'use strict';
/**
 * Ждем загрузки всех ресурсов
 */
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
    document.getElementById('timer').innerHTML = `Time:${time}`;
    time = setTimeout(timer, 1000);
    audio.play();
    return 'Start the game!';
  };
  timer();

  /**
   * Функция получения рандомного числа для размещения объектов(монет, врагов)
   * @param {number} min Минимальная координата по осям x или y
   * @param {number} max Максимальная координата по осям x или y
   * @returns {number} Рандомное число
   */
  let getMathRandom = (min, max) => Math.floor(Math.random() * (max - min)) + min;

  /**
   * Функция для добавления обьектов в массив
   * @param {function} CL класс
   * @param {string} name Имя объекта
   * @param {object} obj Объект аргументов
   * @param {array} objArr Массив, содержащий объекты
   * @return {array} objArr Заполненный массив
   */
  let addEntity = (CL, name, obj, objArr) => {
    let title = name;
    title = new CL(obj);
    return objArr.push(title);
  };


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
  let hero = new Image();
  let fireball = new Image();
  let allien = new Image();
  let prise = new Image();

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
  hero.src = 'images/hero.png';
  fireball.src = 'images/fireball.png';
  allien.src = 'images/allien.png';
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
   * Создаем массив врагов, пуль, монет
   * @type {Array}
   */
  let enemies = [];
  let bullets = [];
  let coins = [];

  /** Класс игрок*/
  class Player {
    /**
     * Создаем игрока в заданных координатах
     * @param {object} player - объект содержащий координаты
     */
    constructor(player) {
      this.keyStorage = {};
      this.KEY_CODE = {
        up: 38,
        down: 40,
        left: 37,
        right: 39,
        shot: 32
      };
      this.playerInfo = {};
      this.width = HEROWIDTH;
      this.height = HEROHEIGHT;
      this.speed = PLAYERSPEED;
      this.posX = player.posX;
      this.posY = player.posY;
      this.direction = 37;
      this.coinCounter = 0;
      this.bulletNumber = 0;
      this.bulletActive = false;
      this.die = false;
    }

    draw() {
      ctx.drawImage(hero, this.posX, this.posY, this.width, this.height);
    }

    coinCollision() {
      for (let i = 0; i < coins.length; i++) {
        collision(this, coins[i]);
        let isColl = collision(this, coins[i]);
        if (isColl === true) {
          window.navigator.vibrate(300);
          this.coinCounter += 1;
          document.querySelector('#score').innerHTML = 'Score: ' + this.coinCounter;
        }
      }
    }

    enemyCollision() {
      for (let i = 0; i < enemies.length; i++) {
        let isColl = collision(this, enemies[i]);
        collision(this, enemies[i]);
        if (isColl === true) {
          this.die = true;
        }
      }
    }

    update() {
      if (this.keyStorage[this.KEY_CODE.up]) {
        this.posY -= this.speed;
        this.direction = 38;
      }

      if (this.keyStorage[this.KEY_CODE.down]) {
        this.posY += this.speed;
        this.direction = 40;
      }

      if (this.keyStorage[this.KEY_CODE.left]) {
        this.posX -= this.speed;
        this.direction = 37;
      }

      if (this.keyStorage[this.KEY_CODE.right]) {
        this.posX += this.speed;
        this.direction = 39;
      }

      if (this.keyStorage[this.KEY_CODE.shot]) {
        this.shot();
      }

      if (this.posX + this.width > CANVASWIDTH) {
        this.posX = CANVASWIDTH - this.width;
      } else if (this.posX < 0) {
        this.posX = 0;
      }

      if (this.posY + this.height > CANVASHEIGHT) {
        this.posY = CANVASHEIGHT - this.height;
      } else if (this.posY < 0) {
        this.posY = 0;
      }

      this.coinCollision();
      this.enemyCollision();

      if (this.die === true) {
        window.navigator.vibrate(1000);
        endGame();
      }
    }

    shot() {
      while (this.bulletNumber < 1 && this.bulletActive === false) {
        bullets.push(new Bullet({
          posX: this.posX,
          posY: this.posY
        }));
        this.bulletNumber++;
        this.bulletActive = true;
      }
    }

    shift() {
      if (this.keyStorage[this.KEY_CODE.up]) {
        this.posY -= this.speed / 5;
        this.direction = 38;
      }
      if (this.keyStorage[this.KEY_CODE.down]) {
        this.posY += this.speed / 5;
        this.direction = 40;
      }

      if (this.keyStorage[this.KEY_CODE.left]) {
        this.posX -= this.speed / 5;
        this.direction = 37;
      }

      if (this.keyStorage[this.KEY_CODE.right]) {
        this.posX += this.speed / 5;
        this.direction = 39;
      }
    }
  }

  /**
   * Создаем героя
   * @type {Player}
   */
  let player = new Player({posX: 0, posY: 0});


  /** Класс враг*/
  class Enemy {
    /**
     * Создаем врагов в рандомных координатах и с заданными направлениями первоначального движения
     * @param {object} enemy - объект содержащий координаты
     */
    constructor(enemy) {
      this.width = HEROWIDTH;
      this.height = HEROHEIGHT;
      this.speed = ENEMYSPEED;
      this.posX = enemy.posX;
      this.posY = enemy.posY;
      this.direction = enemy.direction;
      this.directionEnemy = {
        left: 1,
        right: 2,
        up: 3,
        down: 4
      };
      this.health = 10;
      this.die = false;
    }

    draw() {
      ctx.drawImage(allien, this.posX, this.posY, this.width, this.height);
    }

    bulletCollision() {
      for (let i = 0; i < bullets.length; i++) {
        let isColl = collision(this, bullets[i]);
        collision(this, bullets[i]);
        if (isColl === true) {
          this.health -= 10;
          if (this.health === 0) {
            this.die = true;
            enemies = enemies.filter(enemy => !enemy.die);
          }
        }
      }
    }

    update() {
      if (this.direction === this.directionEnemy.right) {
        this.posX += this.speed;
        this.posY -= this.speed;
        if ((this.posX + this.width > CANVASWIDTH) || (this.posX < 0)) {
          this.speed = -this.speed;
        }
      } else if (this.direction === this.directionEnemy.left) {
        this.posX -= this.speed;
        if ((this.posX + this.width > CANVASWIDTH) || (this.posX < 0)) {
          this.speed = -this.speed;
        }
      } else if (this.direction === this.directionEnemy.down) {
        this.posY += this.speed;
        if ((this.posY + this.height > CANVASHEIGHT) || (this.posY < 0)) {
          this.speed = -this.speed;
        }
      } else if (this.direction === this.directionEnemy.up) {
        this.posY -= this.speed;
        if ((this.posY + this.height > CANVASHEIGHT) || (this.posY < 0)) {
          this.speed = -this.speed;
        }
      }

      if (this.posX + this.width > CANVASWIDTH) {
        this.posX = CANVASWIDTH - this.width;
      } else if (this.posX < 0) {
        this.posX = 0;
      }

      if (this.posY + this.height > CANVASHEIGHT) {
        this.posY = CANVASHEIGHT - this.height;
      } else if (this.posY < 0) {
        this.posY = 0;
      }

      this.bulletCollision();
    }
  }

  let enemyAdd = () => {
    for (let i = 0; i <= 5; i++) {
      addEntity(Enemy, 'enemy', {
        posX: getMathRandom(0, 496),
        posY: getMathRandom(0, 496),
        direction: Math.floor(Math.random() * (5 - 1)) + 1
      }, enemies);
    }
  };

  enemyAdd();

  /** Класс пуля*/
  class Bullet {
    /**
     * Создаем пули в заданных координатах и с направлением героя
     * @param {object} bullet - объект содержащий координаты
     */
    constructor(bullet) {
      this.speed = BULLETSPEED;
      this.width = BULLETSIZE;
      this.height = BULLETSIZE;
      this.posX = bullet.posX;
      this.posY = bullet.posY;
      this.direction = player.direction;
      this.isOut = false;
      this.getEnemyTarget = false;
    }

    draw() {
      ctx.drawImage(fireball, this.posX, this.posY, this.width, this.height);
    }

    enemyCollision() {
      for (let i = 0; i < enemies.length; i++) {
        let isColl = collision(this, enemies[i]);
        collision(this, enemies[i]);
        if (isColl === true) {
          this.getEnemyTarget = true;
          bullets = bullets.filter(bullet => !bullet.getEnemyTarget);
        }
      }
    }

    goOut() {
      if (this.posX > CANVASHEIGHT || this.posX < 0 || this.posY > CANVASHEIGHT || this.posY < 0 || this.getEnemyTarget === true) {
        this.isOut = true;
        player.bulletActive = false;
        player.bulletNumber--;
        bullets = bullets.filter(bullet => !bullet.isOut);
      }
    }

    update() {
      if (this.direction === 37) {
        this.posX -= this.speed;
      }
      if (this.direction === 39) {
        this.posX += this.speed;
      }
      if (this.direction === 38) {
        this.posY -= this.speed;
      }
      if (this.direction === 40) {
        this.posY += this.speed;
      }
      this.enemyCollision();
      this.goOut();
    }
  }

  /** Класс монета*/
  class Coin {
    /**
     * Создаем монеты в рандомных координатах
     * @param {object} coin - объект содержащий координаты
     */
    constructor(coin) {
      this.width = COINSIZE;
      this.height = COINSIZE;
      this.posX = coin.posX;
      this.posY = coin.posY;
      this.playerTouch = false;
    }

    draw() {
      ctx.drawImage(prise, this.posX, this.posY, this.width, this.height);
    }

    playerCollision() {
      let isColl = collision(this, player);
      collision(this, player);
      if (isColl === true) {
        this.playerTouch = true;
        coins = coins.filter(coin => !coin.playerTouch);
        if (coins.length === 0) {
          saveResult();
        }
      }
    }

    update() {
      this.playerCollision();
    }
  }

  let coinAdd = () => {
    for (let i = 0; i <= 10; i++) {
      addEntity(Coin, 'coin', {posX: getMathRandom(0, 496), posY: getMathRandom(0, 496)}, coins);
    }
  };

  coinAdd();


  /**
   * Функция для определения столкновений
   * @param {object} obj1 Первый объект
   * @param {object} obj2 Второй объект
   * @returns {boolean} isCollision Состояние столкновения.
   */
  let collision = (obj1, obj2) => {
    let isCollision = false;
    if (((obj1.posX < obj2.posX + obj2.width && obj1.posX > obj2.posX) || (obj1.posX + obj1.width > obj2.posX && obj1.posX < obj2.posX)) && ((obj1.posY < obj2.posY + obj2.height && obj1.posY > obj2.posY) || (obj1.posY + obj1.height > obj2.posY && obj1.posY < obj2.posY))) {
      isCollision = true;
    } else {
      isCollision = false;
    }
    return isCollision;
  };


  /**
   * Функция для сохраниения результатов игры
   * @returns {boolean} Состояние сохранения.
   */
  let saveResult = () => {
    clearTimeout(time);
    let askName = prompt('Введите ваше имя: ', 'player');
    $('#timer').html(time);
    player.playerInfo.name = askName || 'player';
    player.playerInfo.time = time;
    sendResult();
    endGame();
    return true;
  };

  /**
   * Функция, завершающая игру
   * @return {boolean} Результат
   */
  let endGame = () => {
    clearTimeout(time);
    audio.pause();
    $('#canvas').hide();
    $('#gameOver').show();
    return true;
  };

  //  ***************   VIEW   ***************
  /**
   * Функция для перерисовки канвас
   * @return {boolean} Результат перерисовки
   */
  function drawCanvas() {
    ctx.imageSmoothingEnabled = true;
    drawMap();
    player.draw();
    bullets.forEach(bullet => {
      bullet.draw();
    });
    coins.forEach(coin => {
      coin.draw();
    });
    enemies.forEach(enemie => {
      enemie.draw();
    });
    return true;
  }

  //  ***************   CONTROLLER   ***************
  /**
   * Функции обработки touch down event
   * @param e - event - событие
   */
  let upDown = (e) => {
    let event = e || window.event;
    let key = 38;
    event.preventDefault();
    player.keyStorage[key] = true;
    player.shift();
  };

  let downDown = (e) => {
    let event = e || window.event;
    let key = 40;
    event.preventDefault();
    player.keyStorage[key] = true;
    player.shift();
  };

  let leftDown = (e) => {
    let event = e || window.event;
    let key = 37;
    event.preventDefault();
    player.keyStorage[key] = true;
    player.shift();
  };

  let rightDown = (e) => {
    let event = e || window.event;
    let key = 39;
    event.preventDefault();
    player.keyStorage[key] = true;
    player.shift();
  };

  let shotDown = (e) => {
    let event = e || window.event;
    event.preventDefault();
    player.shot();
  };

  /**
   * Функции обработки touch up event
   * @param e - event - событие
   */
  let downUp = (e) => {
    let event = e || window.event;
    let key = 40;
    event.preventDefault();
    delete player.keyStorage[key];
    player.shift();
  };

  let upUp = (e) => {
    let event = e || window.event;
    let key = 38;
    event.preventDefault();
    delete player.keyStorage[key];
    player.shift();
  };

  let leftUp = (e) => {
    let event = e || window.event;
    let key = 37;
    event.preventDefault();
    delete player.keyStorage[key];
    player.shift();
  };

  let rightUp = (e) => {
    let event = e || window.event;
    let key = 39;
    event.preventDefault();
    delete player.keyStorage[key];
    player.shift();
  };

  /**
   * Функция обработки key down event
   * @param e - event - событие
   */
  let keyDown = (e) => {
    let event = e || window.event;
    event.preventDefault();
    player.keyStorage[e.keyCode] = true;
  };

  /**
   * Функция обработки key up event
   * @param e - event - событие
   */
  let keyUp = (e) => {
    let event = e || window.event;
    event.preventDefault();
    delete player.keyStorage[e.keyCode];
  };

  /**
   * Назначение обработчиков событий - касания(touch event) и нажатия клавиш (key down & key up)
   * @type {Element | null}
   */
  let up = document.querySelector('#up');
  let down = document.querySelector('#down');
  let left = document.querySelector('#left');
  let right = document.querySelector('#right');
  let shot = document.querySelector('#shot');

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

  /**
   * Кроссбраузерность для ReqestAnimationFrame
   */
  let requestAnimationFrame =
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 60);
      };

  /**
   * Функци для обновления состояния игры в каждом RequestAnimationFrame
   */
  let game = () => {
    player.update();
    player.shift();
    bullets.forEach(bullet => {
      bullet.update();
    });
    enemies.forEach(enemie => {
      enemie.update();
    });
    coins.forEach(coin => {
      coin.update();
    });
    drawCanvas();
    requestAnimationFrame(game);
  };

  requestAnimationFrame(game);


  // ***************   AJAX   ***************

  /**
   * Массив, в который будем соханять результаты из БД
   * @type {Array}
   */
  let resultArray = [];

  /**
   * БД для работы с AJAX
   * @type {string}
   */
  let AjaxHandlerScript = 'https://fe.it-academy.by/AjaxStringStorage2.php';

  /**
   * Название нашего хранилища в БД
   * @type {string}
   */
  let storageAddress = 'TEST_GAME_DB';

  /**
   * Пароль для блокировки хранилища при обновлении
   */
  let updatePassword;

  /**
   * Функция для обновления рекордов игры
   */
  let refreshRecords = () => {
    $.ajax(
        {
          url: AjaxHandlerScript,
          type: 'POST',
          data: {f: 'READ', n: storageAddress},
          cache: false,
          success: readReady,
          error: errorHandler
        }
    );
  };

  /**
   * Функция, валидирующая полученые с помощью AJAX данные и сохраняющая их в массив для работы с ними
   * @param {JSON} resultData Получаемые данные
   */
  let readReady = (resultData) => {
    if (resultData.error !== undefined) {
      console.error(resultData.error);
    } else {
      resultArray = [];
      if (resultData.result !== '') {
        resultArray = JSON.parse(resultData.result);
        if (!resultArray.length) {
          resultArray = [];
        }
      }
    }
  };

  /**
   * Функция для блокирования хранилища при обновлении результатов игры
   */
  let sendResult = () => {
    updatePassword = Math.random();
    $.ajax(
        {
          url: AjaxHandlerScript,
          type: 'POST',
          data: {
            f: 'LOCKGET', n: storageAddress,
            p: updatePassword
          },
          cache: false,
          success: lockGetReady,
          error: errorHandler
        }
    );
  };

  /**
   * Функция для оправки данных
   */
  let lockGetReady = (resultData) => {
    if (resultData.error !== undefined) {
      console.error(resultData.error);
    } else {
      resultArray = [];
      if (resultData.result !== '') {
        resultArray = JSON.parse(resultData.result);
        if (!resultArray.length) {
          resultArray = [];
        }
      }

      let playerName = player.playerInfo.name || 'player';
      let playerTime = player.playerInfo.time || 0;
      resultArray.push({name: playerName, time: playerTime});
      if (resultArray.length > 5) {
        resultArray = resultArray.slice(resultArray.length - 5);
      }

      $.ajax(
          {
            url: AjaxHandlerScript,
            type: 'POST',
            data: {
              f: 'UPDATE', n: storageAddress,
              v: JSON.stringify(resultArray), p: updatePassword
            },
            cache: false,
            success: updateReady,
            error: errorHandler
          }
      );
    }
  };

  let updateReady = (resultData) => {
    if (resultData.error !== undefined) {
      console.error(resultData.error);
    }
  };

  /**
   * Функция вызываемая при получении ошибок при выполнении AJAX запроса
   * @param jqXHR
   * @param StatusStr {string}
   * @param ErrorStr {string}
   */
  let errorHandler = (jqXHR, StatusStr, ErrorStr) => {
    console.log(StatusStr + ' ' + ErrorStr);
  };
  refreshRecords();
};
