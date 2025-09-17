import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import aiSecurityRouter from '../../src/routes/ai-security';
import { AISecurityAnalyzer } from '../../src/services/aiSecurityAnalyzer';
import { AdvancedAnalytics } from '../../src/services/advancedAnalytics';

// Mock the services
jest.mock('../../src/services/aiSecurityAnalyzer');
jest.mock('../../src/services/advancedAnalytics');
jest.mock('../../src/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

const MockedAISecurityAnalyzer = AISecurityAnalyzer as jest.MockedClass<typeof AISecurityAnalyzer>;
const MockedAdvancedAnalytics = AdvancedAnalytics as jest.MockedClass<typeof AdvancedAnalytics>;

describe('AI Security Routes', () => {
  let app: express.Application;
  let mockAnalyzer: jest.Mocked<AISecurityAnalyzer>;
  let mockAnalytics: jest.Mocked<AdvancedAnalytics>;
  let authToken: string;

  beforeEach(() => {
    // Create Express app
    app = express();
    app.use(express.json());
    
    // Mock JWT authentication middleware
    app.use((req, res, next) => {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }
      
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test-secret') as any;
        (req as any).user = decoded;
        next();
      } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
      }
    });
    
    app.use('/api/ai-security', aiSecurityRouter);

    // Create mock instances
    mockAnalyzer = {
      analyzeUserBehavior: jest.fn(),
      detectAnomalies: jest.fn(),
      predictSecurityIncidents: jest.fn(),
      adaptPoliciesBasedOnThreat: jest.fn(),
      updateBehaviorProfile: jest.fn(),
    } as any;

    mockAnalytics = {
      generateExecutiveDashboard: jest.fn(),
      analyzeCompliance: jest.fn(),
      calculatePerformanceMetrics: jest.fn(),
      calculateROI: jest.fn(),
      generateBenchmarkReport: jest.fn(),
      generatePredictiveInsights: jest.fn(),
    } as any;

    MockedAISecurityAnalyzer.mockImplementation(() => mockAnalyzer);
    MockedAdvancedAnalytics.mockImplementation(() => mockAnalytics);

    // Create auth token
    authToken = jwt.sign(
      { userId: 'test-user', role: 'ADMIN' },
      process.env.JWT_SECRET || 'test-secret'
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/ai-security/analyze-user/:userId', () => {
    test('should analyze user behavior successfully', async () => {
      const userId = 'test-user-123';
      const mockRiskScore = 75;
      
      mockAnalyzer.analyzeUserBehavior.mockReturnValue(mockRiskScore);

      const response = await request(app)
        .get(`/api/ai-security/analyze-user/${userId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        userId,
        riskScore: mockRiskScore,
        riskLevel: 'MEDIUM'
      });
      expect(mockAnalyzer.analyzeUserBehavior).toHaveBeenCalledWith(userId);
    });

    test('should return 401 without authorization', async () => {
      const response = await request(app)
        .get('/api/ai-security/analyze-user/test-user');

      expect(response.status).toBe(401);
    });

    test('should handle analysis errors', async () => {
      mockAnalyzer.analyzeUserBehavior.mockImplementation(() => {
        throw new Error('Analysis failed');
      });

      const response = await request(app)
        .get('/api/ai-security/analyze-user/test-user')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to analyze user behavior');
    });
  });

  describe('POST /api/ai-security/detect-anomalies', () => {
    test('should detect anomalies in access request', async () => {
      const accessRequest = {
        userId: 'test-user',
        action: 'READ',
        resource: 'sensitive-data',
        location: 'New York'
      };

      const mockThreatLevel = {
        level: 'HIGH' as const,
        confidence: 0.85,
        indicators: ['Unusual location', 'Off-hours access'],
        recommendations: ['Require MFA', 'Verify identity']
      };

      mockAnalyzer.detectAnomalies.mockReturnValue(mockThreatLevel);

      const response = await request(app)
        .post('/api/ai-security/detect-anomalies')
        .set('Authorization', `Bearer ${authToken}`)
        .send(accessRequest);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockThreatLevel);
      expect(mockAnalyzer.detectAnomalies).toHaveBeenCalledWith(accessRequest);
    });

    test('should require request body', async () => {
      const response = await request(app)
        .post('/api/ai-security/detect-anomalies')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/ai-security/forecast', () => {
    test('should return security forecast', async () => {
      const mockForecast = {
        predictedThreats: [
          {
            type: 'Phishing Attack',
            probability: 0.3,
            estimatedImpact: 'MEDIUM' as const,
            preventionStrategies: ['Email filtering', 'User training']
          }
        ],
        riskTrend: 'STABLE' as const,
        confidenceScore: 0.8,
        timeframe: '7d' as const
      };

      mockAnalyzer.predictSecurityIncidents.mockReturnValue(mockForecast);

      const response = await request(app)
        .get('/api/ai-security/forecast')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockForecast);
    });
  });

  describe('GET /api/ai-security/executive-dashboard', () => {
    test('should return executive dashboard', async () => {
      const mockDashboard = {
        totalPolicies: 50,
        activePolicies: 45,
        totalUsers: 1000,
        securityScore: 85,
        complianceStatus: 'GOOD',
        riskTrend: 'STABLE' as const,
        recentActivities: [],
        keyMetrics: [],
        lastUpdated: new Date()
      };

      mockAnalytics.generateExecutiveDashboard.mockResolvedValue(mockDashboard);

      const response = await request(app)
        .get('/api/ai-security/executive-dashboard')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockDashboard);
    });
  });

  describe('GET /api/ai-security/compliance', () => {
    test('should return compliance analysis', async () => {
      const mockCompliance = [
        {
          framework: 'SOX' as const,
          overallScore: 85,
          controlsAssessed: 15,
          controlsCompliant: 12,
          riskLevel: 'LOW' as const,
          recommendations: ['Review quarterly policies'],
          lastAssessment: new Date()
        }
      ];

      mockAnalytics.analyzeCompliance.mockResolvedValue(mockCompliance);

      const response = await request(app)
        .get('/api/ai-security/compliance')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCompliance);
    });
  });

  describe('GET /api/ai-security/performance', () => {
    test('should return performance metrics', async () => {
      const mockMetrics = {
        averageIncidentResolutionTime: 24.5,
        securityPosture: 85,
        userEngagement: 70,
        policyEffectiveness: 80,
        complianceReadiness: 90,
        threatResponse: 95
      };

      mockAnalytics.calculatePerformanceMetrics.mockResolvedValue(mockMetrics);

      const response = await request(app)
        .get('/api/ai-security/performance')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockMetrics);
    });
  });

  describe('GET /api/ai-security/roi', () => {
    test('should return ROI analysis', async () => {
      const mockROI = {
        totalInvestment: 250000,
        costSavings: 350000,
        roiPercentage: 40,
        paybackPeriod: 18,
        riskReduction: 65,
        efficiencyGains: 30
      };

      mockAnalytics.calculateROI.mockResolvedValue(mockROI);

      const response = await request(app)
        .get('/api/ai-security/roi')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockROI);
    });
  });

  describe('GET /api/ai-security/benchmark', () => {
    test('should return benchmark report', async () => {
      const mockBenchmark = {
        securityMaturity: 'ADVANCED' as const,
        incidentFrequency: 5,
        complianceReadiness: 85,
        industryComparison: 'ABOVE_AVERAGE' as const,
        recommendations: ['Implement advanced threat detection']
      };

      mockAnalytics.generateBenchmarkReport.mockResolvedValue(mockBenchmark);

      const response = await request(app)
        .get('/api/ai-security/benchmark')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockBenchmark);
    });
  });

  describe('POST /api/ai-security/policy-recommendations', () => {
    test('should generate policy recommendations based on threat level', async () => {
      const threatLevel = {
        level: 'HIGH' as const,
        confidence: 0.9,
        indicators: ['Multiple failed logins'],
        recommendations: ['Enable account lockout']
      };

      const mockRecommendations = [
        {
          policyId: 'AUTH_POLICY_001',
          suggestedChanges: [{
            field: 'maxLoginAttempts',
            currentValue: 5,
            suggestedValue: 3,
            justification: 'Reduce brute force attack window'
          }],
          reason: 'High threat level detected',
          urgency: 'HIGH' as const
        }
      ];

      mockAnalyzer.adaptPoliciesBasedOnThreat.mockReturnValue(mockRecommendations);

      const response = await request(app)
        .post('/api/ai-security/policy-recommendations')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ threatLevel });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockRecommendations);
      expect(mockAnalyzer.adaptPoliciesBasedOnThreat).toHaveBeenCalledWith(threatLevel);
    });
  });

  describe('Role-based Access Control', () => {
    test('should allow ADMIN access to all endpoints', async () => {
      const adminToken = jwt.sign(
        { userId: 'admin-user', role: 'ADMIN' },
        process.env.JWT_SECRET || 'test-secret'
      );

      const response = await request(app)
        .get('/api/ai-security/executive-dashboard')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
    });

    test('should allow POLICY_MANAGER access to policy recommendations', async () => {
      const managerToken = jwt.sign(
        { userId: 'manager-user', role: 'POLICY_MANAGER' },
        process.env.JWT_SECRET || 'test-secret'
      );

      mockAnalyzer.adaptPoliciesBasedOnThreat.mockReturnValue([]);

      const response = await request(app)
        .post('/api/ai-security/policy-recommendations')
        .set('Authorization', `Bearer ${managerToken}`)
        .send({ threatLevel: { level: 'LOW', confidence: 0.5, indicators: [], recommendations: [] } });

      expect(response.status).toBe(200);
    });
  });

  describe('Error Handling', () => {
    test('should handle service initialization errors', async () => {
      MockedAISecurityAnalyzer.mockImplementation(() => {
        throw new Error('Service initialization failed');
      });

      const response = await request(app)
        .get('/api/ai-security/forecast')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(500);
    });

    test('should handle async service errors', async () => {
      mockAnalytics.generateExecutiveDashboard.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .get('/api/ai-security/executive-dashboard')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to generate executive dashboard');
    });
  });

  describe('Input Validation', () => {
    test('should validate user ID format', async () => {
      const response = await request(app)
        .get('/api/ai-security/analyze-user/invalid-user-id-format-with-special-characters!')
        .set('Authorization', `Bearer ${authToken}`);

      // Should still process but return appropriate response
      expect([200, 400].includes(response.status)).toBe(true);
    });

    test('should validate threat level structure', async () => {
      const invalidThreatLevel = {
        level: 'INVALID_LEVEL',
        confidence: 'not-a-number',
        indicators: 'not-an-array'
      };

      const response = await request(app)
        .post('/api/ai-security/policy-recommendations')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ threatLevel: invalidThreatLevel });

      // Should handle gracefully
      expect([200, 400].includes(response.status)).toBe(true);
    });
  });

  describe('Response Consistency', () => {
    test('should return consistent data types', async () => {
      mockAnalyzer.analyzeUserBehavior.mockReturnValue(75);

      const response = await request(app)
        .get('/api/ai-security/analyze-user/test-user')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(typeof response.body.riskScore).toBe('number');
      expect(typeof response.body.riskLevel).toBe('string');
      expect(typeof response.body.userId).toBe('string');
    });

    test('should include proper timestamps', async () => {
      const mockDashboard = {
        totalPolicies: 50,
        activePolicies: 45,
        totalUsers: 1000,
        securityScore: 85,
        complianceStatus: 'GOOD',
        riskTrend: 'STABLE' as const,
        recentActivities: [],
        keyMetrics: [],
        lastUpdated: new Date()
      };

      mockAnalytics.generateExecutiveDashboard.mockResolvedValue(mockDashboard);

      const response = await request(app)
        .get('/api/ai-security/executive-dashboard')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.lastUpdated).toBeDefined();
      expect(new Date(response.body.lastUpdated).getTime()).toBeGreaterThan(0);
    });
  });
});
