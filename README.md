# GDG-QU Website

The frontend for the official GDG Quantum University (GDG-QU) website, built with React and Vite. This repository contains the frontend only.

## 🚀 Getting Started

You can set up this project locally for development.

## 🛠️ Local Development Setup

To run the project locally:

### Prerequisites
- Node.js and npm

### Start the frontend

```bash
npm install
npm run dev
```

The frontend runs on Vite. To use features that load or change events, team members, contact messages, or account data, set `VITE_BACKEND_URL` in `Frontend/.env` to an API server that provides those endpoints. No backend server is included in this repository.

The Supabase client is configured with `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `Frontend/.env`. Use the publishable key in frontend configuration; never put a Supabase secret key in a `VITE_*` variable or commit it to the repository. Add these same two variables to the Vercel project's environment settings before deploying.

---

## 📂 Project Structure

- **Frontend/**: React application built with Vite.
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
