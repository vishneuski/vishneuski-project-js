window.onload = function () {

// *******************Константы***********************

  var CANVASWIDTH = 512;
  var CANVASHEIGHT = 512;

  var PLAYERWIDTH = 32;
  var PLAYERHEIGHT = 32;
  var PLAYERSPEED = 2;

  var ENEMYWIDTH = 32;
  var ENEMYHEIGHT = 32;
  var ENEMYSPEED = 7;

  var BULLETSPEED = 3;
  var BULLETWIDTH = 10;
  var BULLETHEIGHT = 10;

  var COINSIZE = 20;


  //***************************Канвас**************************

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  canvas.width = CANVASWIDTH;
  canvas.height = CANVASHEIGHT;

  // рефакторинг - ф-ию
  var field = new Image();
  var hero = new Image();
  var fireball = new Image();
  var allien = new Image();
  field.onload = drawCanvas;
  hero.onload = drawCanvas;
  fireball.onload = drawCanvas;
  allien.onload = drawCanvas;
  field.src = '../images/field.png';
  hero.src = '../images/hero.gif';
  fireball.src = '../images/fireball.png';
  allien.src = '../images/allien.gif';


  // Хранилище нажатых клавиш
  var keyStorage = {};
  var KEY_CODE = {
    up: 38,
    down: 40,
    left: 37,
    right: 39,
    shot: 32
  };

  var player = new Player({posX: 0, posY: 0});
  var enemies = []; // и враги конечно
  var bullets = []; // массив выстрелов
  var coins = []; //то же и с монетами

// ***************Функции-конструкторы сущностей**********************

//*******************    Player FC ****************

  function Player(player) {
    var self = this;
    self.width = PLAYERWIDTH;
    self.height = PLAYERHEIGHT;
    self.speed = PLAYERSPEED;
    self.posX = player.posX;
    self.posY = player.posY;
    self.direction = 37;
    self.isCollise = false;
    self.coinCounter = 0;
    self.enemyCounter =0;
  }

  Player.prototype.draw = function () {
    var self = this;
    ctx.drawImage(hero, self.posX, self.posY, self.width, self.height);
  };

  Player.prototype.coinCollision = function () {
    var self = this;
    var isColl = collision(self, coin);
    collision(self, coin);
    if (isColl) {
      self.coinCounter += 1;
      console.log('I catch coin!!!!' + self.coinCounter);
    }
  };

  Player.prototype.enemyCollision = function () {
    var self = this;
    var isColl = collision(self, enemy);
    collision(self, enemy);
    if (isColl) {
      self.enemyCounter +=1;
      console.log('I catch enemy!!!!' + self.enemyCounter);
    }
  };

  Player.prototype.update = function () {
    var self = this;
    if (keyStorage[KEY_CODE.up]) {
      self.posY -= self.speed;
      self.direction = 38;
    }

    if (keyStorage[KEY_CODE.down]) {
      self.posY += self.speed;
      self.direction = 40;
    }

    if (keyStorage[KEY_CODE.left]) {
      self.posX -= self.speed;
      self.direction = 37;
    }

    if (keyStorage[KEY_CODE.right]) {
      self.posX += self.speed;
      self.direction = 39;
    }

    if (keyStorage[KEY_CODE.shot]) {
      self.shot();
    }

    self.posX + self.width > CANVASWIDTH ? self.posX = CANVASWIDTH - self.width : ((self.posX) < 0 ? self.posX = 0 : 1);
    self.posY + self.height > CANVASHEIGHT ? self.posY = CANVASHEIGHT - self.height : ((self.posY) < 0 ? self.posY = 0 : 1);

    self.coinCollision();

    if(self.coinCounter > 100) {
      alert('You are win!!!');
    }

    self.enemyCollision();

    if(self.enemyCounter = 1) {
      alert('Yoy are die!!!!');
      // startGame(); todo start game again
    }
  };

  Player.prototype.shot = function () {
    bullets.push(new Bullet({
      posX: this.posX,
      posY: this.posY
    }));
  };


  //*********************** Enemy function-constructor *************
  function Enemy(enemy) {
    var self = this;
    self.width = ENEMYWIDTH;
    self.height = ENEMYHEIGHT;
    self.speed = ENEMYSPEED;
    self.posX = enemy.posX;
    self.posY = enemy.posY;
  }

  Enemy.prototype.draw = function () {
    var self = this;
    ctx.drawImage(allien, self.posX, self.posY, self.width, self.height);
  };

  // Enemy.prototype.bulletCollision = function () {
  //   var self = this;
  //   collision(self, bullets);
  // };

  Enemy.prototype.update = function () {
    var self = this;

    self.posX + self.width > CANVASWIDTH ? self.posX = CANVASWIDTH - self.width : ((self.posX) < 0 ? self.posX = 0 : 1);
    self.posY + self.height > CANVASHEIGHT ? self.posY = CANVASHEIGHT - self.height : ((self.posY) < 0 ? self.posY = 0 : 1);

    // self.bulletCollision();
  };

  // Enemy.prototype.shot = function () {
  //   bullets.push(new Bullet({
  //     posX: this.posX,
  //     posY: this.posY
  //   }));
  // };

  var enemy = new Enemy({posX: 400, posY: 400});

  //************      Bullet FC    ****************
  function Bullet(bullet) {
    var self = this;
    self.numOfBullet = 0;
    self.speed = BULLETSPEED;
    self.width = BULLETWIDTH;
    self.height = BULLETHEIGHT;
    self.posX = bullet.posX;
    self.posY = bullet.posY;
    self.direction = player.direction;
    self.isOut = false; // нахождение пули в рамках Канвас
  }

  Bullet.prototype.draw = function () {
    var self = this;
    ctx.drawImage(fireball, self.posX, self.posY, self.width, self.height);
  };

  Bullet.prototype.enemyCollision = function () {
    var self = this;
    collision(self, enemy);
  };

  Bullet.prototype.playerCollision = function () {
    var self = this;
    collision(self, player);
  };

  // todo function for outside canvas bullets delete - maby bullets.filter???
  Bullet.prototype.goOut = function () {
    var self = this;
    if (self.posX > canvas.height || self.posX < 0 || self.posY > canvas.height || self.posY < 0) {
      self.isOut = true;
      console.log(self.isOut);

      bullets = bullets.filter(function (bullet) {
        return !bullet.isOut;
      });
    }
  };


  Bullet.prototype.update = function () {
    var self = this;
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
    self.enemyCollision();
    self.playerCollision();
    self.goOut();
  };

  //****************  Coin f-c  *****************
  function Coin(coin) {
    var self = this;
    self.visible = true;
    self.width = COINSIZE;
    self.height = COINSIZE;
    self.posX = coin.posX;
    self.posY = coin.posY;
  }

  Coin.prototype.draw = function () {
    var self = this;
    ctx.beginPath();
    ctx.fillStyle = 'yellow';
    // ctx.arc(self.posX, self.posY, self.width / 2, 0, Math.PI * 2, false);
    ctx.fillRect(self.posX, self.posY, self.width, self.height);
    ctx.fill();
  };

  var coin = new Coin({posX: 50, posY: 50});


  // ************ collision function *************
  function collision(obj1, obj2) {
    var isCollisioned = false;
    if (((obj1.posX < obj2.posX + obj2.width && obj1.posX > obj2.posX) || (obj1.posX + obj1.width > obj2.posX && obj1.posX < obj2.posX)) && ((obj1.posY < obj2.posY + obj2.height && obj1.posY > obj2.posY) || (obj1.posY + obj1.height > obj2.posY && obj1.posY < obj2.posY))) {
      console.log(obj1 + ' collision! ' + obj2);
      isCollisioned = true;
    } else {
      isCollisioned = false;
    }
    return isCollisioned;
  }

//******************отрисовка CANVAS *********************
  function drawCanvas() {
    ctx.drawImage(field, 0, 0, CANVASWIDTH, CANVASHEIGHT);
    player.draw();
    bullets.forEach(function (bullet) {
      bullet.draw();
    });
    coin.draw();
    enemy.draw();
  }

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
