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
};

const init = () => {
  console.log('DOM loaded');
  listener();
};

document.addEventListener('DOMContentLoaded', init);
