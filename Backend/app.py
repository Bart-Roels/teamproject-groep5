import json
import random
import threading
import time
from flask import Flask, jsonify, request
from flask_cors import CORS
import paho.mqtt.client as mqtt
from tinydb import TinyDB, Query
import uuid
import socket
import logging

# region SETUP

# Flask setup
app = Flask(__name__)
CORS(app)
endpoint = '/api/v1'

# MQTT setup
ip = "127.0.0.1"
port = 1883

# Log path main directory
log_path = "/home/bart/teamproject-groep5/Backend/Logs/app.log"
# log_path = "Backend/Logs/app.log"

# Database
db = TinyDB('/home/bart/teamproject-groep5/Backend/Database/db.json')
# db = TinyDB('Backend/Database/db.json')


# Logging setup
logger = logging.getLogger(__name__)
logger.setLevel(logging.ERROR)  # or logging.DEBUG or logging.WARNING, etc.
handler = logging.FileHandler(log_path)  # create a file handler
handler.setLevel(logging.ERROR)
formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
handler.setFormatter(formatter)
logger.addHandler(handler)

# endregion

# region GLOBAL VARIABLES
game = None
total_buttons_pressed = 0
pause = False
# region memory variables
bussy = False  # for memory
new_game = False  # for memory
blink = True  # for memory
haswon = False  # for memory
haslost = False  # for memory
start_memory_var = False  # for memory
counter = 0  # for memory
sequence_number = 1  # for memory
sequence = []  # for memory
# endregion

# region redblue variables
red_led = -1
blue_led = -1
score_team_blue = 0
score_team_red = 0
start_redvsblue_game = False
new_game_redvsblue = False
# endregion

# region zen variables
start_zen_game = False
new_zen_game = False

random_led_zen = -1
random_color_zen = -1
previous_time = -1
total_score_zen = 0
# endregion

# region minesweepr variables
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
# endregion

# endregion

# region MQTT FUNCTIONS


def on_connect(client, userdata, flags, rc):  # Handels connection
    try:
        if rc == 0:
            print("Connected OK Returned code=", rc)
            client.subscribe("games")
            client.subscribe("minesweeper")
            client.subscribe("button")
            client.subscribe("stop")
            client.subscribe("pauze")
            client.subscribe("unpauze")
            client.subscribe("niveau")
        else:
            raise Exception("Bad connection Returned code=", rc)
    except Exception as e:
        print(e)
        logger.error(e)

def on_disconnect(client, userdata, rc):  # Handels disconnection
    try:
        if rc != 0:
            raise Exception(
                "Unexpected MQTT disconnection. Attempting to reconnect.")
    except Exception as e:
        print(e)
        logger.error(e)
    try:
        client.reconnect()
    except socket.error:
        raise Exception("Failed to reconnect. Exiting.")

def on_message(client, userdata, message):  # Handels incomming messages
    try:
        # Global variables

        global game, total_buttons_pressed, pause

        # Global variables memory

        global start_memory_var, new_game, sequence_number, sequence

        # Global variables redblue

        global start_redvsblue_game, new_game_redvsblue, score_team_blue, score_team_red

        # Global variables zen

        global new_zen_game, start_zen_game, total_score_zen

        # Global variables minesweepr

        global start_minesweeper, new_game_minesweeper, score_minesweeper, level_minesweeper, busy_minesweeper

        # print topic and message
        topic = message.topic
        message = message.payload.decode("utf-8")
        print(f"Topic: {topic}, Message: {message}")
        # Logic
        if topic == "games":
            if message == "memorygame":
                print("starting memory")
                game = "memorygame"
                # Start memory
                sequence = []
                sequence_number = 1
                start_memory_var = True
                new_game = True
                pause = False
            elif message == "bluevsred":
                game = "bluevsred"
                print("redblue")
                score_team_blue = 0
                score_team_red = 0
                start_redvsblue_game = True
                new_game_redvsblue = True
            elif message == "zengame":
                game = "zengame"
                print("zen")
                total_score_zen = 0
                start_zen_game = True
                new_zen_game = True
                # zen_game()
        if topic == "minesweeper":
            # Parse json
            data = json.loads(message)
            # Game 
            game = "minesweeper"
            # Get level out of json
            if data['difficulty'] == "makkelijk":
                level_minesweeper = 1
            elif data['difficulty'] == "normaal":
                level_minesweeper = 2
            elif data['difficulty'] == "moeilijk":
                level_minesweeper = 3
            print(f'level: {level_minesweeper} {data["difficulty"]}')
            #level_minesweeper = data["difficulty"]
            # Variables
            score_minesweeper = 0
            start_minesweeper = True
            new_game_minesweeper = True
        if topic == "button":
            if game == "memorygame":
                check_sequence(message)
            elif game == "bluevsred":
                # Do read button stuff voor redblue
                print("red vs blue button incomming")
                analyse_pressed_buttons_redvsblue(int(message))
            elif game == "zengame":
                # Do read button stuff voor zen
                print("zen button incomming")
                analyse_buttons_zen(int(message))
            elif game == "minesweeper":
                # Do read button stuff voor minesweepr
                print("minesweeper button incomming")
                analyse_buttons_minesweeper(message)
        if topic == "stop":
            client.publish("totalbuttonspressed", str(total_buttons_pressed))
            # If stop
            pause = False
            # Send off to all led's mqtt message to turn off
            for i in range(0, 4):
                client.publish(str(i), "off")
            if game == "memorygame":
                start_memory_var = False
                new_game = False
                # Send sequence number to mqtt
                client.publish("niveau", str(sequence_number))
                sequence_number = 1
                # Print stop memory
                game = None
                print("stop memory")
            elif game == "bluevsred":
                print("stop redblue")
                start_redvsblue_game = False
                new_game_redvsblue = False
                game = None
            elif game == "zengame":
                print("stop zen")
                start_zen_game = False
                new_zen_game = False
                game = None
            elif game == "minesweeper":
                start_minesweeper = False
                new_game_minesweeper = False
                game = None
                sequence_off()
                client.publish("niveau", str(level_minesweeper))
                print("stop minesweepr")
                
        if topic == "pauze":
            if game == "memorygame":
                print("pauze memory")
                pause = True
            elif game == "bluevsred":
                print("pauze redblue")
                pause = True
            elif game == "zengame":
                print("pauze zen")
                pause = True
            elif game == "minesweeper":
                busy_minesweeper = True
                print("pauze minesweepr")
        if topic == "unpauze":
            if game == "memorygame":
                print("unpauze memory")
                pause = False
            elif game == "bluevsred":
                print("unpauze redblue")
                pause = False
            elif game == "zengame":
                print("unpauze zen")
                pause = False
            elif game == "minesweeper":
                busy_minesweeper = False
                print("unpauze minesweepr")
    except Exception as e:
        print(e)
        logger.error(e)
# endregion

# region GAMES

def handle_games():
    semaphore.acquire()
    try:
        # Global variables memory
        global start_memory_var, sequence_number, new_game, haswon, haslost
        won = [2, 2, 2, 2]
        lose = [0, 0, 0, 0]

        # Global variables redblue
        global red_led, blue_led, start_redvsblue_game, new_game_redvsblue, list_leds

        # Global variables zen
        global random_led_zen, random_color_zen, previous_time, start_zen_game, new_zen_game

        # Global variables minesweepr
        global list_minesweeper, index_minesweeper, new_game_minesweeper, start_minesweeper, haswon, haslost, level_minesweeper

        # Start memory
        while True:
            if (start_memory_var == True):
                if (new_game == True):
                    sequence = generate_sequence(sequence_number)
                    send_sequence(sequence, True)
                    new_game = False
                else:
                    if (haswon == True):
                        # Play win sequence
                        send_sequence(won)
                        haswon = False
                        # Start new sequence
                        new_game = True
                    elif (haslost == True):
                        send_sequence(lose, False)
                        # Replay sequence
                        send_sequence(sequence, True)
                        haslost = False
                        print("You have lost replaying sequence")
            if (start_redvsblue_game):
                if new_game_redvsblue and not pause:
                    print('new game')
                    list_leds = random_leds()
                    print(list_leds)
                    red_led = list_leds[0]
                    blue_led = list_leds[1]
                    client.publish(str(red_led), "0")
                    client.publish(str(blue_led), "3")
                    new_game_redvsblue = False
            if (start_zen_game):
                if new_zen_game and not pause:
                    for i in range(0, 4):
                        client.publish(str(i), "off")
                    random_led_zen = random.randint(0, 3)
                    random_color_zen = 1
                    print(
                        f"random led: {random_led_zen} kleur: {random_color_zen}")
                    client.publish(str(random_led_zen), str(random_color_zen))
                    previous_time = time.time()
                    new_zen_game = False
                elif pause:
                    previous_time = time.time()
                    print(f"pauze: {pause}")
                    new_zen_game = False
            if (start_minesweeper):
                if (new_game_minesweeper):
                    list_minesweeper = random.sample(range(4), 4)
                    print(f'list: {list_minesweeper}')
                    index_minesweeper = 0
                    print(f'level minesweeper: {level_minesweeper}')
                    if level_minesweeper ==1:
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
        print(e)  # to print the error
        logger.error(e)
    finally:
        semaphore.release()

# region memory

def generate_sequence(sequence_number):
    try:
        leds = [0, 1, 2]
        global sequence
        for i in range(sequence_number):
            led = leds[random.randint(0, len(leds)-1)]
            sequence.append(led)
        return sequence
    except Exception as e:
        print(e)
        logger.error(e)

def send_sequence(sequence, blink=False):  # Send sequence
    try:
        # Global variables
        global bussy
        # Set bussy
        bussy = True
        # Send sequence
        if (blink == True):
            for item in sequence:
                # Publish message
                client.publish(str(item), str(item))
                print(f"Sending: {item}")
                # TIME SLEEP
                time.sleep(1.5)
                if not pause:
                    print("Sending: off")
                    client.publish(str(item), "off")
                else:
                    while pause == True:
                        print("Paused")
                        time.sleep(1)
                    client.publish(str(item), "off")
        else:
            client.publish(str(0), str(sequence[0]))
            client.publish(str(1), str(sequence[1]))
            client.publish(str(2), str(sequence[2]))
            client.publish(str(3), str(sequence[3]))
            time.sleep(1.5)
            if (not pause):
                for i in range(0, 5):
                    client.publish(str(i), "off")
            else:
                while pause == True:
                    print("Paused")
                    time.sleep(1)
                for i in range(0, 5):
                    client.publish(str(i), "off")
        # Set bussy
        bussy = False
    except Exception as e:
        print(e)  # to print the error
        logger.error(e)

def check_sequence(received_sequence):  # Check sequence
    try:
        # Global variables
        global sequence_number, counter, sequence, haswon, haslost, bussy, total_buttons_pressed
        # Check if not bussy
        if not bussy:
            #total_buttons_pressed += 1
            #print(f"Total buttons pressed: {total_buttons_pressed}")
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
                    client.publish("score", str(sequence_number))
                    # Higher sequence number
                    sequence_number += 1
                    # Has won
                    haswon = True
            else:
                counter = 0
                # LOGIC
                haslost = True
    except Exception as e:
        print(e)  # to print the error
        logger.error(e)

# endregion

# region redvsblue
def analyse_pressed_buttons_redvsblue(number):
    try:
        global game, start_redvsblue_game, new_game_redvsblue, total_buttons_pressed, pause
        total_buttons_pressed += 1
        print(f"total buttons pressed: {total_buttons_pressed}")
        print(f"red: {red_led} blue:{blue_led}")
        print(f"button pressed: {number}; {game}")
        if not pause:
            if number == red_led:
                print("red wins")
                global score_team_red
                score_team_red += 1
                print(f"score red: {score_team_red}")
                client.publish("scoreRed", str(score_team_red))
                # All of
                for i in range(0, 4):
                    client.publish(str(i), "off")
                # New game
                new_game_redvsblue = True
            elif number == blue_led:
                print("blue wins")
                global score_team_blue
                score_team_blue += 1
                print(f"score blue: {score_team_blue}")
                client.publish("scoreBlue", str(score_team_blue))
                # All of
                for i in range(0, 4):
                    client.publish(str(i), "off")
                # New game
                new_game_redvsblue = True

            
        client.publish(
            "memorypoints", f"score red:{score_team_red} score blue:{score_team_blue}")
    except socket.error as e:
        logger.error(e)


def random_leds():
    try:
        return random.sample(range(4), 2)
    except Exception as e:
        logger.error(e)


# endregion

# region zen
def reward_response_time(response_time):
    global total_score_zen
    try:
        rewards = [10, 5, 3, 2, 1]
        thresholds = [1, 3, 5, 10, float('inf')]
        reward = next(rewards[i] for i in range(
            len(thresholds)) if response_time < thresholds[i])
        total_score_zen += reward
        print(f"response time: {response_time}, reward: {reward}")
        client.publish(
            "score", str(total_score_zen))
    except Exception as e:
        logger.log(e)


def analyse_buttons_zen(number):

    # write the global variables above on 1 line
    global game, random_led_zen, previous_time, new_zen_game, total_buttons_pressed, pause
    try:
        if not pause:
            total_buttons_pressed += 1
            print(f"Total buttons pressed: {total_buttons_pressed}")
            if number == random_led_zen:
                response_time = time.time() - previous_time
                print(f"correct {response_time}")
                reward_response_time(response_time)
                new_zen_game = True
    except Exception as e:
        logger.log(e)

# endregion

# region MINESWEEPER


def analyse_buttons_minesweeper(message):
    global game, index_minesweeper, score_minesweeper, haswon, haslost, busy_minesweeper, total_buttons_pressed
    try:
        if not busy_minesweeper:
            total_buttons_pressed += 1
            print(f"Total buttons pressed: {total_buttons_pressed}")
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
                    client.publish('score', str(score_minesweeper))
                    haswon = True
            else:
                print('wrong')
                if  level_minesweeper == 3:
                    print('game lost')
                    haslost = True
    except Exception as e:
        logger.error(e)


def send_hint_function():
    global list_minesweeper, index_minesweeper, level_minesweeper, busy_minesweeper
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
        time.sleep(1)
        for i in range(4):
            client.publish(str(i), "off")
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

# endregion

# endregion

# region MQTT


client = mqtt.Client()
client.connect(ip, port)
client.on_connect = on_connect
client.on_disconnect = on_disconnect

# endregion

#region ROUTES

# POST score route
@app.route(endpoint + '/score', methods=['POST'])
def post_score():
    # Get data from request
    data = request.get_json()
    game = data.get('game')
    score = data.get('score')
    name = data.get('name')
    scoreRed = data.get('scoreRed')
    scoreBlue = data.get('scoreBlue')
    nameteamred = data.get('nameRed')
    nameteamblue = data.get('nameBlue')
    time = data.get('time')
    difficulty = data.get('difficulty')

    # If memory or memory game then name, score, game and time are required
    if game == 'memorygame' or game == 'zengame':
        if not all([name, score, game, time]):
            return jsonify({'error': 'Missing required fields: name, score, game and time'}), 400
    # If red vs blue game then nameRed, nameBlue, scoreRed, scoreBlue, game and time are required
    elif game == 'bluevsred':
        if not all([nameteamred, nameteamblue, scoreRed, scoreBlue, game, time]):
            return jsonify({'error': 'Missing required fields: nameRed, nameBlue, scoreRed, scoreBlue, game and time'}), 400
    # If mine sweeper game then score, game, time and dificulty are required
    elif game == 'minesweeper':
        print('minesweeper')
        if not all([score, game, time, difficulty]):
            return jsonify({'error': 'Missing required fields: score, game, time and dificulty'}), 400

    # Convert time and score to int or float
    try:
        time = int(time)
        # If score is not null
        if(not score == None):
            score = int(score)
    except ValueError:
        return jsonify({'error': 'Error in converting'}), 400
    

    # Generate guid 
    guid = uuid.uuid4()

    # Insert data into database
    try:
        # Insert evrything into database
        db.insert({'id': str(guid), 'game': game, 'name': name, 'score': score, 'time': time, 'dificulty': difficulty, 'nameRed': nameteamred, 'nameBlue': nameteamblue, 'scoreRed': scoreRed, 'scoreBlue': scoreBlue})
    except:
        return jsonify({'error': 'An error occurred while inserting data into the database'}), 500

    # Return data
    print('return data')
    return jsonify({'id': str(guid), 'game': game, 'name': name, 'score': score, 'time': time, 'dificulty': difficulty, 'nameRed': nameteamred, 'nameBlue': nameteamblue, 'scoreRed': scoreRed, 'scoreBlue': scoreBlue})

# GET score route
@app.route(endpoint + '/score/<game>/<time>/<dificulty>', methods=['GET'])
def get_score(game, time, dificulty):

    time = int(time)
    
    # Get all scores from database
    scores = db.all()
    # Filter scores based on game
    if game == 'memorygame' or game == 'zengame':
        # Filter game based on game and time
        data_scores = list(filter(lambda x: x['game'] == game and x['time'] == time, scores))
    elif game == 'minesweeper':
        # Filter based on time and dificulty and game
        data_scores = list(filter(lambda x: x['game'] == game and x['time'] == time and x['dificulty'] == dificulty, scores))
    elif game == 'bluevsred':
        # Get all games match with redvsblue and time
        data_scores = list(filter(lambda x: x['game'] == game and x['time'] == time, scores))

        print(data_scores)

    # Sort scores based on score
    if(game == 'bluevsred'):
        
        # set to int and Check if red or blue has the highest score
        for i in range(len(data_scores)):
            data_scores[i]['scoreRed'] = int(data_scores[i]['scoreRed'])
            data_scores[i]['scoreBlue'] = int(data_scores[i]['scoreBlue'])
            if(data_scores[i]['scoreRed'] > data_scores[i]['scoreBlue']):
                data_scores[i]['score'] = data_scores[i]['scoreRed']
            else:
                data_scores[i]['score'] = data_scores[i]['scoreBlue']
    # Sort based on score
    data_scores.sort(key=lambda x: x['score'], reverse=True)
    # Get top 10 scores
    data_scores = data_scores[:10]
    # Sort based on score from high to low
    data_scores.sort(key=lambda x: x['score'], reverse=True)
    # Return data
    return jsonify(data_scores)

@app.route(endpoint + '/logs', methods=['GET'])
def get_logs():
    global log_path
    # Get end set line per line in json
    with open(log_path, 'r') as f:
        data = f.readlines()
        #print(data)
        #split each line of the log file
        data = [line.split(' - ') for line in data]
        # make a list of dictionaries with the data
        data = [{'tijd': line[0], 'functie': line[1], 'type': line[2], 'message':line[3]} for line in data]

    # Return data
    return jsonify(data)

# GET game route
@app.route(endpoint + '/game', methods=['GET'])
def get_game():
    # get current game
    global game
    # Return data
    return jsonify({'game': game})

#endregion

# region THREADS
def subscribeing():
    client.on_message = on_message
    client.loop_forever()


def start_threads():
    # Start subscribeing thread
    sub = threading.Thread(target=subscribeing)
    sub.start()
    # Start memory thread
    games = threading.Thread(target=handle_games)
    games.start()

# endregion

# APP START
if __name__ == '__main__':
    print("Starting server")
    start_threads()
    app.run(host='192.168.220.1',debug=False)
    # app.run(debug=False)