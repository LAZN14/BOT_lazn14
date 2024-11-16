from sqlalchemy.orm import Session
from models import User

def create_user(db: Session, phone: str):
    user = User(phone=phone)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get_user_by_phone(db: Session, phone: str):
    return db.query(User).filter(User.phone == phone).first()

def update_user_face(db: Session, user_id: int, face_data: bytes):
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        user.face_data = face_data
        db.commit()
        return True
    return False

def get_all_faces(db: Session):
    return db.query(User).filter(User.face_data.isnot(None)).all() 