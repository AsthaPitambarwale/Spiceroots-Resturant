@echo off
REM SpiceRoots Development Startup Script for Windows
REM This script starts both frontend and backend servers

echo.
echo Starting SpiceRoots...
echo.

REM Check if backend .env exists
if not exist "backend\.env" (
    echo WARNING: backend\.env file not found!
    echo Please create backend\.env with your MongoDB connection string.
    echo See backend\.env.example for template.
    echo.
    pause
)

echo.
echo Starting services...
echo.
echo Backend will start on: http://localhost:5000
echo Frontend will start on Vite dev server
echo.
echo Press Ctrl+C to stop both servers
echo.

REM Start backend in new window
start "SpiceRoots Backend" cmd /k "cd backend && pnpm run dev"

REM Wait 2 seconds
timeout /t 2 /nobreak >/dev/null

REM Start frontend in new window
start "SpiceRoots Frontend" cmd /k "pnpm run dev"

echo.
echo Both servers are starting in separate windows
echo Close those windows to stop the servers
echo.
pause
