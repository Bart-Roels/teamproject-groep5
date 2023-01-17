import time
import threading
import random
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

# global variables for minesweeper

busy_minesweeper = False

list_minesweeper = []
index_minesweeper = 0
score_minesweeper = 0
start_minesweeper = False
hint_send = False
new_game_minesweeper = False
haswon = False
haslost = False
level_minesweeper = 0

# MQTT functions


def on_connect(client, userdata, flags, rc):  # Handels connection
    if rc == 0:
        print("Connected OK Returned code=", rc)
        client.subscribe("games")
        client.subscribe("buttons")
    else:
        print("Bad connection Returned code=", rc)


def on_disconnect(client, userdata, rc):
    if rc != 0:
        print("Unexpected MQTT disconnection. Attempting to reconnect.")
        try:
            client.reconnect()
        except socket.error:
            print("Failed to reconnect. Exiting.")


def on_message(client, userdata, message):
    global game
    global start_minesweeper
    global new_game_minesweeper
    global level_minesweeper
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
            print('1: easy level, 2: medium level, 3: hard level')
            level_minesweeper = int(input('choose level: '))
            print(f'chosen level {level_minesweeper}')
            start_minesweeper = True
            new_game_minesweeper = True
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
            analyse_buttons_minesweeper(message)

# Minesweeper


def analyse_buttons_minesweeper(message):
    global game
    global index_minesweeper
    global score_minesweeper
    global haswon
    global haslost
    global busy_minesweeper
    if not busy_minesweeper:
        print(f'button {message} pressed; game: {game}')
        print(f'controle{message == str(list_minesweeper[index_minesweeper])}')
        if message == str(list_minesweeper[index_minesweeper]):
            print('correct')
            client.publish(str(list_minesweeper[index_minesweeper]), "2")
            index_minesweeper += 1
            print(f'score: {index_minesweeper}')
            if index_minesweeper == 4:
                print('game won')
                score_minesweeper += 1
                client.publish('memorypoints', str(score_minesweeper))
                haswon = True
        else:
            print('wrong')
            if level_minesweeper == 2 or level_minesweeper == 3:
                print('game lost')
                haslost = True


def send_hint_function():
    global list_minesweeper
    global index_minesweeper
    global level_minesweeper
    global busy_minesweeper
    busy_minesweeper = True
    client.publish(str(list_minesweeper[0]), "1")
    time.sleep(1)
    client.publish(str(list_minesweeper[0]), "off")
    busy_minesweeper = False


def sequence_off():
    global busy_minesweeper
    busy_minesweeper = True
    print('sequence off')
    for i in range(4):
        client.publish(str(i), "off")
    time.sleep(1)
    busy_minesweeper = False


def sequence_mistake():
    global busy_minesweeper
    busy_minesweeper = True
    print('mistake')
    for i in range(4):
        client.publish(str(i), "0")
    time.sleep(1)
    for i in range(4):
        client.publish(str(i), "off")
    busy_minesweeper = False


def minesweeper():
    print('start minesweeper')
    global list_minesweeper
    global index_minesweeper
    global new_game_minesweeper
    global start_minesweeper
    global haswon
    global haslost
    global level_minesweeper
    while True:
        if (start_minesweeper):
            if (new_game_minesweeper):
                list_minesweeper = random.sample(range(4), 4)

                index_minesweeper = 0
                print(f'level minesweeper: {level_minesweeper}')
                if level_minesweeper == 1 or level_minesweeper == 2:
                    send_hint_function()

                new_game_minesweeper = False
            else:
                if (haswon):
                    print('Game has been won')
                    sequence_off()
                    haswon = False
                    new_game_minesweeper = True
                elif (haslost):
                    print('Game has been lost')
                    sequence_mistake()
                    if level_minesweeper == 2:
                        send_hint_function()
                    index_minesweeper = 0
                    haslost = False


# MQTT client
client = mqtt.Client()
client.connect("127.0.0.1", 1883)
client.on_connect = on_connect
client.on_disconnect = on_disconnect


def subscribing():
    client.on_message = on_message
    client.loop_forever()


def start_threads():
    # Start subscribing thread
    print("Starting subscribing thread")
    sub = threading.Thread(target=subscribing)
    sub.start()
    mine = threading.Thread(target=minesweeper)
    mine.start()


# APP START
if __name__ == '__main__':
    print("Starting server")
    start_threads()
    app.run(debug=False)
