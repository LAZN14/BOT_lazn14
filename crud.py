from models import User, Task
from sqlalchemy.orm import Session

def create_user(db: Session, username: str, password: str):
    user = User(username=username, password=password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get_user_tasks(db: Session, user_id: int):
    return db.query(Task).filter(Task.user_id == user_id).all()

def create_task(db: Session, user_id: int, title: str, description: str = None):
    task = Task(
        title=title,
        description=description,
        user_id=user_id
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task 