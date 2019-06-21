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

  var BULLETSPEED = 1;
  var BULLETWIDTH = 10;
  var BULLETHEIGHT = 10;

  var COINWIDTH;
  var COINHEIGHT;


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

  var bullets = [];

// ***************Сущности, обьекты**********************
  var player = {
    width: PLAYERWIDTH,
    height: PLAYERHEIGHT,
    speed: PLAYERSPEED,
    posX: 0,
    posY: 0,
    currentDirection: 0,
    position: 37,

    draw: function () {
      ctx.drawImage(hero, player.posX, player.posY, PLAYERWIDTH, PLAYERHEIGHT);
    },

    update: function () {
      if (keyStorage[KEY_CODE.up]) {
        this.posY -= this.speed;
        this.position = 38;
      }

      if (keyStorage[KEY_CODE.down]) {
        this.posY += this.speed;
        this.position = 40;
      }

      if (keyStorage[KEY_CODE.left]) {
        this.posX -= this.speed;
        this.position = 37;
      }

      if (keyStorage[KEY_CODE.right]) {
        this.posX += this.speed;
        this.position = 39;
      }

      if (keyStorage[KEY_CODE.shot]) {
        player.shot();
      }

      this.posX + this.width > CANVASWIDTH ? this.posX = CANVASWIDTH - this.width : ((this.posX) < 0 ? this.posX = 0 : 1);

      this.posY + this.height > CANVASHEIGHT ? this.posY = CANVASHEIGHT - this.height : ((this.posY) < 0 ? this.posY = 0 : 1);
    },

    shot: function () {
      bullets.push(new Bullet({
        speed: this.speed,
        posX: this.posX,
        posY: this.posY
      }));
    }
  };

  function Bullet(bullet) {
    var self = this;
    self.bulletNumber = 1;
    self.speed = bullet.speed;
    self.width = BULLETWIDTH;
    self.height = BULLETHEIGHT;
    self.posX = bullet.posX;
    self.posY = bullet.posY;
    self.position = player.position;

    self.update = function () {
      if (self.position === 37) {
        self.posX -= self.speed;
      }
      if (self.position === 39) {
        self.posX += self.speed;
      }
      if (self.position === 38) {
        self.posY -= self.speed;
      }
      if (self.position === 40) {
        self.posY += self.speed;
      }
    };

    self.draw = function () {
      ctx.drawImage(fireball, self.posX, self.posY, self.width, self.height);
    }
// todo function for outside canvas bullets delete
    self.disable = function () {
      if (self.posX > canvas.height || self.posX < 0 || self.posY > canvas.height || self.posY < 0) {
        return false;
      }
    };
  }

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
