from flask import Flask, request, jsonify
from face_recognition_handler import compare_faces, encode_face
from database import get_db_connection
import base64
import numpy as np

app = Flask(__name__)

@app.route('/api/register-face', methods=['POST'])
def register_face():
    try:
        data = request.json
        face_data = data['faceData'].split(',')[1]  # Убираем префикс data:image/jpeg;base64,
        face_bytes = base64.b64decode(face_data)
        
        # Получаем вектор признаков лица
        face_encoding = encode_face(face_bytes)
        if face_encoding is None:
            return jsonify({"success": False, "error": "Лицо не обнаружено"})

        # Сохраняем в базу данных
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            "UPDATE users SET face_data = %s WHERE id = %s",
            (face_encoding.tobytes(), data['userId'])
        )
        conn.commit()
        cur.close()
        conn.close()

        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

@app.route('/api/verify-face', methods=['POST'])
def verify_face():
    try:
        data = request.json
        face_data = data['faceData'].split(',')[1]
        face_bytes = base64.b64decode(face_data)
        
        # Получаем вектор признаков лица для проверки
        face_encoding = encode_face(face_bytes)
        if face_encoding is None:
            return jsonify({"success": False, "error": "Лицо не обнаружено"})

        # Получаем все сохраненные лица из базы
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT id, face_data FROM users WHERE face_data IS NOT NULL")
        stored_faces = cur.fetchall()
        cur.close()
        conn.close()

        # Сравниваем с сохраненными лицами
        for user_id, stored_face_data in stored_faces:
            stored_encoding = np.frombuffer(stored_face_data, dtype=np.float64)
            if compare_faces(face_encoding, stored_encoding):
                return jsonify({"success": True, "userId": user_id})

        return jsonify({"success": False, "error": "Лицо не найдено в базе данных"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

if __name__ == '__main__':
    app.run(debug=True) 