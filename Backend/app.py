import random
import threading
import time
from flask import Flask, request
import paho.mqtt.client as mqtt
import socket
import logging

#region SETUP
# Set up app 
app = Flask(__name__)
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
#endregion

#region GLOBAL VARIABLES
game = None 

#region memory variables
bussy = False # for memory
new_game = False # for memory
blink = True # for memory
haswon = False # for memory
haslost = False # for memory
start_memory_var = False # for memory
counter = 0 # for memory
sequence_number = 1 # for memory
sequence = [] # for memory
#endregion

#region redblue variables
red_led = -1
blue_led = -1
score_team_blue = 0
score_team_red = 0
start_redvsblue_game = False
new_game_redvsblue = False
#endregion

#region zen variables
start_zen_game = False
new_zen_game = False

random_led_zen = -1
random_color_zen = -1
previous_time = -1
total_score_zen = 0
#endregion

#region minesweepr variables
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
semaphore = threading.Semaphore(1)
#endregion

#endregion

#region MQTT FUNCTIONS
def on_connect(client, userdata, flags, rc): # Handels connection
    try:
        if rc==0:
            print("Connected OK Returned code=",rc)
            client.subscribe("games")
            client.subscribe("button")
            client.subscribe("stop")
            client.subscribe("pauze")
        else:
            raise Exception("Bad connection Returned code=",rc)
    except Exception as e:
        print(e)
        logger.error(e)

def on_disconnect(client, userdata, rc): # Handels disconnection
    try:
        if rc != 0:
            raise Exception("Unexpected MQTT disconnection. Attempting to reconnect.")
    except Exception as e:
        print(e)
        logger.error(e)
    try:
        client.reconnect()
    except socket.error:
        raise Exception("Failed to reconnect. Exiting.")
      
def on_message(client, userdata, message): # Handels incomming messages
    try:
        # Global variables memory
        global game
        global start_memory_var 
        global new_game
        global sequence_number
        global sequence

        # Global variables redblue
        global start_redvsblue_game
        global new_game_redvsblue
        global score_team_blue
        global score_team_red

        # Global variables zen
        global new_zen_game
        global start_zen_game
        global total_score_zen

        # Global variables minesweepr
        global start_minesweeper
        global new_game_minesweeper
        global level_minesweeper
        global score_minesweeper

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
                sequence = []
                sequence_number = 1
                start_memory_var = True
                new_game = True
            elif message == "redblue":
                game = "redblue"
                print("redblue")
                score_team_blue = 0
                score_team_red = 0
                start_redvsblue_game = True
                new_game_redvsblue = True
            elif message == "zen":
                game = "zen"
                print("zen")
                total_score_zen = 0
                start_zen_game = True
                new_zen_game = True
                # zen_game()
            elif message == "minesweepr":
                game = "minesweepr"
                print("minesweepr")
                print('1: easy level, 2: medium level, 3: hard level')
                level_minesweeper = int(input('choose level: '))
                print(f'chosen level {level_minesweeper}')
                score_minesweeper = 0
                start_minesweeper = True
                new_game_minesweeper = True
        if topic == "button":
            if game == "memory":
                check_sequence(message)
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
                analyse_buttons_minesweeper(message)
        if topic == "stop":
            if game == "memory":
                start_memory_var = False
                new_game = False
                sequence_number = 1
                game = None
                print("stop memory")
            elif game == "redblue":
                print("stop redblue")
                start_redvsblue_game = False
                new_game_redvsblue = False
                game = None
            elif game == "zen":
                print("stop zen")
                start_zen_game = False
                new_zen_game = False
                game = None
            elif game == "minesweepr":
                start_minesweeper = False
                new_game_minesweeper = False
                print("stop minesweepr")
    except Exception as e:
        print(e)
        logger.error(e)
#endregion

#region GAMES

def start_memory(): #start memory game
    semaphore.acquire()
    try:
        # Global variables memory
        global start_memory_var
        global sequence_number
        global new_game
        global haswon
        global haslost
        won = [2,2,2,2] 
        lose = [0,0,0,0]

        # Global variables redblue
        global red_led, blue_led
        global start_redvsblue_game
        global new_game_redvsblue

        # Global variables zen
        global random_led_zen
        global random_color_zen
        global previous_time
        global start_zen_game
        global new_zen_game

        # Global variables minesweepr
        global list_minesweeper
        global index_minesweeper
        global new_game_minesweeper
        global start_minesweeper
        global haswon
        global haslost
        global level_minesweeper
        
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
                        # Replay sequence
                        send_sequence(sequence, True)
                        haslost = False
                        print("You have lost replaying sequence")
            if (start_redvsblue_game):
                if(new_game_redvsblue):
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
            if (start_zen_game):
                if (new_zen_game):
                    for i in range(0, 4):
                        client.publish(str(i), "off")
                    random_led_zen = random.randint(0, 3)
                    random_color_zen = random.randint(0, 3)
                    print(
                        f"random led: {random_led_zen} kleur: {random_color_zen}")
                    client.publish(str(random_led_zen), str(random_color_zen))
                    previous_time = time.time()
                    new_zen_game = False
            if (start_minesweeper):
                if (new_game_minesweeper):
                    list_minesweeper = random.sample(range(4), 4)
                    print(f'list: {list_minesweeper}')
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
    except Exception as e:
        print(e) # to print the error
        logger.error(e)
    finally:
        semaphore.release()

#region memory
def generate_sequence(sequence_number):
    try:
        leds = [0, 1, 2]
        global sequence
        # Generate sequence
        for i in range(sequence_number):
            led = leds[random.randint(0, len(leds)-1)]
            sequence.append(led)
        return sequence
    except Exception as e:
        print(e)
        logger.error(e)

def send_sequence(sequence, blink=False): # Send sequence
    try:
        # Global variables
        global bussy 
        # Set bussy
        bussy = True
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
        # Set bussy
        bussy = False
    except Exception as e:
        print(e) # to print the error
        logger.error(e)

def check_sequence(received_sequence): # Check sequence
    try:
        # Global variables
        global sequence_number
        global counter
        global sequence
        global haswon
        global haslost
        global bussy 

        # Check if not bussy
        if not bussy:
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
    except Exception as e:
        print(e) # to print the error
        logger.error(e)

#endregion

#region redvsblue
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


#endregion

#region zen
def reward_response_time(response_time):
    global total_score_zen
    try:
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
    except Exception as e:
        logger.log(e)

def analyse_buttons_zen(number):
    global game
    global random_led_zen
    global previous_time
    global new_zen_game
    try:
        print(f"button pressed: {number}; {game}")
        if number == random_led_zen:
            response_time = time.time() - previous_time
            print(f"correct {response_time}")
            reward_response_time(response_time)
            new_zen_game = True
    except Exception as e:
        logger.log(e)


#endregion

#region MINESWEEPER
def analyse_buttons_minesweeper(message):
    global game
    global index_minesweeper
    global score_minesweeper
    global haswon
    global haslost
    global busy_minesweeper
    try:
        if not busy_minesweeper:
            print(f'button {message} pressed; game: {game}')
            print(
                f'controle{message == str(list_minesweeper[index_minesweeper])}')
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
    except Exception as e:
        logger.error(e)


def send_hint_function():
    global list_minesweeper
    global index_minesweeper
    global level_minesweeper
    global busy_minesweeper
    try:
        busy_minesweeper = True
        client.publish(str(list_minesweeper[0]), "1")
        time.sleep(1)
        client.publish(str(list_minesweeper[0]), "off")
        busy_minesweeper = False
    except Exception as e:
        logger.error(e)


def sequence_off():
    global busy_minesweeper
    try:
        busy_minesweeper = True
        print('sequence off')
        for i in range(4):
            client.publish(str(i), "off")
        time.sleep(1)
        busy_minesweeper = False
    except Exception as e:
        logger.error(e)


def sequence_mistake():
    global busy_minesweeper
    try:
        busy_minesweeper = True
        print('mistake')
        for i in range(4):
            client.publish(str(i), "0")
        time.sleep(1)
        for i in range(4):
            client.publish(str(i), "off")
        busy_minesweeper = False
    except Exception as e:
        logger.error(e)



#endregion

#endregion

#region MQTT

client = mqtt.Client()
# client.connect("192.168.220.1", 1883)
client.connect("localhost", 1883)
client.on_connect=on_connect
client.on_disconnect = on_disconnect

#endregion

#region FLASK ROUTES
#endregion

#region THREADS
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

    
#endregion

# APP START
if __name__ == '__main__':
    print("Starting server")
    start_threads()
    app.run(debug=False)
   