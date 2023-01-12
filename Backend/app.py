import random
import time
from flask import Flask, jsonify, request
from flask_cors import CORS

import paho.mqtt.client as mqtt
import random
import time
import functools
import threading

# GLOBAL VARIABLES
client = mqtt.Client()
client.username_pw_set("paaltje", "pole")
client.connect("192.168.220.1", 1883)
counter = 0
sequence_number = 1
sequence = []

#region FLASK APP
app = Flask(__name__)
CORS(app)
endpoint = '/api/v1'


@app.route(endpoint + '/test/', methods=['POST'])
def test():
    global sequence_number
    if request.method == 'POST':
        sequence_number = 1
        start_memory()
        return "oke",200

#endregion

#region HARDWARE APP



# MEMORY GAME

def on_message(client, userdata, message):
    global counter
    global sequence_number
    global sequence

    # decode the message
    received_sequence = message.payload.decode("utf-8")
    print(received_sequence)

    # check if the received sequence matches the current sequence
    if int(received_sequence) == sequence[counter]:
        counter += 1

        # check if the entire sequence has been matched
        if counter == len(sequence):
            print("You have won!")
            counter = 0
            sequence_number += 1
            client.loop_stop()
            sequence = generate_sequence(sequence_number)
            time.sleep(1)
            send_sequence(sequence)

    else:
        print("Sequence does not match. Game over.")
        # reset sequence number to 0
        sequence_number = 0
        client.loop_stop()
        counter = 0


def generate_sequence(sequence_number):
    leds = [3, 4, 1 ,2]
    sequence = []
    #test
    for i in range(sequence_number):
        led = leds[random.randint(0, len(leds)-1)]
        sequence.append(led)
    return sequence

def send_sequence(sequence):
    for i in range(len(sequence)):
        print("SEND XX")
        client.publish(str(sequence[i]), "on")
        time.sleep(5)
        client.publish(str(sequence[i]), "off")
        time.sleep(1)

def start_memory():
    global client
    global sequence_number
    global sequence
    client.subscribe("button")
    sequence = generate_sequence(sequence_number)
    send_sequence(sequence)
    client.on_message = on_message
    client.loop_start()

#endregion 


# Start app
if __name__ == '__main__':
    app.run(debug=False)
    print("Starting project")


