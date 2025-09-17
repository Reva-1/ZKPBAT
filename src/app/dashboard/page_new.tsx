'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Shield, 
  FileText, 
  Users, 
  Activity, 
  LogOut,
  Plus,
  Search,
  Filter,
  Link as LinkIcon,
  Brain,
  Zap,
  Eye,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Globe,
  Lock,
  Cpu,
  Layers,
  Target,
  Sparkles,
  Settings
} from 'lucide-react'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
}

interface Policy {
  id: string
  title: string
  description: string
  type: string
  status: string
  version: string
  effectiveDate: string
  createdAt: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [policies, setPolicies] = useState<Policy[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [aiMetrics, setAiMetrics] = useState({
    threatDetection: 94.7,
    behaviorAnalysis: 98.2,
    anomalyScore: 15,
    riskLevel: 'LOW'
  })
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      router.push('/login')
      return
    }

    setUser(JSON.parse(userData))
    loadPolicies()
    
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Simulate AI metrics updates
    const aiTimer = setInterval(() => {
      setAiMetrics(prev => ({
        threatDetection: Math.max(90, Math.min(99.9, prev.threatDetection + (Math.random() - 0.5) * 2)),
        behaviorAnalysis: Math.max(95, Math.min(99.9, prev.behaviorAnalysis + (Math.random() - 0.5) * 1)),
        anomalyScore: Math.max(0, Math.min(100, prev.anomalyScore + (Math.random() - 0.5) * 10)),
        riskLevel: prev.anomalyScore < 30 ? 'LOW' : prev.anomalyScore < 70 ? 'MEDIUM' : 'HIGH'
      }))
    }, 3000)

    return () => {
      clearInterval(timer)
      clearInterval(aiTimer)
    }
  }, [router])

  const loadPolicies = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/policies', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setPolicies(data.policies || [])
      }
    } catch (error) {
      console.error('Error loading policies:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800'
      case 'archived':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'security':
        return 'bg-red-100 text-red-800'
      case 'hr':
        return 'bg-purple-100 text-purple-800'
      case 'compliance':
        return 'bg-blue-100 text-blue-800'
      case 'it':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-400/30 border-t-cyan-400 mx-auto"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-cyan-400/20"></div>
          </div>
          <p className="mt-4 text-cyan-400 font-medium">Initializing AI Security Dashboard...</p>
        </div>
      </div>
    )
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
              <div className="relative">
                <Shield className="h-10 w-10 text-cyan-400" />
                <div className="absolute inset-0 h-10 w-10 text-cyan-400 animate-pulse opacity-50">
                  <Shield className="h-10 w-10" />
                </div>
              </div>
              <div className="ml-3">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  ZeroTrust AI Dashboard
                </h1>
                <p className="text-xs text-gray-400">{currentTime.toLocaleTimeString()} • System Status: Operational</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4 px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600/50">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-300">AI Engine</span>
                  <span className="text-xs text-green-400 font-semibold">{aiMetrics.threatDetection.toFixed(1)}%</span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm font-medium text-white">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-xs text-gray-400">{user?.role} • {user?.email}</div>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-gray-300 hover:text-white bg-slate-700/50 hover:bg-slate-600/50 rounded-lg border border-slate-600/50 hover:border-slate-500/50 transition-all"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white">AI Security Command Center</h2>
              <p className="text-gray-400 mt-1">Real-time threat intelligence and behavioral analysis</p>
            </div>
            <div className="flex space-x-4">
              <Link 
                href="/zero-trust"
                className="flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all"
              >
                <Eye className="h-4 w-4 mr-2" />
                Zero Trust Console
              </Link>
              <Link 
                href="/cross-chain"
                className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                <Globe className="h-4 w-4 mr-2" />
                Cross-Chain Bridge
              </Link>
              <Link 
                href="/zk-proofs"
                className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all"
              >
                <Lock className="h-4 w-4 mr-2" />
                ZK Proof Lab
              </Link>
              {(user?.role === 'admin' || user?.role === 'manager') && (
                <Link 
                  href="/policies"
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Policies
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* AI Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl">
                <Brain className="h-6 w-6 text-cyan-400" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-cyan-400">{aiMetrics.threatDetection.toFixed(1)}%</div>
                <div className="text-xs text-gray-400">AI Detection</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
                <Activity className="h-6 w-6 text-purple-400" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-400">{aiMetrics.behaviorAnalysis.toFixed(1)}%</div>
                <div className="text-xs text-gray-400">Behavior Analysis</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl">
                <FileText className="h-6 w-6 text-green-400" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-400">{policies.length}</div>
                <div className="text-xs text-gray-400">Active Policies</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-400">{aiMetrics.riskLevel}</div>
                <div className="text-xs text-gray-400">Risk Level</div>
              </div>
            </div>
          </div>
        </div>

        {/* Zero Knowledge & Cross-Chain Features */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Zero Knowledge Proof & Cross-Chain Operations</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Zero Knowledge Proofs */}
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl">
                  <Lock className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-bold text-white">Zero Knowledge Proofs</h3>
                  <p className="text-xs text-gray-400">Privacy-preserving verification</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">Policy Compliance Proof</span>
                    <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded">VERIFIED</span>
                  </div>
                  <div className="text-xs text-gray-400 font-mono">
                    zk_proof: 0x7d4a8f9e2b...c5e8a1d3f6
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    ✓ User meets security clearance without revealing identity
                  </div>
                </div>
                
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">Access Rights Proof</span>
                    <span className="text-xs text-blue-400 bg-blue-400/10 px-2 py-1 rounded">GENERATING</span>
                  </div>
                  <div className="text-xs text-gray-400 font-mono">
                    zk_circuit: role_verification.circom
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    ⏳ Proving admin privileges without exposing user data
                  </div>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">Audit Trail Integrity</span>
                    <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded">PROVEN</span>
                  </div>
                  <div className="text-xs text-gray-400 font-mono">
                    merkle_root: 0xa1b2c3d4e5f6...
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    ✓ Actions verified without revealing transaction details
                  </div>
                </div>
              </div>
            </div>

            {/* Cross-Chain Operations */}
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
                  <Globe className="h-6 w-6 text-purple-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-bold text-white">Cross-Chain Bridge</h3>
                  <p className="text-xs text-gray-400">Multi-blockchain policy sync</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">Ethereum Mainnet</span>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      <span className="text-xs text-green-400">SYNCED</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    Policies: 247 • Gas: 15 gwei • Block: 18,458,392
                  </div>
                </div>
                
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">Polygon</span>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      <span className="text-xs text-green-400">SYNCED</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    Policies: 247 • Gas: 0.002 MATIC • Block: 48,792,156
                  </div>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">Arbitrum</span>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                      <span className="text-xs text-blue-400">BRIDGING</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    Syncing: 234/247 policies • ETA: 2 min
                  </div>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">Base</span>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mr-2 animate-pulse"></div>
                      <span className="text-xs text-orange-400">PENDING</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    Queue: 13 policies • Optimistic rollup ready
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Use Cases */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Admin Command Center - Real Use Cases</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Compliance Monitoring */}
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl">
                  <BarChart3 className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-bold text-white">Compliance Monitoring</h3>
                  <p className="text-xs text-gray-400">Real-time regulatory tracking</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <div>
                    <div className="text-sm text-white">GDPR Compliance</div>
                    <div className="text-xs text-gray-400">EU Data Protection</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-green-400">98.7%</div>
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <div>
                    <div className="text-sm text-white">SOX Controls</div>
                    <div className="text-xs text-gray-400">Financial Oversight</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-green-400">99.2%</div>
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <div>
                    <div className="text-sm text-white">HIPAA Security</div>
                    <div className="text-xs text-gray-400">Healthcare Privacy</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-orange-400">94.1%</div>
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Threat Intelligence */}
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl">
                  <AlertTriangle className="h-6 w-6 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-bold text-white">Threat Intelligence</h3>
                  <p className="text-xs text-gray-400">AI-powered security alerts</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-red-400 font-medium">HIGH RISK</span>
                    <span className="text-xs text-gray-400">2 min ago</span>
                  </div>
                  <div className="text-xs text-gray-300">
                    Unusual access pattern detected: user@company.com accessing sensitive policies outside normal hours
                  </div>
                  <button className="mt-2 text-xs text-cyan-400 hover:text-cyan-300">
                    Generate ZK-Proof Investigation →
                  </button>
                </div>
                
                <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-orange-400 font-medium">MEDIUM RISK</span>
                    <span className="text-xs text-gray-400">15 min ago</span>
                  </div>
                  <div className="text-xs text-gray-300">
                    Cross-chain policy sync delay detected on Arbitrum network
                  </div>
                  <button className="mt-2 text-xs text-cyan-400 hover:text-cyan-300">
                    Initiate Bridge Recovery →
                  </button>
                </div>

                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-green-400 font-medium">RESOLVED</span>
                    <span className="text-xs text-gray-400">1 hour ago</span>
                  </div>
                  <div className="text-xs text-gray-300">
                    Failed login attempts from unknown IP successfully blocked
                  </div>
                </div>
              </div>
            </div>

            {/* Blockchain Analytics */}
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/20">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl">
                  <Layers className="h-6 w-6 text-cyan-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-bold text-white">Blockchain Analytics</h3>
                  <p className="text-xs text-gray-400">Immutable audit trails</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-white">Total Transactions</span>
                    <span className="text-sm font-bold text-cyan-400">2,847</span>
                  </div>
                  <div className="text-xs text-gray-400">Across 4 blockchain networks</div>
                </div>
                
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-white">Gas Optimization</span>
                    <span className="text-sm font-bold text-green-400">-34%</span>
                  </div>
                  <div className="text-xs text-gray-400">Cross-chain routing efficiency</div>
                </div>

                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-white">Merkle Tree Depth</span>
                    <span className="text-sm font-bold text-purple-400">18</span>
                  </div>
                  <div className="text-xs text-gray-400">Optimal for ZK-SNARK proofs</div>
                </div>

                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-white">Proof Generation</span>
                    <span className="text-sm font-bold text-orange-400">1.2s</span>
                  </div>
                  <div className="text-xs text-gray-400">Average ZK-proof time</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Policies Overview */}
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Policy Overview</h3>
            <Link
              href="/policies"
              className="flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Policy
            </Link>
          </div>

          {policies.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-300">No policies found</h3>
              <p className="mt-1 text-gray-400">Get started by creating your first AI-powered policy.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {policies.slice(0, 6).map((policy) => (
                <div key={policy.id} className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30 hover:border-slate-500/50 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-white font-medium text-sm truncate">{policy.title}</h4>
                      <p className="text-gray-400 text-xs mt-1">{policy.description}</p>
                    </div>
                    <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(policy.status)}`}>
                      {policy.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(policy.type)}`}>
                      {policy.type}
                    </span>
                    <div className="text-xs text-gray-400">v{policy.version}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
