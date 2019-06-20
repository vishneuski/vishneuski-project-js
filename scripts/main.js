window.onload = function () {

// *******************Константы***********************

  var PLAYERWIDTH = 32;
  var PLAYERHEIGHT = 32;
  var PLAYERSPEED = 2;
  var CANVASWIDTH = 512;
  var CANVASHEIGHT = 480;

  var ENEMYWIDTH = 5;
  var ENEMYHEIGHT = 5;
  var ENEMYSPEED = 7;

  var BULLETSPEED = 3;

// ***************Сущности, обьекты**********************
  var player = {
    speed: PLAYERSPEED,
    posX: 0,
    posY: 0,
    update: function () {
      this.posX += this.speed;
      this.posY += this.speed;
    }
  };

  var enemy = {
    speed: ENEMYSPEED,
    posX: 0,
    posY: 0,
  };

  var bullet = {
    speed: BULLETSPEED,
    posX: 0,
    posY: 0,
  };

  var coin = {
    posX: 0,
    posY: 0,
  };

//***************************Канвас**************************

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  canvas.width = 512;
  canvas.height = 480;

  var field = new Image();
  var hero = new Image();
  field.onload = drawCanvas;
  hero.onload = drawCanvas;
  field.src = '../images/field.png';
  hero.src = '../images/hero.gif';

//******************отрисовка CANVAS *********************


  function drawCanvas() {
    ctx.drawImage(field, 0, 0, CANVASWIDTH, CANVASHEIGHT);
    ctx.drawImage(hero, player.posX, player.posY, PLAYERWIDTH, PLAYERHEIGHT);
  }

//******************** слушаем события клавиатуры*********************

  var keyStorage = {};

  window.addEventListener("keydown", function (e) {
    e = e || window.event;
    keyStorage[e.keyCode] = true;
  }, false);

  window.addEventListener("keyup", function (e) {
    e = e || window.event;
    delete keyStorage[e.keyCode];
  }, false);

  function update() {

    //Up
    if (38 in keyStorage) {
      player.posY -= player.speed;
    }
    //DOWN
    if (40 in keyStorage) {
      player.posY += player.speed;
    }
    //LEFT
    if (37 in keyStorage) {
      player.posX -= player.speed;
    }
    //RIGHT
    if (39 in keyStorage) {
      player.posX += player.speed;
    }

    //SHOT
    if (32 in keyStorage) {
      bullet.posX += bullet.speed;
    }

    player.posX + PLAYERWIDTH > CANVASWIDTH ? player.posX = CANVASWIDTH - PLAYERWIDTH : ((player.posX) < 0 ? player.posX = 0 : 1);

    player.posY + PLAYERHEIGHT > CANVASHEIGHT ? player.posY = CANVASHEIGHT - PLAYERHEIGHT : ((player.posY) < 0 ? player.posY = 0 : 1);

  }

//************* RequestAnimationFrame ***********************

  var RequestAnimationFrame =
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback){
        window.setTimeout(callback, 1000 / 60);
      };

  function render() {
    drawCanvas();
  }

  RequestAnimationFrame(game);

  function game() {
    update();
    render();
    RequestAnimationFrame(game);
  }
};
