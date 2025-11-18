# Amazon Clone - Installation Verification

Write-Host "🔍 Verifying Amazon Clone Installation" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

$allGood = $true

# Check Node.js
Write-Host "1. Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "   ✅ Node.js $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Node.js not found" -ForegroundColor Red
    $allGood = $false
}

# Check npm packages
Write-Host "2. Checking npm packages..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    $packageCount = (Get-ChildItem "node_modules" -Directory).Count
    Write-Host "   ✅ $packageCount packages installed" -ForegroundColor Green
} else {
    Write-Host "   ❌ node_modules not found. Run: npm install" -ForegroundColor Red
    $allGood = $false
}

# Check Python
Write-Host "3. Checking Python..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version
    Write-Host "   ✅ $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Python not found" -ForegroundColor Red
    $allGood = $false
}

# Check environment file
Write-Host "4. Checking .env file..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "   ✅ .env file exists" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  .env file not found. Run: Copy-Item .env.example .env" -ForegroundColor Yellow
    $allGood = $false
}

# Check project structure
Write-Host "5. Checking project structure..." -ForegroundColor Yellow
$requiredDirs = @("components", "pages", "server", "services", "lib", "styles")
$allDirsExist = $true
foreach ($dir in $requiredDirs) {
    if (Test-Path $dir) {
        Write-Host "   ✅ $dir/" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $dir/ missing" -ForegroundColor Red
        $allDirsExist = $false
    }
}
if (-not $allDirsExist) { $allGood = $false }

# Check key files
Write-Host "6. Checking key files..." -ForegroundColor Yellow
$requiredFiles = @(
    "package.json",
    "tsconfig.json",
    "next.config.js",
    "tailwind.config.js",
    "docker-compose.yml",
    "requirements.txt",
    "README.md"
)
$allFilesExist = $true
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "   ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $file missing" -ForegroundColor Red
        $allFilesExist = $false
    }
}
if (-not $allFilesExist) { $allGood = $false }

# Check C++ compiler
Write-Host "7. Checking C++ compiler (optional)..." -ForegroundColor Yellow
try {
    $cppVersion = g++ --version | Select-Object -First 1
    Write-Host "   ✅ $cppVersion" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  C++ compiler not found (optional for DSA modules)" -ForegroundColor Yellow
}

# Check Docker
Write-Host "8. Checking Docker (optional)..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "   ✅ $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  Docker not found (install databases manually)" -ForegroundColor Yellow
}

# Summary
Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
if ($allGood) {
    Write-Host "✅ All essential checks passed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Edit .env file with database credentials" -ForegroundColor White
    Write-Host "2. Start databases: docker-compose up -d" -ForegroundColor White
    Write-Host "3. Seed database: node server/scripts/seed.js" -ForegroundColor White
    Write-Host "4. Start app: npm run dev" -ForegroundColor White
    Write-Host ""
    Write-Host "📖 Read SETUP.md for detailed instructions" -ForegroundColor Cyan
} else {
    Write-Host "⚠️  Some checks failed. Please fix the issues above." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "For help, see:" -ForegroundColor Yellow
    Write-Host "- SETUP.md for installation guide" -ForegroundColor White
    Write-Host "- README.md for project overview" -ForegroundColor White
}
Write-Host "======================================" -ForegroundColor Cyan

# File count summary
Write-Host ""
Write-Host "Project Statistics:" -ForegroundColor Cyan
$totalFiles = (Get-ChildItem -Recurse -File | Where-Object { $_.FullName -notmatch "node_modules" }).Count
$jsFiles = (Get-ChildItem -Recurse -Include *.js,*.jsx,*.ts,*.tsx | Where-Object { $_.FullName -notmatch "node_modules" }).Count
$pyFiles = (Get-ChildItem -Recurse -Include *.py).Count
$cppFiles = (Get-ChildItem -Recurse -Include *.cpp,*.h).Count

Write-Host "   Total Files: $totalFiles" -ForegroundColor White
Write-Host "   JS/TS Files: $jsFiles" -ForegroundColor White
Write-Host "   Python Files: $pyFiles" -ForegroundColor White
Write-Host "   C++ Files: $cppFiles" -ForegroundColor White
Write-Host ""
