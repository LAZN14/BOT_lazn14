from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base

# Создаем подключение к базе данных
DATABASE_URL = "sqlite:///tasks.db"  # Можно заменить на другую БД
engine = create_engine(DATABASE_URL)

# Создаем таблицы
Base.metadata.create_all(engine)

# Создаем сессию
SessionLocal = sessionmaker(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 