let stop = false;
let timeLeft = null;
let timeInSeconds = null;

const client = mqtt.connect('ws://localhost:9001');

client.on('connect', () => {
  console.log('Connected to the MQTT WebSocket');

  client.subscribe('score');
  client.subscribe('scoreRed');
  client.subscribe('scoreBlue');

  client.on('message', (topic, message) => {
    console.log('Message received', topic, message.toString());
    if (document.querySelector('.js-live-page')) {
      if (topic === 'score') {
        document.querySelector('.js-score').textContent = message.toString();
      } else if (topic === 'scoreRed') {
        document.querySelector('.js-score-red').textContent = message.toString();
      } else if (topic === 'scoreBlue') {
        document.querySelector('.js-score-blue').textContent = message.toString();
      }
    }
  });
});

const listener = () => {
  const body = document.querySelector('body');
  const infoBtns = document.querySelectorAll('.js-info-btn');
  const closeBtn = document.querySelector('.js-popup-close');
  const popupTitle = document.querySelector('.js-popup-title');
  const popupDisc = document.querySelector('.js-popup-discription');

  const popup = document.querySelector('.js-popup');
  const popupContent = document.querySelector('.js-popup-content');
  infoBtns.forEach((btn) => {
    btn.addEventListener('click', (event) => {
      body.classList.add('has-popup');
      const game = btn.dataset.game;
      if (game === 'bluevsred') {
        popupTitle.textContent = 'Blue vs Red';
        popupDisc.textContent = 'Het rode en het blauwe team strijden tegen elkaar. Het team dat in 30 seconden het meeste LED-lichtjes van zijn kleur uittikt, wint het spel.';
      } else if (game === 'zengame') {
        popupTitle.textContent = 'Zen Game';
        popupDisc.textContent = 'Probeer de opgelichte LED zo snel mogelijk uit te tikken. De reactie-snelheid waarmee de speler reageert bepaald de score.';
      } else if (game === 'minesweeper') {
        popupTitle.textContent = 'Mine sweeper';
        popupDisc.textContent =
          "Er wordt 1 knop als hint gegeven. Daarna moeten de juiste knoppen gevonden worden. Indien op de foute knop geklikt wordt moet opnieuw begonnen worden. Indien op de juiste knoppen aangeklikt worden, blijven de LED's opgelicht.";
      } else if (game === 'memorygame') {
        popupTitle.textContent = 'Memory Game';
        popupDisc.textContent = 'Probeer de getoonde sequentie zo lang mogelijk na te doen door de juiste paaltjes aan te klikken. Er zal telkens een extra LED oplichten.';
      }
      closeBtn.addEventListener('click', () => {
        console.log('close');
        popup.classList.add('is-closing');
        setTimeout(() => {
          popup.classList.remove('is-closing');
          body.classList.remove('has-popup');
        }, 300);
      });
    });
  });

  const tabs = document.querySelectorAll('.js-tabs');
  tabs.forEach((tab) => {
    tab.addEventListener('click', (event) => {
      tabName = tab.dataset.page;
      console.log(tabName);
      // go to page
      if (tabName === 'home') {
        window.location.href = 'index.html';
      } else if (tabName === 'rangschikking') {
        window.location.href = 'rangschikking.html';
      } else if (tabName === 'overons') {
        window.location.href = 'over-ons.html';
      }
    });
  });

  const gameBtns = document.querySelectorAll('.js-game-btn');
  const dropdown = document.querySelector('.js-dropdown');
  gameBtns.forEach((btn) => {
    btn.addEventListener('change', () => {
      const game = btn.id;
      if (game === 'minesweeper') {
        dropdown.innerHTML = `<div class="c-custom-select u-mb-md">
                <select class="c-input c-custom-select__input" name="select1" id="select1">
                  <option value="3">3 min</option>
                  <option value="5">5 min</option>
                  <option value="10">10 min</option>
                </select>
                <svg class="c-custom-select__symbol" width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M36 18L24 30L12 18" stroke="#333" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
              <div class="c-custom-select">
                <select class="c-input c-custom-select__input" name="select2" id="select2">
                  <option value="makkelijk">makkelijk</option>
                <option value="normaal">normaal</option>
                <option value="moeilijk">moeilijk</option>
                </select>
                <svg class="c-custom-select__symbol" width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M36 18L24 30L12 18" stroke="#333" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>`;
      } else {
        dropdown.innerHTML = ` <div class="c-custom-select">
                <select class="c-input c-custom-select__input" name="select1" id="select1">
                  <option value="3">3 min</option>
                  <option value="5">5 min</option>
                  <option value="10">10 min</option>
                </select>
                <svg class="c-custom-select__symbol" width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M36 18L24 30L12 18" stroke="#333" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>`;
      }
      // getTop10(game, time, difficulty);
    });
  });

  const selectedGames = document.querySelectorAll('.js-selected-game');
  selectedGames.forEach((game) => {
    game.addEventListener('click', () => {
      selectedGameForm = game.dataset.game;
      localStorage.setItem('selectedGameForm', selectedGameForm);
      window.location.href = 'form.html';
    });
  });
};

const listenToControls = () => {
  const stopBtn = document.querySelector('.js-stop-btn');
  const pauseBtn = document.querySelector('.js-pause-btn') === null ? document.querySelector('.js-play-btn') : document.querySelector('.js-pause-btn');
  const svgPlayBtn = `<svg class="c-pause" width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 24V11.8756L25.5 17.9378L36 24L25.5 30.0622L15 36.1244V24Z" fill="none" stroke="#333" stroke-width="2" stroke-linejoin="round"/></svg>`;
  const svgPausebtn = `<svg class="c-pause" width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 12V36" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M32 12V36" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  stopBtn.addEventListener('click', () => {
    stopBtn.classList.add('is-animated');
    setTimeout(() => {
      stop = true;
      localStorage.setItem('startTimeGame', null);
      stopBtn.classList.remove('is-animated');
      let gameData = JSON.parse(localStorage.getItem('gameData'));
      if (gameData.game === 'bluevsred') {
        gameData.scoreRed = document.querySelector('.js-score-red').innerHTML;
        gameData.scoreBlue = document.querySelector('.js-score-blue').innerHTML;
      } else {
        gameData.score = document.querySelector('.js-score').innerHTML;
      }
      localStorage.setItem('gameData', JSON.stringify(gameData));
      // console.log(gameData);
      console.log('save score');
      // sendStopGame();
      // saveScore(gameData.game);

      window.location.href = 'endscore.html';
      window.location.replace('endscore.html');
    }, 1000);
  });
  pauseBtn.addEventListener('click', () => {
    // switch between play and pause
    if (pauseBtn.classList.contains('js-pause-btn')) {
      localStorage.setItem('pause', true);
      localStorage.setItem('timeLeft', timeInSeconds);
      pauseBtn.classList.remove('js-pause-btn');
      pauseBtn.classList.add('js-play-btn');
      pauseBtn.innerHTML = svgPlayBtn;
      pauseBtn.classList.add('is-animated');
      setTimeout(() => {
        pauseBtn.classList.remove('is-animated');
      }, 1000);
      // sendPauseGame();
    } else {
      if (localStorage.getItem('timeLeft') != null) {
        let time = localStorage.getItem('timeLeft');
        timeInSeconds = time;
      }
      localStorage.setItem('pause', false);
      pauseBtn.classList.remove('js-play-btn');
      pauseBtn.classList.add('js-pause-btn');
      pauseBtn.innerHTML = svgPausebtn;
      pauseBtn.classList.add('is-animated');
      setTimeout(() => {
        pauseBtn.classList.remove('is-animated');
      }, 1000);
      // sendPlayGame();
    }
  });
};

const isFormFieldValidity = (fieldElement, inputElement, errorElement) => {
  // check if input is empty
  if (!isEmpty(inputElement.value)) {
    errorElement.classList.remove('is-visible');
    fieldElement.classList.remove('has-error');
    return true;
  } else {
    errorElement.classList.add('is-visible');
    fieldElement.classList.add('has-error');
    return false;
  }
};

const showCountDown3sec = () => {
  const countDown = document.querySelector('.c-countdown');
  countDown.classList.add('is-visible');
  countDown.innerHTML = `<lottie-player class="c-countdown__animation" src="img/count.json" background="transparent"  speed="1"  style="width: 300px; height: 300px;" autoplay></lottie-player>`;

  setTimeout(() => {
    countDown.innerHTML = '';
    localStorage.setItem('startTimeGame', Date.now());
    localStorage.setItem('pause', false);
    localStorage.setItem('pauseTime', 0);
    localStorage.setItem('timeLeft', null);
    console.log(localStorage.getItem('startTimeGame'));
    window.location.href = 'live-scorebord.html';
  }, 3600);
};

const listenToFormSubmit = (arrField, arrInput, arrError) => {
  // listen to form start button
  // check if all fields are filled in and if not show error message
  // and add eventlistener to input field to remove error message when input is filled in
  let arrFieldStatus = [];
  const formStartBtn = document.querySelector('.js-form-start-btn');
  formStartBtn.addEventListener('click', (e) => {
    e.preventDefault();
    for (let i = 0; i < arrField.length; i++) {
      let fieldStatus = isFormFieldValidity(arrField[i], arrInput[i], arrError[i]);
      arrFieldStatus.push(fieldStatus);
      if (fieldStatus == false) {
        arrInput[i].addEventListener('input', (e) => {
          if (!isEmpty(arrInput[i].value)) {
            arrError[i].classList.remove('is-visible');
            arrField[i].classList.remove('has-error');
          }
        });
      }
    }
    // console.log(arrFieldStatus);

    // check if all fields are filled in
    if (!arrFieldStatus.includes(false)) {
      console.log('form is valid');
      let name, nameRed, nameBlue, selectedDropdown, selectedDifficulty;
      if (localStorage.getItem('selectedGameForm') == 'bluevsred') {
        nameRed = arrInput[0].value;
        nameBlue = arrInput[1].value;
      } else {
        name = arrInput[0].value;
      }
      selectedDropdown = document.querySelector('.js-dropdown').value;
      if (localStorage.getItem('selectedGameForm') == 'minesweeper') {
        selectedDifficulty = document.querySelector('.js-dropdown-difficulty').value;
      }
      // put all data in a object
      let gameData = {
        game: localStorage.getItem('selectedGameForm'),
        name: name,
        nameRed: nameRed,
        nameBlue: nameBlue,
        time: selectedDropdown,
        difficulty: selectedDifficulty,
      };

      // put object in localstorage
      localStorage.setItem('gameData', JSON.stringify(gameData));
      console.log(localStorage.getItem('gameData'));

      // count down timer 3 2 1
      showCountDown3sec();
    }
    arrFieldStatus = [];
  });
};

const showForm = () => {
  const selectedGameForm = localStorage.getItem('selectedGameForm');
  console.log(selectedGameForm);
  const title = document.querySelector('.js-form-title');
  const icon = document.querySelector('.js-form-icon');

  const formNameInput = document.querySelector('.js-name-input');
  const formNameField = document.querySelector('.js-name-field');
  const formNameError = document.querySelector('.js-name-error-message');

  const formFields = document.querySelector('.js-form-fields');

  const formInfoText = document.querySelector('.js-form-info-text');

  if (selectedGameForm === 'bluevsred') {
    title.textContent = 'Blue vs Red';
    icon.innerHTML = `<svg class="c-icon" xmlns="http://www.w3.org/2000/svg" width="74" height="74" viewBox="0 0 74 74"><g transform="translate(-288 -349)"><g transform="translate(288.308 349.308)"><path d="M37,0h0a0,0,0,0,1,0,0V74a0,0,0,0,1,0,0h0A37,37,0,0,1,0,37v0A37,37,0,0,1,37,0Z" transform="translate(-0.308 -0.308)" fill="#f33"/><path d="M0,0H0A37,37,0,0,1,37,37v0A37,37,0,0,1,0,74H0a0,0,0,0,1,0,0V0A0,0,0,0,1,0,0Z" transform="translate(36.692 -0.308)" fill="#3cb0d9"/></g></g></svg>`;
    formFields.innerHTML = `<p class="c-form-field js-red-field"><label class="c-label" for="red">Red team naam<span class="c-label__error-message js-red-error-message">Verplicht invullen</span></label><input class="c-input js-red-input" type="text" name="red" id="red" placeholder="bijv. Duivels" required /></p> <p class="c-form-field js-blue-field"><label class="c-label" for="blue">Blue team naam<span class="c-label__error-message js-blue-error-message">Verplicht invullen</span></label><input class="c-input js-blue-input" type="text" name="blue" id="blue" placeholder="bijv. Spartanen" required /></p> `;
    formInfoText.innerHTML = `Het rode en het blauwe team strijden tegen elkaar. Het team dat in 30 seconden het meeste LED-lichtjes van zijn kleur uittikt, wint het spel.`;
    const formRedInput = document.querySelector('.js-red-input');
    const formRedField = document.querySelector('.js-red-field');
    const formRedError = document.querySelector('.js-red-error-message');
    const formBlueInput = document.querySelector('.js-blue-input');
    const formBlueField = document.querySelector('.js-blue-field');
    const formBlueError = document.querySelector('.js-blue-error-message');
    listenToFormSubmit([formRedField, formBlueField], [formRedInput, formBlueInput], [formRedError, formBlueError]);
  } else if (selectedGameForm === 'zengame') {
    title.textContent = 'Zen Game';
    icon.innerHTML = `<svg class="c-icon" xmlns="http://www.w3.org/2000/svg" width="74" height="74" viewBox="0 0 74 74"><g transform="translate(-117 -401)"><path d="M37,0A37,37,0,1,1,0,37,37,37,0,0,1,37,0Z" transform="translate(117 401)" fill="#f56331"/><g transform="translate(130 414)"><path d="M24,44.333A18.333,18.333,0,1,0,5.667,26,18.333,18.333,0,0,0,24,44.333Z" fill="none" stroke="#fff" stroke-linejoin="round" stroke-width="3"/><path d="M23.759,15.354V26.362l7.772,7.772" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/><path d="M4,9l7-5" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/><path d="M44,9,37,4" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/></g></g></svg>`;
    formInfoText.innerHTML = `Probeer de opgelichte LED zo snel mogelijk uit te tikken. De reactie-snelheid waarmee de speler reageert bepaald de score.`;
    listenToFormSubmit([formNameField], [formNameInput], [formNameError]);
  } else if (selectedGameForm === 'minesweeper') {
    title.textContent = 'Mine sweeper';
    icon.innerHTML = `<svg class="c-icon" xmlns="http://www.w3.org/2000/svg" width="74" height="74" viewBox="0 0 74 74"><g transform="translate(-104 -463)"><path d="M37,0A37,37,0,1,1,0,37,37,37,0,0,1,37,0Z" transform="translate(104 463)" fill="#f24330"/><g transform="translate(124 480)"><path d="M11.306,43.49l3.4-8.209A17.1,17.1,0,1,1,41.339,21.052a17.007,17.007,0,0,1-7.7,14.229l3.4,8.209Z" transform="translate(-7 -4)" fill="none" stroke="#fff" stroke-linejoin="round" stroke-width="3"/><path d="M20,38v5.976" transform="translate(-6.87 -4.486)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/><path d="M28,38v5.976" transform="translate(-6.791 -4.486)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/><path d="M16.988,22.976A2.988,2.988,0,1,0,14,19.988,2.988,2.988,0,0,0,16.988,22.976Z" transform="translate(-6.909 -4.186)" fill="none" stroke="#fff" stroke-linejoin="round" stroke-width="3"/><path d="M30.988,22.976A2.988,2.988,0,1,0,28,19.988,2.988,2.988,0,0,0,30.988,22.976Z" transform="translate(-6.727 -4.186)" fill="none" stroke="#fff" stroke-linejoin="round" stroke-width="3"/><path d="M31.968,44H24" transform="translate(-6.757 -4.51)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/><path d="M23.968,44H16" transform="translate(-6.871 -4.51)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/></g></g></svg>`;
    formInfoText.innerHTML = `Er wordt 1 knop als hint gegeven. Daarna moeten de juiste knoppen gevonden worden. Indien op de foute knop geklikt wordt moet opnieuw begonnen worden. Indien op de juiste knoppen aangeklikt worden, blijven de LED's opgelicht.`;
    document.querySelector('.js-form-select').innerHTML = `
    <p class="c-form-field c-custom-select">
                  <label class="c-label js-dropdown-label" for="username"> Selecteer tijdslimiet </label>
                  <select class="c-input c-custom-select__input--form js-dropdown" name="select1" id="select1">
                    <option value="3">3 min</option>
                    <option value="5">5 min</option>
                    <option value="10">10 min</option>
                  </select>
                  <svg class="c-custom-select__symbol" width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M36 18L24 30L12 18" stroke="#333" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </p>
                <p class="c-form-field c-custom-select">
                  <label class="c-label js-dropdown-label" for="username"> Moeilijkheidsgraad </label>
                  <select class="c-input c-custom-select__input--form js-dropdown-difficulty" name="select1" id="select1">
                   <option value="makkelijk">makkelijk</option><option value="normaal">normaal</option><option value="moeilijk">moeilijk</option>
                  </select>
                  <svg class="c-custom-select__symbol" width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M36 18L24 30L12 18" stroke="#333" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </p>`;
    listenToFormSubmit([formNameField], [formNameInput], [formNameError]);
  } else if (selectedGameForm === 'memorygame') {
    title.textContent = 'Memory Game';
    icon.innerHTML = `<svg class="c-icon" xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 72 72"><g transform="translate(-256 -307)"><g transform="translate(256 307)"><path d="M36,0h0a0,0,0,0,1,0,0V36a0,0,0,0,1,0,0H0a0,0,0,0,1,0,0v0A36,36,0,0,1,36,0Z" fill="#f33"/><path d="M0,0H0A36,36,0,0,1,36,36v0a0,0,0,0,1,0,0H0a0,0,0,0,1,0,0V0A0,0,0,0,1,0,0Z" transform="translate(36)" fill="#3cb0d9"/><path d="M0,0H36a0,0,0,0,1,0,0V36a0,0,0,0,1,0,0h0A36,36,0,0,1,0,0V0A0,0,0,0,1,0,0Z" transform="translate(0 36)" fill="#e5ea49"/><path d="M0,0H36a0,0,0,0,1,0,0V0A36,36,0,0,1,0,36H0a0,0,0,0,1,0,0V0A0,0,0,0,1,0,0Z" transform="translate(36 36)" fill="#5ed540"/></g></g></svg>`;
    formInfoText.innerHTML = `Probeer de getoonde sequentie zo lang mogelijk na te doen door de juiste paaltjes aan te klikken. Er zal telkens een extra LED oplichten.`;
    listenToFormSubmit([formNameField], [formNameInput], [formNameError]);
  }

  const backBtn = document.querySelector('.js-back-btn');
  backBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
  });
};

const isEmpty = function (fieldValue) {
  return !fieldValue || fieldValue.length < 1;
};

const showCountdown = () => {
  const gameData = JSON.parse(localStorage.getItem('gameData'));
  const time = gameData.time;
  console.log(gameData);
  setTimeout(() => {
    document.querySelector('.js-start-text').innerHTML = '';
  }, 1000);

  timeInSeconds = time * 60 - timeLeft;
  const counter = setInterval(() => {
    if (localStorage.getItem('pause') == 'false') {
      console.log(timeInSeconds);
      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = timeInSeconds % 60;
      // show time in html
      document.querySelector('.js-time').innerHTML = `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
      timeInSeconds--;
      if (timeInSeconds < 0 || stop === true) {
        clearInterval(counter);
        document.querySelector('.js-time').innerHTML = '00:00';
        document.querySelector('.js-start-text').innerHTML = 'Tijd is op!';
        if (stop === false) {
          setTimeout(() => {
            if (gameData.game === 'bluevsred') {
              gameData.scoreRed = document.querySelector('.js-score-red').innerHTML;
              gameData.scoreBlue = document.querySelector('.js-score-blue').innerHTML;
            } else {
              gameData.score = document.querySelector('.js-score').innerHTML;
            }
            localStorage.setItem('gameData', JSON.stringify(gameData));
            console.log('save score');
            // saveScore(gameData.game);
            window.location.href = 'endscore.html';
            window.location.replace('endscore.html');
          }, 2000);
        }
      }
    }
  }, 1000);
};

const timeFormat24Hours = (totalSeconds) => {
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;
  return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
};

const showCountdownStart = () => {
  let time;
  if (localStorage.getItem('pause') == 'true') {
    time = localStorage.getItem('timeLeft');
    document.querySelector('.js-time').innerHTML = timeFormat24Hours(time);
  } else {
    const gameData = JSON.parse(localStorage.getItem('gameData'));
    time = gameData.time;
    console.log(gameData.time);
    // if refresh page, get time from localstorage and calculate time left
    timeLeft = Date.now() - localStorage.getItem('startTimeGame');
    timeLeft = Math.floor(timeLeft / 1000);
    let timeInSeconds = time * 60 - timeLeft;
    document.querySelector('.js-time').innerHTML = timeFormat24Hours(timeInSeconds);
  }
};

const checkPauseStatus = () => {
  const pauseBtn = document.querySelector('.js-pause-btn');
  const svgPlayBtn = `<svg class="c-pause" width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 24V11.8756L25.5 17.9378L36 24L25.5 30.0622L15 36.1244V24Z" fill="none" stroke="#333" stroke-width="2" stroke-linejoin="round"/></svg>`;
  if (localStorage.getItem('pause') === 'true') {
    pauseBtn.classList.remove('js-pause-btn');
    pauseBtn.classList.add('js-play-btn');
    pauseBtn.innerHTML = svgPlayBtn;
    pauseBtn.classList.add('is-animated');
    setTimeout(() => {
      pauseBtn.classList.remove('is-animated');
    }, 1000);
  }
};

const showLiveScoreBoard = () => {
  const gameData = JSON.parse(localStorage.getItem('gameData'));
  if (gameData === null) {
    window.location.href = 'index.html';
  }
  const game = gameData.game;

  let name, svg;
  if (game != 'bluevsred') {
    if (game === 'minesweeper') {
      name = 'Mine Sweeper';
      svg = `<svg class="c-icon" xmlns="http://www.w3.org/2000/svg" width="74" height="74" viewBox="0 0 74 74"><g transform="translate(-104 -463)"><path d="M37,0A37,37,0,1,1,0,37,37,37,0,0,1,37,0Z" transform="translate(104 463)" fill="#f24330"/><g transform="translate(124 480)"><path d="M11.306,43.49l3.4-8.209A17.1,17.1,0,1,1,41.339,21.052a17.007,17.007,0,0,1-7.7,14.229l3.4,8.209Z" transform="translate(-7 -4)" fill="none" stroke="#fff" stroke-linejoin="round" stroke-width="3"/><path d="M20,38v5.976" transform="translate(-6.87 -4.486)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/><path d="M28,38v5.976" transform="translate(-6.791 -4.486)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/><path d="M16.988,22.976A2.988,2.988,0,1,0,14,19.988,2.988,2.988,0,0,0,16.988,22.976Z" transform="translate(-6.909 -4.186)" fill="none" stroke="#fff" stroke-linejoin="round" stroke-width="3"/><path d="M30.988,22.976A2.988,2.988,0,1,0,28,19.988,2.988,2.988,0,0,0,30.988,22.976Z" transform="translate(-6.727 -4.186)" fill="none" stroke="#fff" stroke-linejoin="round" stroke-width="3"/><path d="M31.968,44H24" transform="translate(-6.757 -4.51)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/><path d="M23.968,44H16" transform="translate(-6.871 -4.51)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/></g></g></svg>`;
    } else if (game === 'memorygame') {
      name = 'Memory Game';
      svg = `<svg class="c-icon" xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 72 72"><g transform="translate(-256 -307)"><g transform="translate(256 307)"><path d="M36,0h0a0,0,0,0,1,0,0V36a0,0,0,0,1,0,0H0a0,0,0,0,1,0,0v0A36,36,0,0,1,36,0Z" fill="#f33"/><path d="M0,0H0A36,36,0,0,1,36,36v0a0,0,0,0,1,0,0H0a0,0,0,0,1,0,0V0A0,0,0,0,1,0,0Z" transform="translate(36)" fill="#3cb0d9"/><path d="M0,0H36a0,0,0,0,1,0,0V36a0,0,0,0,1,0,0h0A36,36,0,0,1,0,0V0A0,0,0,0,1,0,0Z" transform="translate(0 36)" fill="#e5ea49"/><path d="M0,0H36a0,0,0,0,1,0,0V0A36,36,0,0,1,0,36H0a0,0,0,0,1,0,0V0A0,0,0,0,1,0,0Z" transform="translate(36 36)" fill="#5ed540"/></g></g></svg>`;
    } else if (game === 'zengame') {
      name = 'Zen Game';
      svg = `<svg class="c-icon" xmlns="http://www.w3.org/2000/svg" width="74" height="74" viewBox="0 0 74 74"><g transform="translate(-117 -401)"><path d="M37,0A37,37,0,1,1,0,37,37,37,0,0,1,37,0Z" transform="translate(117 401)" fill="#f56331"/><g transform="translate(130 414)"><path d="M24,44.333A18.333,18.333,0,1,0,5.667,26,18.333,18.333,0,0,0,24,44.333Z" fill="none" stroke="#fff" stroke-linejoin="round" stroke-width="3"/><path d="M23.759,15.354V26.362l7.772,7.772" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/><path d="M4,9l7-5" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/><path d="M44,9,37,4" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/></g></g></svg>`;
    }
    document.querySelector('body').innerHTML = `
    <section class="c-live">
      <h1 class="c-live__start js-start-text">START</h1>
      <div class="c-live__game">
       ${svg}
        <h2 class="c-live__name">${name}</h2>
      </div>

      <div class="c-live__timer">
        <div class="c-timer">
          <p class="c-timer__time js-time">00:00</p>
        </div>
      </div>
      <div class="">
        <p class="c-live__score js-score">0</p>
      </div>
      <div class="c-live__controls">
        <div class="c-controls">
          <button class="c-controls__button o-button-reset js-pause-btn">
            <svg class="c-pause" width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 12V36" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M32 12V36" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <button class="c-controls__button o-button-reset js-stop-btn">
            <svg class="c-stop" width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 14L34 34" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M14 34L34 14" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>`;
  }
};

const showScore = () => {
  let score = 0;
  console.log('showScore');
  console.log(localStorage.getItem('gameData'));
  const gameData = JSON.parse(localStorage.getItem('gameData'));
  const cardElement = document.querySelector('.js-card');
  const scoreElement = document.querySelector('.js-score');
  const svgMemoryGame = `<svg class="c-endscore__icon" xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 72 72"><g transform="translate(-256 -307)"><g transform="translate(256 307)"><path d="M36,0h0a0,0,0,0,1,0,0V36a0,0,0,0,1,0,0H0a0,0,0,0,1,0,0v0A36,36,0,0,1,36,0Z" fill="#f33"/><path d="M0,0H0A36,36,0,0,1,36,36v0a0,0,0,0,1,0,0H0a0,0,0,0,1,0,0V0A0,0,0,0,1,0,0Z" transform="translate(36)" fill="#3cb0d9"/><path d="M0,0H36a0,0,0,0,1,0,0V36a0,0,0,0,1,0,0h0A36,36,0,0,1,0,0V0A0,0,0,0,1,0,0Z" transform="translate(0 36)" fill="#e5ea49"/><path d="M0,0H36a0,0,0,0,1,0,0V0A36,36,0,0,1,0,36H0a0,0,0,0,1,0,0V0A0,0,0,0,1,0,0Z" transform="translate(36 36)" fill="#5ed540"/></g></g></svg>`;
  const svgBlueVsRed = `<svg class="c-endscore__icon" xmlns="http://www.w3.org/2000/svg" width="74" height="74" viewBox="0 0 74 74"><g transform="translate(-288 -349)"><g transform="translate(288.308 349.308)"><path d="M37,0h0a0,0,0,0,1,0,0V74a0,0,0,0,1,0,0h0A37,37,0,0,1,0,37v0A37,37,0,0,1,37,0Z" transform="translate(-0.308 -0.308)" fill="#f33"/><path d="M0,0H0A37,37,0,0,1,37,37v0A37,37,0,0,1,0,74H0a0,0,0,0,1,0,0V0A0,0,0,0,1,0,0Z" transform="translate(36.692 -0.308)" fill="#3cb0d9"/></g></g></svg>`;
  const svgMineSweeper = `<svg class="c-endscore__icon" xmlns="http://www.w3.org/2000/svg" width="74" height="74" viewBox="0 0 74 74"><g transform="translate(-104 -463)"><path d="M37,0A37,37,0,1,1,0,37,37,37,0,0,1,37,0Z" transform="translate(104 463)" fill="#f24330"/><g transform="translate(124 480)"><path d="M11.306,43.49l3.4-8.209A17.1,17.1,0,1,1,41.339,21.052a17.007,17.007,0,0,1-7.7,14.229l3.4,8.209Z" transform="translate(-7 -4)" fill="none" stroke="#fff" stroke-linejoin="round" stroke-width="3"/><path d="M20,38v5.976" transform="translate(-6.87 -4.486)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/><path d="M28,38v5.976" transform="translate(-6.791 -4.486)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/><path d="M16.988,22.976A2.988,2.988,0,1,0,14,19.988,2.988,2.988,0,0,0,16.988,22.976Z" transform="translate(-6.909 -4.186)" fill="none" stroke="#fff" stroke-linejoin="round" stroke-width="3"/><path d="M30.988,22.976A2.988,2.988,0,1,0,28,19.988,2.988,2.988,0,0,0,30.988,22.976Z" transform="translate(-6.727 -4.186)" fill="none" stroke="#fff" stroke-linejoin="round" stroke-width="3"/><path d="M31.968,44H24" transform="translate(-6.757 -4.51)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/><path d="M23.968,44H16" transform="translate(-6.871 -4.51)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/></g></g></svg>`;
  const svgZenGame = `<svg class="c-endscore__icon" xmlns="http://www.w3.org/2000/svg" width="74" height="74" viewBox="0 0 74 74"><g transform="translate(-117 -401)"><path d="M37,0A37,37,0,1,1,0,37,37,37,0,0,1,37,0Z" transform="translate(117 401)" fill="#f56331"/><g transform="translate(130 414)"><path d="M24,44.333A18.333,18.333,0,1,0,5.667,26,18.333,18.333,0,0,0,24,44.333Z" fill="none" stroke="#fff" stroke-linejoin="round" stroke-width="3"/><path d="M23.759,15.354V26.362l7.772,7.772" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/><path d="M4,9l7-5" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/><path d="M44,9,37,4" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/></g></g></svg>`;
  if (gameData.game == 'bluevsred') {
    let winner = 'Gelijkspel!';
    console.log(gameData);
    if (gameData.scoreBlue != gameData.scoreRed) {
      score = Math.max(gameData.scoreBlue, gameData.scoreRed);
      if (score == gameData.scoreBlue) {
        winner = 'Blue team wint!';
      }
      winner = 'Red team wint!';
    }
    cardElement.innerHTML = `${svgBlueVsRed} <h2 class="c-endscore__game">${winner}</h2>`;
  } else if (gameData.game == 'memorygame') {
    cardElement.innerHTML = `${svgMemoryGame} <h2 class="c-endscore__game">Memory Game</h2>`;
    score = gameData.score;
  } else if (gameData.game == 'minesweeper') {
    cardElement.innerHTML = `${svgMineSweeper} <h2 class="c-endscore__game">Mine Sweeper</h2>`;
    score = gameData.score;
  } else if (gameData.game == 'zengame') {
    cardElement.innerHTML = `${svgZenGame} <h2 class="c-endscore__game">Zen Game</h2>`;
    score = gameData.score;
  }

  scoreElement.textContent = score;
};

const init = () => {
  console.log('DOM loaded');
  listener();
  if (document.querySelector('.js-index-page')) {
    localStorage.removeItem('gameData');
    localStorage.removeItem('selectedGameForm');
  } else if (document.querySelector('.js-form-page')) {
    localStorage.removeItem('gameData');
    showForm();
  } else if (document.querySelector('.js-ranking-page')) {
    // getTop10(game, time, difficulty);
  } else if (document.querySelector('.js-live-page')) {
    showLiveScoreBoard();
    listenToControls();
    checkPauseStatus();
    showCountdownStart();
    showCountdown();
  } else if (document.querySelector('.js-endscore-page')) {
    showScore();
  }
};

document.addEventListener('DOMContentLoaded', init);
