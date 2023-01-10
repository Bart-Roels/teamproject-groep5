const volgendepagina = function () {
  const button = document.querySelector('.js-button');
  button.addEventListener('click', function () {
    console.log('button clicked');
    window.location.href = 'http://127.0.0.1:5500/Frontend/onboardingScherm2.html';
  });
};

const volgendepaginaNaaronboardingScherm3 = function () {
  const buttonOboarding = document.querySelector('.js-button-naarOnboarding3');
  buttonOboarding.addEventListener('click', function () {
    console.log('button clicked');
    window.location.href = 'http://127.0.0.1:5500/Frontend/onboardingScherm3.html';
  });
};

const init = function () {
  console.log('DOM loaded');
  if (document.querySelector('.js-button')) {
    volgendepagina();
  }
  if (document.querySelector('.js-button-naarOnboarding3')) {
    volgendepaginaNaaronboardingScherm3();
  }
};

document.addEventListener('DOMContentLoaded', init);
