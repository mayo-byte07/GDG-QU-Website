# GDG-QU Website

The official website for GDG Quantum University (GDG-QU). This repository contains both the Frontend (React + Vite) and Backend (Node.js + Express) codebases.

## 🚀 Getting Started

You can set up this project locally for development or deploy it using Docker.

### ⚠️ Security Warning

**NEVER** commit your `.env` files to version control. They should contain sensitive keys and secrets. The `.env` files are ignored by git in this project.

---

## 🛠️ Local Development Setup

To run the project locally without Docker:

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (running locally or a cloud instance URL)

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   Copy `.env.example` to `.env` and fill in the values.
   ```bash
   cp .env.example .env
   ```
   *Make sure `MONGO_URI` points to your running MongoDB instance.*
4. Start the backend:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   Copy `.env.sample` to `.env`.
   ```bash
   cp .env.sample .env
   ```
4. Start the frontend:
   ```bash
   npm run dev
   ```

---

## 🐳 Docker Setup (Server/Production)

You can run the entire stack (Frontend, Backend, Nginx) using Docker Compose.

### 1. Application Setup

1. **Clone the repository** to your server.
2. **Run the Environment Setup Script**:
   We have provided a script to automatically generate the necessary `.env` files for Docker.
   ```bash
   # Make the script executable
   chmod +x setup_server_env.sh

   # Run the script
   ./setup_server_env.sh
   ```
   *Follow the interactive prompts to enter your database URI, API keys, etc.*

   > **Note:** Since the Docker setup uses Nginx as a reverse proxy, the frontend usually communicates with the backend via `/api`.

### 2. Start the Services

Once the environment variables are set up, start the containers:

```bash
docker-compose up -d --build
```
*Use `docker-compose.prod.yml` if you specifically want to run with production configurations.*

### 3. Verify Deployment

- **Frontend**: Accessible at `http://localhost` (or your server IP/Domain).
- **Backend API**: Accessible at `http://localhost/api` (proxied by Nginx).

### 4. Stopping the Services

To stop the containers:
```bash
docker-compose down
```

---

## 📂 Project Structure

- **Frontend/**: React application moved to Vite.
- **Backend/**: Node.js Express API.
- **nginx/**: Nginx configuration for reverse proxying.
- **setup_server_env.sh**: Helper script for environment configuration.

---

## 🤝 How to Contribute

We welcome contributions! If you'd like to improve this project, please follow these steps:

1. **Fork the Repository**
   Click the "Fork" button at the top right of this page.

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/GDG-QU-Website.git
   cd GDG-QU-Website
   ```

3. **Create a Feature Branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```

4. **Make Your Changes**
   Implement your feature or fix.

5. **Commit Your Changes**
   ```bash
   git commit -m "Add some AmazingFeature"
   ```

6. **Push to the Branch**
   ```bash
   git push origin feature/AmazingFeature
   ```

7. **Open a Pull Request**
   Go to the original repository and open a Pull Request.

---
