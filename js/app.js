// ============================================================
// 한글 공부 - 듀오링고 스타일 메인 엔진
// ============================================================

const App = {
  screen: 'home',    // home | lesson
  currentStep: null, // 1~5
  hearts: 3,
  xp: 0,

  init() {
    this.xp = parseInt(localStorage.getItem('hg_xp')) || 0;
    this.showHome();
  },

  // ═══════════════════════════
  //  홈 화면
  // ═══════════════════════════
  showHome() {
    this.screen = 'home';
    document.getElementById('top-bar').classList.add('hide');
    document.getElementById('bottom-bar').classList.add('hide');
    document.getElementById('feedback-bar').classList.remove('show');

    const prog = SRS.getProgress();
    const streak = SRS.getStreak();

    const stages = [
      { n:1, icon:'🔤', title:'자음', desc:'ㄱ ㄴ ㄷ ㄹ... 기본 자음 19개', color:'--pink' },
      { n:2, icon:'🌈', title:'모음', desc:'ㅏ ㅓ ㅗ ㅜ... 기본+복합 모음 16개', color:'--blue' },
      { n:3, icon:'🧩', title:'글자 조합', desc:'자음+모음 → 가 나 다... 한글 만들기', color:'--green' },
      { n:4, icon:'📚', title:'단어', desc:'기초 단어 읽고 뜻 맞추기', color:'--orange' },
      { n:5, icon:'✍️', title:'받아쓰기', desc:'듣고 직접 써보기', color:'--purple' },
    ];

    let currentStage = 1;
    for (let i = 1; i <= 5; i++) {
      if ((prog[i] || 0) >= 80) currentStage = i + 1;
      else break;
    }

    const area = document.getElementById('lesson-area');
    area.innerHTML = `
      <div class="home">
        <div class="home-title"><span style="font-size:2rem">🐰</span> 한글 공부</div>
        <div class="home-stats">
          <span>🔥 ${streak}일 연속</span>
          <span>⭐ ${this.xp} XP</span>
        </div>
        ${stages.map(s => {
          const p = prog[s.n] || 0;
          const done = p >= 80;
          const cur = s.n === currentStage;
          const cls = done ? 'done' : cur ? 'current' : '';
          return `
            <button class="stage-btn ${cls}" onclick="App.startLesson(${s.n})">
              <div class="s-icon">${s.icon}</div>
              <div class="s-info">
                <div class="s-title">${s.title}</div>
                <div class="s-desc">${s.desc}</div>
              </div>
              <div class="s-prog">${done ? '✅' : p > 0 ? p + '%' : '·'}</div>
            </button>`;
        }).join('')}
      </div>
    `;
  },

  // ═══════════════════════════
  //  레슨 시작
  // ═══════════════════════════
  startLesson(step) {
    Sound.tap();
    this.screen = 'lesson';
    this.currentStep = step;
    this.hearts = 3;
    document.getElementById('top-bar').classList.remove('hide');
    this.updateTopBar(0, 1);

    switch (step) {
      case 1: Step1.init(); break;
      case 2: Step2.init(); break;
      case 3: Step3.init(); break;
      case 4: Step4.init(); break;
      case 5: Step5.init(); break;
    }
  },

  goHome() {
    Sound.tap();
    this.showHome();
  },

  // ═══════════════════════════
  //  상단 바 업데이트
  // ═══════════════════════════
  updateTopBar(current, total) {
    const pct = total > 0 ? Math.round((current / total) * 100) : 0;
    document.getElementById('prog-fill').style.width = pct + '%';
    document.getElementById('heart-count').textContent = this.hearts;
    document.getElementById('xp-count').textContent = this.xp;
  },

  // ═══════════════════════════
  //  하단 확인 버튼
  // ═══════════════════════════
  showCheck(label, cls, onclick) {
    const bar = document.getElementById('bottom-bar');
    bar.classList.remove('hide');
    bar.innerHTML = `<button class="check-btn ${cls}" onclick="Sound.tap(); ${onclick}">${label}</button>`;
  },

  showCheckDisabled() {
    const bar = document.getElementById('bottom-bar');
    bar.classList.remove('hide');
    bar.innerHTML = `<button class="check-btn gray">확인</button>`;
  },

  showCheckReady(onclick) {
    this.showCheck('확인', 'green', onclick);
  },

  showContinue(onclick) {
    this.showCheck('계속', 'green', onclick);
  },

  hideBottom() {
    document.getElementById('bottom-bar').classList.add('hide');
  },

  // ═══════════════════════════
  //  피드백 바 (초록/빨강 슬라이드업)
  // ═══════════════════════════
  showCorrectFeedback(onNext) {
    this.hideBottom();
    Sound.correct();

    const fb = document.getElementById('feedback-bar');
    fb.className = 'feedback-bar correct show';
    fb.innerHTML = `
      <div class="fb-left">
        <div class="fb-icon">✅</div>
        <div class="fb-text"><strong>잘했어요!</strong>${this._randomCheer()}</div>
      </div>
      <button class="fb-next" id="fb-next-btn">계속</button>
    `;
    document.getElementById('fb-next-btn').onclick = () => {
      Sound.tap();
      fb.classList.remove('show');
      onNext();
    };
    this.addXP(10);
  },

  showWrongFeedback(correctAnswer, onNext) {
    this.hideBottom();
    Sound.wrong();
    this.hearts--;
    this._animateHeart();

    if (this.hearts <= 0) Sound.gameOver();
    else Sound.heartLost();

    const fb = document.getElementById('feedback-bar');
    fb.className = 'feedback-bar wrong show';
    fb.innerHTML = `
      <div class="fb-left">
        <div class="fb-icon">❌</div>
        <div class="fb-text"><strong>정답:</strong>${correctAnswer}</div>
      </div>
      <button class="fb-next" id="fb-next-btn">계속</button>
    `;
    document.getElementById('fb-next-btn').onclick = () => {
      Sound.tap();
      fb.classList.remove('show');
      onNext();
    };
  },

  hideFeedback() {
    document.getElementById('feedback-bar').classList.remove('show');
  },

  _animateHeart() {
    const el = document.getElementById('heart-count');
    el.textContent = this.hearts;
    el.parentElement.classList.add('heart-break');
    setTimeout(() => el.parentElement.classList.remove('heart-break'), 600);
  },

  _randomCheer() {
    const arr = ['대단해요!','최고!','멋져요!','완벽!','훌륭해요!'];
    return ' ' + arr[Math.floor(Math.random() * arr.length)];
  },

  // ═══════════════════════════
  //  XP
  // ═══════════════════════════
  addXP(amount) {
    this.xp += amount;
    localStorage.setItem('hg_xp', this.xp);
    document.getElementById('xp-count').textContent = this.xp;
    Sound.xp();
    const pop = document.createElement('div');
    pop.className = 'xp-popup';
    pop.textContent = `+${amount} ⭐`;
    document.body.appendChild(pop);
    setTimeout(() => pop.remove(), 1100);
  },

  // ═══════════════════════════
  //  유틸리티
  // ═══════════════════════════
  speak(text, rate = 1) {
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ko-KR'; u.rate = rate; u.pitch = 1.1;
    speechSynthesis.speak(u);
  },

  shuffle(a) {
    const b = [...a];
    for (let i = b.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [b[i], b[j]] = [b[j], b[i]];
    }
    return b;
  },

  genOpts(correct, pool, count) {
    const others = pool.filter(x => x !== correct);
    const picked = this.shuffle(others).slice(0, count - 1);
    return this.shuffle([correct, ...picked]);
  },

  updateHeader() {},
};

document.addEventListener('DOMContentLoaded', () => App.init());
