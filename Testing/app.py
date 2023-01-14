import random
import time
from flask import Flask, request
import paho.mqtt.client as mqtt
import socket

app = Flask(__name__)

# GLOBAL VARIABLES
game = "none"
bussy = False
counter = 0 # for memory
sequence_number = 1 # for memory
sequence = [] # for memory
won = [2,2,2,2] # for memory 
lose = [0,0,0,0]

# MQQT CLIENT       


   
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
            if bussy == False:
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

def on_connect(client, userdata, flags, rc):
    print("Connected with result code " + str(rc))
    client.subscribe("buttons")
    client.subscribe("games")

# GAMES
def generate_sequence(sequence_number):
    # 2, 3
    leds = [0, 1, 2 , 3]
    global sequenc
    # Generate sequence
    for i in range(sequence_number):
        led = leds[random.randint(0, len(leds)-1)]
        sequence.append(led)
    return sequence

def send_sequence(sequence, blink = False):
    global bussy

    if(blink == True):
        for item in sequence:
            # Publish message
            client.publish(str(item), str(item))
            print(f"Sending: {item}")

            client.loop()
            time.sleep(2)

            print("Sending: off")
            client.publish(str(item), "off")
    else:
        client.publish(str(0), str(sequence[0]))
        client.publish(str(1), str(sequence[1]))
        client.publish(str(2), str(sequence[2]))
        client.publish(str(3), str(sequence[3]))
        client.loop()
        time.sleep(2)
        for i in range(0,5):
            client.publish(str(i), "off")

    bussy = False

def check_sequence(received_sequence):
    # Replay sequence
    client.publish(str(received_sequence), str(received_sequence))
    client.loop()
    time.sleep(0.5)
    client.publish(str(received_sequence), "off")
    client.loop()
    time.sleep(0.5)

    # Global variables
    global sequence_number
    global sequence
    global counter
    global won
    global lose

    print(int(received_sequence) == sequence[counter])
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
            send_sequence(won, False)
            # Start new game en higher sequence 
            sequence_number += 1
            # Start new game
            start_memory()
    else:
        print("Sequence does not match. Game over.")
        counter = 0
        send_sequence(lose, False)
        send_sequence(sequence=sequence, blink=True)

def start_memory():
    global bussy 
    global sequence_number
    global sequence
    bussy = True
    sequence = generate_sequence(sequence_number)
    send_sequence(sequence, True)



# FLASK ROUTES
@app.route('/test', methods=['GET'])
def test():
    return "test"

# APP START
if __name__ == '__main__':
    client = mqtt.Client()
    #client.username_pw_set(username, password)
    client.on_connect = on_connect
    client.on_message = on_message
    client.connect("127.0.0.1", 1883)
    client.loop_forever()
    app.run(host='0.0.0.0', debug=True, port=5000)




