import os

from flask import Flask, render_template, request
from flask_jsglue import JSGlue
from flask_socketio import SocketIO, emit

application = app = Flask(__name__)
JSGlue(app)
socketio = SocketIO(app)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/teach/<string:course>")
def teacher(course=None):
    if course is None:
        return redirect(url_for("index"))
    return render_template("teacher.html", course=course)

@app.route("/<string:course>")
def student(course=None):
    return render_template("student.html", course=course)

@socketio.on("reaction")
def on_reaction(data):
    print("Received event")
    print(data)
    emit('show_reaction', data, broadcast=True)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    socketio.run(app, host="0.0.0.0", port=port)
