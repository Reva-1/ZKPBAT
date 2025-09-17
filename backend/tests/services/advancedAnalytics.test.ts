import { AdvancedAnalytics } from '../../src/services/advancedAnalytics';
import { PrismaClient } from '@prisma/client';
import { logger } from '../../src/utils/logger';

// Mock logger first
jest.mock('../../src/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock PrismaClient
const mockPrismaClient = {
  policy: {
    count: jest.fn(),
    findMany: jest.fn(),
  },
  user: {
    count: jest.fn(),
  },
  auditLog: {
    count: jest.fn(),
    findMany: jest.fn(),
  },
  securityIncident: {
    count: jest.fn(),
    findMany: jest.fn(),
  },
} as any;

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockPrismaClient),
}));

describe('AdvancedAnalytics', () => {
  let analytics: AdvancedAnalytics;

  beforeEach(() => {
    jest.clearAllMocks();
    analytics = new AdvancedAnalytics();
  });

  describe('Executive Dashboard Generation', () => {
    test('should generate executive dashboard with all required metrics', async () => {
      // Mock database responses
      mockPrismaClient.policy.count
        .mockResolvedValueOnce(50)  // total policies
        .mockResolvedValueOnce(40); // active policies
      mockPrismaClient.user.count.mockResolvedValue(1000);
      mockPrismaClient.auditLog.findMany.mockResolvedValue([
        { action: 'LOGIN', createdAt: new Date('2025-09-10') },
        { action: 'POLICY_UPDATE', createdAt: new Date('2025-09-11') },
      ]);

      const dashboard = await analytics.generateExecutiveDashboard();

      expect(dashboard).toHaveProperty('totalPolicies');
      expect(dashboard).toHaveProperty('activePolicies');
      expect(dashboard).toHaveProperty('totalUsers');
      expect(dashboard).toHaveProperty('securityScore');
      expect(dashboard).toHaveProperty('complianceStatus');
      expect(dashboard).toHaveProperty('riskTrend');
      expect(dashboard).toHaveProperty('recentActivities');
      expect(dashboard).toHaveProperty('keyMetrics');

      expect(dashboard.totalPolicies).toBe(50);
      expect(dashboard.activePolicies).toBe(40);
      expect(dashboard.totalUsers).toBe(1000);
      expect(dashboard.securityScore).toBeGreaterThanOrEqual(0);
      expect(dashboard.securityScore).toBeLessThanOrEqual(100);
    });

    test('should handle database errors gracefully', async () => {
      mockPrismaClient.policy.count.mockRejectedValue(new Error('Database error'));

      const dashboard = await analytics.generateExecutiveDashboard();

      expect(dashboard.totalPolicies).toBe(0);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('Compliance Status Analysis', () => {
    test('should analyze compliance for multiple frameworks', async () => {
      mockPrismaClient.policy.findMany.mockResolvedValue([
        { 
          id: '1', 
          complianceFramework: 'SOX',
          status: 'ACTIVE',
          lastReviewed: new Date('2025-08-01')
        },
        { 
          id: '2', 
          complianceFramework: 'GDPR',
          status: 'ACTIVE',
          lastReviewed: new Date('2025-09-01')
        },
      ]);

      const complianceAnalysis = await analytics.analyzeCompliance();

      expect(complianceAnalysis).toHaveLength(2);
      expect(complianceAnalysis[0]).toHaveProperty('framework');
      expect(complianceAnalysis[0]).toHaveProperty('overallScore');
      expect(complianceAnalysis[0]).toHaveProperty('controlsAssessed');
      expect(complianceAnalysis[0]).toHaveProperty('controlsCompliant');
      expect(complianceAnalysis[0]).toHaveProperty('riskLevel');
      expect(complianceAnalysis[0]).toHaveProperty('recommendations');
      expect(complianceAnalysis[0]).toHaveProperty('lastAssessment');
    });

    test('should handle empty policy data', async () => {
      mockPrismaClient.policy.findMany.mockResolvedValue([]);

      const complianceAnalysis = await analytics.analyzeCompliance();

      expect(complianceAnalysis).toHaveLength(0);
    });
  });

  describe('Performance Metrics', () => {
    test('should calculate comprehensive performance metrics', async () => {
      mockPrismaClient.securityIncident.findMany.mockResolvedValue([
        { 
          id: '1',
          severity: 'HIGH',
          status: 'RESOLVED',
          createdAt: new Date('2025-09-01'),
          resolvedAt: new Date('2025-09-02')
        },
        {
          id: '2',
          severity: 'MEDIUM',
          status: 'RESOLVED', 
          createdAt: new Date('2025-09-03'),
          resolvedAt: new Date('2025-09-04')
        }
      ]);

      mockPrismaClient.auditLog.findMany.mockResolvedValue([
        { action: 'POLICY_VIEW', userId: 'user1', createdAt: new Date('2025-09-10') },
        { action: 'POLICY_VIEW', userId: 'user2', createdAt: new Date('2025-09-11') },
      ]);

      const metrics = await analytics.calculatePerformanceMetrics();

      expect(metrics).toHaveProperty('averageIncidentResolutionTime');
      expect(metrics).toHaveProperty('securityPosture');
      expect(metrics).toHaveProperty('userEngagement');
      expect(metrics).toHaveProperty('policyEffectiveness');
      expect(metrics).toHaveProperty('complianceReadiness');
      expect(metrics).toHaveProperty('threatResponse');

      expect(metrics.averageIncidentResolutionTime).toBeGreaterThan(0);
      expect(metrics.securityPosture).toBeGreaterThanOrEqual(0);
      expect(metrics.securityPosture).toBeLessThanOrEqual(100);
    });
  });

  describe('ROI Analysis', () => {
    test('should calculate return on investment', async () => {
      mockPrismaClient.securityIncident.count.mockResolvedValue(5);
      mockPrismaClient.auditLog.count.mockResolvedValue(1000);

      const roiAnalysis = await analytics.calculateROI();

      expect(roiAnalysis).toHaveProperty('totalInvestment');
      expect(roiAnalysis).toHaveProperty('costSavings');
      expect(roiAnalysis).toHaveProperty('roiPercentage');
      expect(roiAnalysis).toHaveProperty('paybackPeriod');
      expect(roiAnalysis).toHaveProperty('riskReduction');
      expect(roiAnalysis).toHaveProperty('efficiencyGains');

      expect(roiAnalysis.totalInvestment).toBeGreaterThan(0);
      expect(roiAnalysis.costSavings).toBeGreaterThanOrEqual(0);
      expect(roiAnalysis.roiPercentage).toBeGreaterThanOrEqual(-100);
    });
  });

  describe('Industry Benchmarking', () => {
    test('should generate industry benchmark comparison', async () => {
      const benchmarks = await analytics.generateBenchmarkReport();

      expect(benchmarks).toHaveProperty('securityMaturity');
      expect(benchmarks).toHaveProperty('incidentFrequency');
      expect(benchmarks).toHaveProperty('complianceReadiness');
      expect(benchmarks).toHaveProperty('industryComparison');
      expect(benchmarks).toHaveProperty('recommendations');

      expect(['BASIC', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']).toContain(benchmarks.securityMaturity);
      expect(['BELOW_AVERAGE', 'AVERAGE', 'ABOVE_AVERAGE', 'EXCELLENT']).toContain(benchmarks.industryComparison);
    });
  });

  describe('Predictive Analytics', () => {
    test('should generate predictive insights', async () => {
      mockPrismaClient.securityIncident.findMany.mockResolvedValue([
        { severity: 'HIGH', createdAt: new Date('2025-08-01') },
        { severity: 'MEDIUM', createdAt: new Date('2025-08-15') },
        { severity: 'LOW', createdAt: new Date('2025-09-01') },
      ]);

      const insights = await analytics.generatePredictiveInsights();

      expect(insights).toHaveProperty('userGrowthForecast');
      expect(insights).toHaveProperty('securityTrendAnalysis');
      expect(insights).toHaveProperty('complianceForecasting');
      expect(insights).toHaveProperty('resourceRequirements');
      expect(insights).toHaveProperty('budgetProjections');

      expect(insights.securityTrendAnalysis).toHaveProperty('trend');
      expect(insights.securityTrendAnalysis).toHaveProperty('confidence');
      expect(['IMPROVING', 'STABLE', 'DECLINING']).toContain(insights.securityTrendAnalysis.trend);
    });
  });
});
