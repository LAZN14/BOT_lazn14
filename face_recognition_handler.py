import face_recognition
import numpy as np
from PIL import Image
import io

def encode_face(image_bytes):
    """Получает вектор признаков лица из изображения"""
    try:
        # Конвертируем bytes в изображение
        image = Image.open(io.BytesIO(image_bytes))
        # Конвертируем в формат, который понимает face_recognition
        image_np = np.array(image)
        # Находим все лица на изображении
        face_locations = face_recognition.face_locations(image_np)
        if not face_locations:
            return None
        # Получаем вектор признаков для первого найденного лица
        face_encodings = face_recognition.face_encodings(image_np, face_locations)
        return face_encodings[0]
    except Exception as e:
        print(f"Error encoding face: {e}")
        return None

def compare_faces(face_encoding1, face_encoding2, tolerance=0.6):
    """Сравнивает два вектора признаков лица"""
    try:
        # Вычисляем евклидово расстояние между векторами
        face_distances = face_recognition.face_distance([face_encoding1], face_encoding2)
        return face_distances[0] <= tolerance
    except Exception as e:
        print(f"Error comparing faces: {e}")
        return False 