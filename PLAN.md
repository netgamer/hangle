# 한글 공부 웹 프로그램 계획서

## 개요
한글을 처음 배우는 학습자를 위한 단계별 웹 학습 프로그램.
탭 기반 네비게이션으로 5단계를 순차적으로 학습하며, 최종 단계에서 받아쓰기까지 진행한다.

---

## 학습 설계 근거 (Evidence-Based)

이 프로그램의 학습 루틴은 다음 연구 결과들에 기반한다.

### 1. 시각적 연상 기억법 (Visual Mnemonics)
> 한글 자모를 익숙한 이미지와 연결하면 기억 효율이 크게 향상된다.
> 니모닉 그룹이 즉시 테스트에서 100% 점수를 달성한 비율이 14.29%로, 단순 반복 그룹보다 유의미하게 높았다.
> 자음은 **생산(쓰기)**, 모음은 **식별(읽기)** 에서 더 큰 효과를 보였다.

- **출처**: [Memorization Strategies of Korean Hangul Writing System (Medium)](https://medium.com/@mollysmail29/memorization-strategies-of-korean-hangul-writing-system-fea71a48c96f)
- **적용**: 각 자음/모음 카드에 연상 이미지 포함 (ㄱ→총 gun, ㅂ→침대 bed 등)

### 2. 능동적 회상 & 테스팅 효과 (Active Recall & Testing Effect)
> 2011년 Science 논문: 능동적 회상(Active Recall)은 외국어 단어 쌍 기억률을 **80%**로 올렸으나,
> 수동적 복습은 **34%**에 그쳤다.
> 학습 시간의 일부를 테스트에 할애하면 장기 기억이 유의미하게 증가한다.

- **출처**: [Testing Effect - Wikipedia](https://en.wikipedia.org/wiki/Testing_effect), [Active Retrieval Promotes Meaningful Learning (Purdue)](https://learninglab.psych.purdue.edu/downloads/2012/2012_Karpicke_CDPS.pdf)
- **적용**: 모든 단계에서 학습 → 즉시 퀴즈(4지선다, 직접 입력) 순서로 진행

### 3. 간격 반복 (Spaced Repetition)
> 메타분석 결과, 간격을 두고 반복 테스트하면 벼락치기보다 장기 기억 형성에 월등히 효과적이다.
> 틀린 항목을 더 자주, 맞힌 항목은 간격을 넓혀 복습하는 것이 핵심이다.

- **출처**: [How Spaced Repetition Helps You Learn Korean Words Faster (KoreanClass101)](https://www.koreanclass101.com/lesson/learning-strategies-115-how-spaced-repetition-helps-you-learn-korean-words-faster?lp=237), [Spaced Repetition Korean (Chamelingo)](https://chamelingo.com/blog/spaced-repetition-korean)
- **적용**: 틀린 문제 자동 재출제, localStorage에 오답 기록 저장하여 복습 우선순위 부여

### 4. 청킹 전략 (Chunking)
> 자음 14개를 한 번에 외우지 않고, 4개씩 그룹으로 나눠 학습하면 인지 부하가 줄어든다.
> 자음 먼저 → 모음 → 조합 순서의 구조적 접근이 효과적이다.

- **출처**: [Korean Alphabet - How to Learn it Fast (90DayKorean)](https://www.90daykorean.com/how-to-learn-the-korean-alphabet/), [Mastering Hangul Quickly (Bunpo)](https://bunpo.app/blog/korean/mastering-hangul-quickly-your-step-by-step-guide/)
- **적용**: 자음/모음을 4개씩 소그룹으로 나눠 제시, 그룹 마스터 후 다음 그룹 진행

### 5. 발음 중심 + 의미 중심 통합 접근 (자모음절식 + 단어문장식)
> 한글 학교 교육 연구(최영환 교수)에 따르면, 자모음절식을 중심으로 하면서
> 단어문장식을 보조 수단으로 활용하는 것이 가장 효과적인 한글 교육 방법이다.

- **출처**: [한글 교육의 이해 (KOSAA/한글학교)](https://kosaa.korean.net/bbs/board.php?bo_table=data_education&wr_id=7&device=mobile)
- **적용**: 1~3단계(자모음절식) → 4~5단계(단어문장식)로 자연스럽게 전환

### 6. 매일 15~30분 마이크로 학습 (Micro-Practice)
> 하루 15~30분 짧게 매일 하는 것이 주 1회 장시간 학습보다 훨씬 효과적이다.
> 일일 리뷰는 15~20분으로 제한해야 번아웃을 방지할 수 있다.

- **출처**: [How to Learn Korean Fast (90DayKorean)](https://www.90daykorean.com/learn-korean-fast-tips/), [How to learn Korean fast (Preply)](https://preply.com/en/blog/how-to-learn-korean-fast/)
- **적용**: 각 학습 세션을 15~20분 분량으로 설계, "오늘의 학습" 모드 제공

---

## 학습 루틴 설계

### 하루 학습 플로우 (15~20분)
```
[오늘의 복습] → [새 내용 학습] → [즉시 퀴즈] → [오답 복습] → [진행률 확인]
    3분            5분            5분          3분          1분
```

### 전체 학습 로드맵 (약 2~3주)
| 일차 | 단계 | 학습 내용 | 학습법 |
|------|------|-----------|--------|
| 1~2일 | 1단계 | 기본 자음 ㄱ~ㅁ (5개) | 연상 이미지 + 듣기 + 4지선다 |
| 3~4일 | 1단계 | 기본 자음 ㅂ~ㅎ (9개) + 복습 | 청킹 + 간격 반복 |
| 5일 | 1단계 | 쌍자음 (ㄲㄸㅃㅆㅉ) + 전체 복습 | 비교 학습 + 테스트 |
| 6~7일 | 2단계 | 기본 모음 (ㅏㅑㅓㅕㅗㅛㅜㅠㅡㅣ) | 획 방향 시각화 + 듣기 |
| 8~9일 | 2단계 | 복합 모음 + 복습 | 기본↔복합 비교 + 테스트 |
| 10~11일 | 3단계 | 초성+중성 조합 (가~히) | 인터랙티브 조합기 |
| 12~13일 | 3단계 | 받침(종성) 조합 + 복습 | 분해/조합 연습 |
| 14~16일 | 4단계 | 기초 단어 (카테고리별) | 플래시카드 + 능동적 회상 |
| 17~20일 | 5단계 | 받아쓰기 (글자→단어→문장) | 듣기→쓰기→채점→오답 복습 |

---

## 5단계 학습 구조

### 1단계: 자음 배우기 (탭: 자음)
- **목표**: 한글 자음 14개 + 쌍자음 5개 학습
- **학습법**: 시각적 연상(Mnemonic) + 청킹(4개씩 그룹)
- **내용**:
  - 자음 카드: 큰 글씨 + 발음 + 연상 이미지
    - ㄱ(g/k) → 총(Gun) 모양
    - ㄴ(n) → 의자(Nice chair) 모양
    - ㄷ(d/t) → 문(Door) 모양
    - ㅁ(m) → 지도(Map) 모양 등
  - 카드 클릭 시 TTS 발음 재생
  - 4개씩 그룹 학습 → 그룹 퀴즈 통과 → 다음 그룹
- **연습 (능동적 회상)**:
  - 발음 듣고 자음 고르기 (4지선다)
  - 연상 이미지 보고 자음 고르기
  - 자음 보고 발음 맞추기
- **간격 반복**: 틀린 자음은 2문제 후 재출제

### 2단계: 모음 배우기 (탭: 모음)
- **목표**: 기본 모음 10개 + 복합 모음 11개
- **학습법**: 획 방향 시각화 + 그룹 학습
- **내용**:
  - 기본 모음: 수직(ㅏㅑㅓㅕㅣ) vs 수평(ㅗㅛㅜㅠㅡ) 그룹
  - 복합 모음: 기본 모음 조합 원리 설명
  - 모음 구조 애니메이션 (획이 추가되는 과정)
  - TTS 발음 재생
- **연습 (능동적 회상)**:
  - 발음 듣고 모음 고르기
  - 수직/수평 모음 분류 드래그
  - 복합 모음 = 기본 모음 + 기본 모음 조합 맞추기

### 3단계: 글자 조합 (탭: 조합)
- **목표**: 자음 + 모음 조합 원리 체득
- **학습법**: 인터랙티브 조합 + 분해 연습
- **내용**:
  - 조합 원리 시각 설명 (초성 + 중성 / 초성 + 중성 + 종성)
  - 실시간 조합기: 자음·모음 버튼 → 글자 생성
  - 받침(종성) 개념 도입
- **연습 (능동적 회상)**:
  - 글자 → 자음/모음 분해 (예: 한 → ㅎ+ㅏ+ㄴ)
  - 자음+모음 제시 → 완성 글자 직접 입력
  - 랜덤 글자 읽기 챌린지 (TTS로 정답 확인)

### 4단계: 단어 읽기 (탭: 단어)
- **목표**: 기초 단어 읽기 + 의미 연결
- **학습법**: 플래시카드 + 카테고리 청킹
- **내용**:
  - 카테고리: 인사, 숫자(1~10), 가족, 음식, 동물, 색깔
  - 단어 카드: 한글 + 발음 + 뜻(영어)
  - TTS 발음 재생
- **연습 (능동적 회상)**:
  - 한글 → 뜻 맞추기 (카드 뒤집기)
  - 뜻 → 한글 고르기 (4지선다)
  - 발음 듣고 → 한글 직접 입력
- **간격 반복**: 맞힌 단어는 간격 증가, 틀린 단어는 즉시 재출제

### 5단계: 받아쓰기 (탭: 받아쓰기)
- **목표**: 듣고 직접 한글로 쓰기
- **학습법**: 듣기→쓰기→즉시 피드백→오답 집중 복습
- **난이도**:
  - **쉬움**: 단일 음절 (가, 나, 다...)
  - **보통**: 단어 (사과, 학교, 가방...)
  - **어려움**: 짧은 문장 (안녕하세요, 감사합니다...)
- **기능**:
  - TTS 재생 (속도: 느림 / 보통 / 빠름)
  - 다시 듣기 (최대 3회)
  - 글자 단위 채점 (맞음=초록, 틀림=빨강)
  - 틀린 글자의 정답을 분해하여 표시 (예: 학→ㅎ+ㅏ+ㄱ)
  - 오답 모아보기 + 재도전

---

## 핵심 기능: 오답 기반 간격 반복 시스템

```
문제 출제 → 정답 확인
  ├─ 맞음 → 다음 복습 간격 2배 증가 (1→2→4→8 문제 후)
  └─ 틀림 → 즉시 오답 풀에 추가, 2문제 후 재출제
           → 연속 2회 맞힐 때까지 반복
```

- localStorage에 각 항목별 정답률, 마지막 학습 시간, 복습 간격 저장
- "오늘의 복습" 모드: 이전 세션 오답부터 시작

---

## UI/UX 설계

### 레이아웃
```
┌─────────────────────────────────────────────┐
│  한글 공부                       [진행률 바]  │
├──────┬──────┬──────┬──────┬─────────────────┤
│ 자음 │ 모음 │ 조합 │ 단어 │ 받아쓰기         │
├──────┴──────┴──────┴──────┴─────────────────┤
│                                             │
│  [학습 모드]  |  [퀴즈 모드]  |  [복습 모드]  │
│                                             │
│            [컨텐츠 영역]                      │
│                                             │
├─────────────────────────────────────────────┤
│  오늘의 진행: ████████░░ 80%    연속 5일째    │
└─────────────────────────────────────────────┘
```

### 디자인 원칙
- 깔끔하고 큰 글씨 (학습 가독성 우선)
- 반응형 디자인 (모바일/태블릿 대응)
- 단계별 색상 테마
- 정답/오답 즉각 피드백 (색상 + 시각 효과)
- 학습 연속일수(streak) 표시로 동기 부여

---

## 파일 구조
```
hangle/
├── index.html          # 메인 페이지 (SPA)
├── css/
│   └── style.css       # 전체 스타일
├── js/
│   ├── app.js          # 앱 초기화, 탭 관리, 복습 시스템
│   ├── data.js         # 자음/모음/단어/연상이미지 데이터
│   ├── srs.js          # 간격 반복 시스템 (Spaced Repetition)
│   ├── step1.js        # 1단계: 자음
│   ├── step2.js        # 2단계: 모음
│   ├── step3.js        # 3단계: 조합
│   ├── step4.js        # 4단계: 단어
│   └── step5.js        # 5단계: 받아쓰기
├── PLAN.md             # 이 계획서
└── CLAUDE.md           # 프로젝트 컨텍스트
```

---

## 구현 순서
1. HTML 기본 구조 + 탭 네비게이션 + CSS 스타일링
2. `data.js` - 자음/모음/단어 + 연상 이미지 데이터
3. `srs.js` - 간격 반복 시스템 (오답 추적, 복습 간격)
4. 1단계: 자음 (청킹 + 연상 이미지 + 퀴즈)
5. 2단계: 모음 (그룹 학습 + 퀴즈)
6. 3단계: 조합 (인터랙티브 조합기 + 분해 연습)
7. 4단계: 단어 (플래시카드 + 간격 반복 퀴즈)
8. 5단계: 받아쓰기 (TTS + 채점 + 오답 복습)
9. 진행률/streak 저장 (localStorage)
10. 반응형 디자인 마무리 + 테스트

---

## 핵심 기술 포인트
- **TTS**: `speechSynthesis.speak()` + `lang: 'ko-KR'`
- **간격 반복**: localStorage에 항목별 {정답횟수, 오답횟수, 다음복습시간, 간격} 저장
- **채점**: 문자열 비교로 글자 단위 diff + 자모 분해 힌트
- **빌드 불필요**: 순수 HTML/CSS/JS로 브라우저에서 바로 실행

---

## 참고 자료 (Sources)
- [Korean Alphabet - How to Learn it Fast (90DayKorean)](https://www.90daykorean.com/how-to-learn-the-korean-alphabet/)
- [Memorization Strategies of Korean Hangul (Medium)](https://medium.com/@mollysmail29/memorization-strategies-of-korean-hangul-writing-system-fea71a48c96f)
- [Testing Effect - Wikipedia](https://en.wikipedia.org/wiki/Testing_effect)
- [Active Retrieval Promotes Meaningful Learning (Purdue)](https://learninglab.psych.purdue.edu/downloads/2012/2012_Karpicke_CDPS.pdf)
- [Spaced Repetition for Korean (KoreanClass101)](https://www.koreanclass101.com/lesson/learning-strategies-115-how-spaced-repetition-helps-you-learn-korean-words-faster?lp=237)
- [Spaced Repetition Korean (Chamelingo)](https://chamelingo.com/blog/spaced-repetition-korean)
- [Mastering Hangul Quickly (Bunpo)](https://bunpo.app/blog/korean/mastering-hangul-quickly-your-step-by-step-guide/)
- [한글 교육의 이해 - 최영환 교수 (KOSAA)](https://kosaa.korean.net/bbs/board.php?bo_table=data_education&wr_id=7&device=mobile)
- [How to Learn Korean Fast (90DayKorean)](https://www.90daykorean.com/learn-korean-fast-tips/)
- [How to learn Korean fast (Preply)](https://preply.com/en/blog/how-to-learn-korean-fast/)
