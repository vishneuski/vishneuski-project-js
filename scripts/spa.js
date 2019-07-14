let renderNewState = () => {
  let hash = window.location.hash;
  let state = decodeURIComponent(hash.substr(1));
  if (state === '') {
    state = {
      page: 'main'
    };
  } else {
    state = JSON.parse(state);
  }
  let page = '';

  switch (state.page) {
    case 'main':
      page += `<div class='container'>
                 <div class='game-name'>Bugs killer</div>
                 <ul class='menu-list'>
                   <li class='menu-item'>
                     <input type='button'
                            class='buttons'
                            value='game'
                            onclick='switchToGame()'>
                    </li>
                    <li class='menu-item'>
                      <input type='button'
                             class='buttons'
                             value='rules'
                             onclick='switchToRules()'>
                    </li>
                    <li class='menu-item'>
                      <input type='button'
                       class='buttons'
                       value='records'
                       onclick='switchToRecords()'>
                    </li>
                 </ul>
               </div>`;
      break;

    case 'game':
      page += `<audio src='audio/gamesound.mp3'></audio>
               <div class="container container-canvas">
                 <input type="button"
                        class="buttons-canvas buttons-canvas-menu"
                        value="BACK TO MENU"
                        onclick="switchToStart()">
                 <input type="button"
                        class=" buttons-canvas buttons-canvas-game"
                        value="START THE GAME"
                        onclick="gameStart()">
                 <input type="button"
                        class=" buttons-canvas buttons-canvas-hide"
                        value="HIDE BUTTONS"
                        onclick="hideTouchButtons()">
                 <input type="button"
                        class=" buttons-canvas buttons-canvas-show"
                        value="SHOW BUTTONS"
                        onclick="showTouchButtons()">
                 <div id="score">Score:0</div>
                 <div id="timer">Time:0</div>
                  <table class="controll-container-first">
                   <tr>
                     <td>
                       <input id='up'
                              class='touch-button'
                              type=button
                              value='&uarr;'>
                     </td>
                   </tr>  
                   <tr>
                     <td>
                       <input id='down'
                              class='touch-button'
                              type=button
                              value='&darr;'>
                     </td>
                   </tr>
                 </table>
                 <table class="controll-container-second">
                   <tr>
                     <td>
                       <input id='shot'
                              class='touch-button'
                              type=button
                              value='&bull;'>
                     </td>
                   </tr>
                   <tr>
                     <td>
                       <input id='left'
                              class='touch-button'
                              type=button
                              value='&larr;'>
                     </td>
                   </tr>  
                   <tr>
                     <td>
                       <input id='right'
                              class='touch-button'
                              type=button
                              value='&rarr;'>
                     </td>
                   </tr>
                 </table>
                 <canvas id="canvas"></canvas>
               </div>`;
      break;

    case 'rules':
      page += `<div class="container">
                 <input type="button"
                        class="buttons"
                        value="BACK TO MENU"
                        onclick="switchToStart()">
                 <input type='button'
                        id='hideRules'
                        class="buttons"
                        value="SCALE THE RULES"
                        onclick="scaleRules()">
                 <div class="rules">Перед Вами игра Bugs Killer. Цель игры - собрать все монеты, не попадя в лапы коварных врагов. Они те еще упыри! Но и Вы, уверен, не промах! Дерзайте!!! Управляйте игроком с помощью клавиш ВВЕРХ &#8593;, ВНИЗ &#8595;, ВПРАВО &#8594; и ВЛЕВО &#8592;. Выстрел производится с помощью клавиши пробел.Избегайте прикосновений врагов. Победите всех недругов и будет Вам счастье!)
                 </div>
               </div>`;
      break;

    case 'records':
      page += `<div class="container">
                 <input type="button"
                        class="buttons"
                        value="BACK TO MENU"
                        onclick="switchToStart()">
                 <table class="table-records">
                   <tr class="table-cell">
                     <th class="table-cell">Игрок</th>
                     <th class="table-cell">Время</th>
                   </tr>`;
      for (let i = 0; i < resultArray.length; i++) {
        page += `<tr class="table-cell">
                   <td class="table-cell">${resultArray[i].name}</td>
                   <td class="table-cell">${resultArray[i].time}</td>
                 </tr>`;
      }
      page += `</table></div>`;
      break;
  }
  $('#page').html(page);
};

window.onhashchange = renderNewState;

let resultArray = [];
let AjaxHandlerScript = 'https://fe.it-academy.by/AjaxStringStorage2.php';
let storageAddress = 'TEST_GAME_DB';


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

let errorHandler = (jqXHR, StatusStr, ErrorStr) => {
  console.error(StatusStr + ' ' + ErrorStr);
};
(function refreshRecords() {
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
})();

function switchToState(state) {
  location.hash = encodeURIComponent(JSON.stringify(state));
}

let switchToStart = () => {
  switchToState({page: 'main'});
};

let switchToGame = () => {
  switchToState({page: 'game'});
};

let switchToRules = () => {
  switchToState({page: 'rules'});
};

let switchToRecords = () => {
  switchToState({page: 'records'});
};

let gameStart = () => {
  document.location.reload(true);
};

let scaleRules = () => {
  $('.rules').animate({
    opacity: '1',
    fontSize: '1.5em'
  }, 'slow');
};

let hideTouchButtons = () => {
  $('.touch-button').fadeOut(3000);
  $('.buttons-canvas-hide').fadeOut(0);
};

let showTouchButtons = () => {
  $('.touch-button').fadeIn(3000);
  $('.buttons-canvas-hide').fadeIn(0);
};

renderNewState();
