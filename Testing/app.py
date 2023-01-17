import random
import threading
import time
from flask import Flask, request
import paho.mqtt.client as mqtt
import socket

app = Flask(__name__)

# GLOBAL VARIABLES
new_game = False # for memory
blink = True # for memory
haswon = False # for memory
haslost = False # for memory
game = None # for memory
start_memory_var = False # for memory
counter = 0 # for memory
sequence_number = 1 # for memory
sequence = [] # for memory



# MQQT functions 
def on_connect(client, userdata, flags, rc): # Handels connection 
    if rc==0:
        print("Connected OK Returned code=",rc)
        client.subscribe("games")
        client.subscribe("button")
    else:
        print("Bad connection Returned code=",rc)

def on_disconnect(client, userdata, rc):
        if rc != 0:
            print("Unexpected MQTT disconnection. Attempting to reconnect.")
            try:
                client.reconnect()
            except socket.error:
                print("Failed to reconnect. Exiting.")
      
def on_message(client, userdata, message): # Handels incomming messages 
    # Global variables
    global game
    global start_memory_var 
    global new_game
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

# GAMES
def generate_sequence(sequence_number): # Generate random sequence 
    leds = [0, 1, 2, 3]
    global sequence
    # Generate sequence
    for i in range(sequence_number):
        led = leds[random.randint(0, len(leds)-1)]
        sequence.append(led)
    return sequence

def send_sequence(sequence, blink=False): # Send sequence
    # Global variables

    # Send sequence
    if(blink == True):
        for item in sequence:
            # Publish message
            client.publish(str(item), str(item))
            print(f"Sending: {item}")
            # TIME SLEEP
            time.sleep(3)
    
            print("Sending: off")
            client.publish(str(item), "off")

    else:
        client.publish(str(0), str(sequence[0]))
        client.publish(str(1), str(sequence[1]))
        client.publish(str(2), str(sequence[2]))
        client.publish(str(3), str(sequence[3]))
        # TIME SLEEP
        time.sleep(3)
        for i in range(0,5):
            client.publish(str(i), "off")

def check_sequence(received_sequence): # CHeck sequence
    # Global variables
    global sequence_number
    global counter
    global sequence
    global haswon
    global haslost

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

            # Higher sequence number
            sequence_number += 1
            # Has won
            haswon = True     
    else:
        counter = 0
        # LOGIC
        haslost = True



def start_memory(): #start memory game
    # Global variables
    global start_memory_var
    global sequence_number
    global new_game
    global haswon
    global haslost
    won = [2,2,2,2] 
    lose = [0,0,0,0]

    # Start memory
    while True:
        if(start_memory_var == True):
            if(new_game == True):
                sequence = generate_sequence(sequence_number)
                send_sequence(sequence, True)
                new_game = False
            else:
                if(haswon == True):
                    # Play win sequence
                    send_sequence(won)
                    haswon = False
                    # Start new sequence
                    new_game = True
                elif(haslost == True):
                    send_sequence(lose, False)
                    haslost = False
                    print("You have lost")



# FLASK ROUTES
@app.route('/memory', methods=['GET'])
def memory():
    return "Starting memory"

# MQQT CLIENT
client = mqtt.Client()
client.connect("localhost", 1883)
client.on_connect=on_connect
client.on_disconnect = on_disconnect

# THREADS  
def subscribeing():
    client.on_message= on_message 
    client.loop_forever()

def start_threads():
    # Start subscribeing thread
    sub = threading.Thread(target=subscribeing)
    sub.start()  
    # Start memory thread
    mem = threading.Thread(target=start_memory)
    mem.start()

# APP START
if __name__ == '__main__':
    print("Starting server")
    start_threads()
    app.run(debug=False)
  