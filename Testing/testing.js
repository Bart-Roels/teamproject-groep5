// Connect to the MQTT WebSocket
const client = mqtt.connect('ws://localhost:9001');

client.on('connect', () => {
  console.log('Connected to the MQTT WebSocket');
  const colorsArray = ['red', 'yellow', 'green', 'blue'];
  // Subscribe to the topics
  client.subscribe('1');
  client.subscribe('2');
  client.subscribe('3');
  client.subscribe('4');
  // Handle messages received on the subscribed topic
  client.on('message', (topic, message) => {
    message = message.toString();
    console.log('Received message on topic ' + topic + ': ' + message);
    // Check the message
    if (message === 'off') {
      if (topic === '1') {
        document.getElementById('led-1').style.backgroundColor = 'white';
      } else if (topic === '2') {
        document.getElementById('led-2').style.backgroundColor = 'white';
      } else if (topic === '3') {
        document.getElementById('led-3').style.backgroundColor = 'white';
      } else if (topic === '4') {
        document.getElementById('led-4').style.backgroundColor = 'white';
      }
    } else {
      index = parseInt(message);
      if (topic === '1') {
        console.log('LED 1 on');
        // Set opacity to 1
        document.getElementById('led-1').style.backgroundColor = colorsArray[index];
      } else if (topic === '2') {
        document.getElementById('led-2').style.backgroundColor = colorsArray[index];
      } else if (topic === '3') {
        document.getElementById('led-3').style.backgroundColor = colorsArray[index];
      } else if (topic === '4') {
        document.getElementById('led-4').style.backgroundColor = colorsArray[index];
      }
    }
  });
});

// Listen to the buttons
const listen = () => {
  const btnsGame = document.querySelectorAll('.js-button-game');
  btnsGame.forEach((btn) => {
    btn.addEventListener('click', () => {
      const topic = btn.getAttribute('data-game-id');
      client.publish('games', topic);
      // console.log(`Start game ${topic}`);
    });
  });

  const btnsLed = document.querySelectorAll('.js-button-led');
  btnsLed.forEach((btn) => {
    btn.addEventListener('click', () => {
      const message = btn.getAttribute('data-led-id');
      client.publish('buttons', message);
      // console.log(`Button ${message} pressed`);
    });
  });
};

// Dom loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded');
  listen();
});
