'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
  var Random = (function () {
    function Random() {
      _classCallCheck(this, Random);
    }

    _createClass(Random, null, [{
      key: 'get',
      value: function get(inicio, final) {
        return Math.floor(Math.random() * final) + inicio;
      }
    }]);

    return Random;
  })();

  var Food = (function () {
    function Food(x, y) {
      _classCallCheck(this, Food);

      this.x = x;
      this.y = y;
    }

    _createClass(Food, [{
      key: 'draw',
      value: function draw() {
        ctx.fillRect(this.x, this.y, 10, 10);
      }
    }], [{
      key: 'generate',
      value: function generate() {
        return new Food(Random.get(0, 500), Random.get(0, 300));
      }
    }]);

    return Food;
  })();

  var Square = (function () {
    function Square(x, y) {
      _classCallCheck(this, Square);

      this.x = x;
      this.y = y;
      this.back = null; // Cuadrado de atras
    }

    _createClass(Square, [{
      key: 'draw',
      value: function draw() {
        ctx.fillRect(this.x, this.y, 10, 10);
        if (this.hasBack()) {
          this.back.draw();
        }
      }
    }, {
      key: 'add',
      value: function add() {
        if (this.hasBack()) return this.back.add();
        this.back = new Square(this.x, this.y);
      }
    }, {
      key: 'hasBack',
      value: function hasBack() {
        return this.back !== null;
      }
    }, {
      key: 'copy',
      value: function copy() {
        if (this.hasBack()) {
          this.back.copy();
          this.back.x = this.x;
          this.back.y = this.y;
        }
      }
    }, {
      key: 'right',
      value: function right() {
        this.copy();
        this.x += 10;
      }
    }, {
      key: 'left',
      value: function left() {
        this.copy();
        this.x -= 10;
      }
    }, {
      key: 'up',
      value: function up() {
        this.copy();
        this.y -= 10;
      }
    }, {
      key: 'down',
      value: function down() {
        this.copy();
        this.y += 10;
      }
    }]);

    return Square;
  })();

  var Snake = (function () {
    function Snake() {
      _classCallCheck(this, Snake);

      this.head = new Square(100, 0);
      this.direction = 'right';
      this.head.add();
      this.head.add();
      this.head.add();
      this.head.add();
      this.head.add();
      this.draw();
    }

    _createClass(Snake, [{
      key: 'draw',
      value: function draw() {
        this.head.draw();
      }
    }, {
      key: 'right',
      value: function right() {
        this.direction = 'right';
      }
    }, {
      key: 'left',
      value: function left() {
        this.direction = 'left';
      }
    }, {
      key: 'up',
      value: function up() {
        this.direction = 'up';
      }
    }, {
      key: 'down',
      value: function down() {
        this.direction = 'down';
      }
    }, {
      key: 'move',
      value: function move() {
        if (this.direction === 'up') return this.head.up();
        if (this.direction === 'down') return this.head.down();
        if (this.direction === 'left') return this.head.left();
        if (this.direction === 'right') return this.head.right();
      }
    }]);

    return Snake;
  })();

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var snake = new Snake();
  var foods = [];

  window.addEventListener('keydown', function (ev) {
    ev.preventDefault();

    if (ev.keyCode === 38 || ev.keyCode === 87) return snake.up();
    if (ev.keyCode === 40 || ev.keyCode === 83) return snake.down();
    if (ev.keyCode === 39 || ev.keyCode === 68) return snake.right();
    if (ev.keyCode === 37 || ev.keyCode === 65) return snake.left();

    return false;
  });

  setInterval(function () {
    snake.move();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snake.draw();
    drawFood();
  }, 1000 / 5);

  setInterval(function () {
    var food = Food.generate();
    foods.push(food);
    setTimeout(function () {
      // Elimina la comida
      removeFromFoods(food);
    }, 10000);
  }, 4000);

  function drawFood() {
    for (var index in foods) {
      var food = foods[index];
      food.draw();
    }
  }

  function removeFromFoods(food) {
    foods = foods.filter(function (f) {
      return food !== f;
    });
  }
})();
