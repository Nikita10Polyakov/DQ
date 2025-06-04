# 🧙‍♂️ DungeonQuill

DungeonQuill — це веб-сервіс для створення сюжетних арок у настільних рольових іграх (D&D).  
Проєкт дає змогу майстрам гри створювати, редагувати, переглядати сюжетні арки в зручному інтерфейсі.

---

## ⚙️ Технології

**Backend:**
- Django
- Django REST Framework
- djoser + JWT (авторизація)
- SQLite

**Frontend:**
- React
- Axios
- React Router
- Bootstrap

---

DungeonQuill/
├── backend/ # Django API (auth + story arcs)
│ ├── core/ # Налаштування
│ ├── users/ # Кастомна модель користувача
│ ├── story/ # Сюжетні арки
│ └── db.sqlite3 # (у .gitignore)
├── frontend/ # React SPA (login, story arcs UI)
│ └── src/
│ ├── api/
│ └── pages/
└── README.md

---

## 🚀 Як запустити

### 🔧 1. Backend (Django)

```bash
cd backend
python -m venv venv
venv\Scripts\activate      # або source venv/bin/activate на Mac/Linux
pip install -r requirements.txt

# Міграції та суперкористувач
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser

# Запуск сервера
python manage.py runserver

📍 API: http://localhost:8000
📍 Адмінка: http://localhost:8000/admin
📍 JWT login: POST /auth/jwt/create/

⚛️ 2. Frontend (React)

cd frontend
npm install
npm start


📍 Frontend: http://localhost:3000


🔐 Авторизація

Після входу в систему (/login) — токен зберігається у localStorage.
Запити до GET/POST /api/story-arcs/ потребують заголовка:

Authorization: Bearer <access_token>


👨‍💻 Автор
Микита Поляков — студент ДТУ "STEP", 4 курс
