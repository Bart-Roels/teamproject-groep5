'use strict';

const client = mqtt.connect('ws://localhost:9001');
client.on('connect', () => {
  console.log('Connected to the MQTT WebSocket');

  client.subscribe('bat1');
  client.subscribe('bat2');
  client.subscribe('bat3');
  client.subscribe('bat4');

  client.on('message', (topic, message) => {
    console.log('Message received: ', topic, message.toString());
    const batteryProcent = parseFloat(message.toString());
    const topics = ['bat1', 'bat2', 'bat3', 'bat4'];
    if (topics.includes(topic)) {
      const index = topics.indexOf(topic);
      const batteryElement = document.querySelectorAll('.c-battery-level')[index];
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
    client.publish('bat1');
    client.publish('bat2');
    client.publish('bat3');
    client.publish('bat4');
  }
};

document.addEventListener('DOMContentLoaded', init);
