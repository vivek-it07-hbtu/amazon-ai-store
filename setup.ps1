# Install script for Amazon Clone

Write-Host "🚀 Amazon Clone Setup Script" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js >= 18.0.0" -ForegroundColor Red
    Write-Host "Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check Python
Write-Host "Checking Python installation..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version
    Write-Host "✅ $pythonVersion installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Python not found. Please install Python >= 3.9" -ForegroundColor Red
    Write-Host "Download from: https://www.python.org/downloads/" -ForegroundColor Yellow
    exit 1
}

# Install Node.js dependencies
Write-Host ""
Write-Host "📦 Installing Node.js dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install Node.js dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Node.js dependencies installed" -ForegroundColor Green

# Install Python dependencies
Write-Host ""
Write-Host "🐍 Installing Python dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install Python dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Python dependencies installed" -ForegroundColor Green

# Setup environment file
Write-Host ""
Write-Host "⚙️  Setting up environment variables..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "⚠️  .env file already exists. Skipping..." -ForegroundColor Yellow
} else {
    Copy-Item .env.example .env
    Write-Host "✅ Created .env file from template" -ForegroundColor Green
    Write-Host "⚠️  Please edit .env file with your database credentials" -ForegroundColor Yellow
}

# Check for Docker
Write-Host ""
Write-Host "Checking Docker installation..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "✅ $dockerVersion installed" -ForegroundColor Green
    
    Write-Host ""
    $startDocker = Read-Host "Do you want to start databases with Docker? (y/n)"
    if ($startDocker -eq "y") {
        Write-Host "🐳 Starting Docker containers..." -ForegroundColor Yellow
        docker-compose up -d
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Docker containers started successfully" -ForegroundColor Green
            Write-Host "   - MongoDB: localhost:27017" -ForegroundColor Cyan
            Write-Host "   - PostgreSQL: localhost:5432" -ForegroundColor Cyan
            Write-Host "   - Redis: localhost:6379" -ForegroundColor Cyan
        } else {
            Write-Host "❌ Failed to start Docker containers" -ForegroundColor Red
        }
    }
} catch {
    Write-Host "⚠️  Docker not found. You'll need to install databases manually:" -ForegroundColor Yellow
    Write-Host "   - MongoDB: https://www.mongodb.com/try/download/community" -ForegroundColor Cyan
    Write-Host "   - PostgreSQL: https://www.postgresql.org/download/" -ForegroundColor Cyan
    Write-Host "   - Redis: https://redis.io/download (optional)" -ForegroundColor Cyan
}

# Create bin directory for C++ executables
Write-Host ""
Write-Host "📁 Creating bin directory..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "bin" | Out-Null
Write-Host "✅ bin directory created" -ForegroundColor Green

# Summary
Write-Host ""
Write-Host "=============================" -ForegroundColor Cyan
Write-Host "✨ Setup Complete!" -ForegroundColor Green
Write-Host "=============================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Edit .env file with your database credentials" -ForegroundColor White
Write-Host "2. Run 'node server/scripts/seed.js' to seed database (optional)" -ForegroundColor White
Write-Host "3. Run 'npm run dev' to start the development server" -ForegroundColor White
Write-Host ""
Write-Host "Access the application at:" -ForegroundColor Yellow
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "   Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "   Python:   http://localhost:8000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Happy coding! 🎉" -ForegroundColor Green
