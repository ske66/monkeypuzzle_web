from __future__ import print_function
from flask import Flask, render_template, jsonify, request
import sys, requests, mimetypes
import pickle
import io
import os.path
import os
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload, MediaFileUpload
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request

app = Flask(__name__)
app.secret_key = 'some secret key'

SCOPES = ['https://www.googleapis.com/auth/drive']
CLIENT_SECRET_FILE = 'client_secret.json'

#reddit = praw.Reddit(client_id='T1HvLzIfJ2WGOA', client_secret='hLnHHaSwXWRwEiXoJVXfRMedh7g', username='MonkeyPuzzle_web', password='Woodcot1', user_agent='MonkeyPuzzlePrawv1')


@app.route('/')
def start():

    return render_template('index.html')


def credentials():
    #this might need to be swapped out to work with google picker authentication

    creds = None
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRET_FILE, SCOPES)
            creds = flow.run_local_server()
        # Save the credentials for the next run
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)
    return creds


@app.route('/proxy')
def proxy():

    #this is required because the default user-agent will result in the reddit blocking the connection.
    headers = {'User-Agent': 'MonkeyPuzzle_Web_v1'}
    
    try:
        address = request.args.get("txtAddress")
        new_address = address.replace('www.', 'https://', 1)
        
        resp = requests.get(new_address, headers=headers)

        return jsonify(result=resp.text)

        #this needs to be improved before testing
 

    except Exception as e:
        return(str(e))


@app.route('/drive_download')
def drive_download():
    try:

        oauth_token = request.args.get("authToken")
        file_id = request.args.get("fileID")

        drive_service = build('drive', 'v3', credentials=credentials())

        requests = drive_service.files().get_media(fileId=file_id)
        fh = io.BytesIO()
        downloader = MediaIoBaseDownload(fh, requests)
        done = False
        while done is False:
            status, done = downloader.next_chunk()
            print("Download %d%%." % int(status.progress() * 100), file=sys.stderr)
            fh.seek(0)
            json = fh.read()
            json_read = json.decode('utf-8') #decode from bytes into string

        return jsonify(json_read)

    except Exception as e:
        return(str(e))


@app.route('/drive_upload')
def drive_upload():
    try:

        oauth_token = request.args.get("authToken")
        file_content = request.args.get("filecontent")
        folder_id = request.args.get("folder_id")
        file_name = request.args.get("filename")
        mime_type = "application/json"

        with open(file_name, 'w') as f:
            f.write(file_content)
            f.close()


        #Create a new file using the filepath as the content
        drive_service = build('drive', 'v3', credentials=credentials())

        #send file
        file_metadata = {'name': file_name,
                        'parents':[folder_id]}
        media = MediaFileUpload(file_name, mimetype=mime_type)
        file = drive_service.files().create(body=file_metadata, media_body=media, fields='id').execute()
        print('File ID: %s' % file.get('id'))
        
        #delete file
        os.remove(file_name)

        return jsonify("success")
    
    except Exception as e:
        return(str(e))



if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000,  debug=True)
