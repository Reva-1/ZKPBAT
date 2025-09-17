// Policy Types for Zero Trust System

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'admin' | 'manager' | 'user' | 'guest'
  trustScore?: number
  lastLogin?: string
}

export interface Policy {
  id: string
  title: string
  description: string
  type: 'security' | 'compliance' | 'blockchain' | 'identity'
  status: 'draft' | 'active' | 'archived'
  version: string
  effectiveDate: string
  createdAt: string
  zkProofEnabled?: boolean
  crossChainSync?: boolean
  complianceLevel?: 'critical' | 'high' | 'medium' | 'low'
  riskScore?: number
  lastValidated?: string
  createdBy?: string
  approvedBy?: string
  tags?: string[]
}

export interface ValidationResult {
  isValid: boolean
  score: number
  errors: string[]
  metadata: Record<string, any>
}

export interface ComprehensiveValidationResult {
  isValid: boolean
  overallScore: number
  validationLayers: {
    authorization: ValidationResult
    content: ValidationResult
    compliance: ValidationResult
    behavior: ValidationResult
    crossChain: ValidationResult
    zkProof: ValidationResult
  }
  errors: string[]
  recommendations: string[]
  timestamp: string
  validationId: string
}

export interface AccessContext {
  timestamp: number
  location: string
  deviceFingerprint: string
  actionType: string
  ipAddress?: string
  userAgent?: string
}

export interface ZKProofData {
  proof: string
  publicInputs: string[]
  verificationKey: string
  circuit: string
}

export interface CrossChainSyncStatus {
  network: string
  synced: boolean
  blockHeight?: number
  lastSync?: string
  gasUsed?: string
  transactionHash?: string
}

export interface ComplianceStandard {
  name: string
  required: boolean
  status: 'compliant' | 'non-compliant' | 'partial'
  lastChecked: string
  details: string[]
}

export interface BehaviorMetrics {
  timeScore: number
  locationScore: number
  deviceScore: number
  patternScore: number
  overallRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
}

export interface PolicyAuditLog {
  id: string
  policyId: string
  userId: string
  action: 'create' | 'read' | 'update' | 'delete' | 'validate'
  timestamp: string
  result: 'success' | 'failure'
  validationScore?: number
  riskFactors?: string[]
  zkProofUsed?: boolean
  blockchainRecorded?: boolean
}

export interface ThreatIntelligence {
  id: string
  type: 'behavioral_anomaly' | 'unauthorized_access' | 'policy_violation' | 'system_compromise'
  severity: 'low' | 'medium' | 'high' | 'critical'
  detected: string
  source: string
  affectedPolicies: string[]
  mitigationSteps: string[]
  resolved: boolean
}
