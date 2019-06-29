window.onhashchange = renderNewState;

function renderNewState() {
  var hash = window.location.hash;
  var state = decodeURIComponent(hash.substr(1));
  if (state === '') { // если пустой значит мы зашли в первый раз
    state = {
      page: 'main'
    }
  } else {
    state = JSON.parse(state); // иначе пробуем парсить состояние
  }
  var page = '';

  switch (state.page) {
    case 'main':
      page += "<div class='container'>";
      page += "<div class='gameName'>Bugs killer</div>";
      page += "<ul class='menu-list'>";
      page += "<li class='menu-item'>";
      page += "<input type=\"button\" class='buttons' value=\"game\" onclick=\"switchToGame()\">";
      page += "</li>";
      page += "<li class='menu-item'>";
      page += "<input type=\"button\" class='buttons' value=\"rules\" onclick=\"switchToRules()\">";
      page += "</li>";
      page += "<li class='menu-item'>";
      page += "<input type=\"button\" class='buttons' value=\"records\" onclick=\"switchToRecords()\">";
      page += "</li>";
      page += "</ul>";
      page += '</div>';
      break;

    case 'game':
      page += '<div class="container container-canvas">';
      page += '<input type="button" class="buttons-canvas" value="back to main menu" onclick="switchToStart()">';
      page += '<input type="button" class=" buttons-canvas buttons-canvas-2" value="Start the game!!!" onclick="gameStart()">';
      page += '<canvas id="canvas">';
      page += '</canvas>';
      page += '</div>';
      break;

    case 'rules':
      page += '<div class="container">';
      page += '<input type="button" class="buttons" value="back to main menu" onclick="switchToStart()">';
      page += ' <div class="rules">Перед Вами игра Bugs Killer. Цель игры - собрать все монеты, не попадя в лапы коварных врагов.</br> Они те еще\n' +
          '        упыри! Но и Вы, уверен, не промах! Дерзайте!!!</br> Управляйте игроком с помощью клавиш ВВЕРХ &#8593;, ВНИЗ\n' +
          '        &#8595; , ВПРАВО &#8594; и ВЛЕВО &#8592;.<br/>Выстрел производится с помощью клавиши пробел. Избегайте\n' +
          '        прикосновений врагов и их коварных выстрелов. <br/>Победите всех недругов и будет\n' +
          '        Вам счастье!)</div>';
      page += '</div>';
      // page += 'second page'; //page += buildGameArea(); игра может запускаться этой функцией
      break;

    case 'records':
      page += '<div class="container">';
      page += '<input type="button" class="buttons" value="back to main menu" onclick="switchToStart()">';
      page += '<table class="tableRecords">';
      page += `<tr class="table-cell"><th class="table-cell">Игрок</th><th class="table-cell">Время</th>
       `;
      page += '</table>';
      page += '</div>';
      break;
  }

  document.getElementById('page').innerHTML = page;
}

function switchToState(state) {
  location.hash = encodeURIComponent(JSON.stringify(state));
}

function switchToStart() {
  switchToState({page: 'main'});
}

function switchToGame() {
  switchToState({page: 'game'});
}

function switchToRules() {
  switchToState({page: 'rules'});
}

function switchToRecords() {
  switchToState({page: 'records'});
}

function gameStart() {
  document.location.reload(true);

}


renderNewState();