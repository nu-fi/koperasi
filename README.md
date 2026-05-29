# Cooperative Management System (Koperasi) 🏢

A comprehensive, multi-tier web application built to manage cooperative (koperasi) operations, featuring loan simulations and payment tracking. This project demonstrates a production-ready architecture, utilizing a decoupled frontend and backend, containerized environments, and an automated Continuous Integration (CI) pipeline.

## 🏗️ Architecture & Tech Stack

This application follows a modern 3-tier architecture:

* **Frontend:** React.js (Vite)
* **Backend:** Python / Django REST Framework
* **Database:** PostgreSQL
* **Infrastructure:** Docker & Docker Compose
* **CI/CD:** GitHub Actions

## 🚀 DevOps & Continuous Integration (CI)

To ensure high code quality and prevent regressions, this repository enforces an automated CI pipeline using **GitHub Actions**. 

Every push or pull request to the `main` branch automatically triggers a cloud runner that:
1. Provisions a secure, isolated Ubuntu environment.
2. Injects secure environment variables and build arguments.
3. Builds the multi-container Docker architecture (`docker-compose up --build`).
4. Executes native React production build tests (`npm run build`).
5. Executes Django backend smoke tests to verify routing, database connections, and system health.

## 💻 Local Development Setup

Because the entire application is containerized, local setup requires zero manual installations of Python, Node, or PostgreSQL.

### Prerequisites
* Docker Desktop installed and running.
* Git installed.

### Quick Start
1. **Clone the repository**
   ```bash
   git clone [https://github.com/nu-fi/koperasi.git](https://github.com/nu-fi/koperasi.git)
   cd koperasi

2. **Set up Environment Variables**
    Create a .env file in the root directory and add your local variables:
    ```bash
    DATABASE_URL=postgres://your_user:your_password@db:5432/your_db
    SECRET_KEY=your-django-secret-key
    SALT=your-security-salt
    POSTGRES_USER=your_user
    POSTGRES_PASSWORD=your_password
    POSTGRES_DB=your_db

3. **Build and Run the Containers**
    ```bash
    docker compose up -d --build

4. **Access the Application**
    * Frontend: http://localhost:5173
    * Backend: http://localhost:8000
   
## 🧪 Running Tests Locally
To run the test suite locally using the Docker containers:

Backend (Django):
```bash
docker compose exec backend python manage.py test apps.base
```

Frontend (React):
```bash
docker compose exec frontend npm run test
