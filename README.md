# Cooperative Management System (Koperasi) 🏢

A comprehensive, multi-tier web application built to manage cooperative (koperasi) operations, featuring loan simulations, payment tracking, and an **AI-powered Customer Service Chatbot**. This project demonstrates a production-ready architecture, utilizing a decoupled frontend and backend, containerized environments, machine learning model integration, and an automated Continuous Integration (CI) pipeline.

## 🏗️ Architecture & Tech Stack

This application follows a modern multi-tier architecture:

* **Frontend:** React.js (Vite), Tailwind CSS
* **Backend:** Python / Django REST Framework
* **Database:** PostgreSQL
* **AI & NLP:** PyTorch (Training), ONNX Runtime (Inference), NLTK, Sastrawi (Indonesian Stemmer)
* **Infrastructure:** Docker & Docker Compose
* **CI/CD:** GitHub Actions

---

## 🤖 AI Chatbot Assistant

The application features a built-in, intelligent virtual assistant designed with **Graceful Degradation** and **Role-Based Access**:
* **Static Intent Logic (Public):** Capable of answering general cooperative FAQs (e.g., registration requirements, operational hours, interest rates) for unauthenticated guest users.
* **Dynamic Intent Logic (Authenticated):** Securely interfaces with the PostgreSQL database via Django ORM to provide real-time, personalized financial data (e.g., remaining loan balance, total savings) exclusively for authenticated members using JWT/Token validation.

**Model Deployment Pipeline:**
To ensure a lightweight and lightning-fast production environment, the heavy PyTorch model (`.pth`) is compressed and exported into an **ONNX** (`.onnx`) format. The backend inference is handled entirely by `onnxruntime`, completely removing the need for the heavy PyTorch library in the production Docker container.

---

## 🚀 DevOps & Continuous Integration (CI)

To ensure high code quality and prevent regressions, this repository enforces an automated CI pipeline using **GitHub Actions**. 

Every push or pull request to the `main` branch automatically triggers a cloud runner that:
1. Provisions a secure, isolated Ubuntu environment.
2. Injects secure environment variables and build arguments.
3. Builds the multi-container Docker architecture (`docker-compose up --build`).
4. Executes native React production build tests (`npm run build`).
5. Executes Django backend smoke tests to verify routing, database connections, and system health.

---

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

## 🧠 Training the AI Chatbot (Optional)
If you modify the intents.json dataset, you must retrain the neural network and export the new model:
```bash
# 1. Access the backend container
docker compose exec backend bash

# 2. Run the training script (generates data.pth)
python apps/chatbot/train.py

# 3. Export to ONNX format (generates chatbot_model.onnx and metadata.json)
python apps/chatbot/convert_to_onnx.py
```

---

## 🧪 Running Tests Locally
To run the test suite locally using the Docker containers:

Backend (Django):
```bash
docker compose exec backend python manage.py test apps.base
```

Frontend (React):
```bash
docker compose exec frontend npm run test
