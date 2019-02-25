from __future__ import print_function
from flask import Flask, render_template, jsonify, request
import sys, requests, mimetypes
import pickle
import io
import os.path
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload, MediaFileUpload
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


@app.route('/drive_download')
def drive_download():

    try:

        SCOPES = ['https://www.googleapis.com/auth/drive']
        ##this might need to be swapped out to work with google picker authentication
        creds = None
        if os.path.exists('token.pickle'):
            with open('token.pickle', 'rb') as token:
                creds = pickle.load(token)
        # If there are no (valid) credentials available, let the user log in.
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file('client_secret.json', SCOPES)
                creds = flow.run_local_server()
            # Save the credentials for the next run
            with open('token.pickle', 'wb') as token:
                pickle.dump(creds, token)
            
        file_id = request.args.get("fileID")

        drive_service = build('drive', 'v3', credentials=creds)

        requests = drive_service.files().get_media(fileId = file_id)
        fh = io.BytesIO()
        downloader = MediaIoBaseDownload(fh, requests)
        done = False
        while done is False:
            status, done = downloader.next_chunk()
            print("Download %d%%." % int(status.progress() * 100), file=sys.stderr)
            fh.seek(0)
            json = fh.read()
            jsonRead = json.decode('utf-8') #decode from bytes into string

        return jsonify(jsonRead) #for testing purposes

    except Exception as e:
        return(str(e))


@app.route('/drive_upload')
def drive_upload():

    try:
        SCOPES = ['https://www.googleapis.com/auth/drive']
        ##this might need to be swapped out to work with google picker authentication
        creds = None
        if os.path.exists('token.pickle'):
            with open('token.pickle', 'rb') as token:
                creds = pickle.load(token)
        # If there are no (valid) credentials available, let the user log in.
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file('client_secret.json', SCOPES)
                creds = flow.run_local_server()
            # Save the credentials for the next run
            with open('token.pickle', 'wb') as token:
                pickle.dump(creds, token)
            

        filepath = "HOW_TO.txt"  #request.args.get("filepath")
        filename = "test.txt"
        mimeType = "text/plain"

        drive_service = build('drive', 'v3', credentials=creds)

        file_metadata = {'name': filename}
        media = MediaFileUpload(filepath, mimetype=mimeType)
        file = drive_service.files().create(body=file_metadata, media_body=media, fields='id').execute()
        print('File ID: %s' % file.get('id'))

    

        return jsonify("Good") #for testing purposes

    except Exception as e:
        return(str(e))












    




if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)
