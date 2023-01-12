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
sequence_number = 2
sequence = []

def test():
    global sequence_number
    if request.method == 'POST':
        sequence_number = 1
        start_memory()
        return "oke",200


#region HARDWARE APP



# MEMORY GAME

def on_message(client, userdata, message):
    global counter
    global sequence_number
    global sequence

    # decode the message
    received_sequence = message.payload.decode("utf-8")
    print(received_sequence)

    

def send_sequence(sequence):
    for i in range(len(sequence)):
        print("SEND {} on".format(str(sequence[i])))
        client.publish(str(sequence[i]), "on")
        client.loop_read()
        time.sleep(1)
        client.loop_read()

        # wait for message received

        print("SEND {} off".format(str(sequence[i])))
        client.publish(str(sequence[i]), "off")
        client.loop_read()
        time.sleep(1)
        client.loop_read()


def start_memory():
    global client
    global sequence_number
    global sequence
    client.subscribe("button")
    # sequence = generate_sequence(sequence_number)
    # send_sequence(sequence)
    client.on_message = on_message
    t = threading.Thread(target=sss)
    t.start()
    client.loop_forever()
def sss():
    send_sequence([1,2,3,4])

#endregion 


# Start app
if __name__ == '__main__':
    # app.run(debug=False)2
    # print("Starting project")
    start_memory()


