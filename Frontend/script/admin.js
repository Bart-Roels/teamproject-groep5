'use strict';
const ip = '192.168.220.1';

const client = mqtt.connect(`ws://${ip}:9001`);
client.on('connect', () => {
  console.log('Connected to the MQTT WebSocket');

  client.subscribe('bat0');
  client.subscribe('bat1');
  client.subscribe('bat2');
  client.subscribe('bat3');

  client.on('message', (topic, message) => {
    console.log('Message received: ', topic, message.toString());
    const batteryProcent = Math.round(parseFloat(message.toString()));
    console.log('battery: ', batteryProcent);
    const topics = ['bat0', 'bat1', 'bat2', 'bat3'];
    if (topics.includes(topic)) {
      const index = topics.indexOf(topic);
      const batteryElement = document.querySelectorAll('.c-battery-level')[index];
      batteryElement.classList.toggle('c-battery-level--low', batteryProcent <= 10);
      batteryElement.classList.toggle('c-battery-level--medium', batteryProcent < 25 && batteryProcent > 10);
      batteryElement.style.width = message.toString() + '%';
      document.querySelectorAll('.c-battery__procent')[index].innerHTML = `${batteryProcent}%`;
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
  const url = `http://${ip}:5000/api/v1/logs`;
  handleData(url, showData);
};

const askBatteryData = () => {
  client.publish('0', 'bat0');
  client.publish('1', 'bat1');
  client.publish('2', 'bat2');
  client.publish('3', 'bat3');
};

const setBattery = () => {
  const batteryElements = document.querySelectorAll('.c-battery-level');
  const batteryTexts = document.querySelectorAll('.c-battery__procent');
  batteryElements.forEach((batteryElement, index) => {
    batteryElement.style.width = '0%';
    batteryTexts[index].innerHTML = '?';
  });
};

const checkBattery = () => {
  setInterval(function () {
    console.log('Show battery');
    setBattery();
    askBatteryData();
  }, 5000);
};

const init = () => {
  listenToNavBtns();
  if (document.querySelector('.js-logging-page')) {
    getLogData();
  } else if (document.querySelector('.js-battery-page')) {
    checkBattery();
  }
};

document.addEventListener('DOMContentLoaded', init);
