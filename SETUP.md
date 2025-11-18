# 🚀 Quick Start Guide

## Initial Setup

### Step 1: Install Dependencies

```powershell
# Install Node.js dependencies
npm install

# Install Python dependencies
pip install -r requirements.txt
```

### Step 2: Setup Environment Variables

```powershell
# Copy environment example
Copy-Item .env.example .env

# Edit .env file with your database credentials
notepad .env
```

Update these values in `.env`:
- `MONGODB_URI` - MongoDB connection string
- `POSTGRES_PASSWORD` - PostgreSQL password
- `JWT_SECRET` - Secret key for JWT tokens (generate a random string)

### Step 3: Start Databases

**Option A: Using Docker (Recommended)**
```powershell
docker-compose up -d
```

**Option B: Install Manually**
- Install MongoDB: https://www.mongodb.com/try/download/community
- Install PostgreSQL: https://www.postgresql.org/download/
- Install Redis (optional): https://redis.io/download

### Step 4: Seed Database (Optional)

```powershell
node server/scripts/seed.js
```

This creates sample products and demo user accounts.

### Step 5: Start the Application

```powershell
# Start all services
npm run dev
```

Or start individually:
```powershell
# Frontend only (Terminal 1)
npm run dev:next

# Backend only (Terminal 2)
npm run dev:server

# Python service (Terminal 3)
python services/recommendation_service.py
```

### Step 6: Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Python Service**: http://localhost:8000

## Demo Accounts

After seeding the database:
- **Admin**: admin@amazon.com / admin123
- **Customer**: john.doe@example.com / password123

## Building C++ Modules (Optional)

```powershell
# Install C++ compiler if not already installed
# For Windows: Install Visual Studio Build Tools or MinGW

# Compile search engine
g++ -o bin/search_engine.exe services/cpp/search_engine.cpp -std=c++17

# Compile compression module
g++ -o bin/compression.exe services/cpp/compression.cpp -std=c++17

# Run compiled programs
.\bin\search_engine.exe
.\bin\compression.exe
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `net start MongoDB` (Windows)
- Check connection string in `.env`

### PostgreSQL Connection Issues
- Verify PostgreSQL service is running
- Check credentials in `.env`
- Default port should be 5432

### Port Already in Use
- Frontend (3000): Change in `package.json` dev script
- Backend (5000): Change PORT in `.env`
- Python (8000): Change PYTHON_SERVICE_PORT in `.env`

### Module Not Found Errors
- Run `npm install` again
- For Python: `pip install -r requirements.txt`
- Clear node_modules: `Remove-Item -Recurse -Force node_modules; npm install`

## Project Features Checklist

✅ User Authentication (Register/Login)
✅ Product Browsing & Search
✅ Shopping Cart
✅ Order Management
✅ Product Reviews
✅ Admin Dashboard
✅ Recommendation System
✅ High-Performance Search (C++)
✅ Data Compression (C++)

## Next Steps

1. Explore the codebase in `server/`, `pages/`, and `components/`
2. Test the API endpoints using Postman or Thunder Client
3. Customize products in `server/scripts/seed.js`
4. Add new features from the improvement ideas in README.md
5. Deploy to production (Vercel, Heroku, AWS, etc.)

## Useful Commands

```powershell
# Development
npm run dev              # Start all services
npm run dev:next         # Frontend only
npm run dev:server       # Backend only

# Building
npm run build            # Build Next.js for production
npm run build:cpp        # Compile C++ modules

# Testing
npm test                 # Run tests

# Database
node server/scripts/seed.js    # Seed database

# Docker
docker-compose up -d     # Start databases
docker-compose down      # Stop databases
docker-compose logs      # View logs
```

## Learning Resources

- **Next.js**: https://nextjs.org/docs
- **Express.js**: https://expressjs.com/
- **MongoDB**: https://docs.mongodb.com/
- **PostgreSQL**: https://www.postgresql.org/docs/
- **Redis**: https://redis.io/documentation
- **React**: https://react.dev/

Happy coding! 🎉
