from __future__ import print_function
from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

@app.route('/api/v1/proxy', methods=['GET'])
def api_id():

    headers = {'User-Agent': 'MonkeyPuzzle_Web_v1'}

    address = request.args.get('address', '')
    if address == '':
        return ""
    else:
        new_address = address.replace('www.', 'https://', 1)
        resp = requests.get(new_address, headers=headers)

        return jsonify(result=resp.text)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000, debug=true)
