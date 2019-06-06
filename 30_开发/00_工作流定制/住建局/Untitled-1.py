#!/usr/bin/env python
# encoding: utf-8

import pdb
import os
import logging
import subprocess
import requests
from concurrent.futures import ThreadPoolExecutor as Pool
from flask import Flask, jsonify, request

# Constants defined here
DOWNLOAD_ATT_FOLDER = r'C:\AttFolder'


app = Flask(__name__)
pool = Pool()

future_dict = {}

@app.route('/openDoc', methods=['POST'])
def openDoc():
    # Parse arguments
    origin = request.form.get('origin')
    session = request.form.get('session')
    att_id = request.form.get('att_id')
    extension = request.form.get('extension')
    row = request.form.get('row')
    col = request.form.get('col')

    # download file
    file_path = download_file(origin, session, att_id, extension)
    
    f = pool.submit(subprocess.call, r'C:\Users\solar\AppData\Local\Kingsoft\WPS Office\10.1.0.7698\office6\wps.exe %s' % file_path)
    f.add_done_callback(callback)
    future_dict[f] = {
        'att_id': att_id,
        'file_path': file_path,
        'session': session,
        'origin': origin,
        'row': row,
        'col': col
    }
    
    return jsonify({
        'code': 200
    })

def after_request(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'PUT,GET,POST,DELETE'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    return response

def download_file(origin, session, att_id, extension):
    # TODO: local storage
    local_filename = f'{att_id}.{extension}'
    file_path = os.path.join(DOWNLOAD_ATT_FOLDER, local_filename)

    url = f'{origin}/Apps/Workflow/Worksheet/DownloadAtt/{att_id}?__session__={session}'
    # NOTE the stream=True parameter below
    with requests.get(url, stream=True) as r:
        r.raise_for_status()
        with open(file_path, 'wb') as f:
            for chunk in r.iter_content(chunk_size=8192): 
                if chunk: # filter out keep-alive new chunks
                    f.write(chunk)
                    
    return file_path

def callback(future):
    if future.exception() is not None:
        print('got exception: %s' % future.exception())
    else:
        process_dict = future_dict.get(future)
        print('process returned %d' % future.result())
        upload_modified_file(process_dict)

def upload_modified_file(p_dict):
    # save cookie into local disk file.
    att_id = p_dict['att_id']
    file_path = p_dict['file_path']
    session = p_dict['session']
    origin = p_dict['origin']
    row = p_dict['row']
    col = p_dict['col']
    
    files = {'file': open(file_path, 'rb')}
    
    r = requests.post(f'{origin}/Apps/DEP/Common/Upload?__session__={session}', data={'AttID': att_id, 'row': row, 'col': col}, files=files)
    
    print(r.text)

if __name__ == '__main__':
    # Check if att folder exists
    if not (os.path.isdir(DOWNLOAD_ATT_FOLDER)):
        # create att folder if not exists
        os.mkdir(DOWNLOAD_ATT_FOLDER)
        
    app.after_request(after_request)
    app.run(debug=True)
