'use strict';

const client = mqtt.connect('ws://localhost:9001');
client.on('connect', () => {
  console.log('Connected to the MQTT WebSocket');

  client.subscribe('bat');

  client.on('message', (topic, message) => {
    console.log('Message received: ', topic, message.toString());
    const batteryProcent = parseFloat(message.toString());
    if (topic === 'bat') {
      const batteryElement = document.querySelector('.c-battery-level');
      batteryElement.classList.toggle('c-battery-level--low', batteryProcent <= 10);
      batteryElement.classList.toggle('c-battery-level--medium', batteryProcent < 25 && batteryProcent > 10);
      batteryElement.style.width = message.toString() + '%';
    }
  });
});

const listenToNavBtns = () => {
  const tabs = document.querySelectorAll('.js-tabs');
  tabs.forEach((tab) => {
    tab.addEventListener('click', (event) => {
      let tabName = tab.dataset.page;
      window.location.href = `${tabName}.html`;
    });
  });
};

const init = () => {
  listenToNavBtns();
  if (document.querySelector('.js-battery-page')) {
    client.publish('bat', 'jens');
  }
};

document.addEventListener('DOMContentLoaded', init);
