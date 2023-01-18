import random
import threading
import time
import logging
from flask import Flask, request
import paho.mqtt.client as mqtt
import socket

logger = logging.getLogger(__name__)
logger.setLevel(logging.ERROR) # or logging.DEBUG or logging.WARNING, etc.

# create a file handler
handler = logging.FileHandler("app.log")
handler.setLevel(logging.ERROR)

# create a logging format
formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
handler.setFormatter(formatter)

# add the handlers to the logger
logger.addHandler(handler)

app = Flask(__name__)

# GLOBAL VARIABLES
game = "none"

# global variables for redblue
red_led = -1
blue_led = -1

score_team_blue = 0
score_team_red = 0

start_redvsblue_game = False
new_game_redvsblue = False


# turn on all led's mqqt


def on_all():
    for i in range(1, 5):
        client.publish(str(i), "0")
        time.sleep(1)
        client.publish(str(i), "off")


# MQQT functions
def on_connect(client, userdata, flags, rc):  # Handels connection
    try:
        if rc == 0:
            print("Connected OK Returned code=", rc)
            client.subscribe("games")
            client.subscribe("buttons")
            client.subscribe("stop")
            client.subscribe("pauze")
        else:
            print("Bad connection Returned code=", rc)
    except socket.error as e:
        logger.error(e)

def on_disconnect(client, userdata, rc):
    try:
        if rc != 0:
            print("Unexpected MQTT disconnection. Attempting to reconnect.")
            try:
                client.reconnect()
            except socket.error:
                print("Failed to reconnect. Exiting.")
    except socket.error as e:
        logger.error(e)

def on_message(client, userdata, message):
    try:
        global game
        global start_redvsblue_game
        global new_game_redvsblue
        global score_team_blue
        global score_team_red
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
                score_team_blue = 0
                score_team_red = 0
                start_redvsblue_game = True
                new_game_redvsblue = True
                # redvsblue()
            elif message == "zen":
                game = "zen"
                print("zen")
            elif message == "minesweepr":
                game = "minesweepr"
                print("minesweepr")
        if topic == "buttons":
            if game == "memory":
                # Do read button stuff voor memory
                print("memory button incomming")
            elif game == "redblue":
                # Do read button stuff voor redblue
                print("red vs blue button incomming")
                analyse_pressed_buttons_redvsblue(int(message))
            elif game == "zen":
                # Do read button stuff voor zen
                print("zen button incomming")
            elif game == "minesweepr":
                # Do read button stuff voor minesweepr
                print("minesweeper button incomming")
        if topic == "stop":
            if game == "memory":
                print("stop memory")
            elif game == "redblue":
                print("stop redblue")
                start_redvsblue_game = False
                new_game_redvsblue = False
                game = None

            elif game == "zen":
                print("stop zen")
            elif game == "minesweepr":
                print("stop minesweepr")
        if topic == "pauze":
            if game == "memory":
                print("pauze memory")
            elif game == "redblue":
                print("pauze redblue")
            elif game == "zen":
                print("pauze zen")
            elif game == "minesweepr":
                print("pauze minesweepr")
        if topic == "unpauze":
            if game == "memory":
                print("unpauze memory")
            elif game == "redblue":
                print("unpauze redblue")
            elif game == "zen":
                print("unpauze zen")
            elif game == "minesweepr":
                print("unpauze minesweepr")
    except socket.error as e:
        logger.error(e)
        
def analyse_pressed_buttons_redvsblue(number):
    try:
        global game
        global start_redvsblue_game
        global new_game_redvsblue
        print(f"red: {red_led} blue:{blue_led}")
        print(f"button pressed: {number}; {game}")
        if number == red_led:
            print("red wins")
            global score_team_red
            score_team_red += 1
            print(f"score red: {score_team_red}")
            new_game_redvsblue = True

        elif number == blue_led:
            print("blue wins")
            global score_team_blue
            score_team_blue += 1
            print(f"score blue: {score_team_blue}")
            new_game_redvsblue = True

        client.publish(
            "memorypoints", f"score red:{score_team_red} score blue:{score_team_blue}")
    except socket.error as e:
        logger.error(e)

def random_leds():
    try:
        a = random.randint(0, 3)
        b = random.randint(0, 3)
        while a == b:
            b = random.randint(0, 3)
        return [a, b]
    except Exception as e:
        logger.error(e)

def redvsblue():
    try:
        global red_led, blue_led
        global start_redvsblue_game
        global new_game_redvsblue
        print('red vs blue')
        while True:
            if (start_redvsblue_game):
                if (new_game_redvsblue):
                    print('new game')
                    for i in range(0, 4):
                        client.publish(str(i), "off")
                    list_leds = random_leds()
                    print(list_leds)
                    red_led = list_leds[0]
                    blue_led = list_leds[1]
                    client.publish(str(red_led), "0")
                    client.publish(str(blue_led), "3")
                    new_game_redvsblue = False
    except Exception as e:
        logger.error(e)


# MQQT CLIENT
client = mqtt.Client()
client.connect("127.0.0.1", 1883)
client.on_connect = on_connect
client.on_disconnect = on_disconnect

# THREADS


def subscribing():
    try:
        client.on_message = on_message
        client.loop_forever()
    except Exception as e:
        logger.error(e)

def start_threads():
    try:
        # Start subscribeing thread
        sub = threading.Thread(target=subscribing)
        sub.start()
        # Start memory thread
        mem = threading.Thread(target=redvsblue)
        mem.start()
    except Exception as e:
        logger.error(e)

# APP START
if __name__ == '__main__':
    print("Starting server")
    start_threads()
    app.run(debug=False)
