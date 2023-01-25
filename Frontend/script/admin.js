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

const showData = function (jsonObject) {
  let tableTest = $('.js-table').DataTable({
    data: jsonObject,
    columns: [{ data: 'tijd' }, { data: 'functie' }, { data: 'message' }, { data: 'type' }],
    language: {
      search: '_INPUT_',
      searchPlaceholder: 'Zoeken',
    },
    lengthChange: false,
    paging: 15,
    ordering: false,
    info: false,
  });
  console.log(jsonObject);
};

const getLogData = function () {
  console.log('getData');
  const url = 'http://127.0.0.1:5000/api/v1/logs';
  handleData(url, showData);
};

const askBatteryData = () => {
  client.publish('bat1');
  client.publish('bat2');
  client.publish('bat3');
  client.publish('bat4');
};

const init = () => {
  listenToNavBtns();
  if (document.querySelector('.js-logging-page')) {
    getLogData();
  } else if (document.querySelector('.js-battery-page')) {
    askBatteryData();
  }
};

document.addEventListener('DOMContentLoaded', init);
