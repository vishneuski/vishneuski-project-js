window.onload = () => {

  /**
   * Размер канвас - ширина
   * @const
   * @type {number}
   */
  const CANVASWIDTH = 512;

  /**
   * Размер канвас - высота
   * @const
   * @type {number}
   */
  const CANVASHEIGHT = 512;

  /**
   * Размер персонажей игры - ширина
   * @const
   * @type {number}
   */
  const HEROWIDTH = 32;

  /**
   * Размер персонажей игры - высота
   * @const
   * @type {number}
   */
  const HEROHEIGHT = 32;

  /**
   * Скорость героя
   * @const
   * @type {number}
   */
  const PLAYERSPEED = 1.2;

  /**
   * Скорость врагов
   * @const
   * @type {number}
   */
  const ENEMYSPEED = 1;

  /**
   * Размер пули
   * @const
   * @type {number}
   */
  const BULLETSIZE = 16;

  /**
   * Скорость пули
   * @const
   * @type {number}
   */
  const BULLETSPEED = 3;

  /**
   * Размер монеты
   * @const
   * @type {number}
   */
  const COINSIZE = 16;

  /**
   * Фоновая музыка игры
   * @type {HTMLAudioElement | null}
   */
  let audio = document.querySelector('audio');

  /**
   * Таймер игры - начальное состояние
   * @type {number}
   */
  let time = 0;

  /**
   * Функция для запуска таймера и фоновой музыки
   * @return {string} Таймер и музыка запущены
   */
  let timer = () => {
    document.querySelector('#timer').innerHTML = time;
    time = setTimeout(timer, 1000);
    audio.play();
    return 'Start the game!';
  };
  timer();

  /**
   * Находим канвас в документе, получаем контекст и задаем размеры канвас
   * @type {HTMLElement | null}
   */
  let canvas = document.getElementById('canvas');
  let ctx = canvas.getContext('2d');

  canvas.width = CANVASWIDTH;
  canvas.height = CANVASHEIGHT;

  /**
   * Создаем изображение героя, врага, пули и монеты
   * @type {HTMLImageElement}
   */
  const hero = new Image();
  const fireball = new Image();
  const allien = new Image();
  const prise = new Image();

  /**
   * Отрисовка изображений происходит только после их загрузки
   * @type {drawCanvas}
   */
  hero.onload = drawCanvas;
  fireball.onload = drawCanvas;
  allien.onload = drawCanvas;
  prise.onload = drawCanvas;


  /**
   * Путь до изображений
   * @type {string}
   */
  hero.src = 'images/hero.gif';
  fireball.src = 'images/fireball.png';
  allien.src = 'images/allien.gif';
  prise.src = 'images/coin.png';


  /**
   * Функция для отрисовки карты игры
   * @return {boolean} true - карта успешно загружена
   */
  let drawMap = () => {
    let mapArray = [
      [1, 1, 0, 0, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 0, 0, 1],
      [0, 1, 0, 0, 0, 0, 0, 1],
      [0, 1, 0, 0, 0, 0, 1, 1],
      [0, 1, 1, 1, 1, 0, 1, 0],
      [0, 1, 0, 0, 1, 1, 1, 0],
      [0, 1, 0, 0, 1, 0, 0, 0],
      [0, 1, 1, 1, 1, 0, 0, 0]
    ];

    const brick = new Image();
    const wall = new Image();

    let posX = 0;
    let posY = 0;

    brick.onload = () => {
      wall.onload = () => {
        for (let i = 0; i < mapArray.length; i++) {
          for (let j = 0; j < mapArray[i].length; j++) {
            if (mapArray[i][j] === 0) {
              ctx.drawImage(brick, posX, posY, 64, 64);
            }
            if (mapArray[i][j] === 1) {
              ctx.drawImage(wall, posX, posY, 64, 64);
            }
            posX += 64;
          }
          posY += 64;
          posX = 0;
        }
      };
    };
    brick.src = 'images/brick.png';
    wall.src = 'images/wall.png';
    return true;
  };

  /**
   * Создаем героя
   * @type {Player}
   */
  let player = new Player({posX: 0, posY: 0});

  /**
   * Создаем массив врагов, пуль, монет
   * @type {Array}
   */
  let enemies = [];
  let bullets = [];
  let coins = [];


  // ***************Функции-конструкторы**************
  //* ******************    Player FC ****************
  class Player {
    constructor(player) {
      this.keyStorage = {};
      this.KEY_CODE = {
        up: 38,
        down: 40,
        left: 37,
        right: 39,
        shot: 32
    };
      this.playerInfo = {}; //имя и время игрока
      this.width = HEROWIDTH;
      this.height = HEROHEIGHT;
      this.speed = PLAYERSPEED;
      this.posX = player.posX;
      this.posY = player.posY;
      this.direction = 37;
      this.coinCounter = 0; // кол-во столкновений с монетами
      this.enemyCounter = 0;// кол-во столкновений с врагами
      this.bulletNumber = 0;
      this.bulletActive = false;
      this.health = 100;
    };

    draw() {
      ctx.drawImage(hero, self.posX, self.posY, self.width, self.height);
    }
  }

  Player.prototype.draw = function () {
    var self = this;

  };

  Player.prototype.coinCollision = function () {
    var self = this;
    for (var i = 0; i < coins.length; i++) {
      collision(self, coins[i]);
      var isColl = collision(self, coins[i]);
      if (isColl === true) {
        self.coinCounter += 1;
        document.querySelector('#score').innerHTML = 'Score: ' + self.coinCounter;
      }
    }
  };

  Player.prototype.enemyCollision = function () {
    var self = this;
    for (var i = 0; i < enemies.length; i++) {
      var isColl = collision(self, enemies[i]);
      collision(self, enemies[i]);
      if (isColl === true) {
        self.health -= 25;
        console.log(`collision with enemy!!!!${self.enemyCounter} - ${self.health}`);
        // logic for enemy catch - the end of game)
        self.enemyCounter += 1;
      }
    }
  };

  Player.prototype.update = function () {
    var self = this;

    if (self.keyStorage[self.KEY_CODE.up]) {
      self.posY -= self.speed;
      self.direction = 38; //need for define shot direction
    }

    if (self.keyStorage[self.KEY_CODE.down]) {
      self.posY += self.speed;
      self.direction = 40;
    }

    if (self.keyStorage[self.KEY_CODE.left]) {
      self.posX -= self.speed;
      self.direction = 37;
    }

    if (self.keyStorage[self.KEY_CODE.right]) {
      self.posX += self.speed;
      self.direction = 39;
    }

    if (self.keyStorage[self.KEY_CODE.shot]) {
      self.shot();
    }

    self.posX + self.width > CANVASWIDTH ? self.posX = CANVASWIDTH - self.width : ((self.posX) < 0 ? self.posX = 0 : 1);
    self.posY + self.height > CANVASHEIGHT ? self.posY = CANVASHEIGHT - self.height : ((self.posY) < 0 ? self.posY = 0 : 1);

    self.coinCollision();
    self.enemyCollision();

    if (self.health === 0) {
      audio.pause();
      //TODO: gameover
      endGame();
    }
  };

  Player.prototype.shot = function () {
    var self = this;
    while (self.bulletNumber < 1 && self.bulletActive === false) {
      bullets.push(new Bullet({
        posX: this.posX,
        posY: this.posY
      }));
      self.bulletNumber++;
      self.bulletActive = true;
    }
  };

  Player.prototype.shift = function () {
    var self = this;
    if (self.keyStorage[self.KEY_CODE.up]) {
      self.posY -= self.speed / 5;
      self.direction = 38;
    }
    if (self.keyStorage[self.KEY_CODE.down]) {
      self.posY += self.speed / 5;
      self.direction = 40;
    }

    if (self.keyStorage[self.KEY_CODE.left]) {
      self.posX -= self.speed / 5;
      self.direction = 37;
    }

    if (self.keyStorage[self.KEY_CODE.right]) {
      self.posX += self.speed / 5;
      self.direction = 39;
    }
  };


  function Player(player) {
    var self = this;
    self.keyStorage = {};
    self.KEY_CODE = {
      up: 38,
      down: 40,
      left: 37,
      right: 39,
      shot: 32
    };

    self.playerInfo = {}; //имя и время игрока
    self.width = HEROWIDTH;
    self.height = HEROHEIGHT;
    self.speed = PLAYERSPEED;
    self.posX = player.posX;
    self.posY = player.posY;
    self.direction = 37;
    self.coinCounter = 0; // кол-во столкновений с монетами
    self.enemyCounter = 0;// кол-во столкновений с врагами
    self.bulletNumber = 0;
    self.bulletActive = false;
    self.coinTouch = false;
    self.health = 100;
  }

  Player.prototype.draw = function () {
    var self = this;
    ctx.drawImage(hero, self.posX, self.posY, self.width, self.height);
  };

  Player.prototype.coinCollision = function () {
    var self = this;
    for (var i = 0; i < coins.length; i++) {
      collision(self, coins[i]);
      var isColl = collision(self, coins[i]);
      if (isColl === true) {
        self.coinCounter += 1;
        document.querySelector('#score').innerHTML = 'Score: ' + self.coinCounter;
      }
    }
  };

  Player.prototype.enemyCollision = function () {
    var self = this;
    for (var i = 0; i < enemies.length; i++) {
      var isColl = collision(self, enemies[i]);
      collision(self, enemies[i]);
      if (isColl === true) {
        self.health -= 25;
        console.log(`collision with enemy!!!!${self.enemyCounter} - ${self.health}`);
        // logic for enemy catch - the end of game)
        self.enemyCounter += 1;
      }
    }
  };

  Player.prototype.update = function () {
    var self = this;

    if (self.keyStorage[self.KEY_CODE.up]) {
      self.posY -= self.speed;
      self.direction = 38; //need for define shot direction
    }

    if (self.keyStorage[self.KEY_CODE.down]) {
      self.posY += self.speed;
      self.direction = 40;
    }

    if (self.keyStorage[self.KEY_CODE.left]) {
      self.posX -= self.speed;
      self.direction = 37;
    }

    if (self.keyStorage[self.KEY_CODE.right]) {
      self.posX += self.speed;
      self.direction = 39;
    }

    if (self.keyStorage[self.KEY_CODE.shot]) {
      self.shot();
    }

    self.posX + self.width > CANVASWIDTH ? self.posX = CANVASWIDTH - self.width : ((self.posX) < 0 ? self.posX = 0 : 1);
    self.posY + self.height > CANVASHEIGHT ? self.posY = CANVASHEIGHT - self.height : ((self.posY) < 0 ? self.posY = 0 : 1);

    self.coinCollision();
    self.enemyCollision();

    if (self.health === 0) {
      audio.pause();
      //TODO: gameover
      endGame();
    }
  };

  Player.prototype.shot = function () {
    var self = this;
    while (self.bulletNumber < 1 && self.bulletActive === false) {
      bullets.push(new Bullet({
        posX: this.posX,
        posY: this.posY
      }));
      self.bulletNumber++;
      self.bulletActive = true;
    }
  };

  Player.prototype.shift = function () {
    var self = this;
    if (self.keyStorage[self.KEY_CODE.up]) {
      self.posY -= self.speed / 5;
      self.direction = 38;
    }
    if (self.keyStorage[self.KEY_CODE.down]) {
      self.posY += self.speed / 5;
      self.direction = 40;
    }

    if (self.keyStorage[self.KEY_CODE.left]) {
      self.posX -= self.speed / 5;
      self.direction = 37;
    }

    if (self.keyStorage[self.KEY_CODE.right]) {
      self.posX += self.speed / 5;
      self.direction = 39;
    }
  };

  //* ********************** Enemy function-constructor *************
  function Enemy(enemy) {
    var self = this;
    self.width = HEROWIDTH;
    self.height = HEROHEIGHT;
    self.speed = ENEMYSPEED;
    self.posX = enemy.posX;
    self.posY = enemy.posY;
    self.direction = enemy.direction;
    self.directionEnemy = {
      left: 1,
      right: 2,
      up: 3,
      down: 4
    };
    self.bulletTouch = false; // collision with the bullet
    self.health = 10; // health quantity
    self.die = false;
  }

  Enemy.prototype.draw = function () {
    var self = this;
    ctx.drawImage(allien, self.posX, self.posY, self.width, self.height);
  };

  Enemy.prototype.bulletCollision = function () {
    var self = this;
    for (var i = 0; i < bullets.length; i++) {
      var isColl = collision(self, bullets[i]);
      collision(self, bullets[i]);
      if (isColl === true) {
        self.bulletTouch = true;
        self.health -= 10;
        console.log(self + self.health);
        if (self.health === 0) {
          self.die = true;
          enemies = enemies.filter(function (enemy) {
            return !enemy.die;
          });
        }
      }
    }
  };

  Enemy.prototype.update = function () {
    var self = this;

    if (self.direction === self.directionEnemy.right) {
      self.posX += self.speed;
      self.posY -= self.speed;
      if ((self.posX + self.width > CANVASWIDTH) || (self.posX < 0)) {
        self.speed = -self.speed;
      }
    } else if (self.direction === self.directionEnemy.left) {
      self.posX -= self.speed;
      if ((self.posX + self.width > CANVASWIDTH) || (self.posX < 0)) {
        self.speed = -self.speed;
      }
    } else if (self.direction === self.directionEnemy.down) {
      self.posY += self.speed;
      if ((self.posY + self.height > CANVASHEIGHT) || (self.posY < 0)) {
        self.speed = -self.speed;
      }
    } else if (self.direction === self.directionEnemy.up) {
      self.posY -= self.speed;
      if ((self.posY + self.height > CANVASHEIGHT) || (self.posY < 0)) {
        self.speed = -self.speed;
      }
    }

    self.posX + self.width > CANVASWIDTH ? self.posX = CANVASWIDTH - self.width : ((self.posX) < 0 ? self.posX = 0 : 1);
    self.posY + self.height > CANVASHEIGHT ? self.posY = CANVASHEIGHT - self.height : ((self.posY) < 0 ? self.posY = 0 : 1);

    self.bulletCollision();
  };

  enemyAdd();

  function enemyAdd() {
    for (var i = 0; i <= 5; i++) {
      addEntity(Enemy, 'enemy', {
        posX: getMathRandom(0, 496),
        posY: getMathRandom(0, 496),
        direction: Math.floor(Math.random() * (5 - 1)) + 1
      }, enemies);
    }
  }

  //* ***********      Bullet FC    ****************
  function Bullet(bullet) {
    var self = this;
    self.maxNumOfBullet = 3;
    self.speed = BULLETSPEED;
    self.width = BULLETSIZE;
    self.height = BULLETSIZE;
    self.posX = bullet.posX;
    self.posY = bullet.posY;
    self.direction = player.direction;
    self.isOut = false; // нахождение пули в рамках Канвас
    self.getEnemyTarget = false; // попадание пули во врага
  }

  Bullet.prototype.draw = function () {
    var self = this;
    ctx.drawImage(fireball, self.posX, self.posY, self.width, self.height);
  };

  Bullet.prototype.enemyCollision = function () {
    var self = this;
    for (var i = 0; i < enemies.length; i++) {
      var isColl = collision(self, enemies[i]);
      collision(self, enemies[i]);
      if (isColl === true) {
        self.getEnemyTarget = true;
        bullets = bullets.filter(function (bullet) {
          return !bullet.getEnemyTarget;
        });
      }
    }
  };

  Bullet.prototype.goOut = function () {
    var self = this;
    if (self.posX > canvas.height || self.posX < 0 || self.posY > canvas.height || self.posY < 0 || self.getEnemyTarget === true) {
      self.isOut = true;
      player.bulletActive = false;
      player.bulletNumber--;
      console.log(self);
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
    self.goOut();
  };

// ********************  Coin f-c  *********************
  function Coin(coin) {

    var self = this;
    self.width = COINSIZE;
    self.height = COINSIZE;
    self.posX = coin.posX;
    self.posY = coin.posY;
    self.playerTouch = false;
  }

  Coin.prototype.draw = function () {
    var self = this;
    ctx.drawImage(prise, self.posX, self.posY, self.width, self.height);
  };

  Coin.prototype.playerCollision = function () {
    var self = this;
    var isColl = collision(self, player);
    collision(self, player);
    if (isColl === true) {
      self.playerTouch = true;
      coins = coins.filter(function (coin) {
        return !coin.playerTouch;
      });
      if (coins.length === 0) {
        saveResult();
      }
    }
  };

  Coin.prototype.update = function () {
    var self = this;
    self.playerCollision();
  };

  coinAdd();

  function coinAdd() {
    for (var i = 0; i <= 10; i++) {
      addEntity(Coin, 'coin', {posX: getMathRandom(0, 496), posY: getMathRandom(0, 496)}, coins);
    }
  }

// ******************** Common functions *************************
  /**
   * Функция получения рандомного числа для размещения объектов(монет, врагов)
   * @param {number} min Минимальная координата по осям x или y
   * @param {number} max Максимальная координата по осям x или y
   * @returns {number} Рандомное число
   */
  function getMathRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  /**
   * Функция для определения столкновений
   * @param {object} obj1 Первый объект
   * @param {object} obj2 Второй объект
   * @returns {boolean} Состояние столкновения.
   */
  function collision(obj1, obj2) {
    var isCollisioned = false;
    if (((obj1.posX < obj2.posX + obj2.width && obj1.posX > obj2.posX) || (obj1.posX + obj1.width > obj2.posX && obj1.posX < obj2.posX)) && ((obj1.posY < obj2.posY + obj2.height && obj1.posY > obj2.posY) || (obj1.posY + obj1.height > obj2.posY && obj1.posY < obj2.posY))) {
      isCollisioned = true;
    } else {
      isCollisioned = false;
    }
    return isCollisioned;
  }

  /**
   * Функция для добавления обьектов в массив
   * @param {function} FC Функция-констуктор
   * @param {string} name Имя объекта
   * @param {object} obj Объект аргументов
   * @param {array} objArr Массив, содержащий объекты
   */
  function addEntity(FC, name, obj, objArr) {
    var name = new FC(obj);
    objArr.push(name);
  }

  /**
   * Функция для сохраниения результатов игры
   * @returns {boolean} Состояние сохранения.
   */
  function saveResult() {
    clearTimeout(time);
    audio.pause();
    var askName = prompt('Введите ваше имя: ', 'player');
    console.log(`You are winner!!!${askName}!!! Our congratulates!!!`);
    document.querySelector('#timer').innerHTML = time;
    player.playerInfo.name = askName || 'player';
    player.playerInfo.time = time;
    sendResult();
    endGame();
    return true;
  }

  function endGame() {
    var hideCanvas = document.getElementById('canvas');
    hideCanvas.style.display = 'none';
    coins = null;
    enemies = null;
    bullets = null;
  }

//***************** !!! VIEW !!! *****************************

  function drawCanvas(boolean) {
    drawMap();
    player.draw();
    bullets.forEach(function (bullet) {
      bullet.draw();
    });
    coins.forEach(function (coin) {
      coin.draw();
    });
    enemies.forEach(function (enemie) {
      enemie.draw();
    });
  }

//******************* !!! CONTROLLER !!! **********************
  var up = document.querySelector('#up');
  var down = document.querySelector('#down');
  var left = document.querySelector('#left');
  var right = document.querySelector('#right');
  var shot = document.querySelector('#shot');

  up.addEventListener('touchstart', upDown, false);
  down.addEventListener('touchstart', downDown, false);
  left.addEventListener('touchstart', leftDown, false);
  right.addEventListener('touchstart', rightDown, false);
  shot.addEventListener('touchstart', shotDown, false);

  up.addEventListener('touchend', upUp, false);
  down.addEventListener('touchend', downUp, false);
  left.addEventListener('touchend', leftUp, false);
  right.addEventListener('touchend', rightUp, false);

  window.addEventListener('keydown', keyDown, false);
  window.addEventListener('keyup', keyUp, false);

  function upDown(e) {
    var e = e || window.event;
    var key = 38;
    e.preventDefault();
    player.keyStorage[key] = true;
    player.shift();
  }

  function downDown(e) {
    var e = e || window.event;
    var key = 40;
    e.preventDefault();
    player.keyStorage[key] = true;
    player.shift();
  }

  function leftDown(e) {
    var e = e || window.event;
    var key = 37;
    e.preventDefault();
    player.keyStorage[key] = true;
    player.shift();
  }

  function rightDown(e) {
    var e = e || window.event;
    var key = 39;
    e.preventDefault();
    player.keyStorage[key] = true;
    player.shift();
  }

  function downUp(e) {
    var e = e || window.event;
    var key = 40;
    e.preventDefault();
    delete player.keyStorage[key];
    player.shift();
  }

  function upUp(e) {
    var e = e || window.event;
    var key = 38;
    e.preventDefault();
    delete player.keyStorage[key];
    player.shift();
  }

  function leftUp(e) {
    var e = e || window.event;
    var key = 37;
    e.preventDefault();
    delete player.keyStorage[key];
    player.shift();
  }

  function rightUp(e) {
    var e = e || window.event;
    var key = 39;
    e.preventDefault();
    delete player.keyStorage[key];
    player.shift();
  }

  function shotDown(e) {
    var e = e || window.event;
    e.preventDefault();
    player.shot();
  }

  function keyDown(e) {
    var e = e || window.event;
    e.preventDefault();
    player.keyStorage[e.keyCode] = true;
  }

  function keyUp(e) {
    var e = e || window.event;
    e.preventDefault();
    delete player.keyStorage[e.keyCode];
  }

//* ************ RequestAnimationFrame ***********************

  var RequestAnimationFrame =
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 60);
      };

  RequestAnimationFrame(game);

  function game() {
    player.update();
    player.shift();
    bullets.forEach(function (bullet) {
      bullet.update();
    });
    enemies.forEach(function (enemie) {
      enemie.update();
    });
    coins.forEach(function (coin) {
      coin.update();
    });
    drawCanvas();
    RequestAnimationFrame(game);
  }

  //**********************  AJAX  ***********************************
  var resultArray = [];
  var Server = "http://fe.it-academy.by/AjaxStringStorage2.php";
  var storageMail = 'TEST_GAME_DB';
  var UpdatePassword;

  // ****************** Refresh results******************
  function refreshRecords() {
    $.ajax(
        {
          url: Server,
          type: 'POST',
          data: {f: 'READ', n: storageMail},
          cache: false,
          success: ReadReady,
          error: ErrorHandler
        }
    );
  }

  function ReadReady(resultData) {
    if (resultData.error !== undefined)
      alert(resultData.error);
    else {
      resultArray = [];
      if (resultData.result !== "") {
        resultArray = JSON.parse(resultData.result);
        if (!resultArray.length)
          resultArray = [];
      }
    }
  }

  //**************   add result  *****************
  function sendResult() {
    UpdatePassword = Math.random();
    $.ajax(
        {
          url: Server,
          type: 'POST',
          data: {
            f: 'LOCKGET', n: storageMail,
            p: UpdatePassword
          },
          cache: false,
          success: LockGetReady,
          error: ErrorHandler
        }
    );
  }

  function LockGetReady(resultData) {
    if (resultData.error !== undefined)
      alert(resultData.error);
    else {
      resultArray = [];
      if (resultData.result !== '') {
        resultArray = JSON.parse(resultData.result);
        if (!resultArray.length)
          resultArray = [];
      }

      var playerName = player.playerInfo.name || 'player';
      var playerTime = player.playerInfo.time || 0;
      resultArray.push({name: playerName, time: playerTime});
      if (resultArray.length > 5)
        resultArray = resultArray.slice(resultArray.length - 5);

      $.ajax(
          {
            url: Server,
            type: 'POST',
            data: {
              f: 'UPDATE', n: storageMail,
              v: JSON.stringify(resultArray), p: UpdatePassword
            },
            cache: false,
            success: UpdateReady,
            error: ErrorHandler
          }
      );
    }
  }

  function UpdateReady(resultData) {
    if (resultData.error !== undefined)
      alert(resultData.error);
  }

  function ErrorHandler(jqXHR, StatusStr, ErrorStr) {
    console.log(StatusStr + ' ' + ErrorStr);
  }

  refreshRecords();

};
