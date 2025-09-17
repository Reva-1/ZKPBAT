/**
 * Policy Validation Demo - Complete Example
 * 
 * This file demonstrates how our 6-layer policy validation system works
 * with real-world examples and use cases.
 */

import { PolicyValidationService } from './policyValidation'
import { Policy, User, AccessContext, ZKProofData } from '../types/policy'

export class PolicyValidationDemo {
  private validationService: PolicyValidationService

  constructor() {
    this.validationService = PolicyValidationService.getInstance()
  }

  /**
   * COMPLETE VALIDATION EXAMPLE
   * Shows how all 6 layers work together to validate a policy
   */
  async demonstrateComprehensiveValidation() {
    console.log('🔐 POLICY VALIDATION SYSTEM DEMONSTRATION')
    console.log('=========================================\n')

    // Sample Policy - Security Policy for Financial Data
    const samplePolicy: Policy = {
      id: 'policy-001',
      title: 'Financial Data Protection Policy',
      description: 'This policy ensures comprehensive privacy and data protection for all financial transactions and customer data in compliance with GDPR, SOX, and industry best practices. All access must be audited and logged.',
      type: 'security',
      status: 'active',
      version: '2.1.0',
      effectiveDate: '2024-02-01T00:00:00Z',
      createdAt: '2024-01-15T10:30:00Z',
      zkProofEnabled: true,
      crossChainSync: true,
      complianceLevel: 'critical',
      riskScore: 0.15,
      lastValidated: '2024-01-20T14:22:00Z',
      createdBy: 'admin@company.com',
      approvedBy: 'compliance@company.com',
      tags: ['financial', 'gdpr', 'security', 'critical']
    }

    // Sample User - Manager attempting to access policy
    const sampleUser: User = {
      id: 'user-123',
      email: 'manager@policyapp.com',
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: 'manager',
      trustScore: 0.85, // High trust score
      lastLogin: '2024-01-20T09:15:00Z'
    }

    // Access Context - Current access attempt details
    const accessContext: AccessContext = {
      timestamp: Date.now(), // Current time
      location: 'office-headquarters',
      deviceFingerprint: 'trusted-device-abc123def456',
      actionType: 'read',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    }

    // Zero Knowledge Proof Data - For privacy-preserving validation
    const zkProofData: ZKProofData = {
      proof: 'proof_' + 'x'.repeat(500), // Simulated proof string
      publicInputs: ['policy-001', 'manager-verification', 'timestamp-valid'],
      verificationKey: 'vk_' + 'y'.repeat(100),
      circuit: 'privacy-preserving-access-control'
    }

    console.log('📋 VALIDATING POLICY:', samplePolicy.title)
    console.log('👤 USER:', `${sampleUser.firstName} ${sampleUser.lastName} (${sampleUser.role})`)
    console.log('🎯 ACTION: Reading policy')
    console.log('📍 LOCATION:', accessContext.location)
    console.log('⏰ TIME:', new Date(accessContext.timestamp).toLocaleString())
    console.log('\n' + '='.repeat(60) + '\n')

    try {
      // Execute comprehensive validation
      const validationResult = await this.validationService.validatePolicy(
        samplePolicy,
        sampleUser,
        'read',
        accessContext,
        zkProofData
      )

      // Display results
      this.displayValidationResults(validationResult)
      
      return validationResult

    } catch (error) {
      console.error('❌ VALIDATION ERROR:', error)
      return null
    }
  }

  /**
   * LAYER-BY-LAYER BREAKDOWN
   * Shows what each validation layer checks
   */
  displayValidationResults(result: any) {
    console.log('🎯 OVERALL VALIDATION RESULT')
    console.log('============================')
    console.log(`✅ VALID: ${result.isValid ? 'YES' : 'NO'}`)
    console.log(`📊 OVERALL SCORE: ${(result.overallScore * 100).toFixed(1)}%`)
    console.log(`🆔 VALIDATION ID: ${result.validationId}`)
    console.log(`⏰ TIMESTAMP: ${result.timestamp}`)

    if (result.errors.length > 0) {
      console.log('\n❌ ERRORS FOUND:')
      result.errors.forEach((error: string, index: number) => {
        console.log(`   ${index + 1}. ${error}`)
      })
    }

    console.log('\n' + '='.repeat(60))
    console.log('📋 DETAILED LAYER ANALYSIS')
    console.log('='.repeat(60))

    // Layer 1: Authorization
    this.displayLayerResult('🔐 LAYER 1: AUTHORIZATION', result.validationLayers.authorization, {
      description: 'Validates user permissions, role-based access, and contextual security',
      checks: [
        'User role permissions',
        'Context-aware scoring',
        'Trust score analysis',
        'Risk factor assessment'
      ]
    })

    // Layer 2: Content Validation
    this.displayLayerResult('📄 LAYER 2: CONTENT VALIDATION', result.validationLayers.content, {
      description: 'Validates policy structure, format, and content integrity',
      checks: [
        'Required fields validation',
        'Content quality assessment',
        'Version format verification',
        'Date validation'
      ]
    })

    // Layer 3: Compliance
    this.displayLayerResult('⚖️  LAYER 3: COMPLIANCE', result.validationLayers.compliance, {
      description: 'Validates against regulatory standards (GDPR, SOX, HIPAA)',
      checks: [
        'GDPR compliance verification',
        'SOX requirements check',
        'HIPAA standards validation',
        'Industry-specific compliance'
      ]
    })

    // Layer 4: Behavioral Analysis
    this.displayLayerResult('🧠 LAYER 4: BEHAVIORAL ANALYSIS', result.validationLayers.behavior, {
      description: 'Analyzes user behavior patterns and risk indicators',
      checks: [
        'Access time patterns',
        'Location analysis',
        'Device recognition',
        'Behavioral anomaly detection'
      ]
    })

    // Layer 5: Cross-Chain Validation
    this.displayLayerResult('🔗 LAYER 5: CROSS-CHAIN VALIDATION', result.validationLayers.crossChain, {
      description: 'Validates blockchain synchronization across networks',
      checks: [
        'Multi-network synchronization',
        'Block height verification',
        'Transaction validation',
        'Gas optimization'
      ]
    })

    // Layer 6: Zero Knowledge Proof
    this.displayLayerResult('🔬 LAYER 6: ZERO-KNOWLEDGE PROOF', result.validationLayers.zkProof, {
      description: 'Privacy-preserving cryptographic verification',
      checks: [
        'Proof verification',
        'Privacy score calculation',
        'Circuit complexity analysis',
        'Cryptographic integrity'
      ]
    })

    // Recommendations
    if (result.recommendations.length > 0) {
      console.log('\n💡 RECOMMENDATIONS')
      console.log('==================')
      result.recommendations.forEach((recommendation: string, index: number) => {
        console.log(`${index + 1}. ${recommendation}`)
      })
    }
  }

  private displayLayerResult(title: string, layer: any, details: any) {
    console.log(`\n${title}`)
    console.log('-'.repeat(title.length))
    console.log(`Description: ${details.description}`)
    console.log(`Status: ${layer.isValid ? '✅ PASSED' : '❌ FAILED'}`)
    console.log(`Score: ${(layer.score * 100).toFixed(1)}%`)
    
    if (layer.errors.length > 0) {
      console.log('Errors:')
      layer.errors.forEach((error: string) => {
        console.log(`  • ${error}`)
      })
    }

    console.log('Key Checks:')
    details.checks.forEach((check: string) => {
      console.log(`  ✓ ${check}`)
    })

    if (layer.metadata) {
      console.log('Additional Info:')
      Object.entries(layer.metadata).forEach(([key, value]) => {
        if (typeof value !== 'object') {
          console.log(`  • ${key}: ${value}`)
        }
      })
    }
  }

  /**
   * REAL-WORLD USE CASES
   */
  async demonstrateUseCases() {
    console.log('\n🌟 REAL-WORLD USE CASES')
    console.log('=======================\n')

    // Use Case 1: Admin creating critical security policy
    console.log('📊 USE CASE 1: Admin Creating Critical Security Policy')
    await this.validateAdminAccess()

    // Use Case 2: Manager reading compliance policy
    console.log('\n📊 USE CASE 2: Manager Reading Compliance Policy')
    await this.validateManagerAccess()

    // Use Case 3: Suspicious user access attempt
    console.log('\n📊 USE CASE 3: Suspicious Access Attempt')
    await this.validateSuspiciousAccess()

    // Use Case 4: Cross-chain blockchain validation
    console.log('\n📊 USE CASE 4: Cross-Chain Blockchain Validation')
    await this.validateCrossChainAccess()
  }

  private async validateAdminAccess() {
    const policy: Policy = {
      id: 'critical-001',
      title: 'Zero Trust Network Security Policy',
      description: 'Critical security policy implementing zero trust architecture with multi-factor authentication and continuous verification',
      type: 'security',
      status: 'draft',
      version: '1.0.0',
      effectiveDate: '2024-02-01T00:00:00Z',
      createdAt: new Date().toISOString(),
      zkProofEnabled: true,
      crossChainSync: true,
      complianceLevel: 'critical'
    }

    const admin: User = {
      id: 'admin-001',
      email: 'admin@company.com',
      firstName: 'John',
      lastName: 'Admin',
      role: 'admin',
      trustScore: 0.95
    }

    const context: AccessContext = {
      timestamp: Date.now(),
      location: 'secure-admin-office',
      deviceFingerprint: 'admin-secure-device-xyz789',
      actionType: 'create'
    }

    const result = await this.validationService.validatePolicy(policy, admin, 'write', context)
    console.log(`Result: ${result.isValid ? '✅ APPROVED' : '❌ DENIED'} (Score: ${(result.overallScore * 100).toFixed(1)}%)`)
  }

  private async validateManagerAccess() {
    const policy: Policy = {
      id: 'compliance-001',
      title: 'GDPR Data Processing Policy',
      description: 'Data processing policy ensuring GDPR compliance with privacy by design principles',
      type: 'compliance',
      status: 'active',
      version: '1.2.0',
      effectiveDate: '2024-01-01T00:00:00Z',
      createdAt: '2023-12-15T10:00:00Z'
    }

    const manager: User = {
      id: 'manager-001',
      email: 'manager@company.com',
      firstName: 'Sarah',
      lastName: 'Manager',
      role: 'manager',
      trustScore: 0.80
    }

    const context: AccessContext = {
      timestamp: Date.now(),
      location: 'office-floor-3',
      deviceFingerprint: 'manager-laptop-abc456',
      actionType: 'read'
    }

    const result = await this.validationService.validatePolicy(policy, manager, 'read', context)
    console.log(`Result: ${result.isValid ? '✅ APPROVED' : '❌ DENIED'} (Score: ${(result.overallScore * 100).toFixed(1)}%)`)
  }

  private async validateSuspiciousAccess() {
    const policy: Policy = {
      id: 'financial-001',
      title: 'Financial Data Protection Policy',
      description: 'Highly sensitive financial data protection policy',
      type: 'security',
      status: 'active',
      version: '2.0.0',
      effectiveDate: '2024-01-01T00:00:00Z',
      createdAt: '2023-11-01T09:00:00Z'
    }

    const suspiciousUser: User = {
      id: 'user-suspicious',
      email: 'temp@external.com',
      firstName: 'Unknown',
      lastName: 'User',
      role: 'guest',
      trustScore: 0.15 // Very low trust
    }

    const suspiciousContext: AccessContext = {
      timestamp: Date.now() - 12 * 60 * 60 * 1000, // 12 hours ago (unusual time)
      location: 'unknown-external-ip',
      deviceFingerprint: 'unrecognized-device-123',
      actionType: 'read'
    }

    const result = await this.validationService.validatePolicy(policy, suspiciousUser, 'read', suspiciousContext)
    console.log(`Result: ${result.isValid ? '✅ APPROVED' : '❌ DENIED'} (Score: ${(result.overallScore * 100).toFixed(1)}%)`)
    
    if (result.recommendations.length > 0) {
      console.log('Security Recommendations:')
      result.recommendations.forEach((rec: string, i: number) => {
        console.log(`  ${i + 1}. ${rec}`)
      })
    }
  }

  private async validateCrossChainAccess() {
    const blockchainPolicy: Policy = {
      id: 'blockchain-001',
      title: 'Multi-Chain Asset Management Policy',
      description: 'Policy governing cross-chain asset transfers and validation across Ethereum, Polygon, and Arbitrum networks',
      type: 'blockchain',
      status: 'active',
      version: '1.1.0',
      effectiveDate: '2024-01-01T00:00:00Z',
      createdAt: '2023-12-01T12:00:00Z',
      zkProofEnabled: true,
      crossChainSync: true
    }

    const blockchainUser: User = {
      id: 'blockchain-admin',
      email: 'blockchain@company.com',
      firstName: 'Alex',
      lastName: 'Blockchain',
      role: 'admin',
      trustScore: 0.90
    }

    const blockchainContext: AccessContext = {
      timestamp: Date.now(),
      location: 'blockchain-operations-center',
      deviceFingerprint: 'secure-blockchain-terminal-xyz',
      actionType: 'write'
    }

    const zkProof: ZKProofData = {
      proof: 'blockchain_proof_' + 'z'.repeat(800),
      publicInputs: ['blockchain-001', 'multi-chain-verification', 'asset-validation'],
      verificationKey: 'blockchain_vk_' + 'w'.repeat(200),
      circuit: 'cross-chain-asset-verification'
    }

    const result = await this.validationService.validatePolicy(
      blockchainPolicy, 
      blockchainUser, 
      'write', 
      blockchainContext, 
      zkProof
    )
    
    console.log(`Result: ${result.isValid ? '✅ APPROVED' : '❌ DENIED'} (Score: ${(result.overallScore * 100).toFixed(1)}%)`)
    console.log(`Cross-Chain Status: ${result.validationLayers.crossChain.metadata.overallSyncHealth}`)
    console.log(`ZK-Proof Verified: ${result.validationLayers.zkProof.isValid}`)
  }
}

// Export for use in other files
export const runPolicyValidationDemo = async () => {
  const demo = new PolicyValidationDemo()
  
  console.log('🚀 Starting Policy Validation System Demo...\n')
  
  // Run comprehensive validation example
  await demo.demonstrateComprehensiveValidation()
  
  // Show real-world use cases
  await demo.demonstrateUseCases()
  
  console.log('\n🎉 Demo completed! The policy validation system provides:')
  console.log('   ✅ 6-layer comprehensive security validation')
  console.log('   ✅ Role-based access control')
  console.log('   ✅ Behavioral anomaly detection')
  console.log('   ✅ Compliance verification (GDPR, SOX, HIPAA)')
  console.log('   ✅ Cross-chain blockchain validation')
  console.log('   ✅ Zero-knowledge proof privacy protection')
  console.log('   ✅ Real-time risk assessment and recommendations')
}
