interface Score {
  scoreA: number;
  gameA: number;
  gameB: number;
  scoreB: number;
}

class Scoreboard {
  history: Score[];
  current: Score;
  ggHistory: number[][];
  gamegraphic: number[];

  sA: HTMLButtonElement;
  sB: HTMLButtonElement;
  gA: HTMLButtonElement;
  gB: HTMLButtonElement;
  ggA: HTMLDivElement;
  ggB: HTMLDivElement;
  serviceBtns: HTMLCollection;
  undoBtn: HTMLButtonElement;
  changeEndsBtn: HTMLButtonElement;
  nextGameBtn: HTMLButtonElement;
  player = 0;

  constructor() {
    this.history = [];
    this.ggHistory = [];

    this.current = { scoreA: 0, gameA: 0, gameB: 0, scoreB: 0 };
    this.gamegraphic = Array(7).fill(0);

    this.history.push({ ...this.current });
    this.ggHistory.push(this.gamegraphic.slice());

    this.sA = document.getElementById('scoreA') as HTMLButtonElement;
    this.sB = document.getElementById('scoreB') as HTMLButtonElement;
    this.gA = document.getElementById('gameA') as HTMLButtonElement;
    this.gB = document.getElementById('gameB') as HTMLButtonElement;
    this.gB = document.getElementById('gameB') as HTMLButtonElement;
    this.ggA = document.getElementById('gamegraphicA') as HTMLDivElement;
    this.ggB = document.getElementById('gamegraphicB') as HTMLDivElement;
    this.undoBtn = document.getElementById('undo') as HTMLButtonElement;
    this.serviceBtns = document.getElementsByClassName('service') as HTMLCollection;
    this.changeEndsBtn = document.getElementById('change-ends') as HTMLButtonElement;
    this.nextGameBtn = document.getElementById('next-game') as HTMLButtonElement;

    const resetBtn = document.getElementById('reset') as HTMLButtonElement;

    this.sA.addEventListener('click', () => this.countUp(this.sA, true));
    this.sB.addEventListener('click', () => this.countUp(this.sB, false));
    this.undoBtn.addEventListener('click', () => this.undo());
    this.changeEndsBtn.addEventListener('click', () => this.changeEnds());
    this.nextGameBtn.addEventListener('click', () => this.nextGame());

    resetBtn.addEventListener('click', () => this.resetAll());

    this.firstServer(this.player);
  }

  firstServer(n = 0): void {
    this.player = n;
    this.serviceBtns[0].classList.remove('current');
    this.serviceBtns[1].classList.remove('current');
    this.serviceBtns[n].classList.add('current');
  }

  countUp(el: HTMLButtonElement, isA: boolean): void {
    el.textContent = `${parseInt(`${el.textContent}`) + 1}`;
    if (isA) {
      this.current.scoreA++;
    } else {
      this.current.scoreB++;
    }

    if (this.current.scoreA + this.current.scoreB !== 0) {
      this.undoBtn.disabled = false;
    }

    this.service();
    this.win();

    this.history.push({ ...this.current });
    this.ggHistory.push(this.gamegraphic.slice());
  }

  service(): void {
    const sum = this.current.scoreA + this.current.scoreB;
    if ((sum % 2 === 0 && sum < 20) || sum >= 20) {
      Array.prototype.forEach.call(this.serviceBtns, el => {
        el.classList.toggle('current');
      });
    }
  }

  win(): boolean {
    let w = false;
    const a = this.current.scoreA;
    const b = this.current.scoreB;
    const sum = a + b;
    const diff = Math.abs(a - b);
    if ((sum < 20 && (a >= 11 || b >= 11)) || (sum >= 20 && diff >= 2)) {
      this.btnDisable(false);
      const gameSum = this.current.gameA + this.current.gameB;
      if (this.current.scoreA > this.current.scoreB) {
        this.current.gameA++;
        this.gamegraphic[gameSum] = 1;
      } else {
        this.current.gameB++;
        this.gamegraphic[gameSum] = 2;
      }
      this.display();
      w = true;
    }
    return w;
  }

  undo(): void {
    if (this.history.length <= 1) {
      return;
    }
    this.service();

    this.history.pop();
    const prev = this.history.length - 1;
    [this.current.scoreA, this.current.gameA, this.current.gameB, this.current.scoreB] = [
      this.history[prev].scoreA,
      this.history[prev].gameA,
      this.history[prev].gameB,
      this.history[prev].scoreB
    ];

    const gameSum = this.current.gameA + this.current.gameB;
    this.gamegraphic[gameSum] = 0;

    this.display();

    if (this.win()) {
      this.btnDisable(false);
    } else {
      this.btnDisable(true);
    }
  }

  resetAll(): void {
    this.btnDisable(true);
    this.history = [];
    this.ggHistory = [];
    this.current = { scoreA: 0, gameA: 0, gameB: 0, scoreB: 0 };
    this.gamegraphic = Array(7).fill(0);
    this.history.push({ ...this.current });
    this.ggHistory.push(this.gamegraphic.slice());
    this.display();
  }

  changeEnds(): void {
    if (!this.win()) {
      this.swap();

      Array.prototype.forEach.call(this.serviceBtns, el => {
        el.classList.toggle('current');
      });
    }
  }

  nextGame(): void {
    this.firstServer(this.player);
    this.btnDisable(true);
    this.undoBtn.disabled = true;

    // swap
    [this.current.scoreA, this.current.gameA, this.current.gameB, this.current.scoreB] = [
      0,
      this.current.gameB,
      this.current.gameA,
      0
    ];
    this.gamegraphic = this.gamegraphic.map(v => {
      let n = v;
      if (v !== 0) {
        n = 3 - v;
      }
      return n;
    });

    // reset
    this.history = [];
    this.ggHistory = [];
    this.history.push({ ...this.current });
    this.ggHistory.push(this.gamegraphic.slice());

    this.display();
  }

  swap(): void {
    [this.current.scoreA, this.current.gameA, this.current.gameB, this.current.scoreB] = [
      this.current.scoreB,
      this.current.gameB,
      this.current.gameA,
      this.current.scoreA
    ];
    this.gamegraphic = this.gamegraphic.map(v => {
      let n = v;
      if (v !== 0) {
        n = 3 - v;
      }
      return n;
    });

    this.history.push({ ...this.current });
    this.ggHistory.push(this.gamegraphic.slice());
    this.display();
  }

  display(): void {
    this.sA.textContent = `${this.current.scoreA}`;
    this.gA.textContent = `${this.current.gameA}`;
    this.gB.textContent = `${this.current.gameB}`;
    this.sB.textContent = `${this.current.scoreB}`;

    this.gamegraphic.forEach((value, i) => {
      if (this.ggA.children[i] !== undefined) {
        if (value === 0) {
          this.ggA.children[i].classList.remove('active');
          this.ggB.children[i].classList.remove('active');
        } else if (value === 1) {
          this.ggA.children[i].classList.add('active');
          this.ggB.children[i].classList.remove('active');
        } else if (value === 2) {
          this.ggA.children[i].classList.remove('active');
          this.ggB.children[i].classList.add('active');
        }
      }
    });
    if (this.current.gameA + this.current.gameB >= 7) {
      this.sA.disabled = true;
      this.sB.disabled = true;
      this.changeEndsBtn.disabled = true;
      this.nextGameBtn.disabled = true;
    }
  }

  btnDisable(next = false): void {
    this.sA.disabled = !next;
    this.sB.disabled = !next;
    this.changeEndsBtn.disabled = !next;
    this.nextGameBtn.disabled = next;
  }
}

new Scoreboard();
