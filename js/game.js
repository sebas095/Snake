(function() {
  class Random {
    static get(inicio, final) {
      return Math.floor(Math.random() * final) + inicio;
    }
  }

  class Food {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.width = 10;
      this.height = 10;
    }

    static generate() {
      return new Food(Random.get(0, 500), Random.get(0, 300));
    }

    draw() {
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  class Square {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.width = 10;
      this.height = 10;
      this.back = null; // Cuadrado de atras
    }

    draw() {
      ctx.fillRect(this.x, this.y, this.width, this.height);
      if (this.hasBack()) {
        this.back.draw();
      }
    }

    add() {
      if (this.hasBack()) return this.back.add();
      this.back = new Square(this.x, this.y);
    }

    hasBack() {
      return this.back !== null;
    }

    copy() {
      if (this.hasBack()) {
        this.back.copy();
        this.back.x = this.x;
        this.back.y = this.y;
      }
    }

    right() {
      this.copy();
      this.x += 10;
    }

    left() {
      this.copy();
      this.x -= 10;
    }

    up() {
      this.copy();
      this.y -= 10;
    }

    down() {
      this.copy();
      this.y += 10;
    }

    hit(head, second = false) {
      if (this === head && !this.hasBack()) return false;
      if (this === head) return this.back.hit(head, true);
      if (second && !this.hasBack()) return false;
      if (second) return this.back.hit(head);

      // No es ni la cabeza, ni el segundo
      if (this.hasBack()) return SquareHit(this, head) || this.back.hit(head);

      // No es la cabeza, ni el segundo, y soy el último
      return SquareHit(this, head);
    }

    hitBorder() {
      return (this.x > 490 || this.x < 0 || this.y > 290 || this.y < 0);
    }
  }

  class Snake {
    constructor() {
      this.head = new Square(100, 0);
      this.direction = 'right';
      this.head.add();
      this.head.add();
      this.head.add();
      this.head.add();
      this.head.add();
      this.head.add();
      this.draw();
    }

    draw() {
      this.head.draw();
    }

    right() {
      if (this.direction === 'left') return;
      this.direction = 'right';
    }

    left() {
      if (this.direction === 'right') return;
      this.direction = 'left';
    }

    up() {
      if (this.direction === 'down') return;
      this.direction = 'up';
    }

    down() {
      if (this.direction === 'up') return;
      this.direction = 'down';
    }

    move() {
      if (this.direction === 'up')    return this.head.up();
      if (this.direction === 'down')  return this.head.down();
      if (this.direction === 'left')  return this.head.left();
      if (this.direction === 'right') return this.head.right();
    }

    eat() {
      points++;
      this.head.add();
    }

    dead() {
      return this.head.hit(this.head) || this.head.hitBorder();
    }
  }

  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const gameOver = document.getElementById('game-over');
  const score = document.getElementById('count');
  const snake = new Snake();
  const keys = [37, 38, 39, 40, 65, 68, 83, 87];
  let points = 0;
  let foods = [];

  window.addEventListener('keydown', (ev) => {
    if (ev.keyCode in keys) ev.preventDefault();
    if (ev.keyCode === 38 || ev.keyCode === 87) return snake.up();
    if (ev.keyCode === 40 || ev.keyCode === 83) return snake.down();
    if (ev.keyCode === 39 || ev.keyCode === 68) return snake.right();
    if (ev.keyCode === 37 || ev.keyCode === 65)  return snake.left();

    return false;
  });

  const animacion = setInterval(() => {
    snake.move();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snake.draw();
    drawFood();
    score.innerText = setPoints(points);

    if (snake.dead()) {
      gameOver.style.display = 'inline-flex';
      window.clearInterval(animacion);
    }
  }, 1000 / 5);

  setInterval(() => {
    const food = Food.generate();
    foods.push(food);
    setTimeout(() => {
      // Elimina la comida
      removeFromFoods(food);
    }, 10000);
  }, 4000);


  function drawFood() {
    for (const index in foods) {
      const food = foods[index];
      if (typeof food !== "undefined") {
        food.draw();
        if (hit(food, snake.head)) {
          snake.eat();
          removeFromFoods(food);
        }
      }
    }
  }

  function setPoints(points) {
    let p = "" + points;
    while (p.length < 3) p = "0" + p;
    return p;
  }

  function removeFromFoods(food) {
    foods = foods.filter(f => food !== f);
  }

  function SquareHit(square1, square2) {
    return square1.x === square2.x && square1.y === square2.y;
  }

  function hit(a, b) {
    let hit = false;
    // Colisiones horizontales
    if (b.x + b.width >= a.x && b.x < a.x + a.width) {
      // Colisiones verticales
      if (b.y + b.height >= a.y && b.y < a.y + a.width)
        hit = true;
    }

    // Colisión de a con b
    if (b.x <= a.x && b.x + b.width >= a.x + a.width) {
      if (b.y <= a.y && b.y + b.height >= a.y + a.height)
        hit = true;
    }

    // Colisión de b con a
    if (a.x <= b.x && a.x + a.width >= b.x + b.width) {
      if (a.y <= b.y && a.y + a.height >= b.y + b.height)
        hit = true;
    }

    return hit;
  }
})();
