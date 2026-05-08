"""
한글 공부 - TTS 음성 파일 일괄 생성
data.js에서 모든 텍스트를 자동 수집
"""

import asyncio
import json
import os
import re
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
sys.stderr.reconfigure(encoding='utf-8', errors='replace')

import edge_tts

VOICE = "ko-KR-SunHiNeural"
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "audio")
MAX_WORKERS = 12


def get_all_texts():
    """data.js를 파싱해서 모든 필요한 텍스트 수집"""
    texts = {}

    # ── 자음 ──
    consonants = [
        ('ㄱ','기역'),('ㄴ','니은'),('ㄷ','디귿'),('ㄹ','리을'),('ㅁ','미음'),
        ('ㅂ','비읍'),('ㅅ','시옷'),('ㅇ','이응'),('ㅈ','지읒'),('ㅊ','치읓'),
        ('ㅋ','키읔'),('ㅌ','티읕'),('ㅍ','피읖'),('ㅎ','히읗'),
        ('ㄲ','쌍기역'),('ㄸ','쌍디귿'),('ㅃ','쌍비읍'),('ㅆ','쌍시옷'),('ㅉ','쌍지읒'),
    ]
    for char, name in consonants:
        texts[f"c_{char}"] = name

    # ── 모음 ──
    vowel_pron = {
        'ㅏ':'아','ㅑ':'야','ㅓ':'어','ㅕ':'여','ㅗ':'오','ㅛ':'요',
        'ㅜ':'우','ㅠ':'유','ㅡ':'으','ㅣ':'이',
        'ㅐ':'애','ㅔ':'에','ㅒ':'얘','ㅖ':'예',
        'ㅘ':'와','ㅙ':'왜','ㅚ':'외','ㅝ':'워','ㅞ':'웨','ㅟ':'위','ㅢ':'의',
    }
    for v, pron in vowel_pron.items():
        texts[f"v_{v}"] = pron

    # ── 조합 글자 ──
    combos = [
        '가','나','다','라','마','바','사','아','자','하',
        '고','노','소','한','글','밥','물','곰',
    ]
    for c in combos:
        texts[f"j_{c}"] = c

    # ── data.js에서 단어 추출 ──
    data_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "js", "data.js")
    with open(data_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # kr: '...' 패턴으로 모든 한글 단어 추출
    kr_words = re.findall(r"kr:\s*'([^']+)'", content)
    for w in kr_words:
        safe = w.replace(' ', '_')
        texts[f"w_{safe}"] = w

    # 받아쓰기 데이터 추출 (배열 안의 문자열)
    # easy, medium, hard 배열에서 추출
    dict_matches = re.findall(r"'([가-힣][가-힣 ]*)'", content)
    for d in dict_matches:
        safe = d.replace(' ', '_')
        key = f"d_{safe}"
        if key not in texts:
            texts[key] = d

    return texts


def generate_one(key, text, voice, output_dir):
    safe_key = key.replace(' ', '_')
    filepath = os.path.join(output_dir, f"{safe_key}.mp3")

    if os.path.exists(filepath) and os.path.getsize(filepath) > 0:
        return key, filepath, "skip"

    async def _gen():
        communicate = edge_tts.Communicate(text, voice, rate="-10%", pitch="+5Hz")
        await communicate.save(filepath)

    asyncio.run(_gen())
    return key, filepath, "done"


def main():
    texts = get_all_texts()
    total = len(texts)

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    print(f"총 {total}개 음성 파일 생성 시작")
    print(f"출력: {OUTPUT_DIR}")
    print(f"음성: {VOICE}")
    print(f"스레드: {MAX_WORKERS}개")
    print("-" * 50)

    start = time.time()
    done_count = 0
    skip_count = 0
    fail_count = 0

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as pool:
        futures = {
            pool.submit(generate_one, key, text, VOICE, OUTPUT_DIR): (key, text)
            for key, text in texts.items()
        }

        for future in as_completed(futures):
            key, text = futures[future]
            try:
                _, filepath, status = future.result()
                cnt = skip_count + done_count + 1
                if status == "skip":
                    skip_count += 1
                    # 스킵은 조용히
                else:
                    done_count += 1
                    size = os.path.getsize(filepath)
                    print(f"  [{cnt}/{total}] {key} -> {text} ({size:,}B)")
            except Exception as e:
                fail_count += 1
                print(f"  FAIL [{skip_count+done_count+fail_count}/{total}] {key} -> {text}: {e}")

    elapsed = time.time() - start
    print("-" * 50)
    print(f"완료: {done_count}개 생성, {skip_count}개 스킵, {fail_count}개 실패 ({elapsed:.1f}s)")

    if fail_count > 0:
        sys.exit(1)


if __name__ == "__main__":
    main()
