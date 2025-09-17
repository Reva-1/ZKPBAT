import request from 'supertest';
import app from '../../src/app';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

// Mock PrismaClient
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: {
      findUnique: jest.fn(),
    },
    userBehaviorProfile: {
      findUnique: jest.fn(),
    },
    auditLog: {
      findMany: jest.fn(),
    },
    securityIncident: {
      findMany: jest.fn(),
    },
    threatIntelligence: {
      findMany: jest.fn(),
    },
  })),
}));

// Mock jwt
jest.mock('jsonwebtoken');

describe('AI Security Routes', () => {
  let token: string;

  beforeAll(() => {
    token = 'valid-test-token';
    (jwt.verify as jest.Mock).mockReturnValue({
      userId: 'user-123',
      role: 'ADMIN',
      email: 'admin@test.com'
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/ai-security/analyze-user/:userId', () => {
    test('should analyze user behavior successfully', async () => {
      const response = await request(app)
        .get('/api/ai-security/analyze-user/user-123')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('riskScore');
      expect(response.body).toHaveProperty('threatLevel');
      expect(response.body).toHaveProperty('anomalies');
      expect(response.body).toHaveProperty('recommendations');
    });

    test('should require authentication', async () => {
      await request(app)
        .get('/api/ai-security/analyze-user/user-123')
        .expect(401);
    });
  });

  describe('POST /api/ai-security/detect-threats', () => {
    test('should detect threats in real-time', async () => {
      const activityData = {
        userId: 'user-123',
        action: 'LOGIN',
        ipAddress: '192.168.1.100',
        userAgent: 'Chrome/Windows',
        location: 'New York',
        deviceId: 'device-123'
      };

      const response = await request(app)
        .post('/api/ai-security/detect-threats')
        .set('Authorization', `Bearer ${token}`)
        .send(activityData)
        .expect(200);

      expect(response.body).toHaveProperty('riskScore');
      expect(response.body).toHaveProperty('threatLevel');
      expect(response.body).toHaveProperty('detectedThreats');
    });

    test('should validate request data', async () => {
      const invalidData = {
        userId: '',
        action: '',
      };

      await request(app)
        .post('/api/ai-security/detect-threats')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidData)
        .expect(400);
    });
  });

  describe('GET /api/ai-security/forecast', () => {
    test('should generate security forecast', async () => {
      const response = await request(app)
        .get('/api/ai-security/forecast')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('predictedThreatLevel');
      expect(response.body).toHaveProperty('confidence');
      expect(response.body).toHaveProperty('timeframe');
      expect(response.body).toHaveProperty('keyFactors');
    });
  });

  describe('GET /api/ai-security/recommendations', () => {
    test('should generate policy recommendations', async () => {
      const response = await request(app)
        .get('/api/ai-security/recommendations')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      response.body.forEach((rec: any) => {
        expect(rec).toHaveProperty('type');
        expect(rec).toHaveProperty('priority');
        expect(rec).toHaveProperty('description');
        expect(rec).toHaveProperty('suggestedActions');
      });
    });
  });

  describe('GET /api/ai-security/dashboard', () => {
    test('should generate executive dashboard', async () => {
      const response = await request(app)
        .get('/api/ai-security/dashboard')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('totalPolicies');
      expect(response.body).toHaveProperty('activePolicies');
      expect(response.body).toHaveProperty('totalUsers');
      expect(response.body).toHaveProperty('securityScore');
      expect(response.body).toHaveProperty('complianceStatus');
    });
  });

  describe('GET /api/ai-security/analytics/compliance', () => {
    test('should analyze compliance status', async () => {
      const response = await request(app)
        .get('/api/ai-security/analytics/compliance')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      response.body.forEach((framework: any) => {
        expect(framework).toHaveProperty('framework');
        expect(framework).toHaveProperty('overallScore');
        expect(framework).toHaveProperty('riskLevel');
      });
    });
  });

  describe('GET /api/ai-security/analytics/performance', () => {
    test('should calculate performance metrics', async () => {
      const response = await request(app)
        .get('/api/ai-security/analytics/performance')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('averageIncidentResolutionTime');
      expect(response.body).toHaveProperty('securityPosture');
      expect(response.body).toHaveProperty('userEngagement');
      expect(response.body).toHaveProperty('policyEffectiveness');
    });
  });

  describe('GET /api/ai-security/analytics/roi', () => {
    test('should calculate ROI analysis', async () => {
      const response = await request(app)
        .get('/api/ai-security/analytics/roi')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('totalInvestment');
      expect(response.body).toHaveProperty('costSavings');
      expect(response.body).toHaveProperty('roiPercentage');
      expect(response.body).toHaveProperty('paybackPeriod');
    });
  });

  describe('GET /api/ai-security/analytics/benchmarks', () => {
    test('should generate benchmark report', async () => {
      const response = await request(app)
        .get('/api/ai-security/analytics/benchmarks')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('securityMaturity');
      expect(response.body).toHaveProperty('incidentFrequency');
      expect(response.body).toHaveProperty('complianceReadiness');
      expect(response.body).toHaveProperty('industryComparison');
    });
  });

  describe('GET /api/ai-security/analytics/insights', () => {
    test('should generate predictive insights', async () => {
      const response = await request(app)
        .get('/api/ai-security/analytics/insights')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('userGrowthForecast');
      expect(response.body).toHaveProperty('securityTrendAnalysis');
      expect(response.body).toHaveProperty('complianceForecasting');
      expect(response.body).toHaveProperty('resourceRequirements');
    });
  });
});
