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
button_value = None
sequence_number = 1

#region FLASK APP
app = Flask(__name__)
CORS(app)
endpoint = '/api/v1'


@app.route(endpoint + '/test/', methods=['POST'])
def test():
    global sequence_number
    if request.method == 'POST':
        sequence_number = 1
        memory_game()
        return 200

#endregion

#region HARDWARE APP



# MEMORY GAME


def sendSequence(sequence):
    # For evry item in sequence send to arduino
    for i in sequence:
        client.publish(str(i), "on")
        time.sleep(1)
        client.publish(str(i), "off")

def memory_game():
    global sequence_number
    global button_value
    print("Welcome to the memory game!")
    # random sequence of numbers of 4 digits
    sequence = random.sample(range(1, 5), sequence_number)
    # Send sequence
    sendSequence(sequence)
    print("The sequence is: ", sequence)
    # start_time = time.time()
    # print(start_time)
    user_sequence = []
    while True:
        # output = input("Enter a number: ")
        if(button_value != None):
            output = button_value
            user_sequence.append(int(output))
            button_value = None
        # check if the user sequence is correct
        if user_sequence == sequence:
            print("You won!")
            sequence_number += 1
            break
        for i in range(len(user_sequence)):
            if user_sequence[i] != sequence[i]:
                user_sequence = []
                print("You lost!")
                sequence_number = 1
                print("The sequence is: ", sequence)
        # if time.time() - start_time > 10:
        #     print("You lost!")
        #     break


# READ BUTTONS
def on_message(client, userdata, message):
    global button_value
    button_value = message.payload.decode("utf-8")
    print("Button value: ", button_value)

def buttons():
    while True:
        client.on_message=on_message        
    #attach function to callback


#endregion 


# Start app
if __name__ == '__main__':
    app.run(debug=False)
    print("Starting project")

