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

random_led_zen = -1
random_color_zen = -1

list_minesweeper = []

# turn on all led's mqqt
def on_all():
    for i in range(1, 5):
        client.publish(str(i), "1")
        time.sleep(1)
        client.publish(str(i), "off")

# Minesweeper
def start_minesweepr():
    global list_minesweeper
    global random_led_zen
    if random_led_zen not in list_minesweeper:
        random_led_zen = random.randint(1, 4)
        list_minesweeper.append(random_led_zen)
        client.publish(str(random_led_zen), str(random_led_zen))
        print(list_minesweeper)
    else:
        random_led_zen = random.randint(1, 4)

def analyse_buttons_minesweeper(number):
    global game
    global random_led_zen
    global list_minesweeper
    print(f"button pressed: {number}; {game}")
    if number == random_led_zen and random_led_zen not in list_minesweeper:
        start_minesweepr()
    else:
        print("game over")



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
client.on_message= on_message 
# Hier zet je MQQT CODE VOOR NAAR WEB SERVER TE STUREN 
# Subscribe to the topic "game"
client.subscribe("games")
client.subscribe("buttons")
client.loop_forever()

if __name__ == '__main__':
    print("Starting server")
    app.run(debug=False)
