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
  player: number = 0;

  constructor() {
    this.history = [];
    this.ggHistory = [];

    this.current = {scoreA: 0, gameA: 0, gameB: 0, scoreB: 0};
    this.gamegraphic = Array(7).fill(0);

    this.history.push(Object.assign({}, this.current));
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

    let resetBtn = document.getElementById('reset') as HTMLButtonElement;

    this.sA.addEventListener('click', () => this.countUp(this.sA, true));
    this.sB.addEventListener('click', () => this.countUp(this.sB, false));
    this.undoBtn.addEventListener('click', () => this.undo());
    this.changeEndsBtn.addEventListener('click', () => this.changeEnds());
    this.nextGameBtn.addEventListener('click', () => this.nextGame());

    resetBtn.addEventListener('click', () => this.resetAll());

    this.firstServer(this.player);
  }

  firstServer(n: number = 0) {
    this.player = n;
    this.serviceBtns[0].classList.remove('current');
    this.serviceBtns[1].classList.remove('current');
    this.serviceBtns[n].classList.add('current');
  }

  countUp(el: HTMLButtonElement, isA: boolean): void {
    el.textContent = `${parseInt(el.textContent!) + 1}`;
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

    this.history.push(Object.assign({}, this.current));
    this.ggHistory.push(this.gamegraphic.slice());
  }

  service() {
    let sum = this.current.scoreA + this.current.scoreB;
    if ((sum % 2 === 0 && sum < 20) || sum >= 20) {
      Array.prototype.forEach.call(this.serviceBtns, el => {
        el.classList.toggle('current');
      });
    }
  }

  win(): boolean {
    let w = false;
    let a = this.current.scoreA;
    let b = this.current.scoreB;
    let sum = a + b;
    let diff = Math.abs(a - b);
    if ((sum < 20 && (a >= 11 || b >= 11)) || (sum >= 20 && diff >= 2)) {
      this.btnDisable(false);
      w = true;
    }
    return w;
  }

  undo() {
    if (this.history.length <= 1) {
      return;
    }
    this.service();

    this.history.pop();
    let prev = this.history.length - 1;
    [this.current.scoreA, this.current.gameA, this.current.gameB, this.current.scoreB] = [
      this.history[prev].scoreA,
      this.history[prev].gameA,
      this.history[prev].gameB,
      this.history[prev].scoreB,
    ];
    this.display();

    if (this.win()) {
      this.btnDisable(false);
    } else {
      this.btnDisable(true);
    }
  }

  resetAll() {
    this.history = [];
    this.ggHistory = [];
    this.current = {scoreA: 0, gameA: 0, gameB: 0, scoreB: 0};
    this.gamegraphic = Array(7).fill(0);
    this.history.push(Object.assign({}, this.current));
    this.ggHistory.push(this.gamegraphic.slice());
    this.display();
  }

  changeEnds() {
    if (!this.win()) {
      this.swap();

      Array.prototype.forEach.call(this.serviceBtns, el => {
        el.classList.toggle('current');
      });
    }
  }

  nextGame() {
    this.firstServer(this.player);
    this.btnDisable(true);
    this.undoBtn.disabled = true;

    // game
    let gameSum = this.current.gameA + this.current.gameB;
    if (this.current.scoreA > this.current.scoreB) {
      this.current.gameA++;
      this.gamegraphic[gameSum] = 1;
    } else {
      this.current.gameB++;
      this.gamegraphic[gameSum] = 2;
    }

    // swap
    [this.current.scoreA, this.current.gameA, this.current.gameB, this.current.scoreB] = [0, this.current.gameB, this.current.gameA, 0];
    this.gamegraphic = this.gamegraphic.map(v => {
      if (v !== 0) {
        v = 3 - v;
      }
      return v;
    });

    // reset
    this.history = [];
    this.ggHistory = [];
    this.history.push(Object.assign({}, this.current));
    this.ggHistory.push(this.gamegraphic.slice());

    this.display();
  }

  swap() {
    [this.current.scoreA, this.current.gameA, this.current.gameB, this.current.scoreB] = [this.current.scoreB, this.current.gameB, this.current.gameA, this.current.scoreA];
    this.gamegraphic = this.gamegraphic.map(v => {
      if (v !== 0) {
        v = 3 - v;
      }
      return v;
    });

    this.history.push(Object.assign({}, this.current));
    this.ggHistory.push(this.gamegraphic.slice());
    this.display();
  }

  display() {
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
  }

  btnDisable(next: boolean = false) {
    this.sA.disabled = !next;
    this.sB.disabled = !next;
    this.changeEndsBtn.disabled = !next;
    this.nextGameBtn.disabled = next;
  }
}

new Scoreboard();
