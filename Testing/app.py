import time
import threading
import random
from flask import Flask, request
import paho.mqtt.client as mqtt
import socket

app = Flask(__name__)

# GLOBAL VARIABLES
game = "none"

#global variables for redblue
red_led = -1
blue_led = -1

score_team_blue = 0
score_team_red = 0

#global variables for zen
random_led_zen = -1
random_color_zen = -1
previous_time = -1
total_score_zen = 0
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
            zen_game()
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
            analyse_buttons_zen(int(message))
        elif game == "minesweepr":
            # Do read button stuff voor minesweepr
            print("minesweeper button incomming")


def analyse_pressed_buttons_redvsblue(number):
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

def reward_response_time(response_time):
    global total_score_zen
    print(f"response time: {response_time}")
    if response_time < 1:
        print("reward 10")
        total_score_zen += 10    
    elif response_time < 3:
        print("reward 5")
        total_score_zen += 5
    elif response_time < 5:
        print("reward 3")
        total_score_zen += 3
    elif response_time < 10:
        print("reward 2")
        total_score_zen += 2
    else:
        print("reward 1")
        total_score_zen += 1
    
    client.publish("memorypoints",f"score zen:{total_score_zen} - response time:{response_time}")
def analyse_buttons_zen(number):
    global game
    global random_led_zen
    global previous_time
    print(f"button pressed: {number}; {game}")
    if number == random_led_zen:
        response_time = time.time() - previous_time
        print(f"correct {response_time}")
        reward_response_time(response_time)
        zen_game()
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

def zen_game():
    global random_led_zen
    global random_color_zen
    global previous_time
    print('zen game started')
    for i in range(0, 4):
        client.publish(str(i), "off")
    random_led_zen = random.randint(0, 3)
    random_color = random.randint(0, 3)
    client.publish(str(random_led_zen), str(random_color))
    previous_time = time.time()


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