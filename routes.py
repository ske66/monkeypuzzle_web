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
        address = request.args.get('txtAddress')
        return jsonify(result=str(address).lower())


        HOST_NAME = socket.gethostbyname(socket.gethostname())
        PORT_NUMBER = 9000
        REDIRECTIONS = {"/slashdot/": "http://slashdot.org/",
                "/freshmeat/": "http://freshmeat.net/"}
        LAST_RESORT = "http://google.com/"

        class RedirectHandler(BaseHTTPServer.BaseHTTPRequestHandler):
            def do_HEAD(s):
                s.send_response(301)
                s.send_header("location", REDIRECTIONS.get(s.path, LAST_RESORT))
                s.end_headers()

            def do_GET(s):
                r = requests.get(websrc)
                s.serve_web()
                s.send_response(200)
                s.send_header("Content-type", "text/html")
                s.send_headers()
                s.wfile.write(str(r.content))

            def serve_web(s):
                s.send_reponse(200)
                s.send_headers("Content-type","text/html")
                s.end_headers()
                return jsonify(result=s.get_page())

            def get_page(s):
                r = requests.get(websrc)
                page = r.content
                return str(page)

            def escape(s,htmlstring):
                escapes = {'\"': '&quot;',
                   '\'': '&#39;',
                   '<': '&lt;',
                   '>': '&gt;'}
                htmlstring = htmlstring.replace('&', '&amp;')
                for seq, esc in escapes.iteritems():
                    htmlstring = htmlstring.replace(seq, esc)
                return htmlstring


    
    except Exception, e:
        return(str(e))

        



if __name__ == "__main__":
    server_class = BaseHTTPServer.HTTPServer
    httpd = server_class((HOST_NAME, PORT_NUMBER), RedirectHandler)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
    

