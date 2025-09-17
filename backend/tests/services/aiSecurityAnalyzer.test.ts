import { AISecurityAnalyzer } from '../../src/services/aiSecurityAnalyzer';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    auditLog: {
      findMany: jest.fn(),
    },
    policy: {
      findMany: jest.fn(),
    },
  })),
}));

jest.mock('../../src/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

describe('AISecurityAnalyzer', () => {
  let analyzer: AISecurityAnalyzer;
  
  beforeEach(() => {
    analyzer = new AISecurityAnalyzer();
    jest.clearAllMocks();
  });

  describe('analyzeUserBehavior', () => {
    it('should return behavior score for valid user', () => {
      const result = analyzer.analyzeUserBehavior('user-123');
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(100);
    });

    it('should handle empty user ID', () => {
      const result = analyzer.analyzeUserBehavior('');
      expect(typeof result).toBe('number');
    });
  });

  describe('detectAnomalies', () => {
    it('should detect anomalies in access requests', () => {
      const accessRequest = {
        userId: 'user-123',
        resource: 'sensitive-data',
        timestamp: new Date(),
        location: 'unknown',
      };

      const result = analyzer.detectAnomalies(accessRequest);
      
      expect(result).toHaveProperty('level');
      expect(result).toHaveProperty('confidence');
      expect(result).toHaveProperty('indicators');
      expect(result).toHaveProperty('recommendations');
      expect(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).toContain(result.level);
    });
  });

  describe('predictSecurityIncidents', () => {
    it('should generate security forecast', () => {
      const result = analyzer.predictSecurityIncidents();
      
      expect(result).toHaveProperty('predictedThreats');
      expect(result).toHaveProperty('riskTrend');
      expect(result).toHaveProperty('confidenceScore');
      expect(result).toHaveProperty('timeframe');
      expect(['INCREASING', 'STABLE', 'DECREASING']).toContain(result.riskTrend);
    });
  });

  describe('adaptPoliciesBasedOnThreat', () => {
    it('should generate policy updates based on threat level', () => {
      const threatLevel = {
        level: 'HIGH' as const,
        confidence: 0.8,
        indicators: ['Unusual access pattern'],
        recommendations: ['Increase monitoring'],
      };

      const result = analyzer.adaptPoliciesBasedOnThreat(threatLevel);
      
      expect(Array.isArray(result)).toBe(true);
      result.forEach(update => {
        expect(update).toHaveProperty('policyId');
        expect(update).toHaveProperty('changes');
        expect(update).toHaveProperty('reason');
        expect(update).toHaveProperty('priority');
      });
    });
  });
});