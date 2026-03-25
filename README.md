# 🚀 Ionic Angular + PHP Fullstack App

A fullstack application combining an **Ionic/Angular frontend** with a **PHP backend API**.

---

## 🧱 Tech Stack

- **Frontend:** Angular 20 + Ionic 8
- **Backend:** PHP (MySQLi)
- **Database:** MySQL
- **Tools:** Angular CLI, Ionic CLI, XAMPP / PHP CLI

---

## 📁 Project Structure

```
project-root/
│
├── src/                 # Angular / Ionic app
├── server/
│   ├── api/             # PHP endpoints
│   ├── config/          # DB & CORS config
│   └── uploads/         # Uploaded files
│
├── package.json
├── angular.json
└── README.md
```

---

## ⚙️ Requirements

- Node.js (>= 18)
- npm
- Angular CLI
- Ionic CLI
- PHP (>= 8)
- MySQL

---

## 🧑‍💻 Installation

### 1. Clone repository

```bash
git clone <repo-url>
cd project
```

### 2. Install dependencies

```bash
npm install
```

---

## ▶️ Run the Project

### 🚀 Frontend (Angular / Ionic)

```bash
npm start
```

App runs on:  
👉 http://localhost:4200

---

### 🧠 Backend (PHP)

```bash
cd server
php -S localhost:8000
```

API runs on:  
👉 http://localhost:8000

---

## 🔗 API Usage

Example endpoint:

```
POST http://localhost:8000/api/register.php
```

---

## 🔐 Authentication & Roles

Users have roles:

- `developer`
- `entrepreneur`

On registration:

- A user is created in `users`
- A profile is automatically created in:
  - `developers`
  - `entrepreneurs`

---

## ⚠️ CORS Configuration

Handled in:

```
server/config/cors.php
```

Example:

```php
header("Access-Control-Allow-Origin: http://localhost:4200");
```

---

## 📦 Available Scripts

```bash
npm start        # Run dev server
npm run build    # Build production app
npm run watch    # Watch mode
npm test         # Run tests
npm run lint     # Lint project
npm run format   # Format with Prettier
```

---

## 🧠 Features

- ✅ Authentication (register/login)
- ✅ Role-based profiles
- ✅ File upload (images, PDFs)
- ✅ Profile update system
- ✅ Angular route guards
- ✅ PHP REST API

---

## 🚧 Future Improvements

- 🔐 JWT authentication
- 🌐 Deployment (Apache / Nginx)
- 📱 Mobile build (Capacitor)
- 🧪 End-to-end tests
- 🧾 API validation layer

---

## 👤 Author

Ionic + Angular project with PHP backend

---

## 📄 License

Private / educational use
