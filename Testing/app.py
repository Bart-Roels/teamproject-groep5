import random
import time
from flask import Flask, request
from flask_mqtt import Mqtt
from flask_socketio import SocketIO

# GLOBAL VARIABLES
game = "none"
bussy = False
counter = 0 # for memory
sequence_number = 1 # for memory
sequence = [] # for memory
won = [2,2,2,2] # for memory 
lose = [0,0,0,0]

# MQQT CLIENT  
app = Flask(__name__)
app.config['SECRET'] = 'my secret key'   
app.config['MQTT_BROKER_URL'] = '127.0.0.1'
app.config['MQTT_BROKER_PORT'] = 1883
app.config['MQTT_REFRESH_TIME'] = 1.0  # refresh time in seconds
mqtt = Mqtt(app)

# Send simple message
def send_demo():
    sequence = [0,1,2,3]
    for item in sequence:
        mqtt.publish(str(item), "1")
        print(f"Sending: {item}")
        time.sleep(1)
        mqtt.publish(str(item), "off")
        print(f"Sending: off")



@mqtt.on_message()
def handle_mqtt_message(client, userdata, message):
    global game
    # print topic and message
    topic = message.topic
    message = message.payload.decode("utf-8")
    print(f"Topic: {topic}, Message: {message}")
    if topic == "games":
        if message == "memory":
            game = "memory"
            print("starting memory")
            send_demo()
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

@mqtt.on_connect()
def handle_connect(client, userdata, flags, rc):
    print("Connected with result code " + str(rc))
    mqtt.subscribe("buttons")
    mqtt.subscribe("games")


# GAMES
def generate_sequence(sequence_number):
    leds = [0, 1, 2 , 3]
    global sequence
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
            mqtt.publish(str(item), "1")
            print(f"Sending: {item}")

            # Wait 2 seconds before sending next message mqqt flask
            time.sleep(2)

            print("Sending: off")
            mqtt.publish(str(item), "off")
    else:
        mqtt.publish(str(0), str(sequence[0]))
        mqtt.publish(str(1), str(sequence[1]))
        mqtt.publish(str(2), str(sequence[2]))
        mqtt.publish(str(3), str(sequence[3]))
        time.sleep(1)
        for i in range(0,5):
            mqtt.publish(str(i), "off")

    bussy = False

def check_sequence(received_sequence):
    # Replay sequence
    mqtt.publish(str(received_sequence), str(received_sequence))
    time.sleep(0.5)
    mqtt.publish(str(received_sequence), "off")
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
            mqtt.publish("memorypoints", str(sequence_number))
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
    # Global variables
    global bussy 
    global sequence_number
    # Start game
    bussy = True
    sequence = generate_sequence(sequence_number)
    send_sequence(sequence=sequence, blink=True)

# Flask route
@app.route('/')
def index():
    send_demo()
    return "Hello World"


# APP START
if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0')

