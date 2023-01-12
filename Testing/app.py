import time
from flask import Flask, request
import paho.mqtt.client as mqtt
import socket

app = Flask(__name__)

# GLOBAL VARIABLES
sequence = []



def memory_game():
    global sequence
    print("start memory game")
    # generate random sequence
    



# FLASK route to start the game


# MQQT CLIENT
def on_message(client, userdata, message):
    # print topic and message
    topic = message.topic
    message = message.payload.decode("utf-8")
    print(f"Topic: {topic}, Message: {message}")
    if topic == "game":
        if message == "memory":
            memory_game()
        elif message == "redblue":
            print("redblue")
        elif message == "zen":
            print("zen")
        elif message == "minesweepr":
            print("minesweepr")
        
    

client = mqtt.Client()
client.connect("127.0.0.1", 1883)
client.on_message= on_message 
# Hier zet je MQQT CODE VOOR NAAR WEB SERVER TE STUREN 
# Subscribe to the topic "game"
client.subscribe("games")
client.subscribe("buttons")
client.loop_forever()


# turn on all led's mqqt
def on_all():
    for i in range(1, 5):
        client.publish(str(i), "on")
        time.sleep(1)
        client.publish(str(i), "off")

if __name__ == '__main__':
    print("Starting server")
    app.run(debug=True)
