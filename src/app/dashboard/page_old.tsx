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
  Sparkles
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
        {/* AI Security Command Center */}
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
                href="/ai-security"
                className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                <Brain className="h-4 w-4 mr-2" />
                AI Analytics
              </Link>
            </div>
          </div>
        </div>

        {/* Real-Time AI Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Threat Detection Rate */}
          <div className="group bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/20 hover:border-cyan-400/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl">
                <Brain className="h-6 w-6 text-cyan-400" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-cyan-400">{aiMetrics.threatDetection.toFixed(1)}%</div>
                <div className="text-xs text-gray-400">AI Detection Rate</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Neural Network</span>
                <span className="text-green-400">+0.3%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-1.5">
                <div className="bg-gradient-to-r from-cyan-400 to-blue-400 h-1.5 rounded-full transition-all duration-1000" style={{width: `${aiMetrics.threatDetection}%`}}></div>
              </div>
            </div>
          </div>

          {/* Behavior Analysis */}
          <div className="group bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 hover:border-purple-400/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
                <Activity className="h-6 w-6 text-purple-400" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-400">{aiMetrics.behaviorAnalysis.toFixed(1)}%</div>
                <div className="text-xs text-gray-400">Behavior Accuracy</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Pattern Recognition</span>
                <span className="text-green-400">+1.2%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-1.5">
                <div className="bg-gradient-to-r from-purple-400 to-pink-400 h-1.5 rounded-full transition-all duration-1000" style={{width: `${aiMetrics.behaviorAnalysis}%`}}></div>
              </div>
            </div>
          </div>

          {/* Active Policies */}
          <div className="group bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20 hover:border-green-400/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl">
                <FileText className="h-6 w-6 text-green-400" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-400">{policies.length}</div>
                <div className="text-xs text-gray-400">Active Policies</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Compliance</span>
                <span className="text-green-400">99.2%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-1.5">
                <div className="bg-gradient-to-r from-green-400 to-emerald-400 h-1.5 rounded-full" style={{width: '99.2%'}}></div>
              </div>
            </div>
          </div>

          {/* Risk Assessment */}
          <div className="group bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/20 hover:border-orange-400/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl">
                {aiMetrics.riskLevel === 'LOW' ? (
                  <CheckCircle className="h-6 w-6 text-green-400" />
                ) : aiMetrics.riskLevel === 'MEDIUM' ? (
                  <AlertTriangle className="h-6 w-6 text-orange-400" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-red-400" />
                )}
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${aiMetrics.riskLevel === 'LOW' ? 'text-green-400' : aiMetrics.riskLevel === 'MEDIUM' ? 'text-orange-400' : 'text-red-400'}`}>
                  {aiMetrics.riskLevel}
                </div>
                <div className="text-xs text-gray-400">Risk Level</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Anomaly Score</span>
                <span className={aiMetrics.anomalyScore < 30 ? 'text-green-400' : 'text-orange-400'}>
                  {aiMetrics.anomalyScore.toFixed(0)}
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-1.5">
                <div className={`h-1.5 rounded-full transition-all duration-1000 ${aiMetrics.anomalyScore < 30 ? 'bg-gradient-to-r from-green-400 to-emerald-400' : 'bg-gradient-to-r from-orange-400 to-red-400'}`} style={{width: `${Math.min(100, aiMetrics.anomalyScore)}%`}}></div>
              </div>
            </div>
          </div>
        </div>
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Active Policies
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {policies.filter(p => p.status === 'ACTIVE').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      My Assignments
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      12
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Compliance Rate
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      95%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Policies Section */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Recent Policies
              </h3>
              <div className="flex space-x-3">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search policies..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </button>
                {(user?.role === 'ADMIN' || user?.role === 'POLICY_MANAGER') && (
                  <button className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="h-4 w-4 mr-2" />
                    New Policy
                  </button>
                )}
              </div>
            </div>

            {policies.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No policies</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating a new policy.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Policy
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Version
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Effective Date
                      </th>
                      <th className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {policies.slice(0, 10).map((policy) => (
                      <tr key={policy.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {policy.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {policy.description?.substring(0, 50)}...
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(policy.type)}`}>
                            {policy.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(policy.status)}`}>
                            {policy.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {policy.version}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(policy.effectiveDate || policy.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-indigo-600 hover:text-indigo-900">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
