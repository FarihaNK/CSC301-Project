from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/", methods=["POST"])
def slack_event():
    data = request.json
    #print("Received data:", data)

    # Respond to Slack challenge request (Important for verification)
    if "challenge" in data:
        return jsonify({"challenge": data["challenge"]})

    return jsonify({"status": "ok"}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3000)
