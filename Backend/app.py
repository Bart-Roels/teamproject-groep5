from flask import Flask, jsonify, request
from flask_cors import CORS

# Start app
app = Flask(__name__)
CORS(app)

# Custom endpoint
endpoint = '/api/v1'


@app.route(endpoint + '/test/', methods=['GET'])
def test():
    if request.method == 'GET':
        return "Hello World!"

# Start app
if __name__ == '__main__':
    app.run(host='127.0.0.1', port=3000, debug=True)

