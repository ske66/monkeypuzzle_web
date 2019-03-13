# monkeypuzzle_web
Helping you to work with arguments.... online!

Installing Flask
```
/usr:$ pip install --user flask
```

Check Flask installed correctly
```
/usr:$ python -c "import flask"
```

Create Flask App
```
/usr:$ export FLASK_APP=routes.py
/usr:$ export FLASK_ENV=development
```

Run Flask App
```
python -m flask run --host=0.0.0.0 --port 8000
```

port 8000 is setup for accepting Drive Requests, if the port is to be changed, the target port in the Google Developer Console must also change
