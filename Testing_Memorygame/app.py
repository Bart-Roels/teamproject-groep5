import random
import threading
import time
from flask import Flask, request
import paho.mqtt.client as mqtt
import socket
import logging

# Set up app
app = Flask(__name__)
logging.basicConfig(filename='error.log', level=logging.ERROR)

# region GLOBAL VARIABLES
bussy = False  # for memory
new_game = False  # for memory
blink = True  # for memory
haswon = False  # for memory
haslost = False  # for memory
game = None  # for memory
start_memory_var = False  # for memory
counter = 0  # for memory
sequence_number = 1  # for memory
sequence = []  # for memory
pauze = False
unpauze = False
# endregion

# region MQTT FUNCTIONS


def on_connect(client, userdata, flags, rc):  # Handels connection
    try:
        if rc == 0:
            print("Connected OK Returned code=", rc)
            client.subscribe("games")
            client.subscribe("button")
            client.subscribe("stop")
            client.subscribe("pauze")
            client.subscribe("unpauze")
        else:
            raise Exception("Bad connection Returned code=", rc)
    except Exception as e:
        print(e)
        logging.error(e)


def on_disconnect(client, userdata, rc):  # Handels disconnection
    try:
        if rc != 0:
            raise Exception(
                "Unexpected MQTT disconnection. Attempting to reconnect.")
    except Exception as e:
        print(e)
        logging.error(e)
    try:
        client.reconnect()
    except socket.error:
        raise Exception("Failed to reconnect. Exiting.")


def on_message(client, userdata, message):  # Handels incomming messages
    try:
        # Global variables
        global game
        global start_memory_var
        global new_game
        global sequence_number
        global sequence
        global pauze
        global unpauze
        global bussy
        # print topic and message
        topic = message.topic
        message = message.payload.decode("utf-8")
        print(f"Topic: {topic}, Message: {message}")
        # Logic
        if topic == "games":
            if message == "memory":
                print("starting memory")
                game = "memory"
                # Start memory
                sequence = []
                sequence_number = 1
                start_memory_var = True
                new_game = True
            elif message == "redblue":
                game = "redblue"
                print("redblue")
            elif message == "zen":
                game = "zen"
                print("zen")
            elif message == "minesweepr":
                game = "minesweepr"
                print("minesweepr")
        if topic == "button":
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
        if topic == "stop":
            if game == "memory":
                start_memory_var = False
                new_game = False
                sequence_number = 1
                game = None
                print("stop memory")
            elif game == "redblue":
                print("stop redblue")
            elif game == "zen":
                print("stop zen")
            elif game == "minesweepr":
                print("stop minesweepr")
        if topic == "pauze":
            if game == "memory":
                print("pauze memory")
                for i in range(4):
                    client.publish(str(i), 'off')
                pauze = True
                unpauze = False
                start_memory_var = False
                new_game = False
                bussy = False
                client.publish("memorypoints", "NOW - PAUSE")
            elif game == "redblue":
                print("unpauze redblue")
            elif game == "zen":
                print("unpauze zen")
            elif game == "minesweepr":
                print("unpauze minesweepr")
        if topic == "unpauze":
            if game == "memory":
                print("unpauze memory")
                pauze = False
                unpauze = True
                start_memory_var = True
            elif game == "redblue":
                print("unpauze redblue")
            elif game == "zen":
                print("unpauze zen")
            elif game == "minesweepr":
                print("unpauze minesweepr")
    except Exception as e:
        print(e)
        logging.error(e)
# endregion

# region GAMES

# region MEMORY


def generate_sequence(sequence_number):
    try:
        leds = [0, 1, 2]
        global sequence
        # Generate sequence
        print(f'Generating sequence of {sequence_number}')
        for i in range(sequence_number):
            led = leds[random.randint(0, len(leds)-1)]
            sequence.append(led)
        return sequence
    except Exception as e:
        print(e)
        logging.error(e)


def send_sequence(sequence, blink=False):  # Send sequence
    try:
        # Global variables
        global bussy
        # Set bussy
        bussy = True
        # Send sequence

        if(bussy):
            if (blink == True):
                for item in sequence:
                    # Publish message
                    client.publish(str(item), str(item))
                    print(f"Sending: {item}")
                    # TIME SLEEP
                    time.sleep(2)
                    print("Sending: off")
                    client.publish(str(item), "off")
            else:
                client.publish(str(0), str(sequence[0]))
                client.publish(str(1), str(sequence[1]))
                client.publish(str(2), str(sequence[2]))
                client.publish(str(3), str(sequence[3]))
                # TIME SLEEP
                time.sleep(3)
                for i in range(0, 5):
                    client.publish(str(i), "off")
        # Set bussy
        bussy = False
    except Exception as e:
        print(e)  # to print the error
        logging.error(e)


def check_sequence(received_sequence):  # Check sequence
    try:
        # Global variables
        global sequence_number
        global counter
        global sequence
        global haswon
        global haslost
        global bussy
        global pauze
        # Check if not bussy
        if not bussy or  pauze or not haswon or not haslost:
            # check if the received sequence matches the current sequence
            if int(received_sequence) == sequence[counter]:
                counter += 1
                # check if the entire sequence has been matched
                if counter == len(sequence):
                    # Resent counter en sequence
                    counter = 0
                    sequence = []
                    # You have won
                    print(f"You have won! your points: {sequence_number}")
                    client.publish("memorypoints", str(sequence_number))
                    # Higher sequence number
                    sequence_number += 1
                    # Has won
                    haswon = True
            else:
                counter = 0
                # LOGIC
                haslost = True
    except Exception as e:
        print(e)  # to print the error
        logging.error(e)


def start_memory():  # start memory game
    try:
        # Global variables
        global start_memory_var
        global sequence_number
        global new_game
        global haswon
        global haslost
        global pauze
        global sequence
        global counter
        global unpauze
        won = [2, 2, 2, 2]
        lose = [0, 0, 0, 0]

        # Start memory
        while True:
            if start_memory_var:
                if new_game and not pauze:
                    sequence = generate_sequence(sequence_number)
                    send_sequence(sequence, True)
                    new_game = False
                elif pauze:  
                    print(f'pauze {pauze}, counter: {counter}, sequence: {sequence}')
                    counter = 0
                    new_game = False
                    haslost= False
                elif unpauze:
                    print(f'unpauze {unpauze}, counter: {counter}, sequence: {sequence}')
                    if len(sequence) > 0:
                        send_sequence(sequence, True)
                    else:
                        sequence = generate_sequence(sequence_number)
                        send_sequence(sequence, True)
                    unpauze = False
                    new_game = False
                elif haswon:
                    # Play win sequence
                    send_sequence(won)
                    haswon = False
                    # Start new sequence
                    new_game = True
                elif haslost:
                    send_sequence(lose, False)
                    # Replay sequence
                    send_sequence(sequence, True)
                    haslost = False
                    print("You have lost replaying sequence")
    except Exception as e:
        print(e)  # to print the error
        logging.error(e)
# endregion

# region REDBLUE
# endregion

# region ZEN
# endregion

# region MINESWEEPER
# endregion

# endregion

# region MQTT


client = mqtt.Client()
# client.connect("192.168.220.1", 1883)
client.connect("localhost", 1883)
client.on_connect = on_connect
client.on_disconnect = on_disconnect

# endregion

# region FLASK ROUTES
# endregion

# region THREADS


def subscribeing():
    client.on_message = on_message
    client.loop_forever()


def start_threads():
    # Start subscribeing thread
    sub = threading.Thread(target=subscribeing)
    sub.start()
    # Start memory thread
    mem = threading.Thread(target=start_memory)
    mem.start()
# endregion


# APP START
if __name__ == '__main__':
    print("Starting server")
    start_threads()
    app.run(debug=False)
