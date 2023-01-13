import time
import threading
import random
from flask import Flask, request
import paho.mqtt.client as mqtt
import socket

app = Flask(__name__)

# GLOBAL VARIABLES
game = "none"
red_led = -1
blue_led = -1

score_team_blue = 0
score_team_red = 0

# turn on all led's mqqt


def on_all():
    for i in range(1, 5):
        client.publish(str(i), "0")
        time.sleep(1)
        client.publish(str(i), "off")


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
            redvsblue()
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
            analyse_pressed_buttons(int(message))
        elif game == "zen":
            # Do read button stuff voor zen
            print("zen button incomming")
        elif game == "minesweepr":
            # Do read button stuff voor minesweepr
            print("minesweeper button incomming")


def analyse_pressed_buttons(number):
    global game
    global red_led
    global blue_led
    print(f"red: {red_led} blue:{blue_led}")
    print(f"button pressed: {number}; {game}")
    if number == red_led:
        print("red wins")
        global score_team_red
        score_team_red += 1
        print(f"score red: {score_team_red}")
        #client.publish("memorypoints",f"score red:{score_team_red} score blue:{score_team_blue}")
        redvsblue()

    elif number == blue_led:
        print("blue wins")
        global score_team_blue
        score_team_blue += 1
        print(f"score blue: {score_team_blue}")
        redvsblue()
    client.publish("memorypoints",f"score red:{score_team_red} score blue:{score_team_blue}")

def random_leds():
    a = random.randint(0, 3)
    b = random.randint(0, 3)
    while a == b:
        b = random.randint(0, 3)
    return [a, b]


def redvsblue():
    global red_led, blue_led
    print('red vs blue')
    for i in range(0, 4):
        client.publish(str(i), "off")
    list_leds = random_leds()
    print(list_leds)
    red_led = list_leds[0]
    blue_led = list_leds[1]
    client.publish(str(red_led), "0")
    client.publish(str(blue_led), "3")


client = mqtt.Client()
client.connect("127.0.0.1", 1883)
client.on_message = on_message
# Hier zet je MQQT CODE VOOR NAAR WEB SERVER TE STUREN
# Subscribe to the topic "game"
client.subscribe("games")
client.subscribe("buttons")
client.loop_forever()

while True:
    print("Starting server")
    app.run(debug=False)
