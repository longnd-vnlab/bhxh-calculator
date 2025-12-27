#!/bin/bash

# BHXH Calculator - Start Script
# This script builds and starts the entire application using Docker

echo "🚀 Starting BHXH Calculator..."
echo "================================"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "📝 Please edit .env and add your OpenRouter API key"
    echo "   Get free key from: https://openrouter.ai/"
    read -p "Press Enter after adding your API key to .env file..."
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker compose down

# Build and start services
echo "🔨 Building and starting services..."
docker compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check service health
echo "🏥 Checking service health..."

# Check PostgreSQL
if docker compose ps postgres | grep -q "Up"; then
    echo "✅ PostgreSQL is running"
else
    echo "❌ PostgreSQL failed to start"
fi

# Check Redis
if docker compose ps redis | grep -q "Up"; then
    echo "✅ Redis is running"
else
    echo "❌ Redis failed to start"
fi

# Check Backend
if docker compose ps backend | grep -q "Up"; then
    echo "✅ Backend is running"
else
    echo "❌ Backend failed to start"
fi

# Check Frontend
if docker compose ps frontend | grep -q "Up"; then
    echo "✅ Frontend is running"
else
    echo "❌ Frontend failed to start"
fi

echo ""
echo "================================"
echo "🎉 BHXH Calculator is ready!"
echo "================================"
echo ""
echo "📱 Frontend:  http://localhost:3000"
echo "🔧 Backend:   http://localhost:8000"
echo "📚 API Docs:  http://localhost:8000/docs"
echo ""
echo "📊 View logs:    docker compose logs -f"
echo "🛑 Stop app:     docker compose down"
echo "🔄 Restart:      docker compose restart"
echo ""
echo "Happy calculating! 💚"
