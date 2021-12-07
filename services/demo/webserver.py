from flask import Flask, jsonify, request
from . import main

@main.route("/example")
def example():

  # See /src/components/App.js for frontend call
  return jsonify("Example response from Flask! Learn more in /app.py & /src/components/App.js")


"""
-------------------------- APP SERVICES ----------------------------
"""
# Quits Flask on Electron exit
@main.route("/quit")
def quit():
  # shutdown = request.environ.get("werkzeug.server.shutdown")
  # shutdown()
  exit()