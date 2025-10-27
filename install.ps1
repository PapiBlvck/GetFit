# GetFit Dependencies Installation Script
Write-Host "Installing GetFit dependencies..." -ForegroundColor Green

# Add Node.js to PATH
$env:PATH += ";C:\Program Files\nodejs"

# Check if npm is available
try {
    $npmVersion = & npm --version
    Write-Host "npm version: $npmVersion" -ForegroundColor Yellow
} catch {
    Write-Host "npm not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Install core dependencies
Write-Host "Installing core dependencies..." -ForegroundColor Cyan
& npm install firebase zod @trpc/server @trpc/client @trpc/react-query @tanstack/react-query react react-dom react-hook-form @hookform/resolvers

# Install dev dependencies
Write-Host "Installing dev dependencies..." -ForegroundColor Cyan
& npm install -D typescript @types/node @types/react @types/react-dom eslint prettier vitest @testing-library/react @testing-library/jest-dom @types/jest tsx

Write-Host "Installation complete!" -ForegroundColor Green







