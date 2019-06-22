window.onload = function () {

// *******************Константы***********************

  var CANVASWIDTH = 512;
  var CANVASHEIGHT = 512;

  var PLAYERWIDTH = 32;
  var PLAYERHEIGHT = 32;
  var PLAYERSPEED = 2;

  var ENEMYWIDTH = 5;
  var ENEMYHEIGHT = 5;
  var ENEMYSPEED = 7;

  var BULLETSPEED = 3;
  var BULLETWIDTH = 10;
  var BULLETHEIGHT = 10;

  var COINSIZE = 20;


  //***************************Канвас**************************

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  canvas.width = 512;
  canvas.height = 512;


  // рефакторинг - ф-ию
  var field = new Image();
  var hero = new Image();
  var fireball = new Image();
  field.onload = drawCanvas;
  hero.onload = drawCanvas;
  fireball.onload = drawCanvas;
  field.src = '../images/field.png';
  hero.src = '../images/hero.gif';
  fireball.src = '../images/fireball.png';


  // Хранилище нажатых клавиш
  var keyStorage = {};
  var KEY_CODE = {
    up: 38,
    down: 40,
    left: 37,
    right: 39,
    shot: 32
  };

  var bullets = []; // массив выстрелов
  var coins = [];

// ***************Сущности, обьекты**********************
  var player = {
    width: PLAYERWIDTH,
    height: PLAYERHEIGHT,
    speed: PLAYERSPEED,
    posX: 0,
    posY: 0,
    direction: 37,

    draw: function () {
      ctx.drawImage(hero, player.posX, player.posY, PLAYERWIDTH, PLAYERHEIGHT);
    },

    update: function () {
      if (keyStorage[KEY_CODE.up]) {
        this.posY -= this.speed;
        this.direction = 38;
      }

      if (keyStorage[KEY_CODE.down]) {
        this.posY += this.speed;
        this.direction = 40;
      }

      if (keyStorage[KEY_CODE.left]) {
        this.posX -= this.speed;
        this.direction = 37;
      }

      if (keyStorage[KEY_CODE.right]) {
        this.posX += this.speed;
        this.direction = 39;
      }

      if (keyStorage[KEY_CODE.shot]) {
        player.shot();
      }

      this.posX + this.width > CANVASWIDTH ? this.posX = CANVASWIDTH - this.width : ((this.posX) < 0 ? this.posX = 0 : 1);

      this.posY + this.height > CANVASHEIGHT ? this.posY = CANVASHEIGHT - this.height : ((this.posY) < 0 ? this.posY = 0 : 1);


      collision(this, coin);

    },

    shot: function () {
      bullets.push(new Bullet({
        posX: this.posX,
        posY: this.posY
      }));
    }
  };

  function Bullet(bullet) {
    var self = this;
    self.bulletNumber = 1;
    self.speed = BULLETSPEED;
    self.width = BULLETWIDTH;
    self.height = BULLETHEIGHT;
    self.posX = bullet.posX;
    self.posY = bullet.posY;
    self.direction = player.direction;

    self.update = function () {
      if (self.direction === 37) {
        self.posX -= self.speed;
      }
      if (self.direction === 39) {
        self.posX += self.speed;
      }
      if (self.direction === 38) {
        self.posY -= self.speed;
      }
      if (self.direction === 40) {
        self.posY += self.speed;
      }
    };

    self.draw = function () {
      ctx.drawImage(fireball, self.posX, self.posY, self.width, self.height);
    };

// todo function for outside canvas bullets delete
    self.disable = function () {
      if (self.posX > canvas.height || self.posX < 0 || self.posY > canvas.height || self.posY < 0) {
        return false;
      }
    };
  }

  function Coin(coin) {
    var self = this;
    self.width = COINSIZE;
    self.height = COINSIZE;
    self.posX = coin.posX;
    self.posY = coin.posY;

    self.draw = function () {
      ctx.beginPath();
      ctx.fillStyle = 'yellow';
      // ctx.arc(self.posX, self.posY, self.width / 2, 0, Math.PI * 2, false);
      ctx.fillRect(self.posX, self.posY, self.width, self.height);
      ctx.fill();
    };
  }

  function collision(obj1, obj2) {
    if (((obj1.posX < obj2.posX + obj2.width && obj1.posX > obj2.posX) || (obj1.posX + obj1.width > obj2.posX && obj1.posX < obj2.posX)) && ((obj1.posY < obj2.posY + obj2.height && obj1.posY > obj2.posY) || (obj1.posY + obj1.height > obj2.posY && obj1.posY < obj2.posY))) {

      console.log('collision!');
    }
  }

  var coin = new Coin({posX: 50, posY: 50});
//***************** Враги ********************

  // var enemy = {
  //   width: ENEMYWIDTH,
  //   height: ENEMYHEIGHT,
  //   speed: ENEMYSPEED,
  //   posX: 0,
  //   posY: 0
  //   // move: function() {
  //   //
  //   // }
  // };

//****************** Монеты *****************

  // var coin = {
  //   width: COINWIDTH,
  //   height: COINHEIGHT,
  //   posX: 0,
  //   posY: 0
  // };


//******************отрисовка CANVAS *********************


  function drawCanvas() {
    ctx.drawImage(field, 0, 0, CANVASWIDTH, CANVASHEIGHT);
    player.draw();
    bullets.forEach(function (bullet) {
      bullet.draw();
    });
    coin.draw();
  }

  // drawCanvas();
//******************** слушаем события клавиатуры*********************


  window.addEventListener("keydown", keyDown, false);

  window.addEventListener("keyup", keyUp, false);

  function keyDown(e) {
    var e = e || window.event;
    e.preventDefault();
    keyStorage[e.keyCode] = true;
  }

  function keyUp(e) {
    var e = e || window.event;
    e.preventDefault();
    delete keyStorage[e.keyCode];
  }


//************* RequestAnimationFrame ***********************

  var RequestAnimationFrame =
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 60);
      };

  function render() {
    drawCanvas();
  }

  RequestAnimationFrame(game);

  function game() {
    player.update();
    bullets.forEach(function (bullet) {
      bullet.update();
    });

    render();
    RequestAnimationFrame(game);
  }
};
