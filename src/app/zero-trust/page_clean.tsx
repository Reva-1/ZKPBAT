'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  Shield, 
  Lock, 
  Eye, 
  Globe, 
  Users, 
  Key, 
  Brain, 
  AlertTriangle, 
  CheckCircle, 
  Target, 
  Layers,
  Database,
  Cpu,
  Zap,
  Activity,
  BarChart3
} from 'lucide-react'

interface ValidationResult {
  id: string
  type: 'identity' | 'device' | 'network' | 'data'
  status: 'verified' | 'pending' | 'failed'
  score: number
  timestamp: string
  details: string
  zkProof?: string
}

export default function ZeroTrustPage() {
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([])
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    trustScore: 94.7,
    verifiedUsers: 847,
    blockedAttempts: 23,
    zkProofsGenerated: 1247
  })

  useEffect(() => {
    // Simulate real-time validation results
    const mockValidations: ValidationResult[] = [
      {
        id: '1',
        type: 'identity',
        status: 'verified',
        score: 98,
        timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        details: 'User authentication with biometric + ZK-proof verification',
        zkProof: '0x7d4a8f9e2b1c5e8a1d3f6b9c2e5a8d1f4b7e0c3a6d9f2e5b8c1a4f7d0e3b6a9c2f5e8b1d4a7f0c3e6b9d2f5a8e1c4b7a0d3f6c9e2b5a8d1f4b7e0'
      },
      {
        id: '2',
        type: 'device',
        status: 'verified',
        score: 95,
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        details: 'Device fingerprint verified against trusted registry',
        zkProof: '0xa1b2c3d4e5f6789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890'
      },
      {
        id: '3',
        type: 'network',
        status: 'pending',
        score: 87,
        timestamp: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
        details: 'Network location verification in progress',
      },
      {
        id: '4',
        type: 'data',
        status: 'failed',
        score: 34,
        timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
        details: 'Data access attempt from unauthorized application blocked',
      }
    ]

    setValidationResults(mockValidations)

    // Update metrics every 3 seconds
    const metricsTimer = setInterval(() => {
      setRealTimeMetrics(prev => ({
        trustScore: Math.max(90, Math.min(99.9, prev.trustScore + (Math.random() - 0.5) * 2)),
        verifiedUsers: prev.verifiedUsers + Math.floor(Math.random() * 3),
        blockedAttempts: prev.blockedAttempts + Math.floor(Math.random() * 2),
        zkProofsGenerated: prev.zkProofsGenerated + Math.floor(Math.random() * 5)
      }))
    }, 3000)

    return () => clearInterval(metricsTimer)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'text-green-400 bg-green-500/10 border-green-500/20'
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
      case 'failed':
        return 'text-red-400 bg-red-500/10 border-red-500/20'
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/20'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'identity':
        return <Users className="h-5 w-5" />
      case 'device':
        return <Cpu className="h-5 w-5" />
      case 'network':
        return <Globe className="h-5 w-5" />
      case 'data':
        return <Database className="h-5 w-5" />
      default:
        return <Shield className="h-5 w-5" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-30">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Header */}
      <header className="relative bg-slate-800/50 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center">
                <Shield className="h-10 w-10 text-cyan-400" />
                <div className="ml-3">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    Zero Trust Console
                  </h1>
                  <p className="text-xs text-gray-400">Continuous Verification & Validation</p>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-4 px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600/50">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-300">Trust Score</span>
                  <span className="text-sm font-bold text-cyan-400">{realTimeMetrics.trustScore.toFixed(1)}%</span>
                </div>
              </div>
              
              <Link
                href="/dashboard"
                className="px-4 py-2 text-gray-300 hover:text-white bg-slate-700/50 hover:bg-slate-600/50 rounded-lg border border-slate-600/50 hover:border-slate-500/50 transition-all"
              >
                ← Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Zero Trust Principles */}
        <div className="mb-8 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/20">
          <h2 className="text-2xl font-bold text-white mb-6">Zero Trust Architecture in Action</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="p-4 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl mx-auto w-fit mb-3">
                <Eye className="h-8 w-8 text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Never Trust, Always Verify</h3>
              <p className="text-sm text-gray-400">Every user, device, and request is authenticated and authorized before access is granted, regardless of location or previous trust level.</p>
            </div>
            
            <div className="text-center">
              <div className="p-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl mx-auto w-fit mb-3">
                <Target className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Least Privilege Access</h3>
              <p className="text-sm text-gray-400">Users and systems receive minimal access rights necessary to complete their tasks, dynamically adjusted based on context and risk assessment.</p>
            </div>
            
            <div className="text-center">
              <div className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl mx-auto w-fit mb-3">
                <AlertTriangle className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Assume Breach</h3>
              <p className="text-sm text-gray-400">Security architecture assumes that breaches will occur and implements controls to limit damage and detect threats quickly.</p>
            </div>
          </div>
        </div>

        {/* Real-time Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-400">{realTimeMetrics.trustScore.toFixed(1)}%</div>
                <div className="text-sm text-gray-400">Overall Trust Score</div>
              </div>
              <BarChart3 className="h-8 w-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-400">{realTimeMetrics.verifiedUsers}</div>
                <div className="text-sm text-gray-400">Verified Users</div>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-400">{realTimeMetrics.blockedAttempts}</div>
                <div className="text-sm text-gray-400">Blocked Attempts</div>
              </div>
              <Shield className="h-8 w-8 text-red-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-400">{realTimeMetrics.zkProofsGenerated}</div>
                <div className="text-sm text-gray-400">ZK-Proofs Generated</div>
              </div>
              <Lock className="h-8 w-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Validation Use Cases */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Real-World Validation Use Cases</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Admin Access Scenario */}
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/20">
              <h3 className="text-lg font-bold text-white mb-4">Administrator Access Control</h3>
              
              <div className="space-y-4">
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-cyan-400">Step 1: Identity Verification</span>
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  </div>
                  <p className="text-xs text-gray-400 mb-2">
                    Admin attempts to access sensitive policy management console
                  </p>
                  <div className="text-xs text-green-400">
                    ✓ Multi-factor authentication completed
                  </div>
                  <div className="text-xs text-green-400">
                    ✓ Biometric verification successful
                  </div>
                </div>
                
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-cyan-400">Step 2: Zero Knowledge Proof</span>
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  </div>
                  <p className="text-xs text-gray-400 mb-2">
                    System generates ZK-proof to verify admin privileges without exposing role details
                  </p>
                  <div className="text-xs font-mono text-purple-400 bg-purple-500/10 p-2 rounded">
                    zk_proof: 0x7d4a8f9e2b...c5e8a1d3f6 (VERIFIED)
                  </div>
                </div>
                
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-cyan-400">Step 3: Contextual Analysis</span>
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  </div>
                  <p className="text-xs text-gray-400 mb-2">
                    AI analyzes access patterns, device trust, location, and time
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-green-400">✓ Trusted device</div>
                    <div className="text-green-400">✓ Normal hours</div>
                    <div className="text-green-400">✓ Expected location</div>
                    <div className="text-green-400">✓ Behavior normal</div>
                  </div>
                </div>
                
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                  <div className="text-sm font-medium text-green-400 mb-1">Result: Access Granted</div>
                  <div className="text-xs text-gray-400">
                    Admin granted limited session with full audit trail. Access will be re-validated every 15 minutes.
                  </div>
                </div>
              </div>
            </div>

            {/* Suspicious Activity Scenario */}
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20">
              <h3 className="text-lg font-bold text-white mb-4">Suspicious Activity Detection</h3>
              
              <div className="space-y-4">
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-red-400">Anomaly Detected</span>
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                  </div>
                  <p className="text-xs text-gray-400 mb-2">
                    User attempting to access policies from unusual location at 3:47 AM
                  </p>
                  <div className="text-xs text-red-400">
                    ⚠ Geographic anomaly detected
                  </div>
                  <div className="text-xs text-red-400">
                    ⚠ Unusual time pattern
                  </div>
                </div>
                
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-yellow-400">Enhanced Verification</span>
                    <Activity className="h-4 w-4 text-yellow-400" />
                  </div>
                  <p className="text-xs text-gray-400 mb-2">
                    System triggers additional verification steps due to high risk score
                  </p>
                  <div className="text-xs text-yellow-400">
                    ⏳ Requesting additional biometric verification
                  </div>
                  <div className="text-xs text-yellow-400">
                    ⏳ Generating challenge-response ZK-proof
                  </div>
                </div>
                
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-red-400">Verification Failed</span>
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                  </div>
                  <p className="text-xs text-gray-400 mb-2">
                    User unable to provide valid biometric confirmation
                  </p>
                  <div className="text-xs text-red-400">
                    ✗ Biometric mismatch detected
                  </div>
                </div>
                
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <div className="text-sm font-medium text-red-400 mb-1">Result: Access Denied</div>
                  <div className="text-xs text-gray-400">
                    Access blocked. Security team notified. Account temporarily locked pending investigation.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Validation Stream */}
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Live Validation Stream</h3>
            <div className="flex items-center text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm">Real-time monitoring</span>
            </div>
          </div>

          <div className="space-y-4">
            {validationResults.map((result) => (
              <div key={result.id} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      result.status === 'verified' ? 'bg-green-500/20' :
                      result.status === 'pending' ? 'bg-yellow-500/20' : 'bg-red-500/20'
                    }`}>
                      {getTypeIcon(result.type)}
                    </div>
                    <div>
                      <div className="text-white font-medium capitalize">{result.type} Validation</div>
                      <div className="text-xs text-gray-400">
                        {new Date(result.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getStatusColor(result.status)}`}>
                      {result.status.toUpperCase()}
                    </span>
                    <div className="text-xs text-gray-400 mt-1">
                      Score: {result.score}/100
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-300 mb-3">{result.details}</p>
                
                {result.zkProof && (
                  <div className="bg-slate-800/50 rounded p-3">
                    <div className="text-xs text-purple-400 mb-1">ZK-Proof Generated:</div>
                    <div className="text-xs font-mono text-gray-400 break-all">
                      {result.zkProof.substring(0, 60)}...
                    </div>
                  </div>
                )}
                
                <div className="mt-3">
                  <div className="w-full bg-slate-600/30 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        result.score >= 90 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                        result.score >= 70 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                        'bg-gradient-to-r from-red-500 to-red-600'
                      }`}
                      style={{ width: `${result.score}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
