# import sys
# from flask import Flask, jsonify, request
# from flask_socketio import SocketIO
# from flask_cors import CORS

from services import create_app, socketio, app_config

# app = Flask(__name__)
# # app.config["host"] = "0.0.0.0"
# # app.config["port"] = sys.argv[1]
# app_config = {"host": "0.0.0.0", "port": int(sys.argv[1])}
# socketio = SocketIO(app)

"""
---------------------- DEVELOPER MODE CONFIG -----------------------
"""
# Developer mode uses app.py
# if "app.py" in sys.argv[0]:
#   # Update app config
#   app_config["debug"] = True
#   # app.config["debug"] = True

#   # CORS settings
#   cors = CORS(
#     app,
#     resources={r"/*": {"origins": "http://localhost*"}},
#   )

#   # CORS headers
#   app.config["CORS_HEADERS"] = "Content-Type"


"""
--------------------------- REST CALLS -----------------------------
"""
# Remove and replace with your own
# @app.route("/example")
# def example():

#   # See /src/components/App.js for frontend call
#   return jsonify("Example response from Flask! Learn more in /app.py & /src/components/App.js")


# """
# -------------------------- APP SERVICES ----------------------------
# """
# # Quits Flask on Electron exit
# @app.route("/quit")
# def quit():
#   # shutdown = request.environ.get("werkzeug.server.shutdown")
#   # shutdown()
#   exit()

# @socketio.on('connect')
# def connect():
#   print("connected to websocket")
app = create_app()

if __name__ == "__main__":
  # app.run(**app_config)
  socketio.run(app, **app_config)
