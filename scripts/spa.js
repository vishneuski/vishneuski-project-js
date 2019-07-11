window.onhashchange = renderNewState;

// ****************** Refresh results******************
var resultArray = [];
var AjaxHandlerScript = "http://fe.it-academy.by/AjaxStringStorage2.php";
var storageAddress = 'TEST_GAME_DB';

(function refreshRecords() {
  $.ajax(
      {
        url: AjaxHandlerScript,
        type: 'POST',
        data: {f: 'READ', n: storageAddress},
        cache: false,
        success: readReady,
        error: ErrorHandler
      }
  );
})();

function readReady(resultData) {
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

function ErrorHandler(jqXHR, StatusStr, ErrorStr) {
  console.log(StatusStr + ' ' + ErrorStr);
};

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
      page += `<audio src="audio/lesnik.mp3"></audio><div class="container container-canvas"><input type="button" class="buttons-canvas" value="back to main menu" 
onclick="switchToStart()"><input type="button" class=" buttons-canvas buttons-canvas-2" value="Start the game!!!" 
onclick="gameStart()"><div id="score">Score:</div><div id="timer">Time:</div>
 <table class="controll-container">
    <tr>
      <td></td>
      <td><input id='up' class='touchButton' type=button value='&uarr;'></td>
      <td></td>
    </tr>
    <tr>
      <td><input id='left' class='touchButton' type=button value='&larr;'></td>
      <td><input id='shot' class='touchButton' type="button" value='&bull;'></td>
      <td><input id='right' class='touchButton' type=button value='&rarr;'></td>
    </tr>
    <tr>
      <td></td>
      <td><input id='down' class='touchButton' type=button value='&darr;'></td>
      <td></td>
    </tr>
  </table><canvas id="canvas"></canvas></div>`;
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
      break;

    case 'records':
      page += '<div class="container">';
      page += '<input type="button" class="buttons" value="back to main menu" onclick="switchToStart()">';
      page += '<table class="tableRecords">';
      page += `<tr class="table-cell"><th class="table-cell">Игрок</th><th class="table-cell">Время</th></tr>`;
      for (var i = 0; i < resultArray.length; i++) {
        page += `<tr class="table-cell"><td class="table-cell" id="igrok">${resultArray[i].name}</td><td class="table-cell" id="itog">${resultArray[i].time}</td></tr>`;
      }
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