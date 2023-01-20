let stop = false;
let timeLeft = null;
let timeInSeconds = null;

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
      console.log(gameData);
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

const checkValidity = (arrField, arrInput, arrError) => {
  const formStartBtn = document.querySelector('.js-form-start-btn');
  formStartBtn.addEventListener('click', (e) => {
    e.preventDefault();
    for (let i = 0; i < arrField.length; i++) {
      if (!isEmpty(arrInput[i].value)) {
        arrError[i].classList.remove('is-visible');
        arrField[i].classList.remove('has-error');

        let name, nameRed, nameBlue, selectedDropdown, selectedDifficulty;

        if (i == arrField.length - 1) {
          if (localStorage.getItem('selectedGameForm') == 'bluevsred') {
            nameRed = arrInput[i].value;
            nameBlue = arrInput[i - 1].value;
          } else {
            name = arrInput[i].value;
          }
          selectedDropdown = document.querySelector('.js-dropdown').value;
          if (localStorage.getItem('selectedGameForm') == 'minesweeper') {
            selectedDifficulty = document.querySelector('.js-dropdown-2').value;
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
          countDown3sec();
        }
      } else {
        arrError[i].classList.add('is-visible');
        arrField[i].classList.add('has-error');
      }
    }
  });
  for (let i = 0; i < arrField.length; i++) {
    arrInput[i].addEventListener('input', (e) => {
      if (!isEmpty(arrInput[i].value)) {
        arrError[i].classList.remove('is-visible');
        arrField[i].classList.remove('has-error');
      }
    });
  }
};

const countDown3sec = () => {
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

const showFieldToForm = () => {
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
    icon.innerHTML = `<svg class="c-icon" width="77" height="77" viewBox="0 0 77 77"><g transform="translate(-286.5 -347.5)"><g transform="translate(288.308 349.308)"><path d="M37,0h0a0,0,0,0,1,0,0V74a0,0,0,0,1,0,0h0A37,37,0,0,1,0,37v0A37,37,0,0,1,37,0Z" transform="translate(-0.308 -0.308)" fill="#f33" stroke="#919799" stroke-width="3" /><path d="M0,0H0A37,37,0,0,1,37,37v0A37,37,0,0,1,0,74H0a0,0,0,0,1,0,0V0A0,0,0,0,1,0,0Z" transform="translate(36.692 -0.308)" fill="#44c8f5" stroke="#919799" stroke-width="3" /></g></g></svg>`;
    formFields.innerHTML = `<p class="c-form-field js-red-field"><label class="c-label" for="red">Red team naam<span class="c-label__error-message js-red-error-message">Verplicht invullen</span></label><input class="c-input js-red-input" type="text" name="red" id="red" placeholder="bijv. Duivels" required /></p> <p class="c-form-field js-blue-field"><label class="c-label" for="blue">Blue team naam<span class="c-label__error-message js-blue-error-message">Verplicht invullen</span></label><input class="c-input js-blue-input" type="text" name="blue" id="blue" placeholder="bijv. Spartanen" required /></p> `;
    formInfoText.innerHTML = `Het rode en het blauwe team strijden tegen elkaar. Het team dat in 30 seconden het meeste LED-lichtjes van zijn kleur uittikt, wint het spel.`;
    const formRedInput = document.querySelector('.js-red-input');
    const formRedField = document.querySelector('.js-red-field');
    const formRedError = document.querySelector('.js-red-error-message');
    const formBlueInput = document.querySelector('.js-blue-input');
    const formBlueField = document.querySelector('.js-blue-field');
    const formBlueError = document.querySelector('.js-blue-error-message');
    checkValidity([formRedField, formBlueField], [formRedInput, formBlueInput], [formRedError, formBlueError]);
  } else if (selectedGameForm === 'zengame') {
    title.textContent = 'Zen Game';
    icon.innerHTML = `<svg class="c-icon u-color-zen-game" width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="28" r="16" fill="none"  stroke-width="3"/><path d="M28 4L20 4"  stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 4V12"  stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M35 16L38 13"  stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 28V22"  stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 28H18"  stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    formInfoText.innerHTML = `Probeer de opgelichte LED zo snel mogelijk uit te tikken. De reactie-snelheid waarmee de speler reageert bepaald de score.`;
    checkValidity([formNameField], [formNameInput], [formNameError]);
  } else if (selectedGameForm === 'minesweeper') {
    title.textContent = 'Mine sweeper';
    icon.innerHTML = `<svg class="c-icon u-color-mine-sweeper" width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.2632 44L14.6271 35.6852C10.031 32.5934 7 27.2927 7 21.2727C7 11.7333 14.6112 4 24 4C33.3888 4 41 11.7333 41 21.2727C41 27.2927 37.969 32.5934 33.3729 35.6852L36.7368 44H11.2632Z" fill="none"  stroke-width="3" stroke-linejoin="round"/><path d="M20 38V44"  stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M28 38V44"  stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M17 23C18.6569 23 20 21.6569 20 20C20 18.3431 18.6569 17 17 17C15.3431 17 14 18.3431 14 20C14 21.6569 15.3431 23 17 23Z" fill="none"  stroke-width="3" stroke-linejoin="round"/><path d="M31 23C32.6569 23 34 21.6569 34 20C34 18.3431 32.6569 17 31 17C29.3431 17 28 18.3431 28 20C28 21.6569 29.3431 23 31 23Z" fill="none"  stroke-width="3" stroke-linejoin="round"/><path d="M32 44H24"  stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 44H16"  stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
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
                  <select class="c-input c-custom-select__input--form js-dropdown-2" name="select1" id="select1">
                   <option value="easy">Makkelijk</option><option value="medium">Normaal</option><option value="hard">Moeilijk</option>
                  </select>
                  <svg class="c-custom-select__symbol" width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M36 18L24 30L12 18" stroke="#333" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </p>`;
    checkValidity([formNameField], [formNameInput], [formNameError]);
  } else if (selectedGameForm === 'memorygame') {
    title.textContent = 'Memory Game';
    icon.innerHTML = `<svg class="c-icon" width="75" height="75" viewBox="0 0 75 75"><g transform="translate(-254.5 -305.5)"><g transform="translate(256 307)"><path d="M36,0h0a0,0,0,0,1,0,0V36a0,0,0,0,1,0,0H0a0,0,0,0,1,0,0v0A36,36,0,0,1,36,0Z" fill="#f33" stroke="#919799" stroke-width="3"/><path d="M0,0H0A36,36,0,0,1,36,36v0a0,0,0,0,1,0,0H0a0,0,0,0,1,0,0V0A0,0,0,0,1,0,0Z" transform="translate(36)" fill="#44c8f5" stroke="#919799" stroke-width="3"/><path d="M0,0H36a0,0,0,0,1,0,0V36a0,0,0,0,1,0,0h0A36,36,0,0,1,0,0V0A0,0,0,0,1,0,0Z" transform="translate(0 36)" fill="#e5ea49" stroke="#919799" stroke-width="3"/><path d="M0,0H36a0,0,0,0,1,0,0V0A36,36,0,0,1,0,36H0a0,0,0,0,1,0,0V0A0,0,0,0,1,0,0Z" transform="translate(36 36)" fill="#5ed540" stroke="#919799" stroke-width="3"/></g></g></svg>`;
    formInfoText.innerHTML = `Probeer de getoonde sequentie zo lang mogelijk na te doen door de juiste paaltjes aan te klikken. Er zal telkens een extra LED oplichten.`;
    checkValidity([formNameField], [formNameInput], [formNameError]);
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

const checkSelectedGame = () => {
  const gameData = JSON.parse(localStorage.getItem('gameData'));
  const game = gameData.game;
  let name, svg;
  if (game != 'bluevsred') {
    if (game === 'minesweeper') {
      name = 'Mine Sweeper';
      svg = `<svg class="c-icon u-color-mine-sweeper" width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.2632 44L14.6271 35.6852C10.031 32.5934 7 27.2927 7 21.2727C7 11.7333 14.6112 4 24 4C33.3888 4 41 11.7333 41 21.2727C41 27.2927 37.969 32.5934 33.3729 35.6852L36.7368 44H11.2632Z" fill="none"  stroke-width="3" stroke-linejoin="round"/><path d="M20 38V44"  stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M28 38V44"  stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M17 23C18.6569 23 20 21.6569 20 20C20 18.3431 18.6569 17 17 17C15.3431 17 14 18.3431 14 20C14 21.6569 15.3431 23 17 23Z" fill="none"  stroke-width="3" stroke-linejoin="round"/><path d="M31 23C32.6569 23 34 21.6569 34 20C34 18.3431 32.6569 17 31 17C29.3431 17 28 18.3431 28 20C28 21.6569 29.3431 23 31 23Z" fill="none"  stroke-width="3" stroke-linejoin="round"/><path d="M32 44H24"  stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 44H16"  stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    } else if (game === 'memorygame') {
      name = 'Memory Game';
      svg = `<svg class="c-icon" width="75" height="75" viewBox="0 0 75 75"><g transform="translate(-254.5 -305.5)"><g transform="translate(256 307)"><path d="M36,0h0a0,0,0,0,1,0,0V36a0,0,0,0,1,0,0H0a0,0,0,0,1,0,0v0A36,36,0,0,1,36,0Z" fill="#f33" stroke="#919799" stroke-width="3"/><path d="M0,0H0A36,36,0,0,1,36,36v0a0,0,0,0,1,0,0H0a0,0,0,0,1,0,0V0A0,0,0,0,1,0,0Z" transform="translate(36)" fill="#44c8f5" stroke="#919799" stroke-width="3"/><path d="M0,0H36a0,0,0,0,1,0,0V36a0,0,0,0,1,0,0h0A36,36,0,0,1,0,0V0A0,0,0,0,1,0,0Z" transform="translate(0 36)" fill="#e5ea49" stroke="#919799" stroke-width="3"/><path d="M0,0H36a0,0,0,0,1,0,0V0A36,36,0,0,1,0,36H0a0,0,0,0,1,0,0V0A0,0,0,0,1,0,0Z" transform="translate(36 36)" fill="#5ed540" stroke="#919799" stroke-width="3"/></g></g></svg>`;
    } else if (game === 'zengame') {
      name = 'Zen Game';
      svg = `<svg class="c-icon u-color-zen-game" width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="28" r="16" fill="none"  stroke-width="3"/><path d="M28 4L20 4"  stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 4V12"  stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M35 16L38 13"  stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 28V22"  stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 28H18"  stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
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

};

const init = () => {
  console.log('DOM loaded');
  listener();

  if (document.querySelector('.js-form-page')) {
    showFieldToForm();
  } else if (document.querySelector('.js-ranking-page')) {
    // getTop10(game, time, difficulty);
  } else if (document.querySelector('.js-live-page')) {
    checkSelectedGame();
    listenToControls();
    checkPauseStatus();
    showCountdownStart();
    showCountdown();
  }else if (document.querySelector('.js-endscore-page')) {
    // showScore();
  }
};

document.addEventListener('DOMContentLoaded', init);
