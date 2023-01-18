import random
import threading
import time
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

# global variables for zen
start_zen_game = False
new_zen_game = False

random_led_zen = -1
random_color_zen = -1
previous_time = -1
total_score_zen = 0

# turn on all led's mqqt


def on_all():
    for i in range(1, 5):
        client.publish(str(i), "1")
        time.sleep(1)
        client.publish(str(i), "off")


# def zen_game():
#     client.publish("1", "1")

# MQQT functions


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
    global new_zen_game
    global start_zen_game
    global total_score_zen
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
            total_score_zen = 0
            start_zen_game = True
            new_zen_game = True
            #zen_game()
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

        elif game == "zen":
            # Do read button stuff voor zen
            print("zen button incomming")
            analyse_buttons_zen(int(message))
        elif game == "minesweepr":
            # Do read button stuff voor minesweepr
            print("minesweeper button incomming")
    if topic == "stop":
        if game == "memory":
            print("stop memory")
        elif game == "redblue":
            print("stop redblue")
        elif game == "zen":
            print("stop zen")
            start_zen_game = False
            new_zen_game = False
            game = None
        elif game == "minesweepr":
            print("stop minesweepr")

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

    client.publish(
        "memorypoints", f"score zen:{total_score_zen} - response time:{response_time}")


def analyse_buttons_zen(number):
    global game
    global random_led_zen
    global previous_time
    global new_zen_game
    print(f"button pressed: {number}; {game}")
    if number == random_led_zen:
        response_time = time.time() - previous_time
        print(f"correct {response_time}")
        reward_response_time(response_time)
        new_zen_game = True


def zen_game():
    global random_led_zen
    global random_color_zen
    global previous_time
    global start_zen_game
    global new_zen_game
    while True:
        if(start_zen_game):
            if(new_zen_game):
                for i in range(0, 4):
                    client.publish(str(i), "off")
                random_led_zen = random.randint(0, 3)
                random_color_zen = random.randint(0, 3)
                print(f"random led: {random_led_zen} kleur: {random_color_zen}")
                client.publish(str(random_led_zen), str(random_color_zen))
                previous_time = time.time()
                new_zen_game = False



# MQQT CLIENT
client = mqtt.Client()
client.connect("127.0.0.1", 1883)
client.on_connect = on_connect
client.on_disconnect = on_disconnect

# THREADS


def subscribing():
    client.on_message = on_message
    client.loop_forever()


def start_threads():
    # Start subscribeing thread
    sub = threading.Thread(target=subscribing)
    sub.start()
    # Start memory thread
    mem = threading.Thread(target=zen_game)
    mem.start()


# APP START
if __name__ == '__main__':
    print("Starting server")
    start_threads()
    app.run(debug=False)
