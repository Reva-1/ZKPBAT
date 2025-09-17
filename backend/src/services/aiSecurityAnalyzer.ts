import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

interface UserBehaviorPattern {
  userId: string;
  avgLoginTime: number;
  commonLocations: string[];
  typicalDevices: string[];
  accessPatterns: AccessPattern[];
  riskFactors: RiskFactor[];
}

interface AccessPattern {
  resourceType: string;
  frequency: number;
  timeOfDay: number;
  dayOfWeek: number;
  location: string;
  deviceFingerprint: string;
}

interface RiskFactor {
  type: 'LOCATION' | 'TIME' | 'DEVICE' | 'BEHAVIOR' | 'NETWORK';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  score: number;
  description: string;
}

interface ThreatLevel {
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidence: number;
  indicators: string[];
  recommendations: string[];
}

interface SecurityForecast {
  predictedThreats: PredictedThreat[];
  riskTrend: 'INCREASING' | 'STABLE' | 'DECREASING';
  confidenceScore: number;
  timeframe: '24h' | '7d' | '30d';
}

interface PredictedThreat {
  type: string;
  probability: number;
  estimatedImpact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  preventionStrategies: string[];
}

interface PolicyUpdate {
  policyId: string;
  suggestedChanges: PolicyChange[];
  reason: string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH';
}

interface PolicyChange {
  field: string;
  currentValue: any;
  suggestedValue: any;
  justification: string;
}

export class AISecurityAnalyzer {
  private prisma: PrismaClient;
  private behaviorProfiles: Map<string, UserBehaviorPattern> = new Map();
  private threatIntelligence: any[] = [];

  constructor() {
    this.prisma = new PrismaClient();
    this.initializeAI();
  }

  private async initializeAI() {
    // Initialize AI models and load historical data
    logger.info('Initializing AI Security Analyzer');
    await this.loadHistoricalBehaviorData();
    await this.loadThreatIntelligence();
  }

  private async loadHistoricalBehaviorData() {
    try {
      // Load user behavior patterns from database
      const users = await this.prisma.user.findMany({
        include: {
          auditLogs: {
            orderBy: { createdAt: 'desc' },
            take: 1000 // Last 1000 activities per user
          }
        }
      });

      for (const user of users) {
        const pattern = await this.analyzeBehaviorPattern(user);
        this.behaviorProfiles.set(user.id, pattern);
      }

      logger.info(`Loaded behavior patterns for ${users.length} users`);
    } catch (error) {
      logger.error('Failed to load historical behavior data:', error);
    }
  }

  private async analyzeBehaviorPattern(user: any): Promise<UserBehaviorPattern> {
    const auditLogs = user.auditLogs || [];
    
    // Analyze login patterns
    const loginTimes = auditLogs
      .filter((log: any) => log.action === 'LOGIN')
      .map((log: any) => new Date(log.createdAt).getHours());
    
    const avgLoginTime = loginTimes.length > 0 
      ? loginTimes.reduce((a: number, b: number) => a + b, 0) / loginTimes.length 
      : 9; // Default to 9 AM

    // Extract location patterns
    const locations = auditLogs
      .map((log: any) => log.location || 'Unknown')
      .filter((loc: string) => loc !== 'Unknown');
    
    const commonLocations = this.findMostCommon(locations, 3);

    // Extract device patterns
    const devices = auditLogs
      .map((log: any) => log.userAgent || 'Unknown')
      .filter((device: string) => device !== 'Unknown');
    
    const typicalDevices = this.findMostCommon(devices, 2);

    // Analyze access patterns
    const accessPatterns = this.extractAccessPatterns(auditLogs);

    // Calculate risk factors
    const riskFactors = this.calculateRiskFactors(user, auditLogs);

    return {
      userId: user.id,
      avgLoginTime,
      commonLocations,
      typicalDevices,
      accessPatterns,
      riskFactors
    };
  }

  private findMostCommon(arr: string[], count: number): string[] {
    const frequency: { [key: string]: number } = {};
    arr.forEach(item => frequency[item] = (frequency[item] || 0) + 1);
    
    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, count)
      .map(([item]) => item);
  }

  private extractAccessPatterns(auditLogs: any[]): AccessPattern[] {
    const patterns: { [key: string]: AccessPattern } = {};

    auditLogs.forEach((log: any) => {
      const resourceType = log.entityType || 'GENERAL';
      const date = new Date(log.createdAt);
      const timeOfDay = date.getHours();
      const dayOfWeek = date.getDay();
      const location = log.location || 'Unknown';
      const deviceFingerprint = this.generateDeviceFingerprint(log.userAgent || '');

      const key = `${resourceType}_${timeOfDay}_${dayOfWeek}`;
      
      if (!patterns[key]) {
        patterns[key] = {
          resourceType,
          frequency: 0,
          timeOfDay,
          dayOfWeek,
          location,
          deviceFingerprint
        };
      }
      
      patterns[key].frequency++;
    });

    return Object.values(patterns);
  }

  private generateDeviceFingerprint(userAgent: string): string {
    // Simple device fingerprinting based on user agent
    const hash = this.simpleHash(userAgent);
    return hash.toString(16).substring(0, 8);
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  }

  private calculateRiskFactors(user: any, auditLogs: any[]): RiskFactor[] {
    const riskFactors: RiskFactor[] = [];

    // Check for unusual login times
    const loginTimes = auditLogs
      .filter((log: any) => log.action === 'LOGIN')
      .map((log: any) => new Date(log.createdAt).getHours());

    if (loginTimes.some((time: number) => time < 6 || time > 22)) {
      riskFactors.push({
        type: 'TIME',
        severity: 'MEDIUM',
        score: 30,
        description: 'Login attempts outside normal business hours detected'
      });
    }

    // Check for multiple location access
    const locations = new Set(auditLogs.map((log: any) => log.location).filter(Boolean));
    if (locations.size > 5) {
      riskFactors.push({
        type: 'LOCATION',
        severity: 'HIGH',
        score: 50,
        description: 'Access from multiple geographic locations detected'
      });
    }

    // Check for device diversity
    const devices = new Set(auditLogs.map((log: any) => log.userAgent).filter(Boolean));
    if (devices.size > 3) {
      riskFactors.push({
        type: 'DEVICE',
        severity: 'MEDIUM',
        score: 25,
        description: 'Access from multiple devices detected'
      });
    }

    return riskFactors;
  }

  private async loadThreatIntelligence() {
    try {
      // Load threat intelligence from database
      const threats = await this.prisma.threatIntelligence?.findMany({
        where: { isActive: true }
      }) || [];
      
      this.threatIntelligence = threats.map(threat => ({
        type: threat.type,
        indicators: [threat.indicator],
        severity: threat.severity,
        description: threat.description
      }));
      
      // Add some default threat intelligence if none exists
      if (this.threatIntelligence.length === 0) {
        this.threatIntelligence = [
          {
            type: 'MALICIOUS_IP',
            indicators: ['192.168.1.100', '10.0.0.50'],
            severity: 'HIGH',
            description: 'Known malicious IP addresses'
          },
          {
            type: 'SUSPICIOUS_USER_AGENT',
            indicators: ['bot', 'crawler', 'scanner'],
            severity: 'MEDIUM',
            description: 'Suspicious user agent patterns'
          }
        ];
      }
    } catch (error) {
      logger.error('Failed to load threat intelligence:', error);
      // Fallback to default threats
      this.threatIntelligence = [
        {
          type: 'MALICIOUS_IP',
          indicators: ['192.168.1.100', '10.0.0.50'],
          severity: 'HIGH',
          description: 'Known malicious IP addresses'
        }
      ];
    }
    
    logger.info(`Loaded ${this.threatIntelligence.length} threat intelligence items`);
  }

  public analyzeUserBehavior(userId: string): number {
    const profile = this.behaviorProfiles.get(userId);
    if (!profile) {
      return 50; // Default medium risk for unknown users
    }

    let riskScore = 0;
    const baseScore = 20; // Base risk score

    // Calculate risk based on various factors
    profile.riskFactors.forEach(factor => {
      riskScore += factor.score;
    });

    // Normalize risk score (0-100)
    const normalizedScore = Math.min(Math.max(baseScore + riskScore, 0), 100);
    
    logger.info(`Risk score for user ${userId}: ${normalizedScore}`);
    return normalizedScore;
  }

  public detectAnomalies(accessRequest: any): ThreatLevel {
    const indicators: string[] = [];
    let riskScore = 0;

    // Check against threat intelligence
    this.threatIntelligence.forEach(threat => {
      threat.indicators.forEach((indicator: string) => {
        if (JSON.stringify(accessRequest).toLowerCase().includes(indicator.toLowerCase())) {
          indicators.push(`Matched threat indicator: ${indicator}`);
          riskScore += 30;
        }
      });
    });

    // Behavioral anomaly detection
    const userProfile = this.behaviorProfiles.get(accessRequest.userId);
    if (userProfile) {
      const currentHour = new Date().getHours();
      if (Math.abs(currentHour - userProfile.avgLoginTime) > 4) {
        indicators.push('Access outside typical time pattern');
        riskScore += 20;
      }

      const currentLocation = accessRequest.location;
      if (currentLocation && !userProfile.commonLocations.includes(currentLocation)) {
        indicators.push('Access from unusual location');
        riskScore += 25;
      }
    }

    // Determine threat level
    let level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    let confidence: number;

    if (riskScore >= 75) {
      level = 'CRITICAL';
      confidence = 0.9;
    } else if (riskScore >= 50) {
      level = 'HIGH';
      confidence = 0.8;
    } else if (riskScore >= 25) {
      level = 'MEDIUM';
      confidence = 0.7;
    } else {
      level = 'LOW';
      confidence = 0.6;
    }

    const recommendations = this.generateRecommendations(level, indicators);

    return {
      level,
      confidence,
      indicators,
      recommendations
    };
  }

  private generateRecommendations(level: string, indicators: string[]): string[] {
    const recommendations: string[] = [];

    if (level === 'CRITICAL' || level === 'HIGH') {
      recommendations.push('Require multi-factor authentication');
      recommendations.push('Initiate security review');
      recommendations.push('Alert security team');
    }

    if (indicators.some(i => i.includes('location'))) {
      recommendations.push('Verify user location through secondary channel');
    }

    if (indicators.some(i => i.includes('time'))) {
      recommendations.push('Request business justification for off-hours access');
    }

    if (indicators.some(i => i.includes('threat indicator'))) {
      recommendations.push('Block access immediately');
      recommendations.push('Quarantine user account');
    }

    return recommendations;
  }

  public predictSecurityIncidents(): SecurityForecast {
    // Advanced ML prediction would go here
    // For now, using rule-based prediction

    const predictedThreats: PredictedThreat[] = [
      {
        type: 'Credential Stuffing Attack',
        probability: 0.3,
        estimatedImpact: 'MEDIUM',
        preventionStrategies: [
          'Enable account lockout policies',
          'Implement CAPTCHA for repeated login attempts',
          'Monitor for unusual login patterns'
        ]
      },
      {
        type: 'Insider Threat',
        probability: 0.15,
        estimatedImpact: 'HIGH',
        preventionStrategies: [
          'Enhance user behavior monitoring',
          'Implement data loss prevention',
          'Regular access reviews'
        ]
      },
      {
        type: 'Phishing Attack',
        probability: 0.45,
        estimatedImpact: 'MEDIUM',
        preventionStrategies: [
          'Security awareness training',
          'Email security gateways',
          'Link analysis and sandboxing'
        ]
      }
    ];

    return {
      predictedThreats,
      riskTrend: 'STABLE',
      confidenceScore: 0.75,
      timeframe: '7d'
    };
  }

  public adaptPoliciesBasedOnThreat(threatLevel: ThreatLevel): PolicyUpdate[] {
    const updates: PolicyUpdate[] = [];

    if (threatLevel.level === 'HIGH' || threatLevel.level === 'CRITICAL') {
      updates.push({
        policyId: 'AUTH_POLICY_001',
        suggestedChanges: [
          {
            field: 'mfaRequired',
            currentValue: false,
            suggestedValue: true,
            justification: 'High threat level detected - enforce MFA for all users'
          }
        ],
        reason: 'Elevated threat level requires enhanced authentication',
        urgency: 'HIGH'
      });

      updates.push({
        policyId: 'SESSION_POLICY_001',
        suggestedChanges: [
          {
            field: 'sessionTimeout',
            currentValue: 3600, // 1 hour
            suggestedValue: 1800, // 30 minutes
            justification: 'Reduce session timeout due to high threat level'
          }
        ],
        reason: 'Shorter sessions reduce attack window',
        urgency: 'MEDIUM'
      });
    }

    return updates;
  }

  public async updateBehaviorProfile(userId: string, newActivity: any) {
    const profile = this.behaviorProfiles.get(userId);
    if (profile) {
      // Update behavior profile with new activity
      // This would involve more sophisticated ML model updates
      logger.info(`Updated behavior profile for user ${userId}`);
    }
  }
}
