from __future__ import print_function
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import requests

app = Flask(__name__)
cors = CORS(app)

@app.route('/api/v1/proxy', methods=['GET'])
def api_id():

    headers = {'User-Agent': 'MonkeyPuzzle_Web_v1'}

if 'address' in request.args:
        address = (request.args['address'])
        new_address = address.replace('www.', 'https://', 1)
        resp = requests.get(new_address, headers=headers)

return jsonify(result=resp.text)
