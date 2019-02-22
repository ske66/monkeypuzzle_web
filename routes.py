from __future__ import print_function
from flask import Flask, render_template, flash, jsonify, request
import sys, requests, mimetypes
import pickle
import os.path
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
from oauth2client.client import AccessTokenCredentials
import httplib2

app = Flask(__name__)
app.secret_key = 'some secret key'

@app.route('/')
def start():
    return render_template('index.html')

@app.route('/Proxy')
def Proxy():
    
    try:
        address = request.args.get("txtAddress")

        newaddress = address.replace('www.', 'https://', 1)
        resp = requests.get(newaddress)
        return jsonify(result=resp.text)

    except Exception as e:
        return(str(e))


@app.route('/drive_download', methods=['GET'])
def drive_download():

    try:
        code = request.args.get("tokenID")
        fileID = request.args.get("fileID")
    
        credentials = AccessTokenCredentials(code, 'my-user-agent/1.0')

        http = httplib2.Http()
        http_auth = credentials.authorize(http)

        drive_service = build('drive', 'v3', http=http_auth)

        data = drive_service.files().export(
            fileID = fileID,
            mimeType='application/json').execute()

        f = open('test.json')
        f.write(data)
        f.close()
        print ("Good", sys=std.err) ##not working??
        return jsonify(result="it works kk ") #for testing purposes

    except Exception as e:
        return(str(e))



if __name__ == "__main__":
     app.run(host='0.0.0.0', debug=True)
