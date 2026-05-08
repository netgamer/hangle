// ============================================================
// 1단계: 자음 - Premium Flow
// ============================================================

const Step1 = {
  items: DATA.consonants,
  exercises: [],
  idx: 0,
  total: 0,
  selected: null,
  cursor: 0,

  init() {
    this.cursor = 0;
    for (let i = 0; i < this.items.length; i++) {
      if (SRS.isLearned(`c_${this.items[i].char}`)) this.cursor = i + 1;
      else break;
    }
    this.buildExercises();
  },

  buildExercises() {
    this.exercises = [];

    if (this.cursor >= this.items.length) {
      const all = App.shuffle([...this.items]).slice(0, 8);
      all.forEach(item => this.exercises.push({ type: 'quiz', item }));
    } else {
      const newItems = this.items.slice(this.cursor, this.cursor + 3);
      newItems.forEach(item => {
        this.exercises.push({ type: 'learn', item });
        this.exercises.push({ type: 'quiz', item });
      });
    }

    this.idx = 0;
    this.total = this.exercises.length;
    this.run();
  },

  run() {
    App.hideFeedback();

    if (App.hearts <= 0) { this.showFail(); return; }
    if (this.idx >= this.exercises.length) { this.showDone(); return; }

    App.updateTopBar(this.idx, this.total);
    const ex = this.exercises[this.idx];

    if (ex.type === 'learn') this.showLearn(ex.item);
    else this.showQuiz(ex.item);
  },

  showLearn(item) {
    const emoji = item.hint.split(' ').pop();
    App._transitionTo(() => {
      const area = document.getElementById('lesson-area');
      area.innerHTML = `
        <div class="q-prompt">새로운 자음이에요!</div>
        <div class="learn-card" onclick="App.speak('${item.char}')">
          <div class="lc-emoji">${emoji}</div>
          <div class="lc-char">${item.char}</div>
          <div class="lc-sub">${item.name} · ${item.roman}</div>
          <div class="lc-hint">${item.hint}</div>
          <div class="lc-tap">터치하면 소리가 나요</div>
        </div>
      `;
    });
    Sound.flip();
    setTimeout(() => App.speak(item.char), 400);

    SRS.markLearned(`c_${item.char}`);
    App.showContinue('Step1.advance()');
  },

  advance() {
    this.idx++;
    this.run();
  },

  showQuiz(item) {
    this.selected = null;
    const allChars = this.items.map(c => c.char);
    const opts = App.genOpts(item.char, allChars, 4);
    const listen = Math.random() > 0.4;

    App._transitionTo(() => {
      const area = document.getElementById('lesson-area');
      area.innerHTML = `
        ${listen ? `
          <div class="q-prompt">들리는 소리의 자음을 골라요</div>
          <button class="q-listen" onclick="App.speak('${item.char}')">🔊 듣기</button>
        ` : `
          <div class="q-prompt">"${item.name}" (${item.roman}) 은 어떤 글자?</div>
        `}
        <div class="opts">
          ${opts.map(o => `<button class="opt" data-v="${o}" onclick="Step1.select(this)">${o}</button>`).join('')}
        </div>
      `;
    });

    App.showCheckDisabled();
    this._correctChar = item.char;
    this._item = item;
    if (listen) setTimeout(() => App.speak(item.char), 300);
  },

  select(btn) {
    Sound.select();
    document.querySelectorAll('.opt').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    this.selected = btn.dataset.v;
    App.showCheckReady('Step1.check()');
  },

  check() {
    const correct = this._correctChar;
    const ok = this.selected === correct;

    document.querySelectorAll('.opt').forEach(b => {
      if (b.dataset.v === correct) b.classList.add('correct-show');
      else if (b.classList.contains('selected') && !ok) b.classList.add('wrong-show');
      else b.classList.add('dim');
      b.style.pointerEvents = 'none';
    });

    SRS.record(`c_${correct}`, ok);

    if (ok) {
      App.showCorrectFeedback(() => { this.idx++; this.run(); });
    } else {
      this.exercises.push({ type: 'quiz', item: this._item });
      this.total = this.exercises.length;
      App.showWrongFeedback(`${correct} (${this._item.name})`, () => { this.idx++; this.run(); });
    }
  },

  showDone() {
    App.hideBottom();
    Sound.complete();
    App.confetti();
    this.cursor = Math.min(this.cursor + 3, this.items.length);
    const pct = Math.round((this.cursor / this.items.length) * 100);
    SRS.setProgress(1, pct);
    SRS.bumpStreak();

    const allDone = this.cursor >= this.items.length;

    App._transitionTo(() => {
      const area = document.getElementById('lesson-area');
      area.innerHTML = `
        <div class="done-screen">
          <div class="d-emoji">${allDone ? '🎉' : '👏'}</div>
          <h2>${allDone ? '자음 완료!' : '잘했어요!'}</h2>
          <div class="d-xp">+${this.exercises.filter(e => e.type === 'quiz').length * 10} ⭐</div>
          <p>${allDone ? '자음을 모두 익혔어요!' : `${this.cursor}/${this.items.length} 자음 학습 완료`}</p>
          ${allDone
            ? `<button class="d-btn blue" onclick="App.goHome()">홈으로</button>`
            : `<button class="d-btn green" onclick="Step1.buildExercises()">계속 배우기</button>`
          }
          <button class="d-btn blue" onclick="App.goHome()" style="margin-top:0.4rem">홈으로</button>
        </div>
      `;
    });
  },

  showFail() {
    App.hideBottom();
    Sound.gameOver();
    App._transitionTo(() => {
      const area = document.getElementById('lesson-area');
      area.innerHTML = `
        <div class="done-screen">
          <div class="d-emoji">💔</div>
          <h2>하트가 없어요!</h2>
          <p>다시 도전해보아요</p>
          <button class="d-btn green" onclick="App.startLesson(1)">다시 하기</button>
          <button class="d-btn blue" onclick="App.goHome()" style="margin-top:0.4rem">홈으로</button>
        </div>
      `;
    });
  },
};
