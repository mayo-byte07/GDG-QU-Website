#!/bin/bash

# setup_server_env.sh
# Only For Server Admins if want to contribute in this repo than don't use this script
# This script helps set up the environment variables for the GDG-QU Website.
# It creates:
#   1. .env (root - for docker-compose)
#   2. Backend/.env (for backend service)
#   3. Frontend/.env (for frontend service)

echo "=========================================="
echo "GDG-QU Website Environment Setup"
echo "=========================================="
echo "This script will ask for necessary configuration values."
echo "Press ENTER to accept default values where available."
echo ""

# --- 1. Root .env setup ---
echo "--- 1. Docker Configuration (Root .env) ---"
read -p "Enter DOCKER_USERNAME (default: your_dockerhub_username): " DOCKER_USERNAME
DOCKER_USERNAME=${DOCKER_USERNAME:-your_dockerhub_username}

cat > .env <<EOF
DOCKER_USERNAME=$DOCKER_USERNAME
EOF

echo "✅ Created .env"
echo ""

# --- 2. Backend .env setup ---
echo "--- 2. Backend Configuration (Backend/.env) ---"

read -p "Enter PORT (default: 8000): " PORT
PORT=${PORT:-8000}

read -p "Enter MONGO_URI (REQUIRED, e.g., mongodb+srv://...): " MONGO_URI
if [ -z "$MONGO_URI" ]; then
  echo "⚠️  WARNING: MONGO_URI was left empty. The backend will likely fail to start."
fi

read -p "Enter JWT_SECRET (random string recommended): " JWT_SECRET
if [ -z "$JWT_SECRET" ]; then
    JWT_SECRET=$(openssl rand -hex 32 2>/dev/null || echo "changethis_secret_key_12345")
    echo "   Generated random JWT_SECRET."
fi

read -p "Enter ALLOWED_ORIGINS (comma separated, default: http://localhost:5173): " ALLOWED_ORIGINS
ALLOWED_ORIGINS=${ALLOWED_ORIGINS:-http://localhost:5173}

read -p "Enter NODE_ENV (development/production, default: production): " NODE_ENV
NODE_ENV=${NODE_ENV:-production}

echo "   -- OAuth Credentials (Leave empty if not using) --"
read -p "Enter GOOGLE_CLIENT_ID: " GOOGLE_CLIENT_ID
read -p "Enter GOOGLE_CLIENT_SECRET: " GOOGLE_CLIENT_SECRET
read -p "Enter GITHUB_CLIENT_ID: " GITHUB_CLIENT_ID
read -p "Enter GITHUB_CLIENT_SECRET: " GITHUB_CLIENT_SECRET

cat > Backend/.env <<EOF
PORT=$PORT
MONGO_URI=$MONGO_URI
ALLOWED_ORIGINS=$ALLOWED_ORIGINS
NODE_ENV=$NODE_ENV

JWT_SECRET=$JWT_SECRET

GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
GITHUB_CLIENT_ID=$GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET=$GITHUB_CLIENT_SECRET
EOF

echo "✅ Created Backend/.env"
echo ""

# --- 3. Frontend .env setup ---
echo "--- 3. Frontend Configuration (Frontend/.env) ---"

read -p "Enter VITE_BACKEND_URL (default: /api): " VITE_BACKEND_URL
VITE_BACKEND_URL=${VITE_BACKEND_URL:-/api}

# Frontend needs these for public identification, secrets are backend only
read -p "Enter VITE_GOOGLE_CLIENT_ID (Same as Backend GOOGLE_CLIENT_ID? [y/N]): " SAME_GOOGLE
if [[ "$SAME_GOOGLE" =~ ^[Yy]$ ]]; then
    VITE_GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
else
     read -p "Enter VITE_GOOGLE_CLIENT_ID: " VITE_GOOGLE_CLIENT_ID
fi

read -p "Enter VITE_GITHUB_CLIENT_ID (Same as Backend GITHUB_CLIENT_ID? [y/N]): " SAME_GITHUB
if [[ "$SAME_GITHUB" =~ ^[Yy]$ ]]; then
    VITE_GITHUB_CLIENT_ID=$GITHUB_CLIENT_ID
else
     read -p "Enter VITE_GITHUB_CLIENT_ID: " VITE_GITHUB_CLIENT_ID
fi

cat > Frontend/.env <<EOF
VITE_BACKEND_URL=$VITE_BACKEND_URL
VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
VITE_GITHUB_CLIENT_ID=$VITE_GITHUB_CLIENT_ID
EOF

echo "✅ Created Frontend/.env"
echo ""
echo "=========================================="
echo "🎉 Setup Complete!"
echo "You can now run 'docker-compose up -d' to start the application."
echo "=========================================="
