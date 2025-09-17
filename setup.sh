#!/bin/bash

echo "🚀 Starting Blockchain Policy Administration System..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL 14+ and try again."
    exit 1
fi

echo "✅ Prerequisites check passed"
echo ""

# Create database if it doesn't exist
echo "🗃️  Setting up database..."
createdb policy_admin_db 2>/dev/null || echo "Database already exists"

# Setup backend
echo "🔧 Setting up backend..."
cd backend

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

# Copy environment file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating environment file..."
    cp .env.example .env
    echo "⚠️  Please update the DATABASE_URL in backend/.env with your PostgreSQL credentials"
fi

# Generate Prisma client
echo "🔄 Generating Prisma client..."
npx prisma generate

# Run migrations
echo "🏗️  Running database migrations..."
npx prisma migrate dev --name init

# Seed database
echo "🌱 Seeding database with sample data..."
npx prisma db seed

echo "✅ Backend setup complete"
echo ""

# Setup frontend
echo "🎨 Setting up frontend..."
cd ..

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

echo "✅ Frontend setup complete"
echo ""

echo "🎉 Setup completed successfully!"
echo ""
echo "To start the application:"
echo "1. Backend:  cd backend && npm run dev"
echo "2. Frontend: npm run dev"
echo ""
echo "Demo credentials:"
echo "- Admin: admin@policyapp.com / admin123"
echo "- Manager: manager@policyapp.com / manager123" 
echo "- User: user@policyapp.com / user123"
echo ""
echo "Access the application at: http://localhost:3000"
