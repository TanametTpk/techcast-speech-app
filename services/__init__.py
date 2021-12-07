from os import name
import sys
from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS

app = Flask(__name__)
app_config = {"host": "0.0.0.0", "port": int(sys.argv[1])}
socketio = SocketIO()

def create_app():
    if "app.py" in sys.argv[0]:
        app_config["debug"] = True
        cors = CORS(
            app,
            resources={r"/*": {"origins": "*"}},
        )
        app.config["CORS_HEADERS"] = "Content-Type"

    from .demo import main as main_blueprint
    from .macro import main as main_socket_blueprint
    app.register_blueprint(main_blueprint)
    app.register_blueprint(main_socket_blueprint, name="socket")

    socketio.init_app(app, cors_allowed_origins="*")

    return app



