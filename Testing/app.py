import random
import time
from flask import Flask, request
import paho.mqtt.client as mqtt
import socket

app = Flask(__name__)

# GLOBAL VARIABLES
game = "none"
counter = 0 # for memory
sequence_number = 1 # for memory
sequence = [] # for memory

# Simple send message function
def send_messagetest():
    sequence = [1, 2, 3, 4]
    while sequence != []:
        client.loop_start()
        # Publish message
        client.publish(str(sequence[0]), str(sequence[0]))
        print(f"Sending: {sequence[0]}")

        time.sleep(2)

        print("Sending: off")
        client.publish(str(sequence[0]), "off")

        sequence.pop(0)
        client.loop_stop()

def send_message():
    client.loop_start()
    # Publish message
    client.publish(str(1), str(2))
    time.sleep(2)
    client.publish(str(1), "off")
    client.loop_stop()
       

# Handeling incomming messages
def on_message(client, userdata, message):
    global game
    # print topic and message
    topic = message.topic
    message = message.payload.decode("utf-8")
    print(f"Topic: {topic}, Message: {message}")
    if topic == "games":
        if message == "memory":
            game = "memory"
            print("starting memory")
            start_memory()
        elif message == "redblue":
            game = "redblue"
            print("redblue")
        elif message == "zen":
            game = "zen"
            print("zen")
        elif message == "minesweepr":
            game = "minesweepr"
            print("minesweepr")
    if topic == "buttons":
        if game == "memory":
            check_sequence(message)
        elif game == "redblue":
            # Do read button stuff voor redblue
            print("red vs blue button incomming")
        elif game == "zen":
            # Do read button stuff voor zen
            print("zen button incomming")
        elif game == "minesweepr":
            # Do read button stuff voor minesweepr
            print("minesweeper button incomming")

# GAMES
def generate_sequence(sequence_number):
    leds = [1, 2, 3, 4]
    sequence = []
    # Generate sequence
    for i in range(sequence_number):
        led = leds[random.randint(0, len(leds)-1)]
        sequence.append(led)
    return sequence

def send_sequence(sequence):
    while sequence != []:
        client.loop_start()
        # Publish message
        client.publish(str(sequence[0]), str(sequence[0]))
        print(f"Sending: {sequence[0]}")
        time.sleep(2)
        print("Sending: off")
        client.publish(str(sequence[0]), "off")
        sequence.pop(0)
        client.loop_stop()



def check_sequence(received_sequence):
    global sequence_number
    global sequence
    global counter
    # check if the received sequence matches the current sequence
    if int(received_sequence) == sequence[counter]:
        counter += 1
        # check if the entire sequence has been matched
        if counter == len(sequence):
            print(f"You have won! your points: {sequence_number}")
            counter = 0
            sequence_number += 1
            # Start new sequence
            start_memory()
    else:
        print("Sequence does not match. Game over.")
        # reset sequence number to 0
        sequence_number = 0
        counter = 0


def start_memory():
    global sequence_number
    global sequence
    sequence = generate_sequence(sequence_number)
    send_sequence(sequence)

# MQQT CLIENT       
client = mqtt.Client()
client.connect("127.0.0.1", 1883)
client.on_message= on_message 
client.subscribe("games")
client.subscribe("buttons")
client.loop_forever()

# APP START
if __name__ == '__main__':
    print("Starting server")
    app.run(debug=False)
