class Scoreboard {
  history: number[][];
  current: number[];
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
    this.current = [0, 0, 0, 0];
    this.history.push(this.current.slice());

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
      this.current[0]++;
    } else {
      this.current[3]++;
    }
    this.history.push(this.current.slice());

    this.service();
    this.win();
  }

  service() {
    let sum = this.current[0] + this.current[3];
    if ((sum % 2 === 0 && sum < 20) || sum >= 20) {
      Array.prototype.forEach.call(this.serviceBtns, el => {
        el.classList.toggle('current');
      });
    }
  }

  win(): boolean {
    let w = false;
    let a = this.current[0];
    let b = this.current[3];
    let sum = a + b;
    let diff = Math.abs(a - b);
    if ((sum < 20 && (a >= 11 || b >= 11)) || (sum >= 20 && diff >= 2)) {
      this.btnDisable(false);
      if (a > b) {
        this.current[1]++;
      } else {
        this.current[2]++;
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
    [this.current[0], this.current[1], this.current[2], this.current[3]] = [this.history[prev][0], this.history[prev][1], this.history[prev][2], this.history[prev][3]];
    this.display();

    if (this.win()) {
      this.btnDisable(false);
    } else {
      this.btnDisable(true);
    }
  }

  resetAll() {
    this.current = [0, 0, 0, 0];
    this.history = [];
    this.history.push(this.current.slice());
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
      this.current[0] = 0;
      this.current[3] = 0;
    }
    [this.current[0], this.current[1], this.current[2], this.current[3]] = [this.current[3], this.current[2], this.current[1], this.current[0]];
    this.display();
    this.history.push(this.current.slice());
  }

  display() {
    this.sA.textContent = `${this.current[0]}`;
    this.gA.textContent = `${this.current[1]}`;
    this.gB.textContent = `${this.current[2]}`;
    this.sB.textContent = `${this.current[3]}`;
  }

  btnDisable(next: boolean = false) {
    this.sA.disabled = !next;
    this.sB.disabled = !next;
    this.changeEndsBtn.disabled = !next;
    this.nextGameBtn.disabled = next;
  }
}

new Scoreboard();
