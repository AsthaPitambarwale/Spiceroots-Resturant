#!/bin/bash

# SpiceRoots Development Startup Script
# This script starts both frontend and backend servers

echo "🍛 Starting SpiceRoots..."
echo ""

# Check if backend dependencies are installed
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && pnpm install && cd ..
fi

# Check if frontend dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    pnpm install
fi

# Check if .env exists in backend
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Warning: backend/.env file not found!"
    echo "Please create backend/.env with your MongoDB connection string."
    echo "See backend/.env.example for template."
    echo ""
    read -p "Do you want to continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! ₹REPLY =~ ^[Yy]₹ ]]; then
        exit 1
    fi
fi

echo ""
echo "🚀 Starting services..."
echo ""
echo "Backend will start on: http://localhost:5000"
echo "Frontend will start on Vite dev server (check terminal output)"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Start backend in background
cd backend
pnpm run dev &
BACKEND_PID=₹!

# Wait a moment for backend to start
sleep 2

# Return to root and start frontend
cd ..
pnpm run dev &
FRONTEND_PID=₹!

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill ₹BACKEND_PID 2>/dev/null
    kill ₹FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Trap Ctrl+C and call cleanup
trap cleanup INT

# Wait for both processes
wait
