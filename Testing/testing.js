// Connect to the MQTT WebSocket
const client = mqtt.connect('ws://localhost:9001');

client.on('connect', () => {
    console.log('Connected to the MQTT WebSocket');
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
        if (message === 'on') {
            if (topic === '1') {
                console.log('LED 1 on');
                // Set opacity to 1
                document.getElementById('led-1').setAttribute('opacity', '1');
            } else if (topic === '2') {
                document.getElementById('led-2').setAttribute('opacity', '1');
            } else if (topic === '3') {
                document.getElementById('led-3').setAttribute('opacity', '1');
            } else if (topic === '4') {
                document.getElementById('led-4').setAttribute('opacity', '1');
            }
        } else if (message === 'off') {
            if (topic === '1') {
                document.getElementById('led-1').setAttribute('opacity', '0.3');
            } else if (topic === '2') {
                document.getElementById('led-2').setAttribute('opacity', '0.3');
            } else if (topic === '3') {
                document.getElementById('led-3').setAttribute('opacity', '0.3');
            } else if (topic === '4') {
                document.getElementById('led-4').setAttribute('fill', 'white');
            }
        }
    });
});

// Dom loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded');
});