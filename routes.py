from __future__ import print_function
from flask import Flask, render_template, jsonify, request
import sys
import requests
import io

app = Flask(__name__)
app.secret_key = 'some secret key'

SCOPES = ['https://www.googleapis.com/auth/drive']
CLIENT_SECRET_FILE = 'client_secret.json'

@app.route('/')
def start():

    return render_template('index.html')

@app.route('/proxy')
def proxy():

    #this is required because the default user-agent will result in the reddit blocking the connection.
    headers = {'User-Agent': 'MonkeyPuzzle_Web_v1'}
	
    try:
        address = request.args.get("txtAddress")
        new_address = address.replace('www.', 'https://', 1)
        resp = requests.get(new_address, headers=headers)
				
        return jsonify(result=resp.text)

    except Exception as e:
        return(str(e))

if __name__ == "__main__":
    app.run(port=8000,  debug=True)
