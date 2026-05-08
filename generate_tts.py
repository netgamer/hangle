"""
한글 공부 - TTS 음성 파일 일괄 생성 스크립트
edge-tts (Microsoft Edge 음성) 사용
스레드풀로 병렬 생성
"""

import asyncio
import os
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

# Windows 콘솔 UTF-8
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
sys.stderr.reconfigure(encoding='utf-8', errors='replace')

import edge_tts

# ── 설정 ──
VOICE = "ko-KR-SunHiNeural"  # 여성 (자연스러운 한국어)
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "audio")
MAX_WORKERS = 10  # 동시 생성 스레드 수

# ── 생성할 음성 목록 ──
def get_all_texts():
    texts = {}

    # 1단계: 자음
    consonants = [
        ('ㄱ', '기역'), ('ㄴ', '니은'), ('ㄷ', '디귿'), ('ㄹ', '리을'),
        ('ㅁ', '미음'), ('ㅂ', '비읍'), ('ㅅ', '시옷'), ('ㅇ', '이응'),
        ('ㅈ', '지읒'), ('ㅊ', '치읓'), ('ㅋ', '키읔'), ('ㅌ', '티읕'),
        ('ㅍ', '피읖'), ('ㅎ', '히읗'),
        ('ㄲ', '쌍기역'), ('ㄸ', '쌍디귿'), ('ㅃ', '쌍비읍'),
        ('ㅆ', '쌍시옷'), ('ㅉ', '쌍지읒'),
    ]
    for char, name in consonants:
        texts[f"c_{char}"] = name  # 자음은 이름으로 발음

    # 2단계: 모음
    vowels = [
        'ㅏ', 'ㅑ', 'ㅓ', 'ㅕ', 'ㅗ', 'ㅛ', 'ㅜ', 'ㅠ', 'ㅡ', 'ㅣ',
        'ㅐ', 'ㅔ', 'ㅘ', 'ㅝ', 'ㅟ', 'ㅢ',
    ]
    # 모음은 '아', '야' 등 ㅇ+모음 형태로 발음
    vowel_pron = {
        'ㅏ': '아', 'ㅑ': '야', 'ㅓ': '어', 'ㅕ': '여',
        'ㅗ': '오', 'ㅛ': '요', 'ㅜ': '우', 'ㅠ': '유',
        'ㅡ': '으', 'ㅣ': '이', 'ㅐ': '애', 'ㅔ': '에',
        'ㅘ': '와', 'ㅝ': '워', 'ㅟ': '위', 'ㅢ': '의',
    }
    for v in vowels:
        texts[f"v_{v}"] = vowel_pron.get(v, v)

    # 3단계: 조합 글자
    combos = [
        '가', '나', '다', '라', '마', '바', '사', '아', '자', '하',
        '고', '노', '소', '한', '글', '밥', '물', '곰',
    ]
    for c in combos:
        texts[f"j_{c}"] = c

    # 4단계: 단어
    words = [
        '안녕', '감사', '네', '아니요', '사랑',
        '엄마', '아빠', '동생', '할머니', '할아버지',
        '밥', '물', '사과', '우유', '빵', '김치',
        '강아지', '고양이', '토끼', '새', '곰',
    ]
    for w in words:
        texts[f"w_{w}"] = w

    # 5단계: 받아쓰기
    # 쉬움
    easy = ['가','나','다','라','마','바','사','아','자','차','카','타','파','하']
    for e in easy:
        texts[f"d_{e}"] = e

    # 보통
    medium = [
        '사과','학교','가방','나무','바다','하늘','토끼','우유','김치',
        '엄마','아빠','동생','친구','공부',
    ]
    for m in medium:
        texts[f"d_{m}"] = m

    # 어려움
    hard = ['안녕하세요','감사합니다','사랑해요','좋은 아침','잘 자요','맛있어요']
    for h in hard:
        safe = h.replace(' ', '_')
        texts[f"d_{safe}"] = h

    # 중복 제거 (같은 발음 텍스트는 한 번만)
    return texts


def generate_one(key, text, voice, output_dir):
    """단일 TTS 파일 생성 (스레드에서 실행)"""
    # 파일명에 안전한 이름 사용
    safe_key = key.replace(' ', '_')
    filepath = os.path.join(output_dir, f"{safe_key}.mp3")

    # 이미 존재하면 스킵
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

    print(f"🎙️  총 {total}개 음성 파일 생성 시작")
    print(f"📂 출력: {OUTPUT_DIR}")
    print(f"🔊 음성: {VOICE}")
    print(f"🧵 스레드: {MAX_WORKERS}개")
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
                if status == "skip":
                    skip_count += 1
                    print(f"  ⏭️  [{skip_count + done_count}/{total}] {key} (이미 존재)")
                else:
                    done_count += 1
                    size = os.path.getsize(filepath)
                    print(f"  ✅ [{skip_count + done_count}/{total}] {key} → {text} ({size:,}B)")
            except Exception as e:
                fail_count += 1
                print(f"  ❌ [{skip_count + done_count + fail_count}/{total}] {key} → {text}: {e}")

    elapsed = time.time() - start
    print("-" * 50)
    print(f"✅ 완료: {done_count}개 생성, {skip_count}개 스킵, {fail_count}개 실패")
    print(f"⏱️  소요시간: {elapsed:.1f}초")

    if fail_count == 0:
        print("\n🎉 모든 음성 파일 생성 완료!")
    else:
        print(f"\n⚠️  {fail_count}개 실패. 다시 실행하면 실패한 것만 재생성됩니다.")
        sys.exit(1)


if __name__ == "__main__":
    main()
