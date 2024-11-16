import telebot
from database import get_db
from crud import create_user, create_task, get_user_tasks
from config import BOT_TOKEN

bot = telebot.TeleBot(BOT_TOKEN)

@bot.message_handler(commands=['start'])
def start(message):
    db = next(get_db())
    try:
        # Создаем пользователя при первом использовании бота
        user = create_user(db, 
                         username=str(message.from_user.id),
                         password="telegram_user")  # Можно генерировать случайный пароль
        bot.reply_to(message, "Добро пожаловать! Вы успешно зарегистрированы.")
    except Exception as e:
        bot.reply_to(message, "Вы уже зарегистрированы!")
    finally:
        db.close()

@bot.message_handler(commands=['add_task'])
def add_task(message):
    db = next(get_db())
    try:
        # Формат команды: /add_task Название задачи | Описание задачи
        task_data = message.text.replace('/add_task', '').strip().split('|')
        if len(task_data) >= 1:
            title = task_data[0].strip()
            description = task_data[1].strip() if len(task_data) > 1 else None
            
            task = create_task(db, 
                             user_id=message.from_user.id,
                             title=title,
                             description=description)
            bot.reply_to(message, f"Задача '{title}' успешно создана!")
        else:
            bot.reply_to(message, "Пожалуйста, укажите название задачи!")
    except Exception as e:
        bot.reply_to(message, f"Произошла ошибка: {str(e)}")
    finally:
        db.close()

@bot.message_handler(commands=['my_tasks'])
def list_tasks(message):
    db = next(get_db())
    try:
        tasks = get_user_tasks(db, message.from_user.id)
        if tasks:
            task_list = "\n".join([f"- {task.title}: {task.description}" for task in tasks])
            bot.reply_to(message, f"Ваши задачи:\n{task_list}")
        else:
            bot.reply_to(message, "У вас пока нет задач!")
    except Exception as e:
        bot.reply_to(message, f"Произошла ошибка: {str(e)}")
    finally:
        db.close()

@bot.message_handler(commands=['help'])
def help(message):
    help_text = """
    Доступные команды:
    /start - Начать работу с ботом
    /add_task [название] | [описание] - Добавить новую задачу
    /my_tasks - Показать список ваших задач
    /help - Показать это сообщение
    """
    bot.reply_to(message, help_text)

if __name__ == '__main__':
    bot.polling(none_stop=True) 