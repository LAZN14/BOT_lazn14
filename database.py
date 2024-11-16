from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base

DATABASE_URL = "sqlite:///face_recognition.db"
engine = create_engine(DATABASE_URL)

# Создаем таблицы
Base.metadata.create_all(engine)

# Создаем фабрику сессий
SessionLocal = sessionmaker(bind=engine)

def get_db_connection():
    db = SessionLocal()
    try:
        return db
    finally:
        db.close() 