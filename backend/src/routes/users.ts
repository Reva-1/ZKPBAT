import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/', authMiddleware, async (req, res, next) => {
  try {
    res.json({ message: 'Users endpoint' });
  } catch (error) {
    next(error);
  }
});

export default router;
