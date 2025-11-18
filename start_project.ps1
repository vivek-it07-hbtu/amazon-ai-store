# Start Project Script

Write-Host "Starting Amazon Clone Project..." -ForegroundColor Cyan

# Check for databases
$mongoRunning = Get-Process mongod -ErrorAction SilentlyContinue
$postgresRunning = Get-Process postgres -ErrorAction SilentlyContinue

if (-not $mongoRunning) {
    Write-Host "Warning: MongoDB is not running." -ForegroundColor Red
}
if (-not $postgresRunning) {
    Write-Host "Warning: PostgreSQL is not running." -ForegroundColor Red
}

# Build C++ modules
Write-Host "Building C++ modules..." -ForegroundColor Yellow
if (-not (Test-Path "bin")) {
    New-Item -ItemType Directory -Force -Path "bin" | Out-Null
}

if (Get-Command g++ -ErrorAction SilentlyContinue) {
    g++ -o bin/search_engine services/cpp/search_engine.cpp -std=c++17
    if ($LASTEXITCODE -eq 0) {
        Write-Host "C++ modules built." -ForegroundColor Green
    } else {
        Write-Host "Failed to build C++ modules." -ForegroundColor Red
    }
} else {
    Write-Host "g++ not found. Skipping C++ modules." -ForegroundColor Yellow
}

# Activate Python venv and start app
Write-Host "Activating Python virtual environment..." -ForegroundColor Yellow
if (Test-Path "venv\Scripts\Activate.ps1") {
    . .\venv\Scripts\Activate.ps1
    Write-Host "Virtual environment activated." -ForegroundColor Green
    
    Write-Host "Starting development servers..." -ForegroundColor Cyan
    Write-Host "Frontend: http://localhost:3000"
    Write-Host "Backend:  http://localhost:5000"
    Write-Host "Python:   http://localhost:8000"
    
    npm run dev
} else {
    Write-Host "Virtual environment not found." -ForegroundColor Red
}
