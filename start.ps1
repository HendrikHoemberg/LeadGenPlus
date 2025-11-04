# LeadGen Plus Startup Script
$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "========================================" -ForegroundColor Magenta
Write-Host "   LeadGen Plus - Startup             " -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta
Write-Host ""

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Cyan
$nodeVersion = node --version 2>$null
if (-not $nodeVersion) {
    Write-Host "ERROR: Node.js not found!" -ForegroundColor Red
    Write-Host "Install from https://nodejs.org/" -ForegroundColor Yellow
    pause
    exit 1
}
Write-Host "OK: Node.js $nodeVersion" -ForegroundColor Green

# Check npm
$npmVersion = npm --version 2>$null
if (-not $npmVersion) {
    Write-Host "ERROR: npm not found!" -ForegroundColor Red
    pause
    exit 1
}
Write-Host "OK: npm v$npmVersion" -ForegroundColor Green
Write-Host ""

# Install frontend dependencies
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to install frontend dependencies" -ForegroundColor Red
        pause
        exit 1
    }
    Write-Host "OK: Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "OK: Frontend dependencies found" -ForegroundColor Green
}

# Install server dependencies
if (-not (Test-Path "server\node_modules")) {
    Write-Host "Installing server dependencies..." -ForegroundColor Yellow
    Push-Location server
    npm install
    Pop-Location
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to install server dependencies" -ForegroundColor Red
        pause
        exit 1
    }
    Write-Host "OK: Server dependencies installed" -ForegroundColor Green
} else {
    Write-Host "OK: Server dependencies found" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Magenta
Write-Host "   Starting Servers...                 " -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta
Write-Host ""

# Kill any existing processes on our ports
Write-Host "Checking for existing processes..." -ForegroundColor Cyan
$existingProcesses = Get-NetTCPConnection -LocalPort 3001,5173 -ErrorAction SilentlyContinue
if ($existingProcesses) {
    Write-Host "Stopping existing processes on ports 3001 and 5173..." -ForegroundColor Yellow
    Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
    Start-Sleep -Seconds 1
    Write-Host "OK: Ports cleared" -ForegroundColor Green
} else {
    Write-Host "OK: Ports are free" -ForegroundColor Green
}
Write-Host ""

# Global process variables
$Global:ServerProc = $null
$Global:FrontendProc = $null

# Cleanup function
function Stop-Servers {
    Write-Host ""
    Write-Host "Stopping servers..." -ForegroundColor Yellow
    
    if ($Global:ServerProc -and -not $Global:ServerProc.HasExited) {
        Stop-Process -Id $Global:ServerProc.Id -Force -ErrorAction SilentlyContinue
        Write-Host "Backend stopped" -ForegroundColor Green
    }
    
    if ($Global:FrontendProc -and -not $Global:FrontendProc.HasExited) {
        Stop-Process -Id $Global:FrontendProc.Id -Force -ErrorAction SilentlyContinue
        Write-Host "Frontend stopped" -ForegroundColor Green
    }
    
    Write-Host "Cleanup complete!" -ForegroundColor Green
}

# Start backend
Write-Host "Starting backend (port 3001)..." -ForegroundColor Cyan
$Global:ServerProc = Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "cd server && node server.js" -WorkingDirectory $scriptPath -PassThru -NoNewWindow
Start-Sleep -Seconds 3

if ($Global:ServerProc.HasExited) {
    Write-Host "ERROR: Backend failed to start" -ForegroundColor Red
    Write-Host "Checking for issues..." -ForegroundColor Yellow
    Write-Host ""
    Stop-Servers
    pause
    exit 1
}
Write-Host "OK: Backend running on http://localhost:3001" -ForegroundColor Green

# Start frontend
Write-Host "Starting frontend (port 5173)..." -ForegroundColor Cyan
$Global:FrontendProc = Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "npm run dev" -WorkingDirectory $scriptPath -PassThru -NoNewWindow
Start-Sleep -Seconds 5

if ($Global:FrontendProc.HasExited) {
    Write-Host "ERROR: Frontend failed to start" -ForegroundColor Red
    Stop-Servers
    pause
    exit 1
}
Write-Host "OK: Frontend running on http://localhost:5173" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   LeadGen Plus is Ready!              " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend:  http://localhost:3001" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Cyan
Write-Host ""

# Open browser
Start-Process "http://localhost:5173" -ErrorAction SilentlyContinue

# Monitor servers
try {
    while ($true) {
        Start-Sleep -Seconds 2
        
        if ($Global:ServerProc.HasExited) {
            Write-Host "ERROR: Backend stopped!" -ForegroundColor Red
            break
        }
        
        if ($Global:FrontendProc.HasExited) {
            Write-Host "ERROR: Frontend stopped!" -ForegroundColor Red
            break
        }
    }
}
catch {
    # User pressed Ctrl+C
}
finally {
    Stop-Servers
}

pause
