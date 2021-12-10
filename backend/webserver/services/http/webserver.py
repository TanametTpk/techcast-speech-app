from flask import Flask, jsonify, request
from . import main
from ..wav2vec import inference
from .. import socketio

@main.route("/example")
def example():
  return jsonify("Example response from Flask! Learn more in /app.py & /src/components/App.js")

@main.route("/testhooks", methods = ['GET', 'POST', 'DELETE'])
def testHook():
  print("got message from hook testing")
  return jsonify("Yeah!! I got message.")

@main.route("/wav2vec")
def run_wav2vec():
  inference.running()
  return jsonify("start")

@main.route("/stopwav2vec")
def stop_wav2vec():
  inference.stopRunning()
  return jsonify("stop")

@socketio.on("system:close")
@main.route("/quit")
def quit():
  # this function is not found in socketio
  # I use it, because it can exit this process by just throw not found Error
  # Details: Why socketio not exit correctly?
  # I Think it's bug from Werkzeug's handling but not sure lol
  # u can see more detail here
  # https://github.com/miguelgrinberg/Flask-SocketIO/issues/199
  shutdown = request.environ.get("werkzeug.server.shutdown")
  shutdown()
  socketio.stop()
  exit()
  # --- all solution below is not working (as single solution) ---
  # shutdown = request.environ.get("werkzeug.server.shutdown")
  # shutdown()
  # socketio.stop()
  # exit()