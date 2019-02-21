from __future__ import print_function
from flask import Flask, render_template, flash, jsonify, request
import sys, requests
import pickle
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request

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

        file_id = request.args.get("itemID")
        print(file_id, file=sys.stderr)

        request = drive_service.files().get_media(fileId=file_id)
        #fh = io.BytesIO()
        #downloader = MediaIoBaseDownload(fh, request)
        #done = False
        #while done is False:
        #    status, done = downloader.next_chunk()
        #    print "Download %d%%." % int(status.progress() * 100)

        return jsonify(result="it works kk " + file_id)


if __name__ == "__main__":
     app.run(host='0.0.0.0', debug=True)
