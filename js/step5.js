// ============================================================
// 5단계: 받아쓰기 - Premium Flow
// ============================================================

const Step5 = {
  exercises: [], idx: 0, total: 0,
  speed: 1,
  difficulty: 'easy',

  init() {
    this.showDifficultySelect();
  },

  showDifficultySelect() {
    App.hideBottom();
    App._transitionTo(() => {
      const area = document.getElementById('lesson-area');
      area.innerHTML = `
        <div class="q-prompt" style="font-size:1.3rem;margin-bottom:1.5rem">받아쓰기 난이도를 골라요</div>
        <button class="diff-btn" onclick="Step5.start('easy')">
          <div class="diff-icon">🌱</div>
          <div class="diff-info">
            <div class="diff-title">쉬움</div>
            <div class="diff-desc">한 글자 (가, 나, 다...)</div>
          </div>
        </button>
        <div style="height:0.6rem"></div>
        <button class="diff-btn" onclick="Step5.start('medium')">
          <div class="diff-icon">🌿</div>
          <div class="diff-info">
            <div class="diff-title">보통</div>
            <div class="diff-desc">단어 (사과, 학교...)</div>
          </div>
        </button>
        <div style="height:0.6rem"></div>
        <button class="diff-btn" onclick="Step5.start('hard')">
          <div class="diff-icon">🌳</div>
          <div class="diff-info">
            <div class="diff-title">어려움</div>
            <div class="diff-desc">문장 (안녕하세요...)</div>
          </div>
        </button>
      `;
    });
  },

  start(diff) {
    Sound.tap();
    this.difficulty = diff;
    this.exercises = [];
    const items = App.shuffle([...DATA.dictation[diff]]).slice(0, 8);
    items.forEach(text => this.exercises.push({ text }));
    this.idx = 0; this.total = this.exercises.length;
    this.speed = 1;
    this.run();
  },

  run() {
    App.hideFeedback();
    if (App.hearts <= 0) { this.showEnd('fail'); return; }
    if (this.idx >= this.exercises.length) { this.showEnd('done'); return; }
    App.updateTopBar(this.idx, this.total);
    this.showDictation();
  },

  showDictation() {
    const ex = this.exercises[this.idx];
    App._transitionTo(() => {
      const area = document.getElementById('lesson-area');
      area.innerHTML = `
        <div class="q-prompt">듣고 써 봐요!</div>
        <button class="q-listen" onclick="Step5.play()" style="padding:1.2rem 3rem;font-size:1.4rem">🔊 듣기</button>
        <div class="pill-row">
          <button class="pill ${this.speed===0.6?'on':''}" onclick="Step5.setSpeed(0.6)">🐢 느림</button>
          <button class="pill ${this.speed===1?'on':''}" onclick="Step5.setSpeed(1)">🐇 보통</button>
          <button class="pill ${this.speed===1.3?'on':''}" onclick="Step5.setSpeed(1.3)">🚀 빠름</button>
        </div>
        <input type="text" class="q-input" id="dict-input"
          placeholder="여기에 써요"
          autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
      `;
    });

    const input = document.getElementById('dict-input');
    input.addEventListener('input', () => {
      if (input.value.trim()) App.showCheckReady('Step5.check()');
      else App.showCheckDisabled();
    });
    input.addEventListener('keydown', e => { if (e.key === 'Enter' && input.value.trim()) Step5.check(); });

    App.showCheckDisabled();
    setTimeout(() => this.play(), 500);
  },

  play() {
    App.speak(this.exercises[this.idx].text, this.speed);
  },

  setSpeed(s) {
    this.speed = s;
    document.querySelectorAll('.pill').forEach(b => b.classList.remove('on'));
    event.target.classList.add('on');
  },

  check() {
    const input = document.getElementById('dict-input');
    if (!input) return;
    const answer = input.value.trim();
    const correct = this.exercises[this.idx].text;
    const ok = answer === correct;

    input.disabled = true;
    SRS.record(`d_${correct}`, ok);

    let gradeHtml = '';
    const maxLen = Math.max(answer.length, correct.length);
    for (let i = 0; i < maxLen; i++) {
      const uc = answer[i] || '';
      const cc = correct[i] || '';
      if (uc === cc) {
        gradeHtml += `<span class="char-grade ok">${cc}</span>`;
      } else {
        let hint = '';
        if (cc && HG.isSyllable(cc)) {
          const d = HG.decompose(cc);
          if (d) hint = `${d.i}+${d.m}${d.f ? '+' + d.f : ''}`;
        }
        gradeHtml += `<span class="char-grade no">${uc || '·'}<span class="cg-ans">${cc} ${hint ? `(${hint})` : ''}</span></span>`;
      }
    }

    const gradeDiv = document.createElement('div');
    gradeDiv.style.cssText = 'margin-top:1rem;text-align:center';
    gradeDiv.innerHTML = gradeHtml;
    input.parentElement.appendChild(gradeDiv);

    if (ok) {
      input.style.borderColor = 'var(--green)';
      input.style.boxShadow = '0 0 0 4px var(--green-glow)';
      App.showCorrectFeedback(() => { this.idx++; this.run(); });
    } else {
      input.style.borderColor = 'var(--red)';
      input.style.boxShadow = '0 0 0 4px var(--red-glow)';
      this.exercises.push({ text: correct });
      this.total = this.exercises.length;
      App.showWrongFeedback(correct, () => { this.idx++; this.run(); });
    }
  },

  showEnd(type) {
    App.hideBottom();
    if (type === 'fail') {
      Sound.gameOver();
      App._transitionTo(() => {
        const area = document.getElementById('lesson-area');
        area.innerHTML = `
          <div class="done-screen">
            <div class="d-emoji">💔</div>
            <h2>하트가 없어요!</h2>
            <p>다시 도전해요</p>
            <button class="d-btn green" onclick="App.startLesson(5)">다시 하기</button>
            <button class="d-btn blue" onclick="App.goHome()" style="margin-top:0.4rem">홈으로</button>
          </div>`;
      });
      return;
    }
    Sound.complete();
    App.confetti();
    SRS.setProgress(5, 100); SRS.bumpStreak();
    App._transitionTo(() => {
      const area = document.getElementById('lesson-area');
      area.innerHTML = `
        <div class="done-screen">
          <div class="d-emoji">✍️</div>
          <h2>받아쓰기 완료!</h2>
          <div class="d-xp">+${this.exercises.length * 10} ⭐</div>
          <p>잘 들리고 잘 써요!</p>
          <button class="d-btn green" onclick="Step5.showDifficultySelect()">다른 난이도</button>
          <button class="d-btn blue" onclick="App.goHome()" style="margin-top:0.4rem">홈으로</button>
        </div>`;
    });
  },
};
