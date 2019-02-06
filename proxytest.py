"""
URL redirection example.
"""

import BaseHTTPServer
import time
import sys
import requests
import socket


#URL = 'https://google.com' #TAKE USER INPUT
URL='https://siwells.github.io/set08101'
IP_ADDRESS = socket.gethostbyname(socket.gethostname())
HOST_NAME = IP_ADDRESS
PORT_NUMBER = 9000
HTML_LIST = ['/index', '/home', '/default']
REDIRECTIONS = {"/slashdot/": "http://slashdot.org/",
                "/freshmeat/": "http://freshmeat.net/"}
LAST_RESORT = "http://google.com/"

class RedirectHandler(BaseHTTPServer.BaseHTTPRequestHandler):
    def do_HEAD(s):
        s.send_response(301)
        s.send_header("Location", REDIRECTIONS.get(s.path, LAST_RESORT))
        s.end_headers()

    def do_GET(s):
        r = requests.get(URL)
        s.serve_web()
        s.send_response(200)
        s.send_header("Content-type", "text/html")
        s.end_headers()
        s.wfile.write(str(r.content))

    def get_page(s):
        r = requests.get(URL)
        page = r.content
        return str(page)

    def serve_web(s):
        s.send_response(200)
        print "Writing html"
        s.send_header("Content-type", "text/html")
        s.end_headers()
        wr = open("webview.html", "w")
        wr.write(s.get_page())



    def escape(s, htmlstring):
        escapes = {'\"': '&quot;',
                   '\'': '&#39;',
                   '<': '&lt;',
                   '>': '&gt;'}
        htmlstring = htmlstring.replace('&', '&amp;')
        for seq, esc in escapes.iteritems():
            htmlstring = htmlstring.replace(seq, esc)
        return htmlstring


if __name__ == '__main__':
    server_class = BaseHTTPServer.HTTPServer
    httpd = server_class((HOST_NAME, PORT_NUMBER), RedirectHandler)
    print(time.asctime(), "Server Starts - %s:%s" % (HOST_NAME, PORT_NUMBER))
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
    print(time.asctime(), "Server Stops - %s:%s" % (HOST_NAME, PORT_NUMBER))
