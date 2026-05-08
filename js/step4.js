// ============================================================
// 4단계: 단어 - 듀오링고 플로우
// ============================================================

const Step4 = {
  exercises: [], idx: 0, total: 0, selected: null,

  init() {
    this.buildExercises();
  },

  buildExercises() {
    this.exercises = [];
    const allWords = Object.values(DATA.words).flat();
    const batch = App.shuffle([...allWords]).slice(0, 8);

    batch.forEach(word => {
      // 먼저 카드로 배우기
      if (!SRS.isLearned(`w_${word.kr}`)) {
        this.exercises.push({ type: 'learn', item: word });
      }
      // 그 다음 퀴즈
      this.exercises.push({ type: 'quiz', item: word });
    });

    this.idx = 0; this.total = this.exercises.length;
    this.run();
  },

  run() {
    App.hideFeedback();
    if (App.hearts <= 0) { this.showEnd('fail'); return; }
    if (this.idx >= this.exercises.length) { this.showEnd('done'); return; }
    App.updateTopBar(this.idx, this.total);
    const ex = this.exercises[this.idx];
    if (ex.type === 'learn') this.showLearn(ex.item); else this.showQuiz(ex.item);
  },

  showLearn(item) {
    const area = document.getElementById('lesson-area');
    area.innerHTML = `
      <div class="q-prompt">새 단어에요!</div>
      <div class="learn-card" onclick="App.speak('${item.kr}')">
        <div class="lc-emoji">${item.emoji}</div>
        <div class="lc-char" style="color:var(--orange);font-size:4rem">${item.kr}</div>
        <div class="lc-sub">${item.en}</div>
        <div class="lc-tap">👆 터치하면 소리가 나요</div>
      </div>
    `;
    Sound.flip();
    setTimeout(() => App.speak(item.kr), 400);
    SRS.markLearned(`w_${item.kr}`);
    App.showContinue('Step4.advance()');
  },

  advance() { this.idx++; this.run(); },

  showQuiz(item) {
    this.selected = null;
    const allWords = Object.values(DATA.words).flat();
    // 랜덤 문제 유형
    const types = ['kr2en', 'en2kr', 'listen'];
    const type = types[Math.floor(Math.random() * types.length)];

    const area = document.getElementById('lesson-area');
    let opts;

    if (type === 'kr2en') {
      opts = App.genOpts(item.en, allWords.map(w => w.en), 4);
      area.innerHTML = `
        <div class="q-prompt">이 단어의 뜻은?</div>
        <div class="q-big">${item.emoji} ${item.kr}</div>
        <div class="opts single-col">
          ${opts.map(o => `<button class="opt" data-v="${this._esc(o)}" onclick="Step4.select(this)" style="font-size:1.1rem">${o}</button>`).join('')}
        </div>
      `;
      this._correct = item.en;
    } else if (type === 'en2kr') {
      opts = App.genOpts(item.kr, allWords.map(w => w.kr), 4);
      area.innerHTML = `
        <div class="q-prompt">"${item.en}" ${item.emoji} 은 한글로?</div>
        <div class="opts">
          ${opts.map(o => `<button class="opt" data-v="${o}" onclick="Step4.select(this)">${o}</button>`).join('')}
        </div>
      `;
      this._correct = item.kr;
    } else {
      opts = App.genOpts(item.kr, allWords.map(w => w.kr), 4);
      area.innerHTML = `
        <div class="q-prompt">들리는 단어를 골라요</div>
        <button class="q-listen" onclick="App.speak('${item.kr}')">🔊 듣기</button>
        <div class="opts">
          ${opts.map(o => `<button class="opt" data-v="${o}" onclick="Step4.select(this)">${o}</button>`).join('')}
        </div>
      `;
      this._correct = item.kr;
      setTimeout(() => App.speak(item.kr), 300);
    }

    this._item = item;
    App.showCheckDisabled();
  },

  _esc(s) { return s.replace(/'/g, "\\'"); },

  select(btn) {
    Sound.select();
    document.querySelectorAll('.opt').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    this.selected = btn.dataset.v;
    App.showCheckReady('Step4.check()');
  },

  check() {
    const c = this._correct, ok = this.selected === c;
    document.querySelectorAll('.opt').forEach(b => {
      if (b.dataset.v === c) b.classList.add('correct-show');
      else if (b.classList.contains('selected') && !ok) b.classList.add('wrong-show');
      else b.classList.add('dim');
      b.style.pointerEvents = 'none';
    });
    SRS.record(`w_${this._item.kr}`, ok);
    if (ok) {
      App.showCorrectFeedback(() => { this.idx++; this.run(); });
    } else {
      this.exercises.push({ type: 'quiz', item: this._item });
      this.total = this.exercises.length;
      App.showWrongFeedback(`${this._item.kr} = ${this._item.en} ${this._item.emoji}`, () => { this.idx++; this.run(); });
    }
  },

  showEnd(type) {
    App.hideBottom();
    const area = document.getElementById('lesson-area');
    if (type === 'fail') {
      Sound.gameOver();
      area.innerHTML = `<div class="done-screen"><div class="d-emoji">💔</div><h2>하트가 없어요!</h2><button class="d-btn green" onclick="App.startLesson(4)">다시 하기</button><button class="d-btn blue" onclick="App.goHome()" style="margin-top:0.4rem">홈으로</button></div>`;
      return;
    }
    Sound.complete();
    SRS.setProgress(4, 100); SRS.bumpStreak();
    area.innerHTML = `
      <div class="done-screen">
        <div class="d-emoji">📚</div>
        <h2>단어 학습 완료!</h2>
        <div class="d-xp">+${this.exercises.filter(e => e.type === 'quiz').length * 10} ⭐</div>
        <p>단어를 잘 외웠어요!</p>
        <button class="d-btn green" onclick="Step4.buildExercises()">더 연습하기</button>
        <button class="d-btn blue" onclick="App.goHome()" style="margin-top:0.4rem">홈으로</button>
      </div>`;
  },
};
