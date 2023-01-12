from flask import Flask, request
import paho.mqtt.client as mqtt
import socket

app = Flask(__name__)

# Connect to the MQTT broker
client = mqtt.Client()
client.connect("ws://localhost:9001")

@app.route('/turn_on_led', methods=['POST'])
def turn_on_led():
    # Get the LED ID from the request
    data = request.get_json()
    led_id = data.get('led_id')

    # Publish the message to the "leds/1" topic
    client.publish("leds/{}".format(led_id), 'on')

    return "Led turned on!"

if __name__ == '__main__':
    app.run(debug=True)