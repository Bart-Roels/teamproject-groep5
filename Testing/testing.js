// Connect to the MQTT WebSocket
const client = mqtt.connect('ws://localhost:9001');

client.on('connect', () => {
  console.log('Connected to the MQTT WebSocket');
  const colorsArray = ['red', 'yellow', 'green', 'blue'];
  // Subscribe to the topics
  client.subscribe('0');
  client.subscribe('1');
  client.subscribe('2');
  client.subscribe('3');
  client.subscribe('memorypoints');
  // Handle messages received on the subscribed topic
  client.on('message', (topic, message) => {
    message = message.toString();
    console.log('Received message on topic ' + topic + ': ' + message);
    // Check the message
    if (topic === 'memorypoints') {
      document.getElementById('memorypoints').innerHTML = message;
    } else {
      if (message === 'off') {
        if (topic === '0') {
          document.getElementById('led-1').style.backgroundColor = 'white';
        } else if (topic === '1') {
          document.getElementById('led-2').style.backgroundColor = 'white';
        } else if (topic === '2') {
          document.getElementById('led-3').style.backgroundColor = 'white';
        } else if (topic === '3') {
          document.getElementById('led-4').style.backgroundColor = 'white';
        }
      } else {
        index = parseInt(message);
        index = index;
        if (topic === '0') {
          console.log('LED 1 on');
          // Set opacity to 1
          document.getElementById('led-1').style.backgroundColor = colorsArray[index];
        } else if (topic === '1') {
          document.getElementById('led-2').style.backgroundColor = colorsArray[index];
        } else if (topic === '2') {
          document.getElementById('led-3').style.backgroundColor = colorsArray[index];
        } else if (topic === '3') {
          document.getElementById('led-4').style.backgroundColor = colorsArray[index];
        }
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

  const buttons = document.querySelectorAll('.js-button-action');
  buttons.forEach(button =>{
    button.addEventListener('click', (event)=>{
      const message = event.target.getAttribute('data-action-id');
      console.log(message);
      if (message === 'stop') {
        client.publish('stop', "stop");
        // Refresh the page
        console.log('Stop game');
        location.reload();
  
      }else if(message==='pauze'){
        client.publish('pauze', "pauze");
        console.log('Pauze game');
        location.reload();
      }
    })
  })
  /*btnAction.addEventListener('click', () => {
    const message = btnAction.getAttribute('data-action-id');
    console.log(message);
    if (message === 'stop') {
      client.publish('stop', "stop");
      // Refresh the page
      console.log('Stop game');
      location.reload();

    }else if(message==='pauze'){
      client.publish('pauze', "pauze");
      console.log('Pauze game');
      location.reload();
    }
  });*/
};

// Dom loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded');
  listen();
});
