# Installation and Setup Guide

## Prerequisites

Before setting up the Blockchain-Based Policy Administration System, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)
- **PostgreSQL** (version 14 or higher)
- **Git** (for version control)

## Quick Start (5 minutes)

### 1. Clone and Navigate
```bash
git clone <repository-url>
cd policy-admin-system
```

### 2. Backend Setup
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env file with your database credentials
# DATABASE_URL="postgresql://username:password@localhost:5432/policy_admin_db"
```

### 3. Database Setup
```bash
# Create database
createdb policy_admin_db

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed with sample data
npx prisma db seed
```

### 4. Frontend Setup
```bash
# Navigate back to root
cd ..

# Install frontend dependencies
npm install
```

### 5. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 6. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Database Studio:** http://localhost:5555 (run `npx prisma studio` in backend folder)

## Default Login Credentials

After seeding the database, you can use these demo accounts:

- **Admin:** admin@policyapp.com / admin123
- **Policy Manager:** manager@policyapp.com / manager123
- **Regular User:** user@policyapp.com / user123
- **Auditor:** auditor@policyapp.com / user123

## Environment Configuration

### Backend (.env)
```env
NODE_ENV=development
PORT=3001
DATABASE_URL="postgresql://username:password@localhost:5432/policy_admin_db"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
FRONTEND_URL=http://localhost:3000
```

### Frontend (automatic)
The frontend automatically connects to the backend at `http://localhost:3001`.

## Testing

### Run Backend Tests
```bash
cd backend
npm test
```

### Run Test Coverage
```bash
cd backend
npm run test:coverage
```

## Smart Contracts (Optional)

### Setup Blockchain Development
```bash
cd contracts
npm install
npx hardhat compile
npx hardhat test
```

### Deploy to Local Network
```bash
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

## Troubleshooting

### Common Issues

**1. Database Connection Error**
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env file
- Verify database exists: `psql -l`

**2. Port Already in Use**
- Change PORT in backend/.env
- Kill existing processes: `lsof -ti:3001 | xargs kill -9`

**3. Prisma Generate Error**
```bash
cd backend
rm -rf node_modules
npm install
npx prisma generate
```

**4. Frontend Build Error**
```bash
rm -rf node_modules .next
npm install
npm run dev
```

### Reset Database
```bash
cd backend
npx prisma migrate reset
npx prisma db seed
```

## Production Deployment

### Environment Variables
Set these in production:
```env
NODE_ENV=production
DATABASE_URL=your-production-database-url
JWT_SECRET=your-secure-jwt-secret
FRONTEND_URL=your-frontend-domain
```

### Build Commands
```bash
# Backend
cd backend
npm run build
npm start

# Frontend
npm run build
npm start
```

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Ensure environment variables are correctly configured
4. Check server logs for detailed error messages

For further assistance, please refer to the main README.md or create an issue in the repository.
