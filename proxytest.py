"""
URL redirection example.
"""

import BaseHTTPServer
import time
import sys
import requests


HOST_NAME = '10.0.75.1' # !!!REMEMBER TO CHANGE THIS!!!
PORT_NUMBER = 8899 # Maybe set this to 9000.
REDIRECTIONS = {"/slashdot/": "http://slashdot.org/",
                "/freshmeat/": "http://freshmeat.net/"}
LAST_RESORT = "http://google.com/"

class RedirectHandler(BaseHTTPServer.BaseHTTPRequestHandler):
    def do_HEAD(s):
        s.send_response(301)
        s.send_header("Location", REDIRECTIONS.get(s.path, LAST_RESORT))
        s.end_headers()
        
    def do_GET(s):
        print("s: "+s.path)
        if (s.path == "/index.html"):
            s.serve_web()
        else:
            print("s: "+s.path)
            #//is.do_HEAD()
            r = requests.get('https://www.reddit.com')
            s.send_response(200)
            s.send_header("Content-type", "text/html")
            s.end_headers()
            s.wfile.write(str(r.content))
    
    def get_page(s):
        r = requests.get('http://www.reddit.com')
        page = s.escape(r.content)
        return str(page)

    def serve_web(s):
        s.send_response(200)
        s.send_header("Content-type", "text/html")
        s.end_headers()
        s.wfile.write("<html><head><title>Proxy Testing.</title></head>")
        # If someone went to "http://something.somewhere.net/foo/bar/",
        # then s.path equals "/foo/bar/".
        s.wfile.write("<p>You accessed this path: %s</p>" % s.path)
        s.wfile.write("<iframe id='test_iframe' height='600' width='1000' srcdoc='"+s.get_page()+"'></iframe>")
        s.wfile.write("<button type='button' onclick='getSelectionText()'>textify</button>")
        s.wfile.write("<script>function getSelectionText() { var iframe= document.getElementById('test_iframe'); var idoc= iframe.contentDocument || iframe.contentWindow.document; var iwin= iframe.contentWindow || iframe.contentDocument.defaultView; console.log(''+iwin.getSelection() ) } </script>")
        s.wfile.write("</body></html>")

    def escape(s, htmlstring):
        escapes = {'\"': '&quot;',
                   '\'': '&#39;',
                   '<': '&lt;',
                   '>': '&gt;'}
        # This is done first to prevent escaping other escapes.
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
