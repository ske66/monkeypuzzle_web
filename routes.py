from __future__ import print_function
from flask import Flask, render_template, flash, request, jsonify
import BaseHTTPServer, time, sys, requests, socket

app = Flask(__name__)
app.secret_key = 'some secret key'

@app.route('/')
def start():
    return render_template('index.html')

@app.route('/background_process')
def background_process():
    try:
        #address = request.args.get('txtAddress')
        #return jsonify(result=str(address).lower())
        return jsonify(result="<h1>hello</h1>")

    except Exception, e:
        return(str(e))

if __name__ == "__main__":
     app.run(host='0.0.0.0', debug=True)