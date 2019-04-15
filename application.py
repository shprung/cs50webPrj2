import os

from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# global array that hold all the channels
# each channel will have channel-name, 
channels=[] 

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/create")
def create():
    cn = request.args.get('cn')
    for c in channels:
        if c['cn'] == cn: return 'dup'

    channels.append({"cn": cn,"dn":request.args.get('by'),"dt":request.args.get('ts'),"msg":[] })
    return 'ok'

@app.route("/channels")
def list_channels():
    ret=[]
    for c in channels:
        ret.append({'cn':c['cn'],'dn':c['dn'],'dt':c['dt'],'msgs':len(c['msg'])})
    return jsonify(ret)

@socketio.on("add_msg")
def add_msg(data):
    cn = data["cn"]
    for i in range(0,len(channels)):
        if channels[i]['cn'] == cn: 
            if len(channels[i]['msg'])==100: # limit to 100 messages max per channel
                channels[i]['msg']=channels[i]['msg'][1:]
            channels[i]['msg'].append({'n':data['n'], 'ts':data['ts'], 'msg':data['msg']})
            emit("new message",data,broadcast=True)

@socketio.on("get_in")
def show_channel(data):
    found = 0
    cn = data["cn"]
    for c in channels:
        if c['cn'] == cn: 
            emit("all messages",c['msg'])