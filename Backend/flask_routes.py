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
    name = data['name']
    score = data['score']
    game = data['game']
    time = data['time']
    # Generate guid 
    guid = uuid.uuid4()

   # Insert data into database
    db.insert({'name': name, 'score': score, 'game': game, 'time': time, 'id': str(guid)})

    # Return data
    return jsonify({'name': name, 'score': score, 'game': game, 'time': time, 'id': str(guid)})

# GET score route
@app.route(endpoint + '/score', methods=['GET'])
def get_score():
    # Get data from request
    data = request.get_json()
    game = data['game']
    time = data['time']
    # Get all scores from database
    scores = db.all()
    # Filter scores by game and time top 10
    scores = list(filter(lambda x: x['game'] == game and x['time'] == time, scores))
    # Sort scores by score high to low (int)
    scores = sorted(scores, key=lambda x: x['score'], reverse=True)
    # Get top 10 scores
    scores = scores[:10]
    # Return data
    return jsonify(scores)



#endregion


# Start app
if __name__ == '__main__':
    app.run(debug=False)
    print("Starting project")



