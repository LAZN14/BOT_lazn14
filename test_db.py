from database import get_db
from crud import create_user, create_task, get_user_tasks

# Получаем соединение с БД
db = next(get_db())

try:
    # Создаем тестового пользователя
    user = create_user(db, username="test_user", password="test123")
    print(f"Создан пользователь: {user.username}")

    # Создаем тестовую задачу
    task = create_task(db, user.id, "Тестовая задача", "Описание тестовой задачи")
    print(f"Создана задача: {task.title}")

    # Получаем все задачи пользователя
    tasks = get_user_tasks(db, user.id)
    print(f"Задачи пользователя: {[task.title for task in tasks]}")

except Exception as e:
    print(f"Произошла ошибка: {e}")
finally:
    db.close() 