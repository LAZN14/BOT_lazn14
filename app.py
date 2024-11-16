from flask import Flask, request, jsonify
from flask_cors import CORS
from database import get_db
from crud import create_user, create_task, get_user_tasks

app = Flask(__name__)
CORS(app)

@app.route('/api/users', methods=['POST'])
def add_user():
    db = next(get_db())
    try:
        data = request.json
        user = create_user(db, 
                         username=data['username'],
                         password=data['password'])
        return jsonify({"success": True, "user_id": user.id})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})
    finally:
        db.close()

@app.route('/api/tasks', methods=['POST'])
def add_task():
    db = next(get_db())
    try:
        data = request.json
        task = create_task(db,
                         user_id=data['user_id'],
                         title=data['title'],
                         description=data.get('description'))
        return jsonify({"success": True, "task": {
            "id": task.id,
            "title": task.title,
            "description": task.description
        }})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})
    finally:
        db.close()

@app.route('/api/tasks/<int:user_id>', methods=['GET'])
def get_tasks(user_id):
    db = next(get_db())
    try:
        tasks = get_user_tasks(db, user_id)
        return jsonify({
            "success": True,
            "tasks": [{
                "id": task.id,
                "title": task.title,
                "description": task.description,
                "status": task.status
            } for task in tasks]
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})
    finally:
        db.close()

if __name__ == '__main__':
    app.run(debug=True) 