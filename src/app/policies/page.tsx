'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Shield, 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  Eye, 
  Lock, 
  Globe, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Users,
  Settings,
  Key,
  Database,
  Brain,
  Layers,
  Target
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
  zkProofEnabled: boolean
  crossChainSync: boolean
  complianceLevel: string
  riskScore: number
  lastValidated: string
}

export default function PoliciesPage() {
  const [user, setUser] = useState<User | null>(null)
  const [policies, setPolicies] = useState<Policy[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newPolicy, setNewPolicy] = useState({
    title: '',
    description: '',
    type: 'security',
    zkProofEnabled: true,
    crossChainSync: true,
    complianceLevel: 'high'
  })
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      router.push('/login')
      return
    }

    const userObj = JSON.parse(userData)
    setUser(userObj)
    
    // Check if user is admin or manager
    if (!['admin', 'manager'].includes(userObj.role?.toLowerCase())) {
      router.push('/dashboard')
      return
    }

    loadPolicies()
  }, [router])

  const loadPolicies = async () => {
    try {
      // Mock data for demonstration - in real app, this would be an API call
      const mockPolicies: Policy[] = [
        {
          id: '1',
          title: 'Zero Trust Network Access Policy',
          description: 'Comprehensive zero trust security framework requiring continuous verification of all users and devices',
          type: 'security',
          status: 'active',
          version: '2.1.0',
          effectiveDate: '2024-01-15',
          createdAt: '2024-01-10',
          zkProofEnabled: true,
          crossChainSync: true,
          complianceLevel: 'critical',
          riskScore: 95,
          lastValidated: '2024-09-15'
        },
        {
          id: '2',
          title: 'Data Privacy & GDPR Compliance',
          description: 'Privacy-preserving data handling with ZK-proof verification for EU compliance',
          type: 'compliance',
          status: 'active',
          version: '1.8.2',
          effectiveDate: '2024-02-01',
          createdAt: '2024-01-25',
          zkProofEnabled: true,
          crossChainSync: false,
          complianceLevel: 'high',
          riskScore: 88,
          lastValidated: '2024-09-14'
        },
        {
          id: '3',
          title: 'Cross-Chain Asset Management',
          description: 'Multi-blockchain policy synchronization with automated compliance verification',
          type: 'blockchain',
          status: 'active',
          version: '3.0.1',
          effectiveDate: '2024-03-01',
          createdAt: '2024-02-20',
          zkProofEnabled: true,
          crossChainSync: true,
          complianceLevel: 'high',
          riskScore: 92,
          lastValidated: '2024-09-16'
        },
        {
          id: '4',
          title: 'AI-Powered Threat Detection',
          description: 'Machine learning based behavioral analysis for anomaly detection and prevention',
          type: 'security',
          status: 'draft',
          version: '1.0.0',
          effectiveDate: '2024-10-01',
          createdAt: '2024-09-01',
          zkProofEnabled: true,
          crossChainSync: false,
          complianceLevel: 'medium',
          riskScore: 76,
          lastValidated: '2024-09-10'
        },
        {
          id: '5',
          title: 'Identity Verification with ZK-SNARKs',
          description: 'Zero-knowledge identity verification without revealing personal information',
          type: 'identity',
          status: 'active',
          version: '2.2.1',
          effectiveDate: '2024-04-01',
          createdAt: '2024-03-15',
          zkProofEnabled: true,
          crossChainSync: true,
          complianceLevel: 'critical',
          riskScore: 97,
          lastValidated: '2024-09-16'
        }
      ]
      
      setPolicies(mockPolicies)
    } catch (error) {
      console.error('Error loading policies:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const createPolicy = async () => {
    try {
      const policy: Policy = {
        id: Date.now().toString(),
        ...newPolicy,
        status: 'draft',
        version: '1.0.0',
        effectiveDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString().split('T')[0],
        riskScore: Math.floor(Math.random() * 30) + 70,
        lastValidated: new Date().toISOString().split('T')[0]
      }
      
      setPolicies([...policies, policy])
      setShowCreateModal(false)
      setNewPolicy({
        title: '',
        description: '',
        type: 'security',
        zkProofEnabled: true,
        crossChainSync: true,
        complianceLevel: 'high'
      })
    } catch (error) {
      console.error('Error creating policy:', error)
    }
  }

  const validatePolicy = (policyId: string) => {
    setPolicies(policies.map(policy => 
      policy.id === policyId 
        ? { ...policy, lastValidated: new Date().toISOString().split('T')[0], riskScore: Math.min(100, policy.riskScore + 5) }
        : policy
    ))
  }

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'all' || policy.type === filterType
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'draft':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      case 'archived':
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'security':
        return 'bg-red-500/10 text-red-400 border-red-500/20'
      case 'compliance':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'blockchain':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20'
      case 'identity':
        return 'bg-green-500/10 text-green-400 border-green-500/20'
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }
  }

  const getComplianceLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'critical':
        return 'text-red-400 bg-red-500/10'
      case 'high':
        return 'text-orange-400 bg-orange-500/10'
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/10'
      case 'low':
        return 'text-green-400 bg-green-500/10'
      default:
        return 'text-gray-400 bg-gray-500/10'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-400/30 border-t-cyan-400 mx-auto"></div>
          <p className="mt-4 text-cyan-400 font-medium">Loading Zero Trust Policies...</p>
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
              <Link href="/dashboard" className="flex items-center">
                <Shield className="h-10 w-10 text-cyan-400" />
                <div className="ml-3">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    Policy Management
                  </h1>
                  <p className="text-xs text-gray-400">Zero Trust Security Policies</p>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-white">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-xs text-gray-400">{user?.role} • Policy Admin</div>
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
        {/* Zero Trust Explanation */}
        <div className="mb-8 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/20">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl">
              <Shield className="h-8 w-8 text-cyan-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white mb-2">Why Zero Trust Security?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                <div>
                  <h3 className="text-cyan-400 font-semibold mb-2">Core Principles:</h3>
                  <ul className="space-y-1">
                    <li>• <strong>Never Trust, Always Verify</strong> - Every user and device must be authenticated</li>
                    <li>• <strong>Least Privilege Access</strong> - Minimal necessary permissions only</li>
                    <li>• <strong>Assume Breach</strong> - Plan for compromise and limit blast radius</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-purple-400 font-semibold mb-2">Our Implementation:</h3>
                  <ul className="space-y-1">
                    <li>• <strong>ZK-Proof Verification</strong> - Privacy-preserving identity validation</li>
                    <li>• <strong>Cross-Chain Sync</strong> - Immutable policy enforcement across blockchains</li>
                    <li>• <strong>AI Behavioral Analysis</strong> - Real-time anomaly detection</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-white">Policy Management</h2>
            <p className="text-gray-400">Manage zero trust security policies with ZK-proof validation</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search policies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
            >
              <option value="all">All Types</option>
              <option value="security">Security</option>
              <option value="compliance">Compliance</option>
              <option value="blockchain">Blockchain</option>
              <option value="identity">Identity</option>
            </select>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Policy
            </button>
          </div>
        </div>

        {/* Policies Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPolicies.map((policy) => (
            <div key={policy.id} className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-cyan-500/30 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">{policy.title}</h3>
                  <p className="text-sm text-gray-400 mb-3">{policy.description}</p>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getStatusColor(policy.status)}`}>
                      {policy.status.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getTypeColor(policy.type)}`}>
                      {policy.type.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* ZK-Proof and Cross-Chain Indicators */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {policy.zkProofEnabled && (
                    <div className="flex items-center text-green-400">
                      <Lock className="h-4 w-4 mr-1" />
                      <span className="text-xs">ZK-Proof</span>
                    </div>
                  )}
                  {policy.crossChainSync && (
                    <div className="flex items-center text-purple-400">
                      <Globe className="h-4 w-4 mr-1" />
                      <span className="text-xs">Cross-Chain</span>
                    </div>
                  )}
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${getComplianceLevelColor(policy.complianceLevel)}`}>
                  {policy.complianceLevel.toUpperCase()}
                </div>
              </div>

              {/* Risk Score */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-400">Security Score</span>
                  <span className="text-sm font-bold text-cyan-400">{policy.riskScore}/100</span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${policy.riskScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Metadata */}
              <div className="space-y-2 mb-4 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>Version:</span>
                  <span className="text-cyan-400">v{policy.version}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Validated:</span>
                  <span className="text-green-400">{policy.lastValidated}</span>
                </div>
                <div className="flex justify-between">
                  <span>Effective Date:</span>
                  <span>{policy.effectiveDate}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-lg transition-all">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={() => validatePolicy(policy.id)}
                  className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all"
                >
                  Validate
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Create Policy Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-2xl mx-4 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-4">Create New Zero Trust Policy</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Policy Title</label>
                  <input
                    type="text"
                    value={newPolicy.title}
                    onChange={(e) => setNewPolicy({...newPolicy, title: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50"
                    placeholder="Enter policy title..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                  <textarea
                    value={newPolicy.description}
                    onChange={(e) => setNewPolicy({...newPolicy, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50"
                    placeholder="Describe the policy purpose and scope..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Policy Type</label>
                    <select
                      value={newPolicy.type}
                      onChange={(e) => setNewPolicy({...newPolicy, type: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
                    >
                      <option value="security">Security</option>
                      <option value="compliance">Compliance</option>
                      <option value="blockchain">Blockchain</option>
                      <option value="identity">Identity</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Compliance Level</label>
                    <select
                      value={newPolicy.complianceLevel}
                      onChange={(e) => setNewPolicy({...newPolicy, complianceLevel: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
                    >
                      <option value="critical">Critical</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="zkProof"
                      checked={newPolicy.zkProofEnabled}
                      onChange={(e) => setNewPolicy({...newPolicy, zkProofEnabled: e.target.checked})}
                      className="mr-3 h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                    />
                    <label htmlFor="zkProof" className="text-sm text-gray-300">
                      Enable Zero Knowledge Proof Validation
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="crossChain"
                      checked={newPolicy.crossChainSync}
                      onChange={(e) => setNewPolicy({...newPolicy, crossChainSync: e.target.checked})}
                      className="mr-3 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label htmlFor="crossChain" className="text-sm text-gray-300">
                      Enable Cross-Chain Synchronization
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-300 hover:text-white bg-slate-700/50 hover:bg-slate-600/50 rounded-lg border border-slate-600/50 hover:border-slate-500/50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={createPolicy}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all"
                >
                  Create Policy
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
