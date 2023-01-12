from flask import Flask, request
import paho.mqtt.client as mqtt
import socket

app = Flask(__name__)


# Define the callbacks for connecting, publishing and receiving messages
def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))
    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    client.subscribe("1")


def on_message(client, userdata, msg):
    print(msg.topic+" "+str(msg.payload))

# Create the MQTT client and set the callbacks
client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

# Connect to the MQTT WebSocket
client.connect("ws://localhost", port=9100, keepalive=60)

# Start the loop to process incoming MQTT messages
client.loop_forever()


# FLASK

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