from os import name
import sys
from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS
from .VAD import VADAudio
from engineio.async_drivers import threading

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

    from .http import main as main_blueprint
    from .macro import main as main_socket_blueprint
    from .wav2vec import main as wav2vec_socket_blueprint
    from .googlespeech import main as googlespeech_socket_blueprint
    from .micstream import main as micstream_socket_blueprint
    app.register_blueprint(main_blueprint)
    app.register_blueprint(main_socket_blueprint, name="socket")
    app.register_blueprint(wav2vec_socket_blueprint, name="wav2vec")
    app.register_blueprint(googlespeech_socket_blueprint, name="googlespeech")
    app.register_blueprint(micstream_socket_blueprint, name="micstream")

    socketio.init_app(app, cors_allowed_origins="*", async_mode="threading")

    return app



