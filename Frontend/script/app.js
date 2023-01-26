'use strict';
let stop = false;
let timeLeft = null;
let timeInSeconds = null;

const game = {
  bluevsred: {
    name: 'Blue vs Red',
    description: 'Bij dit spel strijden het blauwe en het rode team tegen elkaar. Het team dat binnen de tijdslimiet de meeste LED-lichtjes van zijn kleur uittikt, wint het spel.',
    icon: '<svg class="c-icon" xmlns="http://www.w3.org/2000/svg" width="74" height="74" viewBox="0 0 74 74"><g transform="translate(-288 -349)"><g transform="translate(288.308 349.308)"><path d="M37,0h0a0,0,0,0,1,0,0V74a0,0,0,0,1,0,0h0A37,37,0,0,1,0,37v0A37,37,0,0,1,37,0Z" transform="translate(-0.308 -0.308)" fill="#f24330"/><path d="M0,0H0A37,37,0,0,1,37,37v0A37,37,0,0,1,0,74H0a0,0,0,0,1,0,0V0A0,0,0,0,1,0,0Z" transform="translate(36.692 -0.308)" fill="#3cb0d9"/></g></g></svg>',
  },
  zengame: {
    name: 'Zen Game',
    description: 'Probeer de opgelichte LED zo snel mogelijk uit te tikken. Hoe sneller je de LED uitklikt, hoe hoger je score zal zijn.',
    icon: '<svg class="c-icon" xmlns="http://www.w3.org/2000/svg" width="74" height="74" viewBox="0 0 74 74"><g transform="translate(-117 -401)"><path d="M37,0A37,37,0,1,1,0,37,37,37,0,0,1,37,0Z" transform="translate(117 401)" fill="#f56331"/><g transform="translate(130 414)"><path d="M24,44.333A18.333,18.333,0,1,0,5.667,26,18.333,18.333,0,0,0,24,44.333Z" fill="none" stroke="#fff" stroke-linejoin="round" stroke-width="3"/><path d="M23.759,15.354V26.362l7.772,7.772" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/><path d="M4,9l7-5" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/><path d="M44,9,37,4" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/></g></g></svg>',
  },
  minesweeper: {
    name: 'Mine Sweeper',
    description: `Klik op de knoppen om de palen in de juiste volgorde op te lichten. Er zijn 3 moeilijkheidsgraden: met hint, zonder hint, en bij fout opnieuw beginnen.`,
    icon: '<svg class="c-icon" xmlns="http://www.w3.org/2000/svg" width="74" height="74" viewBox="0 0 74 74"><g transform="translate(-104 -463)"><path d="M37,0A37,37,0,1,1,0,37,37,37,0,0,1,37,0Z" transform="translate(104 463)" fill="#f24330"/><g transform="translate(124 480)"><path d="M11.306,43.49l3.4-8.209A17.1,17.1,0,1,1,41.339,21.052a17.007,17.007,0,0,1-7.7,14.229l3.4,8.209Z" transform="translate(-7 -4)" fill="none" stroke="#fff" stroke-linejoin="round" stroke-width="3"/><path d="M20,38v5.976" transform="translate(-6.87 -4.486)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/><path d="M28,38v5.976" transform="translate(-6.791 -4.486)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/><path d="M16.988,22.976A2.988,2.988,0,1,0,14,19.988,2.988,2.988,0,0,0,16.988,22.976Z" transform="translate(-6.909 -4.186)" fill="none" stroke="#fff" stroke-linejoin="round" stroke-width="3"/><path d="M30.988,22.976A2.988,2.988,0,1,0,28,19.988,2.988,2.988,0,0,0,30.988,22.976Z" transform="translate(-6.727 -4.186)" fill="none" stroke="#fff" stroke-linejoin="round" stroke-width="3"/><path d="M31.968,44H24" transform="translate(-6.757 -4.51)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/><path d="M23.968,44H16" transform="translate(-6.871 -4.51)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/></g></g></svg>',
  },
  memorygame: {
    name: 'Memory Game',
    description: 'Probeer de getoonde volgorde zo lang mogelijk na te doen door de juiste paaltjes aan te klikken. Er zal telkens een extra LED oplichten.',
    icon: '<svg class="c-icon" xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 72 72"><g transform="translate(-256 -307)"><g transform="translate(256 307)"><path d="M36,0h0a0,0,0,0,1,0,0V36a0,0,0,0,1,0,0H0a0,0,0,0,1,0,0v0A36,36,0,0,1,36,0Z" fill="#f24330"/><path d="M0,0H0A36,36,0,0,1,36,36v0a0,0,0,0,1,0,0H0a0,0,0,0,1,0,0V0A0,0,0,0,1,0,0Z" transform="translate(36)" fill="#3cb0d9"/><path d="M0,0H36a0,0,0,0,1,0,0V36a0,0,0,0,1,0,0h0A36,36,0,0,1,0,0V0A0,0,0,0,1,0,0Z" transform="translate(0 36)" fill="#e5ea49"/><path d="M0,0H36a0,0,0,0,1,0,0V0A36,36,0,0,1,0,36H0a0,0,0,0,1,0,0V0A0,0,0,0,1,0,0Z" transform="translate(36 36)" fill="#5ed540"/></g></g></svg>',
  },
};

const dropdownRanking = {
  time: '<div class="c-custom-select"><select class="c-input c-custom-select__input" name="select1" id="select1"><option value="3">3 min</option><option value="5">5 min</option><option value="10">10 min</option></select><svg class="c-custom-select__symbol" width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M36 18L24 30L12 18" stroke="#333" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" /></svg></div>',
  difficulty:
    '<div class="c-custom-select u-mt-md"><select class="c-input c-custom-select__input" name="select2" id="select2"><option value="makkelijk">makkelijk</option><option value="normaal">normaal</option><option value="moeilijk">moeilijk</option></select><svg class="c-custom-select__symbol" width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M36 18L24 30L12 18" stroke="#333" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" /></svg></div>',
};

const client = mqtt.connect('ws://localhost:9001');
client.on('connect', () => {
  console.log('Connected to the MQTT WebSocket');

  client.subscribe('score');
  client.subscribe('scoreRed');
  client.subscribe('scoreBlue');

  client.subscribe('totalbuttonspressed');
  client.subscribe('niveau');

  client.on('message', (topic, message) => {
    let gameData = JSON.parse(localStorage.getItem('gameData'));
    console.log('Message received', topic, message.toString());
    if (document.querySelector('.js-live-page')) {
      if (topic === 'score') {
        document.querySelector('.js-score').textContent = message.toString();
      } else if (topic === 'scoreRed') {
        document.querySelector('.js-score-red').textContent = message.toString();
      } else if (topic === 'scoreBlue') {
        document.querySelector('.js-score-blue').textContent = message.toString();
      }
      if (topic === 'totalbuttonspressed') {
        localStorage.setItem('totalbuttonspressed', message.toString());
      } else if (topic === 'niveau') {
        localStorage.setItem('niveau', message.toString());
      }
    }
  });
});

const showExtraInfo = () => {
  let gameData = JSON.parse(localStorage.getItem('gameData'));
  const extraInfo = document.querySelector('.js-infos');
  if (gameData.game != 'bluevsred') {
    if (localStorage.getItem('totalbuttonspressed') != null) {
      extraInfo.innerHTML += `
                <li class="c-endscore__item">
                  <h3 class="c-endscore__item-title">Ingedrukte knoppen</h3>
                  <p class="c-endscore__item-text">${localStorage.getItem('totalbuttonspressed')}</p>
                </li>
      `;
    }

    if (localStorage.getItem('niveau') != null) {
      if (gameData.game != 'zengame') {
        extraInfo.innerHTML += `
              <li class="c-endscore__item">
                <h3 class="c-endscore__item-title">Niveau</h3>
                <p class="c-endscore__item-text">${localStorage.getItem('niveau') - 1}</p>
              </li>
    `;
      }
    }
  }
};

// open popup on click and close on click
const listenToPopup = () => {
  const body = document.querySelector('body');
  const infoBtns = document.querySelectorAll('.js-info-btn');
  const closeBtn = document.querySelector('.js-popup-close');
  const popupTitle = document.querySelector('.js-popup-title');
  const popupDisc = document.querySelector('.js-popup-discription');
  const popup = document.querySelector('.js-popup');

  infoBtns.forEach((btn) => {
    btn.addEventListener('click', (event) => {
      body.classList.add('has-popup');
      const gameName = btn.dataset.game;
      popupTitle.textContent = game[gameName].name;
      popupDisc.textContent = game[gameName].description;

      // listen to close btn
      closeBtn.addEventListener('click', () => {
        popup.classList.add('is-closing');
        setTimeout(() => {
          popup.classList.remove('is-closing');
          body.classList.remove('has-popup');
        }, 300);
      });
    });
  });
};

// listen to selected game btn on ranking page
const listenToGameBtns = () => {
  const gameBtns = document.querySelectorAll('.js-game-btn');
  const dropdown = document.querySelector('.js-dropdown');
  gameBtns.forEach((btn) => {
    btn.addEventListener('change', () => {
      const gameName = btn.id;
      let time, difficulty;
      // console.log(dropdown);
      if (gameName === 'minesweeper') {
        dropdown.innerHTML += dropdownRanking.difficulty;
        time = document.querySelector('#select1').value;
        difficulty = document.querySelector('#select2').value;
      } else {
        dropdown.innerHTML = dropdownRanking.time;
        time = document.querySelector('#select1').value;
      }
      getTop10(gameName, time, difficulty);
      listenToDropdown();
    });
  });
};

// listen to selected dropdown time and difficulty on ranking page
const listenToDropdown = () => {
  const dropdowns = document.querySelectorAll('.c-custom-select__input');
  dropdowns.forEach((dropdown) => {
    dropdown.addEventListener('change', () => {
      console.log('change');
      const gameName = document.querySelector('.js-game-btn:checked').id;
      let time, difficulty;
      if (gameName === 'minesweeper') {
        time = document.querySelector('#select1').value;
        difficulty = document.querySelector('#select2').value;
      } else {
        time = document.querySelector('#select1').value;
      }
      getTop10(gameName, time, difficulty);
    });
  });
};

const listener = () => {
  // listen to tabs and go to the clicked page
  const tabs = document.querySelectorAll('.js-tabs');
  tabs.forEach((tab) => {
    tab.addEventListener('click', (event) => {
      let tabName = tab.dataset.page;
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

  const selectedGames = document.querySelectorAll('.js-selected-game');
  selectedGames.forEach((game) => {
    game.addEventListener('click', () => {
      let selectedGameForm = game.dataset.game;
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
      sendStopGame();
      saveScore();

      // window.location.href = 'endscore.html';
      // window.location.replace('endscore.html');
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
      sendPauseGame();
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
      sendUnpauseGame();
    }
  });
};

const saveScore = () => {
  let gameData = JSON.parse(localStorage.getItem('gameData'));
  const url = `http://127.0.0.1:5000/api/v1/score`;
  console.log('show end page');
  const body = JSON.stringify(gameData);
  handleData(url, goToEndScore, null, 'POST', body);
};

const goToEndScore = () => {
  console.log('redirect');
  window.location.href = 'endscore.html';
  window.location.replace('endscore.html');
};

const getTop10 = (gameName, time, difficulty) => {
  const url = `http://127.0.0.1:5000/api/v1/score/${gameName}/${time}/${difficulty}`;
  console.log(url);
  handleData(url, showTop10, null, 'GET');
};

const showTop10 = (data) => {
  if (data.length > 0) {
    const top10 = document.querySelector('.js-rangschikking');
    top10.innerHTML = '';

    for (let i = 0; i < data.length; i++) {
      let name, score;
      if (data[i].game != 'bluevsred') {
        name = data[i].name;
        score = data[i].score;
      } else {
        if (data[i].scoreRed == data[i].scoreBlue) {
          name = `${data[i].nameRed} & ${data[i].nameBlue}`;
          score = data[i].scoreRed;
        } else if (data[i].scoreRed > data[i].scoreBlue) {
          name = data[i].nameRed;
          score = data[i].scoreRed;
        } else {
          name = data[i].nameBlue;
          score = data[i].scoreBlue;
        }
      }

      if (i === 0) {
        top10.innerHTML += `
            <li class="c-ranking__item c-ranking__item--first">
                  <span><img src="img/icons/first_place.svg" alt="eerste plaat badge" /></span><span>${name}</span><span class="c-ranking__score">${score}p</span>
              </li>`;
      } else if (i === 1) {
        top10.innerHTML += `
                <li class="c-ranking__item c-ranking__item--second">
                  <span><img src="img/icons/second_place.svg" alt="eerste plaat badge" /></span><span>${name}</span><span class="c-ranking__score">${score}p</span>
                </li>`;
      } else if (i === 2) {
        top10.innerHTML += `
                <li class="c-ranking__item c-ranking__item--third">
                  <span><img src="img/icons/thrid_place.svg" alt="eerste plaat badge" /></span><span>${name}</span><span class="c-ranking__score">${score}p</span>
                </li>`;
      } else {
        top10.innerHTML += `<li class="c-ranking__item"><span>${i + 1}</span><span>${name}</span><span class="c-ranking__score">${score}p</span></li>`;
      }
    }
  } else {
    const top10 = document.querySelector('.js-rangschikking');
    top10.innerHTML = '';
    top10.innerHTML += `<li class="c-ranking__item">Er zijn nog geen scores</li>`;
  }
};

const sendPlayGame = () => {
  let gameData = JSON.parse(localStorage.getItem('gameData'));
  if (gameData.game == 'minesweeper') {
    client.publish('minesweeper', JSON.stringify({ game: gameData.game, difficulty: gameData.difficulty }));
  } else {
    client.publish('games', gameData.game);
  }
};

const sendPauseGame = () => {
  client.publish('pauze', 'x');
};

const sendUnpauseGame = () => {
  client.publish('unpauze', 'x');
};

const sendStopGame = () => {
  client.publish('stop', 'x');
};

const isFormFieldValidity = (fieldElement, inputElement, errorElement) => {
  // check if input is empty
  if (isEmpty(inputElement.value)) {
    errorElement.innerHTML = 'Verplicht invullen';
    errorElement.classList.add('is-visible');
    fieldElement.classList.add('has-error');
    return false;
  } else if (isBadWord(inputElement.value)) {
    errorElement.innerHTML = 'Ongepaste naam';
    errorElement.classList.add('is-visible');
    fieldElement.classList.add('has-error');
    return false;
  }
  errorElement.innerHTML = '';
  errorElement.classList.remove('is-visible');
  fieldElement.classList.remove('has-error');
  return true;
};

const isBadWord = (word) => {
  // check if bad word: true = bad word
  return arrBadWords.includes(word.toLowerCase());
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
    sendPlayGame();
    console.log('redirect live-scorebord.html');
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
          if (!isEmpty(arrInput[i].value) && !isBadWord(arrInput[i].value)) {
            arrError[i].innerHTML = '';
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
  // console.log(selectedGameForm);
  const formElement = {
    title: document.querySelector('.js-form-title'),
    icon: document.querySelector('.js-form-icon'),
    info: document.querySelector('.js-form-info-text'),
    input: document.querySelector('.js-name-input'),
    field: document.querySelector('.js-name-field'),
    error: document.querySelector('.js-name-error-message'),

    inputRed: document.querySelector('.js-red-input'),
    fieldRed: document.querySelector('.js-red-field'),
    errorRed: document.querySelector('.js-red-error-message'),

    inputBlue: document.querySelector('.js-blue-input'),
    fieldBlue: document.querySelector('.js-blue-field'),
    errorBlue: document.querySelector('.js-blue-error-message'),

    dropdownDifficulty: document.querySelectorAll('.c-custom-select')[1],
  };

  formElement.title.textContent = game[selectedGameForm].name;
  formElement.icon.innerHTML = game[selectedGameForm].icon;
  formElement.info.innerHTML = game[selectedGameForm].description;

  if (selectedGameForm === 'bluevsred') {
    formElement.field.classList.add('u-hidden');
    formElement.fieldBlue.classList.remove('u-hidden');
    formElement.fieldRed.classList.remove('u-hidden');
    listenToFormSubmit([formElement.fieldRed, formElement.fieldBlue], [formElement.inputRed, formElement.inputBlue], [formElement.errorRed, formElement.errorBlue]);
  } else if (selectedGameForm === 'minesweeper') {
    formElement.dropdownDifficulty.classList.remove('u-hidden');
  }
  listenToFormSubmit([formElement.field], [formElement.input], [formElement.error]);

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
            sendStopGame();
            saveScore();
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
      svg = `<svg class="c-icon" xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 72 72"><g transform="translate(-256 -307)"><g transform="translate(256 307)"><path d="M36,0h0a0,0,0,0,1,0,0V36a0,0,0,0,1,0,0H0a0,0,0,0,1,0,0v0A36,36,0,0,1,36,0Z" fill="#f24330"/><path d="M0,0H0A36,36,0,0,1,36,36v0a0,0,0,0,1,0,0H0a0,0,0,0,1,0,0V0A0,0,0,0,1,0,0Z" transform="translate(36)" fill="#3cb0d9"/><path d="M0,0H36a0,0,0,0,1,0,0V36a0,0,0,0,1,0,0h0A36,36,0,0,1,0,0V0A0,0,0,0,1,0,0Z" transform="translate(0 36)" fill="#e5ea49"/><path d="M0,0H36a0,0,0,0,1,0,0V0A36,36,0,0,1,0,36H0a0,0,0,0,1,0,0V0A0,0,0,0,1,0,0Z" transform="translate(36 36)" fill="#5ed540"/></g></g></svg>`;
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
  const extraInfo = document.querySelector('.js-infos');
  const gameData = JSON.parse(localStorage.getItem('gameData'));
  const cardElement = document.querySelector('.js-card');
  const scoreElement = document.querySelector('.js-score');
  const svgMemoryGame = `<svg class="c-endscore__icon" xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 72 72"><g transform="translate(-256 -307)"><g transform="translate(256 307)"><path d="M36,0h0a0,0,0,0,1,0,0V36a0,0,0,0,1,0,0H0a0,0,0,0,1,0,0v0A36,36,0,0,1,36,0Z" fill="#f24330"/><path d="M0,0H0A36,36,0,0,1,36,36v0a0,0,0,0,1,0,0H0a0,0,0,0,1,0,0V0A0,0,0,0,1,0,0Z" transform="translate(36)" fill="#3cb0d9"/><path d="M0,0H36a0,0,0,0,1,0,0V36a0,0,0,0,1,0,0h0A36,36,0,0,1,0,0V0A0,0,0,0,1,0,0Z" transform="translate(0 36)" fill="#e5ea49"/><path d="M0,0H36a0,0,0,0,1,0,0V0A36,36,0,0,1,0,36H0a0,0,0,0,1,0,0V0A0,0,0,0,1,0,0Z" transform="translate(36 36)" fill="#5ed540"/></g></g></svg>`;
  const svgBlueVsRed = `<svg class="c-endscore__icon" xmlns="http://www.w3.org/2000/svg" width="74" height="74" viewBox="0 0 74 74"><g transform="translate(-288 -349)"><g transform="translate(288.308 349.308)"><path d="M37,0h0a0,0,0,0,1,0,0V74a0,0,0,0,1,0,0h0A37,37,0,0,1,0,37v0A37,37,0,0,1,37,0Z" transform="translate(-0.308 -0.308)" fill="#f24330"/><path d="M0,0H0A37,37,0,0,1,37,37v0A37,37,0,0,1,0,74H0a0,0,0,0,1,0,0V0A0,0,0,0,1,0,0Z" transform="translate(36.692 -0.308)" fill="#3cb0d9"/></g></g></svg>`;
  const svgMineSweeper = `<svg class="c-endscore__icon" xmlns="http://www.w3.org/2000/svg" width="74" height="74" viewBox="0 0 74 74"><g transform="translate(-104 -463)"><path d="M37,0A37,37,0,1,1,0,37,37,37,0,0,1,37,0Z" transform="translate(104 463)" fill="#f24330"/><g transform="translate(124 480)"><path d="M11.306,43.49l3.4-8.209A17.1,17.1,0,1,1,41.339,21.052a17.007,17.007,0,0,1-7.7,14.229l3.4,8.209Z" transform="translate(-7 -4)" fill="none" stroke="#fff" stroke-linejoin="round" stroke-width="3"/><path d="M20,38v5.976" transform="translate(-6.87 -4.486)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/><path d="M28,38v5.976" transform="translate(-6.791 -4.486)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/><path d="M16.988,22.976A2.988,2.988,0,1,0,14,19.988,2.988,2.988,0,0,0,16.988,22.976Z" transform="translate(-6.909 -4.186)" fill="none" stroke="#fff" stroke-linejoin="round" stroke-width="3"/><path d="M30.988,22.976A2.988,2.988,0,1,0,28,19.988,2.988,2.988,0,0,0,30.988,22.976Z" transform="translate(-6.727 -4.186)" fill="none" stroke="#fff" stroke-linejoin="round" stroke-width="3"/><path d="M31.968,44H24" transform="translate(-6.757 -4.51)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/><path d="M23.968,44H16" transform="translate(-6.871 -4.51)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/></g></g></svg>`;
  const svgZenGame = `<svg class="c-endscore__icon" xmlns="http://www.w3.org/2000/svg" width="74" height="74" viewBox="0 0 74 74"><g transform="translate(-117 -401)"><path d="M37,0A37,37,0,1,1,0,37,37,37,0,0,1,37,0Z" transform="translate(117 401)" fill="#f56331"/><g transform="translate(130 414)"><path d="M24,44.333A18.333,18.333,0,1,0,5.667,26,18.333,18.333,0,0,0,24,44.333Z" fill="none" stroke="#fff" stroke-linejoin="round" stroke-width="3"/><path d="M23.759,15.354V26.362l7.772,7.772" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/><path d="M4,9l7-5" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/><path d="M44,9,37,4" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/></g></g></svg>`;
  if (gameData.game == 'bluevsred') {
    let winner = 'Gelijkspel!';
    console.log(gameData);
    score = Math.max(gameData.scoreBlue, gameData.scoreRed);
    if (gameData.scoreBlue != gameData.scoreRed) {
      if (score == gameData.scoreBlue) {
        winner = `${gameData.nameBlue} team wint!`;
        score = gameData.scoreBlue;
      } else {
        winner = `${gameData.nameRed} team wint!`;
        score = gameData.scoreRed;
      }
    }
    extraInfo.innerHTML = `
                <li class="c-endscore__item">
                  <h3 class="c-endscore__item-title">Gekozen tijd</h3>
                  <p class="c-endscore__item-text">${gameData.time} min</p>
                </li>
                <li class="c-endscore__item">
                  <h3 class="c-endscore__item-title">${gameData.nameRed} team</h3>
                  <p class="c-endscore__item-text">${gameData.scoreRed}p</p>
                </li>
                <li class="c-endscore__item">
                  <h3 class="c-endscore__item-title">${gameData.nameBlue} team</h3>
                  <p class="c-endscore__item-text">${gameData.scoreBlue}p</p>
                </li>
      `;
    cardElement.innerHTML = `${svgBlueVsRed} <h2 class="c-endscore__game">${winner}</h2>`;
  } else if (gameData.game == 'memorygame') {
    cardElement.innerHTML = `${svgMemoryGame} <h2 class="c-endscore__game">Memory Game</h2>`;
    score = gameData.score;
    extraInfo.innerHTML = `
                <li class="c-endscore__item">
                  <h3 class="c-endscore__item-title">Gekozen tijd</h3>
                  <p class="c-endscore__item-text">${gameData.time} min</p>
                </li>
      `;
  } else if (gameData.game == 'minesweeper') {
    cardElement.innerHTML = `${svgMineSweeper} <h2 class="c-endscore__game">Mine Sweeper</h2>`;
    score = gameData.score;
    extraInfo.innerHTML = `
                <li class="c-endscore__item">
                  <h3 class="c-endscore__item-title">Gekozen tijd</h3>
                  <p class="c-endscore__item-text">${gameData.time} min</p>
                </li>
      `;
  } else if (gameData.game == 'zengame') {
    cardElement.innerHTML = `${svgZenGame} <h2 class="c-endscore__game">Zen Game</h2>`;
    score = gameData.score;
    extraInfo.innerHTML = `
                <li class="c-endscore__item">
                  <h3 class="c-endscore__item-title">Gekozen tijd</h3>
                  <p class="c-endscore__item-text">${gameData.time} min</p>
                </li>
      `;
  }

  scoreElement.textContent = score;
};

const showSplashScreen = () => {
  // show splash screen once
  if (sessionStorage.getItem('splashScreen') == null) {
    const body = document.querySelector('body');
    // create splash screen
    const splashScreen = document.createElement('div');
    splashScreen.classList.add('c-splashscreen');

    splashScreen.innerHTML =
      '<svg class="c-logo__symbol" width="91.52mm" height="25.37mm" viewBox="0 0 259.44 71.92"><path d="m0,20.89c.86-3.52,3.26-5.6,6.34-7.31,7.11-3.95,14.13-8.08,21.17-12.16,3.27-1.89,6.49-1.89,9.75,0,7.56,4.38,15.13,8.73,22.71,13.09,3.23,1.86,4.81,4.62,4.8,8.35-.03,8.73-.03,17.46,0,26.19.01,3.79-1.62,6.54-4.89,8.42-7.54,4.32-15.08,8.67-22.6,13.03-3.27,1.89-6.49,1.91-9.75.01-3.96-2.31-7.95-4.58-11.92-6.87-.34-.2-.66-.42-1.01-.64,1.53-1.19,2.35-2.64,2.82-4.48.46-1.79,1.4-3.46,2.14-5.17,1.55-3.57,3.64-6.81,6.02-9.87,1.14-1.47,1.63-1.63,3.03-.45,1.64,1.38,3.15,2.93,4.63,4.48,1.79,1.87,3.56,3.77,5.23,5.75,1.16,1.38,2.36,2.78,2.59,4.73.04.31.62.6,1,.83.59.35,1.22.65,1.85.94.68.31,1.39.79,2.08.79.58,0,1.35-.49,1.66-.99.18-.3-.22-1.2-.6-1.56-.89-.83-1.94-1.49-2.96-2.24.3-.48.49-.82.71-1.14.56-.82.32-1.42-.36-2.08-1.22-1.17-2.39-2.41-3.51-3.67-1.21-1.36-2.17-2.92-3.94-3.75-.58-.27-.93-1.13-1.29-1.77-1.44-2.6-2.68-5.33-4.28-7.83-2.45-3.84-1.61-7.68-.46-11.59.02-.08.03-.18.09-.22,1.5-1.08,2.93-2.29,4.54-3.17,1.22-.68,2.67-.95,4.02-1.39.52-.17,1.04-.44,1.56-.45.91-.02,1.82.14,2.65.21-.05-.16-.15-.48-.25-.81.11-.05.22-.11.33-.16-.25-.16-.49-.32-.76-.5.19-.11.38-.23.82-.48-.63-.13-.98-.2-1.34-.27-.08-.06-.15-.13-.23-.19.33-.1.67-.2,1-.3-.09-.14-.18-.28-.27-.42-.57.09-1.32.45-1.65.21-.38-.27-.39-1.06-.8-1.61-.05.24-.09.48-.14.71-.39,1.88-.92,2.58-2.75,2.35-2.16-.26-3.61,1-5.29,1.77-.81.37-1.5.73-2.47.55-.63-.12-1.36.26-2.04.45-.55.15-1.09.35-1.82.59.04-.71-.1-1.28.12-1.62.87-1.38.21-2.58-.46-3.66-1.01-1.63-3.31-1.42-4.02.36-.51,1.27-.53,2.6.41,3.8.28.35.39.83.67,1.43-.7,0-1.2-.03-1.69,0-.97.08-1.95.32-2.92.28-1.12-.05-2.29-.15-3.31-.55-1.11-.44-2.13-.59-3.24-.19-.04.01-.08.01-.12.03-1.5.5-2.81.38-3.71-1.11-.18-.29-.4-.56-.87-.76.09.47.18.95.29,1.52-.6-.15-1.16-.3-1.72-.44-.08.12-.15.24-.23.36.24.2.48.4.69.57-.16.06-.4.14-.86.3.54.26.87.42,1.3.62-.34.18-.63.33-.91.47.15.35.29.69.45,1.08,1.69-.57,3.41-.54,5.15.11.57.21,1.29.28,1.87.13,1.07-.26,1.93.04,2.84.52.87.45,1.83.72,2.74,1.11.29.13.59.33.78.58,1.63,2.16,1.69,4.7,1.89,7.26.23,3.06-.67,5.85-1.56,8.68-.51,1.62-.89,3.31-1.57,4.86-.48,1.08-1.47,1.91-2.05,2.96-.77,1.38-1.32,2.88-2.03,4.3-.33.67-.72,1.35-1.23,1.88-1.01,1.05-.77,1.96.08,2.91.16.18.3.37.55.68-.52.69-1.06,1.4-1.68,2.22-2.89-1.73-5.74-3.32-8.47-5.11-1.88-1.23-2.69-3.28-3.33-5.36v-30.14Z"/><path d="m158.92,29.93c-1.25,3.89-2.38,7.44-3.52,10.98-.32.99-.6,1.98-.97,2.95-.7,1.81-1.94,2.97-3.98,3.14-2.14.17-3.73-.67-4.76-2.54-.33-.59-.6-1.22-.82-1.85-2.31-6.49-4.61-12.98-6.89-19.47-.29-.82-.54-1.67-.71-2.53-.42-2.06.36-3.54,2.17-4.24,2-.77,4.07-.2,5.09,1.45.27.43.45.93.6,1.42,1.44,4.72,2.86,9.45,4.29,14.17.13.44.3.88.54,1.6,1.55-4.94,3-9.56,4.45-14.19.19-.61.36-1.22.57-1.82.73-2.04,1.97-2.95,4.01-2.94,1.99.01,3.22.86,3.89,2.91,1.6,4.92,3.12,9.86,4.68,14.8.11.34.23.67.43,1.24,1.12-3.69,2.17-7.14,3.21-10.59.52-1.71,1.02-3.43,1.54-5.15.8-2.63,2.86-3.79,5.33-3.02,2.22.69,3.22,2.8,2.37,5.32-1.71,5.01-3.5,9.99-5.26,14.98-.84,2.36-1.63,4.74-2.56,7.07-.79,1.98-2.16,3.33-4.48,3.38-2.46.05-3.99-1.05-4.84-3.63-1.31-3.97-2.56-7.96-3.83-11.94-.13-.4-.28-.8-.53-1.51Z"/><path d="m82.5,18.45c3.61-3,7.54-3.37,11.64-2.1,4.2,1.3,6.71,4.3,7,8.63.33,4.96.18,9.96.21,14.94,0,1.19.02,2.4-.14,3.58-.29,2.14-1.82,3.48-3.87,3.52-2.15.04-3.7-1.22-4.1-3.4-.11-.58-.14-1.19-.14-1.78-.01-4.18,0-8.37,0-12.55,0-.44,0-.88-.01-1.31-.12-3.41-2.13-5.42-5.39-5.4-3.08.03-5.14,2.17-5.17,5.52-.04,3.87-.01,7.73-.01,11.6,0,1,.02,1.99-.01,2.99-.07,2.63-1.7,4.35-4.1,4.34-2.4,0-4.06-1.72-4.07-4.35-.03-8.25-.01-16.5-.01-24.75,0-3.63-.04-7.25.02-10.88.05-2.8,2.16-4.54,4.85-4.1,1.94.31,3.28,1.96,3.31,4.23.04,3.35.02,6.7.02,10.04,0,.36,0,.71,0,1.26Z"/><path d="m191.37,34.28c.13,2.89,2.53,5.21,5.75,5.75,2.31.39,4.44-.05,6.48-1.09,1.1-.56,2.17-1.2,3.29-1.71,1.52-.69,2.89-.3,3.94,1.01,1.02,1.28,1.12,2.78.11,4.07-.55.71-1.23,1.4-1.99,1.87-4.67,2.91-9.72,4.01-15.12,2.61-6.89-1.78-11.2-7.92-11.01-15.46.17-6.72,3.98-12.52,9.64-14.7,8.22-3.17,17.49,2.06,19.47,10.99.22,1,.35,2.05.35,3.07,0,2.48-1.1,3.57-3.59,3.58-5.35.02-10.7,0-16.05,0-.43,0-.86,0-1.29,0Zm12.63-5.54c-.2-3.77-3.09-6.35-6.85-6.17-3.21.15-6.01,3.06-5.93,6.17h12.78Z"/><path d="m105.92,32.3c.12-5.72,1.87-10.08,5.82-13.38,6.32-5.29,15.77-4.01,20.53,2.9,3.99,5.8,4.24,12,.96,18.19-2.9,5.47-8.52,8.05-14.95,7.19-5.62-.75-10.39-5.28-11.79-11.28-.32-1.39-.44-2.82-.56-3.62Zm21.55-.66c-.11-.03-.22-.07-.33-.1,0-1.95-.42-3.79-1.46-5.46-2.4-3.83-7.7-3.87-10.01.03-2.04,3.44-2.06,7.06-.19,10.59,1.09,2.06,2.86,3.15,5.26,3.13,2.35-.02,4.13-1.11,5.1-3.15.75-1.58,1.1-3.35,1.63-5.03Z"/><path d="m226.06,47.4c-2.93-.13-5.83-.78-8.45-2.37-.77-.47-1.51-1.07-2.1-1.74-1.14-1.3-1.19-2.63-.32-4.07.87-1.44,2.27-2.16,3.85-1.72,1.17.33,2.3.89,3.38,1.46,1.74.92,3.52,1.46,5.51,1.11,1-.18,1.71-.62,1.9-1.68.19-1.02-.3-1.74-1.14-2.16-1.24-.63-2.54-1.14-3.81-1.71-1.67-.75-3.4-1.4-4.99-2.29-6.48-3.65-4.86-11.6-.27-14.58,4.2-2.73,11.44-2.56,15.42.48,1.87,1.43,2.46,3.44,1.54,5.25-.82,1.61-2.42,2.25-4.13,1.6-1.45-.55-2.84-1.29-4.32-1.72-.95-.28-2.08-.35-3.03-.11-.62.15-1.35.97-1.48,1.6-.12.55.34,1.54.85,1.86,1.23.78,2.63,1.29,3.97,1.91,1.7.78,3.47,1.43,5.09,2.35,6.18,3.5,4.95,10.98.51,14.16-2.37,1.69-5.05,2.28-8,2.38Z"/><path d="m244.96,23.64c-4.32-.38-5.41-1.13-5.43-3.6-.01-2.46,1.15-3.29,5.43-3.78,0-.8,0-1.62,0-2.44.01-1.07-.03-2.16.08-3.22.21-2.06,1.71-3.5,3.65-3.63,2.19-.14,3.85,1.01,4.27,3.15.23,1.16.17,2.37.21,3.56.03.83,0,1.67,0,2.69.92,0,1.78-.04,2.64,0,2.34.13,3.61,1.42,3.61,3.59,0,2.04-1.22,3.39-3.27,3.54-.94.07-1.9.01-2.98.01,0,.58,0,1.01,0,1.43,0,5.66,0,11.31,0,16.97,0,.67-.06,1.36-.21,2.01-.49,2.01-2.05,3.14-4.13,3.06-1.92-.07-3.45-1.41-3.76-3.38-.1-.62-.1-1.27-.11-1.91,0-5.54,0-11.08,0-16.61,0-.47,0-.94,0-1.46Z"/><path d="m191.97,60.02c-.78,2.58-1.54,5.17-2.33,7.75-.46,1.5-1.56,2.32-2.83,1.85-.67-.25-1.45-1-1.63-1.66-1.05-4-1.95-8.05-2.87-12.08-.25-1.08.2-1.82,1.12-2.05,1.03-.26,1.87.24,2.12,1.39.6,2.76,1.13,5.54,1.69,8.31.04.21.1.42.4.64.5-1.65,1.01-3.3,1.5-4.95.37-1.22.72-2.44,1.07-3.67.28-1,.77-1.8,1.94-1.77,1.1.03,1.55.8,1.83,1.75.78,2.68,1.58,5.34,2.38,8.01.08.25.19.5.4,1.03.64-3.16,1.2-6.03,1.8-8.89.1-.49.25-1.18.6-1.37.56-.3,1.37-.49,1.95-.33.94.27.93,1.21.75,2.02-.56,2.53-1.16,5.04-1.75,7.56-.34,1.43-.68,2.87-1.02,4.3-.27,1.15-.94,1.83-2.16,1.84-1.2.02-1.94-.6-2.28-1.73-.81-2.66-1.62-5.32-2.43-7.99-.08,0-.17.02-.25.03Z"/><path d="m143.67,60.31c-.28-.37-.55-.62-.7-.94-.25-.53-.52-1.08-.61-1.66-.22-1.47.47-2.69,1.84-3.44,1.86-1.01,4.58-.81,6.1.47,1.05.88,1.53,2.08.95,3.31-.52,1.1-1.43,2.02-2.3,3.19.13.15.48.55.83.94.37.41.74.82,1.15,1.28.48-.51.9-.99,1.35-1.42.57-.55,1.37-.86,1.89-.21.35.43.4,1.34.21,1.9-.22.67-.85,1.22-1.36,1.89.48.55.98,1.11,1.46,1.69.59.72.65,1.47-.06,2.12-.69.63-1.45.62-2.14-.03-.52-.49-1-1.02-1.33-1.36-1.54.63-2.9,1.46-4.37,1.73-3.72.69-6.63-2.02-6.07-5.49.3-1.84,1.6-2.96,3.16-3.98Zm4.99,5.33c-.94-1.05-1.86-2.09-2.81-3.1-.13-.14-.42-.25-.6-.2-.84.21-1.71,1.71-1.62,2.71.1,1.07.81,1.75,1.99,1.86,1.19.11,2.18-.31,3.04-1.27Zm-1.8-6.55c.76-.47,1.67-.85,1.47-1.9-.08-.39-.72-.92-1.13-.94-.47-.03-1.24.32-1.41.7-.42.97.38,1.55,1.08,2.14Z"/><path d="m244.09,60.17c0,2.47,0,4.94,0,7.41,0,1.49-.51,2.12-1.66,2.13-1.14,0-1.67-.64-1.68-2.12,0-3.9,0-7.81,0-11.71,0-.88.12-1.71,1.12-2.01,1-.31,1.67.22,2.23.97,1.91,2.56,3.82,5.1,5.74,7.65.25.34.53.66,1,1.26,0-2.48,0-4.65,0-6.82,0-.52-.03-1.04.02-1.55.09-1.03.67-1.64,1.71-1.6,1.04.04,1.59.66,1.6,1.71,0,3.31,0,6.61,0,9.92,0,.84.13,1.7-.04,2.5-.13.62-.53,1.46-1.02,1.64-.51.19-1.39-.14-1.9-.52-.61-.46-1.01-1.22-1.49-1.85-1.8-2.37-3.6-4.74-5.4-7.1-.08.04-.15.07-.23.11Z"/><path d="m167.62,60.98c2.76,1.33,3.61,2.94,2.88,5.43-.51,1.75-1.73,2.83-3.49,3.01-2.02.21-4.06.19-6.1.16-1.08-.01-1.65-.73-1.65-1.81,0-4.03-.02-8.05,0-12.08,0-1.24.61-1.77,1.89-1.8,1.36-.02,2.72-.02,4.07,0,1.93.03,3.42.99,3.96,2.54.6,1.7.09,3.22-1.57,4.55Zm-4.99,5.65c1.02,0,1.93.04,2.84-.01,1.05-.06,1.7-.63,1.77-1.71.06-1.05-.54-1.67-1.53-1.77-1-.1-2.02-.02-3.08-.02v3.52Zm.02-6.53c1.2-.09,2.48.41,3.15-.82.25-.46.25-1.35-.03-1.76-.75-1.09-1.97-.7-3.12-.68v3.26Z"/><path d="m224.82,63.33c-.69,0-1.4.02-2.11,0-1.01-.04-1.57-.62-1.52-1.61.04-.95.65-1.4,1.6-1.4,1.24,0,2.47-.03,3.71,0,1.33.04,1.83.56,1.93,1.92.34,4.58-3.62,8.25-8.17,7.57-3.29-.49-5.61-2.6-6.38-5.8-.84-3.54.33-7.14,2.92-9,2.42-1.75,6.49-1.83,9.07-.18.3.19.59.42.83.68.65.68.87,1.48.25,2.26-.61.77-1.39.56-2.17.19-.85-.41-1.69-.99-2.59-1.14-3.29-.54-5.52,1.97-5.1,5.59.35,3,2.07,4.66,4.58,4.41,1.98-.2,3.23-1.51,3.14-3.47Z"/><path d="m114.19,61.73c.02,6.3-5.88,10.1-11.23,7.23-3.48-1.86-4.94-6.62-3.29-10.67,1.48-3.62,5.21-5.43,9.02-4.38,3.29.91,5.49,4.03,5.5,7.82Zm-3.26.28c-.26-1.08-.36-2-.7-2.83-.64-1.57-1.84-2.46-3.6-2.47-1.76,0-2.97.85-3.63,2.42-.8,1.89-.78,3.82.18,5.65,1.4,2.64,5.18,2.79,6.68.23.54-.93.74-2.06,1.07-3Z"/><path d="m123.12,63.12c1.24,1.33,2.35,2.51,3.45,3.72.82.9.82,1.83.04,2.5-.74.63-1.75.49-2.52-.39-.78-.9-1.53-1.84-2.29-2.76-.73-.88-1.46-1.77-2.45-2.6,0,1.36.09,2.73-.04,4.08-.06.64-.36,1.45-.84,1.81-1.03.77-2.41-.04-2.42-1.39-.04-4.18-.02-8.36-.01-12.54,0-.92.45-1.6,1.39-1.62,1.91-.04,3.84-.12,5.73.12,2.45.31,3.75,1.82,3.92,4.1.19,2.47-.78,3.87-3.26,4.73-.18.06-.37.13-.7.24Zm-3.71-2.25c1.47-.2,3.09.54,3.94-1.01.3-.56.22-1.69-.16-2.19-.99-1.25-2.47-.53-3.77-.71v3.91Z"/><path d="m79.67,53.46c1.06.31,2.16.52,3.17.94.9.37,1.35,1.14.89,2.15-.43.93-1.17,1.06-2.1.78-.76-.23-1.57-.55-2.31-.45-.58.08-1.33.63-1.56,1.16-.33.79.48,1.14,1.13,1.38,1.08.39,2.2.71,3.27,1.13,1.77.68,2.78,1.98,2.87,3.88.09,1.89-.6,3.48-2.24,4.47-2.56,1.53-5.2,1.22-7.78.04-.91-.42-1.23-1.28-.84-2.22.4-.97,1.26-.98,2.13-.74.5.14.98.37,1.48.45.7.11,1.42.21,2.12.15.89-.09,1.55-.72,1.47-1.58-.05-.53-.6-1.16-1.1-1.47-.62-.39-1.41-.52-2.13-.74-3.2-.95-4.37-2.35-4.03-4.84.34-2.55,2.59-4.3,5.55-4.47Z"/><path d="m90.19,64.39c0,1.27.02,2.38,0,3.48-.03,1.22-.54,1.8-1.57,1.83-1.04.03-1.71-.54-1.72-1.71-.04-4.14-.03-8.29,0-12.43,0-1.08.64-1.68,1.77-1.68,1.44,0,2.88-.04,4.31.02,3.03.13,5.15,2.26,5.2,5.16.05,2.91-1.99,5.08-5.04,5.31-.91.07-1.83.01-2.95.01Zm.06-2.86c1.56-.17,3.18.44,4.15-1.16.53-.88.51-1.88-.15-2.69-1.08-1.35-2.57-.81-4-.84v4.69Z"/><path d="m233.59,56.97v3.17c1.1,0,2.16-.01,3.23,0,1.28.02,2,.61,1.97,1.58-.03.92-.73,1.48-1.94,1.5-1.04.02-2.07,0-3.21,0v3.34c1.22,0,2.44-.01,3.66,0,1.24.01,1.89.54,1.89,1.5,0,.95-.66,1.54-1.87,1.56-1.72.03-3.43.04-5.15,0-1.4-.03-1.95-.61-1.96-2-.02-3.86-.02-7.73,0-11.59,0-1.59.58-2.12,2.19-2.13,1.56,0,3.11-.01,4.67,0,1.25.01,1.9.52,1.92,1.48.03.97-.7,1.57-1.97,1.59-1.11.02-2.22,0-3.45,0Z"/><path d="m175.79,56.96v3.17c1.04,0,2.1-.01,3.16,0,1.29.02,2.02.58,2.01,1.55,0,.95-.74,1.52-2.03,1.53-1.03.01-2.06,0-3.14,0v3.34c1.25,0,2.48-.01,3.7,0,1.25.02,1.87.52,1.85,1.52-.03,1.12-.75,1.52-1.75,1.54-1.76.03-3.52.04-5.27,0-1.38-.03-1.92-.62-1.92-2.03-.01-3.83-.01-7.65,0-11.48,0-1.7.53-2.21,2.22-2.22,1.6,0,3.2-.02,4.79,0,1.13.02,1.79.59,1.75,1.52-.05,1.08-.74,1.53-1.76,1.54-1.16.02-2.31,0-3.61,0Z"/><path d="m206.94,56.96v3.17c1.09,0,2.16-.01,3.22,0,1.28.02,2,.62,1.96,1.59-.04.92-.74,1.46-1.95,1.49-1,.02-2,.02-2.99.03-.04,0-.07.03-.19.08v3.23c1.26,0,2.49.01,3.71,0,1.01-.01,1.73.33,1.8,1.45.06,1-.56,1.59-1.78,1.61-1.76.03-3.52.04-5.27,0-1.33-.03-1.87-.62-1.88-1.95-.01-3.91-.02-7.81,0-11.72,0-1.49.57-2.04,2.02-2.05,1.68-.02,3.36,0,5.03,0,.99,0,1.62.43,1.7,1.45.08.93-.57,1.57-1.68,1.61-1.19.04-2.39.01-3.7.01Z"/><path d="m134.3,56.96c0,3.42,0,6.68,0,9.94,0,.48.03.96-.03,1.43-.11.87-.64,1.34-1.53,1.38-.88.04-1.47-.35-1.67-1.22-.09-.42-.09-.87-.09-1.3,0-3.34,0-6.69,0-10.22-.77,0-1.47.02-2.17,0-1.14-.05-1.74-.6-1.72-1.56.02-.95.62-1.5,1.77-1.5,2.56-.02,5.11,0,7.67,0,1,0,1.6.46,1.66,1.48.06.98-.52,1.54-1.66,1.59-.68.03-1.35,0-2.22,0Z"/></svg>';

    body.appendChild(splashScreen);

    setTimeout(() => {
      // fade out
      splashScreen.style.opacity = 0;
    }, 2000);

    setTimeout(() => {
      body.removeChild(splashScreen);
    }, 3000);

    sessionStorage.setItem('splashScreen', true);
  }
};

const setToggleAndFilter = (game, time, difficulty) => {
  const toggle = document.querySelectorAll('.js-game-btn');
  const dropdownTime = document.querySelectorAll('.c-custom-select__input')[0];
  if (game != null) {
    // change toggle button value to selected game
    toggle.forEach((btn) => {
      if (btn.id == game) {
        btn.checked = true;
      }
    });

    // change time dropdown
    if (time != null) {
      dropdownTime.value = time;
    }

    // change difficulty dropdown
    if (difficulty != null) {
      document.querySelector('.js-dropdown').innerHTML += dropdownRanking.difficulty;
      const dropdownDifficulty = document.querySelectorAll('.c-custom-select__input')[1];
      dropdownDifficulty.value = difficulty;
    }
  } else {
    toggle[0].checked = true;
    dropdownTime.value = '3';
  }
};

const init = () => {
  console.log('DOM loaded');
  listener();
  showSplashScreen();

  if (document.querySelector('.js-index-page')) {
    localStorage.removeItem('gameData');
    localStorage.removeItem('selectedGameForm');
    listenToPopup();
  } else if (document.querySelector('.js-form-page')) {
    localStorage.removeItem('gameData');
    showForm();
  } else if (document.querySelector('.js-ranking-page')) {
    const gameData = JSON.parse(localStorage.getItem('gameData'));
    if (gameData != null) {
      setToggleAndFilter(gameData.game, gameData.time, gameData.difficulty);
      getTop10(gameData.game, gameData.time, gameData.difficulty);
    } else {
      getTop10('memorygame', '3', null);
    }
    listenToGameBtns();
    listenToDropdown();
  } else if (document.querySelector('.js-live-page')) {
    showLiveScoreBoard();
    listenToControls();
    checkPauseStatus();
    showCountdownStart();
    showCountdown();
  } else if (document.querySelector('.js-endscore-page')) {
    showScore();
    showExtraInfo();
  }
};

document.addEventListener('DOMContentLoaded', init);
