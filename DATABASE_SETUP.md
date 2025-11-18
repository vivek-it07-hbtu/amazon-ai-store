# Database Setup Guide

## Current Status
- ✅ PostgreSQL 18 is installed
- ❌ MongoDB is NOT installed

## Quick Start

### Option 1: Install MongoDB (Recommended)

1. Download MongoDB Community Server:
   - Visit: https://www.mongodb.com/try/download/community
   - Choose Windows x64 MSI installer
   - Install with default settings
   - **Important**: During installation, check "Install MongoDB as a Service"

2. After installation, MongoDB should start automatically
   - Verify: `mongod --version`

### Option 2: Use Docker (Alternative)

If you have Docker installed, you can use the included docker-compose.yml:

```powershell
docker-compose up -d
```

This will start MongoDB, PostgreSQL, and Redis containers.

## Starting PostgreSQL

PostgreSQL is installed but not running. Start it with:

```powershell
# Start PostgreSQL service (run as Administrator)
Start-Service postgresql-x64-18

# Or manually start the server
& "C:\Program Files\PostgreSQL\18\bin\pg_ctl.exe" start -D "C:\Program Files\PostgreSQL\18\data"
```

## Creating Databases

Once both services are running:

### MongoDB
The database will be created automatically when the app connects.

### PostgreSQL
```powershell
# Connect to PostgreSQL (default password is what you set during installation)
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres

# Then run:
CREATE DATABASE amazon_users;
\q
```

## Environment Configuration

Update your `.env` file with your PostgreSQL password:

```
POSTGRES_PASSWORD=your_password_here
```

## Verify Everything Works

```powershell
# Test MongoDB connection
mongo --eval "db.version()"

# Test PostgreSQL connection
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "SELECT version();"
```
