import os

from flask import Flask, render_template, request
from flask_jsglue import JSGlue

application = app = Flask(__name__)
JSGlue(app)

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

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)
