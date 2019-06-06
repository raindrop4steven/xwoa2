#!/usr/bin/env python
# encoding: utf-8

import os
import logging
import subprocess
from concurrent.futures import ThreadPoolExecutor as Pool


from flask import Flask, jsonify

app = Flask(__name__)
pool = Pool()

def callback(future):
    if future.exception() is not None:
        print('got exception: %s' % future.exception())
    else:
        print('process returned %d' % future.result())
        upload_modified_file()
        
def after_request(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'PUT,GET,POST,DELETE'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    return response

def upload_modified_file():
    print('upload file success!')

@app.route('/hello')
def hello():
    f = pool.submit(subprocess.call, r'C:\Users\solar\AppData\Local\Kingsoft\WPS Office\10.1.0.7698\office6\wps.exe C:\Users\solar\Desktop\word.doc')
    f.add_done_callback(callback)
    pool.shutdown(wait=False)
    
    return jsonify({
        'code': 200
    })

if __name__ == '__main__':
    app.after_request(after_request)
    app.run(debug=True)
