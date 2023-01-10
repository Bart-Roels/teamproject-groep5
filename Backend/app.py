import random
import time
from flask import Flask, jsonify, request
from flask_cors import CORS

#region FLASK APP
app = Flask(__name__)
CORS(app)
endpoint = '/api/v1'


@app.route(endpoint + '/test/', methods=['GET'])
def test():
    if request.method == 'GET':
        memorryGame()
        return "Test"

#endregion

#region HARDWARE APP

from helpers.mqqt import Mqqt
# Mqqt
mqqt = Mqqt("192.168.220.1", 1883, "paaltje", "pole")
# Connect to broker
client = mqqt.connect_mqtt()

def memorryGame():


    # Number of leds
    sequence_number = 10
    # Hardware leds
    leds = [1 ,2, 3, 4]
    # Sequence
    sequence = []
    # Generate sequence
    for i in range(sequence_number):
        # Generate random led out leds list
        led = leds[random.randint(0, len(leds)-1)]
        # Add led to sequence
        sequence.append(led)
        # Return sequence
  
    # Publish sequence to broker
    for item in sequence:
        # Publish on to I topic
        mqqt.send(client, str(item), "on")
        # Delay 
        time.sleep(1)
        # Publish off to I topic
        mqqt.send(client, str(item), "off")
        # Print sequence
        print(item)

    # While loop to check if sequence is correct
    while True:
        # Subscribe to button topic
        bericht = mqqt.subscribe(client, "button")
        print(bericht)


    # Add 1 to sequence_number
    sequence_number += 1





#endregion 



# Start app
if __name__ == '__main__':
    app.run(debug=False)

