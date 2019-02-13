from __future__ import print_function
from flask import Flask, render_template, flash, jsonify, request
import sys, requests

app = Flask(__name__)
app.secret_key = 'some secret key'

@app.route('/')
def start():
    return render_template('index.html')

@app.route('/background_process')
def background_process():
    
    try:
        address = request.args.get("txtAddress")
        resp = requests.get(address)        
        return jsonify(result=resp.text)

    except Exception, e:
        return(str(e))


if __name__ == "__main__":
     app.run(host='0.0.0.0', debug=True)
