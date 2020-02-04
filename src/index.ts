interface Score {
  scoreA: number;
  gameA: number;
  gameB: number;
  scoreB: number;
}

class Scoreboard {
  history: Score[];
  current: Score;
  sA: HTMLButtonElement;
  sB: HTMLButtonElement;
  gA: HTMLButtonElement;
  gB: HTMLButtonElement;
  serviceBtns: HTMLCollection;
  changeEndsBtn: HTMLButtonElement;
  nextGameBtn: HTMLButtonElement;
  player: number = 0;

  constructor() {
    this.history = [];

    this.current = {scoreA: 0, gameA: 0, gameB: 0, scoreB: 0};
    this.history.push(Object.assign({}, this.current));

    this.sA = document.getElementById('scoreA') as HTMLButtonElement;
    this.sB = document.getElementById('scoreB') as HTMLButtonElement;
    this.gA = document.getElementById('gameA') as HTMLButtonElement;
    this.gB = document.getElementById('gameB') as HTMLButtonElement;
    this.gB = document.getElementById('gameB') as HTMLButtonElement;
    this.serviceBtns = document.getElementsByClassName('service') as HTMLCollection;
    this.changeEndsBtn = document.getElementById('change-ends') as HTMLButtonElement;
    this.nextGameBtn = document.getElementById('next-game') as HTMLButtonElement;

    let undoBtn = document.getElementById('undo') as HTMLButtonElement;
    let resetBtn = document.getElementById('reset') as HTMLButtonElement;

    this.sA.addEventListener('click', () => this.countUp(this.sA, true));
    this.sB.addEventListener('click', () => this.countUp(this.sB, false));
    this.changeEndsBtn.addEventListener('click', () => this.changeEnds());
    this.nextGameBtn.addEventListener('click', () => this.nextGame());

    undoBtn.addEventListener('click', () => this.undo());
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

    this.service();
    this.win();

    this.history.push(Object.assign({}, this.current));
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
      if (a > b) {
        this.current.gameA++;
      } else {
        this.current.gameB++;
      }
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
    this.current = {scoreA: 0, gameA: 0, gameB: 0, scoreB: 0};
    this.history.push(Object.assign({}, this.current));
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
    this.swap(true);
  }

  swap(next: boolean = false) {
    if (next) {
      this.current.scoreA = 0;
      this.current.scoreB = 0;
    }
    [this.current.scoreA, this.current.gameA, this.current.gameB, this.current.scoreB] = [this.current.scoreB, this.current.gameB, this.current.gameA, this.current.scoreA];
    this.display();
    this.history.push(Object.assign({}, this.current));
  }

  display() {
    this.sA.textContent = `${this.current.scoreA}`;
    this.gA.textContent = `${this.current.gameA}`;
    this.gB.textContent = `${this.current.gameB}`;
    this.sB.textContent = `${this.current.scoreB}`;
  }

  btnDisable(next: boolean = false) {
    this.sA.disabled = !next;
    this.sB.disabled = !next;
    this.changeEndsBtn.disabled = !next;
    this.nextGameBtn.disabled = next;
  }
}

new Scoreboard();
