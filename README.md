Screenshot 2025-09-17 at 10.44.08 PM
# zKPBAT - Zero Trust Policy Administration System

A modern enterprise security platform implementing Zero Trust architecture with AI-powered threat detection and quantum-resistant cryptography.

## 🚀 **Overview**

zKPBAT (zero Knowledge Policy-Based Authentication Technology) is a comprehensive security framework that replaces traditional perimeter-based security with continuous verification and intelligent threat detection.

## ✨ **Key Features**

### 🛡️ **Zero Trust Architecture**
- Continuous verification of all access requests
- "Never trust, always verify" security model
- Risk-based authentication and authorization
- Least privilege access enforcement

### 🤖 **AI-Powered Security**
- Real-time behavioral analysis
- Anomaly detection and threat prediction
- Adaptive risk scoring
- Automated policy enforcement

### ⚛️ **Quantum-Ready Design**
- Post-quantum cryptography preparation
- Hybrid classical/quantum-resistant algorithms
- Future-proof security architecture
- Seamless algorithm migration path

### 📊 **Enterprise Dashboard**
- Real-time security monitoring
- Policy management interface
- Comprehensive audit trails
- Advanced analytics and reporting
- **Version Control**: Track all policy changes with detailed history
- **User Assignment**: Assign policies to specific users
- **Audit Trail**: Complete audit logging for compliance

### Technical Features
- **Modern Web Stack**: Next.js 15 with TypeScript
- **Secure Authentication**: JWT-based auth with role management
- **Database**: PostgreSQL with Prisma ORM
- **Smart Contracts**: Solidity contracts for blockchain integration
- **Responsive Design**: Tailwind CSS for modern UI
- **API Documentation**: RESTful APIs with proper validation

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │────│   Backend API   │────│   Database      │
│   (Next.js)     │    │   (Node.js)     │    │  (PostgreSQL)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         │              ┌─────────────────┐
         └──────────────│ Blockchain Layer│
                        │ (Smart Contracts)│
                        └─────────────────┘
```

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn
- Git

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd policy-admin-system
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure your environment variables in .env
```

### 3. Database Setup
```bash
# Create database
createdb policy_admin_db

# Run migrations
npx prisma migrate dev

# Seed database (optional)
npx prisma db seed
```

### 4. Frontend Setup
```bash
cd ..
npm install
```

### 5. Smart Contracts Setup (Optional)
```bash
cd contracts
npm install
npx hardhat compile
```

## 🚀 Running the Application

### Development Mode

1. **Start Backend API:**
```bash
cd backend
npm run dev
```
Backend will run on http://localhost:3001

2. **Start Frontend:**
```bash
npm run dev
```
Frontend will run on http://localhost:3000

3. **Database Studio (Optional):**
```bash
cd backend
npx prisma studio
```
Prisma Studio will run on http://localhost:5555

## 📝 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=3001
DATABASE_URL="postgresql://username:password@localhost:5432/policy_admin_db"
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
FRONTEND_URL=http://localhost:3000
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/your-project-id
PRIVATE_KEY=your-private-key
```

## 🧪 Testing

### Unit Tests
```bash
cd backend
npm test
```

### Test Coverage
```bash
cd backend
npm run test:coverage
```

### Manual Testing
See [Testing Documentation](./docs/testing.md) for detailed test cases.

## 📖 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### Policy Endpoints
- `GET /api/policies` - Get all policies (with pagination)
- `POST /api/policies` - Create new policy
- `GET /api/policies/:id` - Get policy by ID
- `PUT /api/policies/:id` - Update policy
- `DELETE /api/policies/:id` - Archive policy

### Blockchain Endpoints
- `GET /api/blockchain/health` - Check blockchain connection
- `POST /api/blockchain/deploy-policy` - Deploy policy to blockchain

## 🔐 Security Features

- **Input Validation**: Joi schemas for all API inputs
- **Authentication**: JWT tokens with expiration
- **Authorization**: Role-based access control
- **SQL Injection Protection**: Prisma ORM with parameterized queries
- **CORS Protection**: Configured for specific origins
- **Rate Limiting**: API rate limiting (production)
- **Data Encryption**: Bcrypt for password hashing

## 🔧 Database Schema

### Key Tables
- **Users**: User accounts with roles
- **Policies**: Policy records with metadata
- **PolicyVersions**: Version history tracking
- **PolicyAssignments**: User-policy relationships
- **AuditLogs**: Complete audit trail
- **BlockchainTransactions**: Blockchain transaction records

## 🌐 Deployment

### Production Deployment

1. **Environment Setup:**
   - Set production environment variables
   - Configure production database
   - Set up blockchain network connection

2. **Build Application:**
```bash
# Backend
cd backend
npm run build

# Frontend
npm run build
```

3. **Start Production Services:**
```bash
# Backend
npm start

# Frontend (if self-hosting)
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Revan Ande** - Lead Developer

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in `/docs`

## 🎯 Project Status

- ✅ Phase 1: Requirements and Planning (Complete)
- ✅ Phase 2: Architecture and Design (Complete)
- 🚧 Phase 3: Development and Implementation (In Progress)
- ⏳ Phase 4: Testing and Deployment (Pending)

## 📊 Technology Stack

### Frontend
- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- React Query
- Zustand

### Backend
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication

### Blockchain
- Solidity
- Hardhat
- Ethers.js
- OpenZeppelin

### DevOps
- Docker (planned)
- GitHub Actions (planned) 
- AWS/Vercel (deployment)

## 🎯 **Vision & Impact**

zKPBAT represents the future of enterprise security, combining Zero Trust principles with cutting-edge AI and blockchain technology to create an unbreakable security perimeter around your organization's digital assets.
=======
# ZKPBAT


┌─────────────────────────────────────────────────────────────────┐
│                    Presentation Layer                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Admin Dashboard│  │  User Portal    │  │  Mobile App     │ │
│  │   (React.js)    │  │  (React.js)     │  │  (React Native) │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────┐
│                     API Gateway Layer                           │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │     Kong API Gateway / Express Gateway                     │ │
│  │  - Rate Limiting  - Authentication  - Load Balancing      │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────┐
│                   Business Logic Layer                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌──────────────┐│
│  │   Auth      │ │   Policy    │ │  Blockchain │ │  zk-SNARKs   ││
│  │  Service    │ │  Service    │ │   Service   │ │   Service    ││
│  │(Node.js)    │ │(Node.js)    │ │(Node.js)    │ │(Node.js)     ││
│  └─────────────┘ └─────────────┘ └─────────────┘ └──────────────┘│
└─────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────┐
│                 Integration Layer                               │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌──────────────┐│
│  │   Redis     │ │  Message    │ │  External   │ │  Blockchain  ││
│  │   Cache     │ │  Queue      │ │  APIs       │ │   Networks   ││
│  │             │ │ (RabbitMQ)  │ │             │ │              ││
│  └─────────────┘ └─────────────┘ └─────────────┘ └──────────────┘│
└─────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────┐
│                   Data Layer                                   │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌──────────────┐│
│  │   MongoDB   │ │  PostgreSQL │ │  Blockchain │ │  File Storage││
│  │   (NoSQL)   │ │  (Relational)│ │   Ledger    │ │   (MinIO)    ││
│  └─────────────┘ └─────────────┘ └─────────────┘ └──────────────┘│
└─────────────────────────────────────────────────────────────────┘
>>>>>>> 0c9cf9e6877a6a5dbe00965d92d96185351e80a8
