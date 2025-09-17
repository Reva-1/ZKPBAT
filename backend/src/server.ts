import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import app from './app';
import { logger } from './utils/logger';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Received SIGINT. Graceful shutdown...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM. Graceful shutdown...');
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`� Health check: http://localhost:${PORT}/health`);
  logger.info(`📝 API docs: http://localhost:${PORT}/api-docs`);
});
