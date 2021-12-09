from services import create_app, socketio, app_config

app = create_app()

if __name__ == "__main__":
  socketio.run(app, **app_config)
