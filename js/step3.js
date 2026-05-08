// ============================================================
// 3단계: 글자 조합 - 듀오링고 플로우
// ============================================================

const Step3 = {
  lessons: [
    { char:'가', desc:'ㄱ + ㅏ' },{ char:'나', desc:'ㄴ + ㅏ' },{ char:'다', desc:'ㄷ + ㅏ' },
    { char:'라', desc:'ㄹ + ㅏ' },{ char:'마', desc:'ㅁ + ㅏ' },{ char:'바', desc:'ㅂ + ㅏ' },
    { char:'사', desc:'ㅅ + ㅏ' },{ char:'아', desc:'ㅇ + ㅏ' },{ char:'자', desc:'ㅈ + ㅏ' },
    { char:'하', desc:'ㅎ + ㅏ' },{ char:'고', desc:'ㄱ + ㅗ' },{ char:'노', desc:'ㄴ + ㅗ' },
    { char:'소', desc:'ㅅ + ㅗ' },{ char:'한', desc:'ㅎ+ㅏ+ㄴ' },{ char:'글', desc:'ㄱ+ㅡ+ㄹ' },
    { char:'밥', desc:'ㅂ+ㅏ+ㅂ' },{ char:'물', desc:'ㅁ+ㅜ+ㄹ' },{ char:'곰', desc:'ㄱ+ㅗ+ㅁ' },
  ],
  exercises: [], idx: 0, total: 0, selected: null, cursor: 0,

  init() {
    this.cursor = 0;
    for (let i = 0; i < this.lessons.length; i++) {
      if (SRS.isLearned(`j_${this.lessons[i].char}`)) this.cursor = i + 1;
      else break;
    }
    this.buildExercises();
  },

  buildExercises() {
    this.exercises = [];
    if (this.cursor >= this.lessons.length) {
      App.shuffle([...this.lessons]).slice(0, 8).forEach(item => this.exercises.push({ type: 'quiz', item }));
    } else {
      const newItems = this.lessons.slice(this.cursor, this.cursor + 3);
      newItems.forEach(item => {
        this.exercises.push({ type: 'learn', item });
        this.exercises.push({ type: 'quiz', item });
      });
    }
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
    const d = HG.decompose(item.char);
    const parts = d ? `${d.i} + ${d.m}${d.f ? ' + ' + d.f : ''}` : item.desc;
    const area = document.getElementById('lesson-area');
    area.innerHTML = `
      <div class="q-prompt">글자를 조합해요! 🧩</div>
      <div class="learn-card" onclick="App.speak('${item.char}')">
        <div class="lc-char" style="color:var(--green)">${item.char}</div>
        <div class="lc-sub" style="font-size:1.4rem;margin-top:0.5rem">${parts}</div>
        <div class="lc-hint">${item.desc}</div>
        <div class="lc-tap">👆 터치하면 소리가 나요</div>
      </div>
    `;
    Sound.flip();
    setTimeout(() => App.speak(item.char), 400);
    SRS.markLearned(`j_${item.char}`);
    App.showContinue('Step3.advance()');
  },

  advance() { this.idx++; this.run(); },

  showQuiz(item) {
    this.selected = null;
    const d = HG.decompose(item.char);
    const parts = d ? `${d.i} + ${d.m}${d.f ? ' + ' + d.f : ''}` : item.desc;
    const allChars = this.lessons.map(l => l.char);
    const opts = App.genOpts(item.char, allChars, 4);

    const area = document.getElementById('lesson-area');
    area.innerHTML = `
      <div class="q-prompt">이 조합으로 만들어지는 글자는?</div>
      <div class="q-big" style="color:var(--green)">${parts}</div>
      <div class="opts">
        ${opts.map(o => `<button class="opt" data-v="${o}" onclick="Step3.select(this)">${o}</button>`).join('')}
      </div>
    `;
    App.showCheckDisabled();
    this._correct = item.char; this._item = item;
  },

  select(btn) {
    Sound.select();
    document.querySelectorAll('.opt').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    this.selected = btn.dataset.v;
    App.showCheckReady('Step3.check()');
  },

  check() {
    const c = this._correct, ok = this.selected === c;
    document.querySelectorAll('.opt').forEach(b => {
      if (b.dataset.v === c) b.classList.add('correct-show');
      else if (b.classList.contains('selected') && !ok) b.classList.add('wrong-show');
      else b.classList.add('dim');
      b.style.pointerEvents = 'none';
    });
    SRS.record(`j_${c}`, ok);
    if (ok) {
      App.speak(c);
      App.showCorrectFeedback(() => { this.idx++; this.run(); });
    } else {
      this.exercises.push({ type: 'quiz', item: this._item });
      this.total = this.exercises.length;
      App.showWrongFeedback(`${c} (${this._item.desc})`, () => { this.idx++; this.run(); });
    }
  },

  showEnd(type) {
    App.hideBottom();
    const area = document.getElementById('lesson-area');
    if (type === 'fail') {
      Sound.gameOver();
      area.innerHTML = `<div class="done-screen"><div class="d-emoji">💔</div><h2>하트가 없어요!</h2><button class="d-btn green" onclick="App.startLesson(3)">다시 하기</button><button class="d-btn blue" onclick="App.goHome()" style="margin-top:0.4rem">홈으로</button></div>`;
      return;
    }
    Sound.complete();
    this.cursor = Math.min(this.cursor + 3, this.lessons.length);
    SRS.setProgress(3, Math.round((this.cursor / this.lessons.length) * 100));
    SRS.bumpStreak();
    const allDone = this.cursor >= this.lessons.length;
    area.innerHTML = `
      <div class="done-screen">
        <div class="d-emoji">${allDone ? '🧩' : '👏'}</div>
        <h2>${allDone ? '조합 완료!' : '잘했어요!'}</h2>
        <div class="d-xp">+${this.exercises.filter(e => e.type === 'quiz').length * 10} ⭐</div>
        <p>${allDone ? '글자 조합을 마스터했어요!' : `${this.cursor}/${this.lessons.length} 학습 완료`}</p>
        ${allDone ? '' : `<button class="d-btn green" onclick="Step3.buildExercises()">계속 배우기</button>`}
        <button class="d-btn blue" onclick="App.goHome()" style="margin-top:0.4rem">홈으로</button>
      </div>`;
  },
};
