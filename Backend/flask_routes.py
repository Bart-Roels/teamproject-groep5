import random
import time
from flask import Flask, jsonify, request
from flask_cors import CORS
from tinydb import TinyDB, Query
import uuid

#region FLASK APP
app = Flask(__name__)
CORS(app)
endpoint = '/api/v1'

# Database
db = TinyDB('Backend/Database/db.json')

#endregion

#region ROUTES

# POST score route
@app.route(endpoint + '/score', methods=['POST'])
def post_score():
    # Get data from request
    data = request.get_json()
    name = data.get('name')
    score = data.get('score')
    game = data.get('game')
    time = data.get('time')
    nameteamred = data.get('nameRed')
    nameteamblue = data.get('nameBlue')
    scoreRed = data.get('scoreRed')
    scoreBlue = data.get('scoreBlue')
    # Dificulty can be null
    dificulty = data.get('dificulty')

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
        if not all([score, game, time, dificulty]):
            return jsonify({'error': 'Missing required fields: score, game, time and dificulty'}), 400

    # Convert time and score to int or float
    try:
        time = int(time)
        score = int(score)
    except ValueError:
        return jsonify({'error': 'Error in converting'}), 400
    

    # Check if score is int or float
    try:
        score = int(score)
    except ValueError:
        try:
            score = float(score)
        except ValueError:
            return jsonify({'error': 'Invalid score'}), 400

    # Generate guid 
    guid = uuid.uuid4()

    # Insert data into database
    try:
        # Insert evrything into database
        db.insert({'id': str(guid), 'game': game, 'name': name, 'score': score, 'time': time, 'dificulty': dificulty, 'nameRed': nameteamred, 'nameBlue': nameteamblue, 'scoreRed': scoreRed, 'scoreBlue': scoreBlue})
    except:
        return jsonify({'error': 'An error occurred while inserting data into the database'}), 500

    # Return data
    return jsonify({'id': str(guid), 'game': game, 'name': name, 'score': score, 'time': time, 'dificulty': dificulty, 'nameRed': nameteamred, 'nameBlue': nameteamblue, 'scoreRed': scoreRed, 'scoreBlue': scoreBlue})

# GET score route
@app.route(endpoint + '/score', methods=['GET'])
def get_score():
    # Get data from request
    data = request.get_json()
    game = data.get('game')
    time = data.get('time')
    dificulty = data.get('dificulty')

    # Get all scores from database
    scores = db.all()

    # Filter scores based on game
    if game != 'minesweeper':
        # Filter game based on game and time
        data_scores = list(filter(lambda x: x['game'] == game and x['time'] == time, scores))
    elif game == 'minesweeper':
        # Filter based on time and dificulty and game
        data_scores = list(filter(lambda x: x['game'] == game and x['time'] == time and x['dificulty'] == dificulty, scores))

    # Filter 10 best scores
    data_scores = data_scores[:10]
    # Sort scores based on score
    data_scores = sorted(scores, key=lambda k: k['score'])
    # Return data
    return jsonify(data_scores)
    

#endregion


# Start app
if __name__ == '__main__':
    app.run(debug=False)
    print("Starting project")



