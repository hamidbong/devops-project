from flask import Flask, jsonify
app = Flask(__name__)

@app.route('/stats')
def stats():
    return jsonify({"products": 42, "users_online": 10})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
