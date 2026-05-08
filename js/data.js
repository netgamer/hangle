// ============================================================
// 한글 공부 - 학습 데이터
// ============================================================

const DATA = {
  // ── 1단계: 자음 (순서대로 학습) ──
  consonants: [
    { char: 'ㄱ', roman: 'g/k', name: '기역', hint: '총(Gun) 모양 🔫' },
    { char: 'ㄴ', roman: 'n', name: '니은', hint: '의자 모양 🪑' },
    { char: 'ㄷ', roman: 'd/t', name: '디귿', hint: '문(Door) 모양 🚪' },
    { char: 'ㄹ', roman: 'r/l', name: '리을', hint: '꼬불꼬불 뱀 🐍' },
    { char: 'ㅁ', roman: 'm', name: '미음', hint: '네모 지도 🗺️' },
    { char: 'ㅂ', roman: 'b/p', name: '비읍', hint: '침대(Bed) 🛏️' },
    { char: 'ㅅ', roman: 's', name: '시옷', hint: '산타 모자 🎅' },
    { char: 'ㅇ', roman: 'ng/∅', name: '이응', hint: '동그라미 ⭕' },
    { char: 'ㅈ', roman: 'j', name: '지읒', hint: '주전자 🫖' },
    { char: 'ㅊ', roman: 'ch', name: '치읓', hint: '교회 지붕 ⛪' },
    { char: 'ㅋ', roman: 'k', name: '키읔', hint: '열쇠(Key) 🔑' },
    { char: 'ㅌ', roman: 't', name: '티읕', hint: '이빨(Teeth) 🦷' },
    { char: 'ㅍ', roman: 'p', name: '피읖', hint: '피아노 🎹' },
    { char: 'ㅎ', roman: 'h', name: '히읗', hint: '모자 쓴 사람 🎩' },
    { char: 'ㄲ', roman: 'kk', name: '쌍기역', hint: 'ㄱ 두 번! 더 세게 💪' },
    { char: 'ㄸ', roman: 'tt', name: '쌍디귿', hint: 'ㄷ 두 번! 더 세게 💪' },
    { char: 'ㅃ', roman: 'pp', name: '쌍비읍', hint: 'ㅂ 두 번! 더 세게 💪' },
    { char: 'ㅆ', roman: 'ss', name: '쌍시옷', hint: 'ㅅ 두 번! 더 세게 💪' },
    { char: 'ㅉ', roman: 'jj', name: '쌍지읒', hint: 'ㅈ 두 번! 더 세게 💪' },
  ],

  // ── 2단계: 모음 (순서대로 학습) ──
  vowels: [
    { char: 'ㅏ', roman: 'a', name: '아', hint: '오른쪽 획 → 아! 👶' },
    { char: 'ㅑ', roman: 'ya', name: '야', hint: 'ㅏ에 획 추가 → 야! 🎉' },
    { char: 'ㅓ', roman: 'eo', name: '어', hint: '왼쪽 획 ← 어? 🤔' },
    { char: 'ㅕ', roman: 'yeo', name: '여', hint: 'ㅓ에 획 추가 → 여! 🦄' },
    { char: 'ㅗ', roman: 'o', name: '오', hint: '위로 ↑ 오! 🌞' },
    { char: 'ㅛ', roman: 'yo', name: '요', hint: 'ㅗ에 획 추가 → 요! 🧸' },
    { char: 'ㅜ', roman: 'u', name: '우', hint: '아래로 ↓ 우~ 🌧️' },
    { char: 'ㅠ', roman: 'yu', name: '유', hint: 'ㅜ에 획 추가 → 유! 🎈' },
    { char: 'ㅡ', roman: 'eu', name: '으', hint: '가로 줄 ─ 으.. ➖' },
    { char: 'ㅣ', roman: 'i', name: '이', hint: '세로 줄 │ 이! 🌳' },
    { char: 'ㅐ', roman: 'ae', name: '애', hint: 'ㅏ + ㅣ = ㅐ 🍎' },
    { char: 'ㅔ', roman: 'e', name: '에', hint: 'ㅓ + ㅣ = ㅔ 🥚' },
    { char: 'ㅘ', roman: 'wa', name: '와', hint: 'ㅗ + ㅏ = 와! 🌈' },
    { char: 'ㅝ', roman: 'wo', name: '워', hint: 'ㅜ + ㅓ = 워~ 🐺' },
    { char: 'ㅟ', roman: 'wi', name: '위', hint: 'ㅜ + ㅣ = 위 🎡' },
    { char: 'ㅢ', roman: 'ui', name: '의', hint: 'ㅡ + ㅣ = 의 🏥' },
  ],

  // ── 4단계: 단어 ──
  words: {
    인사: [
      { kr: '안녕', en: 'Hello', emoji: '👋' },
      { kr: '감사', en: 'Thanks', emoji: '🙏' },
      { kr: '네', en: 'Yes', emoji: '✅' },
      { kr: '아니요', en: 'No', emoji: '❌' },
      { kr: '사랑', en: 'Love', emoji: '❤️' },
    ],
    가족: [
      { kr: '엄마', en: 'Mom', emoji: '👩' },
      { kr: '아빠', en: 'Dad', emoji: '👨' },
      { kr: '동생', en: 'Sibling', emoji: '🧒' },
      { kr: '할머니', en: 'Grandma', emoji: '👵' },
      { kr: '할아버지', en: 'Grandpa', emoji: '👴' },
    ],
    음식: [
      { kr: '밥', en: 'Rice', emoji: '🍚' },
      { kr: '물', en: 'Water', emoji: '💧' },
      { kr: '사과', en: 'Apple', emoji: '🍎' },
      { kr: '우유', en: 'Milk', emoji: '🥛' },
      { kr: '빵', en: 'Bread', emoji: '🍞' },
      { kr: '김치', en: 'Kimchi', emoji: '🥬' },
    ],
    동물: [
      { kr: '강아지', en: 'Puppy', emoji: '🐶' },
      { kr: '고양이', en: 'Cat', emoji: '🐱' },
      { kr: '토끼', en: 'Rabbit', emoji: '🐰' },
      { kr: '새', en: 'Bird', emoji: '🐦' },
      { kr: '곰', en: 'Bear', emoji: '🐻' },
    ],
  },

  // ── 5단계: 받아쓰기 ──
  dictation: {
    easy: ['가','나','다','라','마','바','사','아','자','차','카','타','파','하'],
    medium: ['사과','학교','가방','나무','바다','하늘','토끼','우유','김치','엄마','아빠','동생','친구','공부'],
    hard: ['안녕하세요','감사합니다','사랑해요','좋은 아침','잘 자요','맛있어요'],
  },

  cheers: ['잘했어요! 👏','대단해요! 🌟','최고예요! 🏆','멋져요! ✨','훌륭해요! 🎉','완벽해요! 💯'],
  retry: ['다시 해봐요! 💪','괜찮아요! 🌈','힘내요! 🌟','할 수 있어요! 🦋'],
};

// ── 한글 자모 분해/조합 ──
const HG = {
  I: ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'],
  M: ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'],
  F: ['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'],

  decompose(ch) {
    const c = ch.charCodeAt(0) - 0xAC00;
    if (c < 0 || c > 11171) return null;
    return { i: this.I[~~(c/588)], m: this.M[~~((c%588)/28)], f: this.F[c%28] || null };
  },
  compose(i, m, f) {
    const ii = this.I.indexOf(i), mm = this.M.indexOf(m), ff = f ? this.F.indexOf(f) : 0;
    if (ii < 0 || mm < 0 || ff < 0) return '';
    return String.fromCharCode(0xAC00 + ii*588 + mm*28 + ff);
  },
  isSyllable(ch) { const c = ch.charCodeAt(0); return c >= 0xAC00 && c <= 0xD7A3; },
};
