from flask import Flask, render_template, flash, request, url_for
app = Flask(__name__)
app.secret_key = 'some secret key'

@app.route('/')
def start():
    return render_template('index.html')

@app.route('/', methods=["GET, POST"])
def proxy():
    error = None
    try:
        if request.method == "POST":
            attempted_url = request.form['web_address']
            print ("success")
            flash(attempted_url)
        return render_template('index.html', error = error)

    except Exception as e:
        return render_template('index.html', error = error)

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)
