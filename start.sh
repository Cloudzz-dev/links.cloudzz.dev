#!/bin/sh
set -e

echo "🚀 Starting Cloudzz Links Deployment Script"

# Check if .git directory exists
if [ -d ".git" ]; then
    echo "⬇️  Pulling latest changes from git..."
    # We use || true to prevent failure if git pull fails (e.g. detached head, local changes)
    git pull || echo "⚠️  Git pull failed, continuing with current version..."
else
    echo "⚠️  No .git directory found. Skipping git pull."
fi

echo "📦 Installing dependencies..."
npm install

echo "🗄️  Generating Prisma Client..."
npx prisma generate

echo "🏗️  Building application..."
npm run build

echo "✅ Build complete. Starting application on port 3535..."
exec npm run start -- -p 3535
