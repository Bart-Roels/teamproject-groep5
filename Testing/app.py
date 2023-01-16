import time, random
from flask import Flask, request
import paho.mqtt.client as mqtt
import socket

app = Flask(__name__)

# GLOBAL VARIABLES
game = "none"
button1 = "off"
button2 = "off"
button3 = "off"
button4 = "off"

#global variables for minesweeper

list_minesweeper = []
index_minesweeper = 0
score_minesweeper = 0

# turn on all led's mqqt


def on_all():
    for i in range(1, 5):
        client.publish(str(i), "1")
        time.sleep(1)
        client.publish(str(i), "off")

# Minesweeper


def start_minesweepr():
    print('start minesweeper')
    global list_minesweeper
    global index_minesweeper
    for i in range(4):
        client.publish(str(i), "off")
    list_minesweeper = random.sample(range(4),4)
    show_sequence_minesweeper(1)
    print(list_minesweeper)

def analyse_buttons_minesweeper(number):
    global game
    global list_minesweeper
    global index_minesweeper
    global score_minesweeper
    print(f"button pressed: {number}; {game}")
    if number == list_minesweeper[index_minesweeper]:
        print('correct')
        index_minesweeper += 1
        if index_minesweeper == 4:
            print('game won')
            score_minesweeper += 1

            index_minesweeper = 0
            start_minesweepr()
        show_sequence_minesweeper(index_minesweeper + 1)
    else:
        print('game over')
        index_minesweeper = 0
        start_minesweepr()
def show_sequence_minesweeper(number):
    print('show sequence')
    global list_minesweeper
    global index_minesweeper
    for i in range(number):
        client.publish(str(list_minesweeper[i]), str(list_minesweeper[i]))
        
# MQQT CLIENT


def on_message(client, userdata, message):
    global game
    # print topic and message
    topic = message.topic
    message = message.payload.decode("utf-8")
    print(f"Topic: {topic}, Message: {message}")
    if topic == "games":
        if message == "memory":
            game = "memory"
            print("memory")
        elif message == "redblue":
            game = "redblue"
            print("redblue")
        elif message == "zen":
            game = "zen"
            print("zen")
        elif message == "minesweepr":
            game = "minesweepr"
            print("minesweepr")
            start_minesweepr()
    if topic == "buttons":
        if game == "memory":
            # Do read button stuff voor memory
            print("memory button incomming")
        elif game == "redblue":
            # Do read button stuff voor redblue
            print("red vs blue button incomming")
        elif game == "zen":
            # Do read button stuff voor zen
            print("zen button incomming")
        elif game == "minesweepr":
            # Do read button stuff voor minesweepr
            print("minesweeper button incomming")
            analyse_buttons_minesweeper(int(message))

client = mqtt.Client()
client.connect("127.0.0.1", 1883)
client.on_message = on_message
# Hier zet je MQQT CODE VOOR NAAR WEB SERVER TE STUREN
# Subscribe to the topic "game"
client.subscribe("games")
client.subscribe("buttons")
client.loop_forever()

if __name__ == '__main__':
    print("Starting server")
    app.run(debug=False)
