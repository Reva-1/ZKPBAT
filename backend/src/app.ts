import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Import routes
import authRoutes from './routes/auth';
import policyRoutes from './routes/policies';
import userRoutes from './routes/users';
import blockchainRoutes from './routes/blockchain';
import aiSecurityRoutes from './routes/ai-security';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Policy Administration API'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/policies', policyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/blockchain', blockchainRoutes);
app.use('/api/ai-security', aiSecurityRoutes);

// Error handling middleware (should be last)
app.use(errorHandler);

export default app;
