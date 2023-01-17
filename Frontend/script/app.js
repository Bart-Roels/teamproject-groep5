const listener = () => {
  const body = document.querySelector('body');
  const infoBtns = document.querySelectorAll('.js-info-btn');
  const closeBtn = document.querySelector('.js-popup-close');
  const popupTitle = document.querySelector('.js-popup-title');
  const popupDisc = document.querySelector('.js-popup-discription');
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
        body.classList.remove('has-popup');
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
        dropdown.innerHTML = `<option value="makkelijk">makkelijk</option>
                <option value="normaal">normaal</option>
                <option value="moeilijk">moeilijk</option>`;
      } else {
        dropdown.innerHTML = `<option value="3">3 min</option>
                <option value="5">5 min</option>
                <option value="10">10 min</option>`;
      }
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

const showFieldToForm = () => {
  const selectedGameForm = localStorage.getItem('selectedGameForm');
  console.log(selectedGameForm);
  const title = document.querySelector('.js-form-title');
  const icon = document.querySelector('.js-form-icon');
  if (selectedGameForm === 'bluevsred') {
    title.textContent = 'Blue vs Red';
    icon.innerHTML = `<svg class="c-icon" width="77" height="77" viewBox="0 0 77 77"><g transform="translate(-286.5 -347.5)"><g transform="translate(288.308 349.308)"><path d="M37,0h0a0,0,0,0,1,0,0V74a0,0,0,0,1,0,0h0A37,37,0,0,1,0,37v0A37,37,0,0,1,37,0Z" transform="translate(-0.308 -0.308)" fill="#f33" stroke="#919799" stroke-width="3" /><path d="M0,0H0A37,37,0,0,1,37,37v0A37,37,0,0,1,0,74H0a0,0,0,0,1,0,0V0A0,0,0,0,1,0,0Z" transform="translate(36.692 -0.308)" fill="#44c8f5" stroke="#919799" stroke-width="3" /></g></g></svg>`;
  } else if (selectedGameForm === 'zengame') {
    title.textContent = 'Zen Game';
    icon.innerHTML = `<svg class="c-icon u-color-zen-game" width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="28" r="16" fill="none"  stroke-width="3"/><path d="M28 4L20 4"  stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 4V12"  stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M35 16L38 13"  stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 28V22"  stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 28H18"  stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  } else if (selectedGameForm === 'minesweeper') {
    console.log('minesweeper');
    title.textContent = 'Mine sweeper';
    icon.innerHTML = `<svg class="c-icon u-color-mine-sweeper" width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.2632 44L14.6271 35.6852C10.031 32.5934 7 27.2927 7 21.2727C7 11.7333 14.6112 4 24 4C33.3888 4 41 11.7333 41 21.2727C41 27.2927 37.969 32.5934 33.3729 35.6852L36.7368 44H11.2632Z" fill="none"  stroke-width="3" stroke-linejoin="round"/><path d="M20 38V44"  stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M28 38V44"  stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M17 23C18.6569 23 20 21.6569 20 20C20 18.3431 18.6569 17 17 17C15.3431 17 14 18.3431 14 20C14 21.6569 15.3431 23 17 23Z" fill="none"  stroke-width="3" stroke-linejoin="round"/><path d="M31 23C32.6569 23 34 21.6569 34 20C34 18.3431 32.6569 17 31 17C29.3431 17 28 18.3431 28 20C28 21.6569 29.3431 23 31 23Z" fill="none"  stroke-width="3" stroke-linejoin="round"/><path d="M32 44H24"  stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 44H16"  stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  } else if (selectedGameForm === 'memorygame') {
    title.textContent = 'Memory Game';
    icon.innerHTML = `<svg class="c-icon" width="75" height="75" viewBox="0 0 75 75"><g transform="translate(-254.5 -305.5)"><g transform="translate(256 307)"><path d="M36,0h0a0,0,0,0,1,0,0V36a0,0,0,0,1,0,0H0a0,0,0,0,1,0,0v0A36,36,0,0,1,36,0Z" fill="#f33" stroke="#919799" stroke-width="3"/><path d="M0,0H0A36,36,0,0,1,36,36v0a0,0,0,0,1,0,0H0a0,0,0,0,1,0,0V0A0,0,0,0,1,0,0Z" transform="translate(36)" fill="#44c8f5" stroke="#919799" stroke-width="3"/><path d="M0,0H36a0,0,0,0,1,0,0V36a0,0,0,0,1,0,0h0A36,36,0,0,1,0,0V0A0,0,0,0,1,0,0Z" transform="translate(0 36)" fill="#e5ea49" stroke="#919799" stroke-width="3"/><path d="M0,0H36a0,0,0,0,1,0,0V0A36,36,0,0,1,0,36H0a0,0,0,0,1,0,0V0A0,0,0,0,1,0,0Z" transform="translate(36 36)" fill="#5ed540" stroke="#919799" stroke-width="3"/></g></g></svg>`;
  }
};

const init = () => {
  console.log('DOM loaded');
  listener();

  if (document.querySelector('.js-form-page')) {
    showFieldToForm();
  }
};

document.addEventListener('DOMContentLoaded', init);
