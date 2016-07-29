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
    }

    static generate() {
      return new Food(Random.get(0, 500), Random.get(0, 300));
    }

    draw() {
      ctx.fillRect(this.x, this.y, 10, 10);
    }
  }

  class Square {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.back = null; // Cuadrado de atras
    }

    draw() {
      ctx.fillRect(this.x, this.y, 10, 10);
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
  }

  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const snake = new Snake();
  let foods = [];

  window.addEventListener('keydown', (ev) => {
    ev.preventDefault();

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
      food.draw();
    }
  }

  function removeFromFoods(food) {
    foods = foods.filter(f => food !== f);
  }
})();
