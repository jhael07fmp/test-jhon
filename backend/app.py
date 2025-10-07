from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

tasks = [
    {"id": 1, "task": "Sample Task"},
    {"id": 2, "task": "Another Task"},
    {"id": 3, "task": "More Tasks"},
    {"id": 4, "task": "Last Task"}
]

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "API is running"})


@app.route("/tasks", methods=["GET"])
def get_tasks():
    return jsonify(tasks)

@app.route("/tasks", methods=["POST"])
def add_task():
    task = request.json.get("task")
    if task:
        new_id = max(t["id"] for t in tasks) + 1 if tasks else 1
        tasks.append({"id": new_id, "task": task})
        return jsonify({"message": "Task added successfully!"}), 201
    return jsonify({"error": "Task content is required."}), 400

@app.route("/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    task_data = request.json.get("task")
    for t in tasks:
        if t["id"] == task_id:
            t["task"] = task_data
            return jsonify({"message": "Task updated successfully!"})
    return jsonify({"error": "Task not found."}), 404

@app.route("/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    global tasks
    initial_length = len(tasks)
    tasks = [t for t in tasks if t["id"] != task_id]
    if len(tasks) < initial_length:
        return jsonify({"message": f"Task {task_id} deleted."})
    return jsonify({"error": "Task not found."}), 404

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
