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
      this.draw();
    }

    draw() {
      this.head.draw();
    }

    right() {
      this.direction = 'right';
    }

    left() {
      this.direction = 'left';
    }

    up() {
      this.direction = 'up';
    }

    down() {
      this.direction = 'down';
    }

    move() {
      if (this.direction === 'up')    return this.head.up();
      if (this.direction === 'down')  return this.head.down();
      if (this.direction === 'left')  return this.head.left();
      if (this.direction === 'right') return this.head.right();
    }

    eat() {
      this.head.add();
    }
  }

  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const snake = new Snake();
  let foods = [];
  const keys = [37, 38, 39, 40, 65, 68, 83, 87];

  window.addEventListener('keydown', (ev) => {
    if (ev.keyCode in keys) ev.preventDefault();
    if (ev.keyCode === 38 || ev.keyCode === 87) return snake.up();
    if (ev.keyCode === 40 || ev.keyCode === 83) return snake.down();
    if (ev.keyCode === 39 || ev.keyCode === 68) return snake.right();
    if (ev.keyCode === 37 || ev.keyCode === 65)  return snake.left();

    return false;
  });

  setInterval(() => {
    snake.move();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snake.draw();
    drawFood();
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
      else console.log("HI");
    }
  }

  function removeFromFoods(food) {
    foods = foods.filter(f => food !== f);
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
