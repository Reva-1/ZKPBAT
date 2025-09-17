'use client'

import Link from 'next/link'
import { 
  Shield, 
  FileText, 
  Users, 
  Activity, 
  Settings,
  TrendingUp,
  Clock,
  CheckCircle,
  Lock,
  Zap,
  Brain,
  Eye,
  Globe,
  ArrowRight,
  Star,
  PlayCircle,
  BarChart3
} from 'lucide-react'
import { useState, useEffect } from 'react'

export default function HomePage() {
  const [currentMetric, setCurrentMetric] = useState(0)
  const metrics = [
    { value: "99.9%", label: "System Uptime", color: "text-green-400" },
    { value: "2.8s", label: "Avg Response Time", color: "text-blue-400" },
    { value: "256-bit", label: "Encryption Level", color: "text-purple-400" },
    { value: "24/7", label: "Monitoring", color: "text-orange-400" }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMetric((prev) => (prev + 1) % metrics.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-50">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Header */}
      <header className="relative bg-transparent backdrop-blur-sm border-b border-white/10">
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
                  ZeroTrust AI
                </h1>
                <p className="text-xs text-gray-400">Policy Administration System</p>
              </div>
            </div>
            <nav className="flex items-center space-x-6">
              <Link 
                href="/demo" 
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <PlayCircle className="h-4 w-4 mr-1" />
                Demo
              </Link>
              <Link 
                href="/login" 
                className="text-gray-300 hover:text-white px-4 py-2 rounded-md text-sm font-medium border border-gray-600 hover:border-gray-400 transition-colors"
              >
                Login
              </Link>
              <Link 
                href="/dashboard" 
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-6 py-2 rounded-lg text-sm font-medium flex items-center transition-all transform hover:scale-105"
              >
                Enter Dashboard
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Dynamic Metrics Display */}
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-300">Live System Status:</span>
                <span className={`font-bold ${metrics[currentMetric].color}`}>
                  {metrics[currentMetric].value} {metrics[currentMetric].label}
                </span>
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-8">
            <span className="bg-gradient-to-r from-white via-cyan-100 to-purple-100 bg-clip-text text-transparent">
              Next-Gen
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Security Platform
            </span>
          </h1>
          
          <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-300 leading-relaxed">
            Revolutionary zero-trust policy administration powered by <span className="text-cyan-400 font-semibold">AI behavioral analysis</span>, 
            <span className="text-purple-400 font-semibold"> blockchain immutability</span>, and 
            <span className="text-pink-400 font-semibold"> predictive threat intelligence</span>.
          </p>

          {/* CTA Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold rounded-xl hover:from-cyan-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-xl hover:shadow-cyan-500/25"
            >
              <span className="relative z-10 flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                Explore AI Dashboard
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-xl blur opacity-30 group-hover:opacity-60 transition-opacity"></div>
            </Link>
            
            <Link
              href="/zero-trust"
              className="group px-8 py-4 border-2 border-cyan-400/50 text-cyan-400 font-bold rounded-xl hover:border-cyan-400 hover:bg-cyan-400/10 transition-all backdrop-blur-sm"
            >
              <span className="flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                View Zero-Trust Demo
              </span>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-gray-400">
            <div className="flex items-center">
              <Lock className="h-4 w-4 mr-1 text-green-400" />
              SOC2 Compliant
            </div>
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-1 text-blue-400" />
              ISO 27001
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-1 text-yellow-400" />
              99.9% Uptime
            </div>
          </div>
        </div>        {/* AI-Powered Metrics Section */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Real-Time AI Security Intelligence
            </h2>
            <p className="text-gray-400">Live metrics from our advanced AI security engine</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/20 hover:border-cyan-400/40 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl">
                  <Brain className="h-6 w-6 text-cyan-400" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-cyan-400">94.7%</div>
                  <div className="text-xs text-gray-400">Threat Detection</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">AI Accuracy</span>
                  <span className="text-green-400">+2.3%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-1">
                  <div className="bg-gradient-to-r from-cyan-400 to-blue-400 h-1 rounded-full" style={{width: '94.7%'}}></div>
                </div>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 hover:border-purple-400/40 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
                  <Activity className="h-6 w-6 text-purple-400" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-400">2,847</div>
                  <div className="text-xs text-gray-400">Policies Analyzed</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">This Month</span>
                  <span className="text-green-400">+127</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-1">
                  <div className="bg-gradient-to-r from-purple-400 to-pink-400 h-1 rounded-full" style={{width: '78%'}}></div>
                </div>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20 hover:border-green-400/40 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl">
                  <Users className="h-6 w-6 text-green-400" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-400">12,493</div>
                  <div className="text-xs text-gray-400">Active Users</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Compliance Rate</span>
                  <span className="text-green-400">99.2%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-1">
                  <div className="bg-gradient-to-r from-green-400 to-emerald-400 h-1 rounded-full" style={{width: '99.2%'}}></div>
                </div>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/20 hover:border-orange-400/40 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl">
                  <Zap className="h-6 w-6 text-orange-400" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-orange-400">1.2ms</div>
                  <div className="text-xs text-gray-400">Response Time</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Avg Latency</span>
                  <span className="text-green-400">-0.3ms</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-1">
                  <div className="bg-gradient-to-r from-orange-400 to-red-400 h-1 rounded-full" style={{width: '95%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI-Powered Features */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-6">
              Revolutionary AI Security Features
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Powered by advanced machine learning algorithms and blockchain technology
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* AI Behavioral Analysis */}
            <div className="group relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-3xl p-8 border border-cyan-500/20 hover:border-cyan-400/40 transition-all transform hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 mb-6">
                  <Brain className="h-8 w-8 text-cyan-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">AI Behavioral Analysis</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Advanced ML algorithms analyze user behavior patterns to detect anomalies and predict security threats in real-time with 94.7% accuracy.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-sm text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                    Real-time threat detection
                  </li>
                  <li className="flex items-center text-sm text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                    Predictive risk scoring
                  </li>
                  <li className="flex items-center text-sm text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                    Anomaly pattern recognition
                  </li>
                </ul>
              </div>
            </div>

            {/* Zero Trust Architecture */}
            <div className="group relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-3xl p-8 border border-purple-500/20 hover:border-purple-400/40 transition-all transform hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 mb-6">
                  <Shield className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Zero Trust Security</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Never trust, always verify. Our zero-trust architecture ensures every access request is authenticated, authorized, and encrypted.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-sm text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                    Multi-factor authentication
                  </li>
                  <li className="flex items-center text-sm text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                    Continuous verification
                  </li>
                  <li className="flex items-center text-sm text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                    Microsegmentation
                  </li>
                </ul>
              </div>
            </div>

            {/* Blockchain Immutability */}
            <div className="group relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-3xl p-8 border border-orange-500/20 hover:border-orange-400/40 transition-all transform hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 mb-6">
                  <Globe className="h-8 w-8 text-orange-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Blockchain Immutability</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Tamper-proof policy records stored on blockchain ensure complete transparency and immutable audit trails for compliance.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-sm text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                    Immutable audit trails
                  </li>
                  <li className="flex items-center text-sm text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                    Decentralized verification
                  </li>
                  <li className="flex items-center text-sm text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                    Smart contract automation
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Executive Dashboard Preview */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-6">
              Executive AI Dashboard
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Real-time insights powered by advanced analytics and machine learning
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-400 mb-2">94.7%</div>
                  <div className="text-sm text-gray-400">AI Detection Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">1.2ms</div>
                  <div className="text-sm text-gray-400">Response Time</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">99.9%</div>
                  <div className="text-sm text-gray-400">System Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400 mb-2">12.5K</div>
                  <div className="text-sm text-gray-400">Protected Users</div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Link 
                  href="/dashboard"
                  className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold rounded-xl hover:from-cyan-600 hover:to-purple-600 transition-all transform hover:scale-105"
                >
                  <BarChart3 className="h-5 w-5 mr-2" />
                  View Live Dashboard
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative bg-slate-900/50 backdrop-blur-sm border-t border-white/10 mt-32">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <Shield className="h-8 w-8 text-cyan-400" />
                <span className="ml-2 text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  ZeroTrust AI
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                Revolutionary AI-powered security platform with blockchain immutability and zero-trust architecture.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/dashboard" className="hover:text-cyan-400 transition-colors">AI Dashboard</Link></li>
                <li><Link href="/zero-trust" className="hover:text-cyan-400 transition-colors">Zero Trust</Link></li>
                <li><Link href="/analytics" className="hover:text-cyan-400 transition-colors">Analytics</Link></li>
                <li><Link href="/compliance" className="hover:text-cyan-400 transition-colors">Compliance</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Security</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><span className="text-green-400">SOC 2 Type II</span></li>
                <li><span className="text-green-400">ISO 27001</span></li>
                <li><span className="text-green-400">GDPR Compliant</span></li>
                <li><span className="text-green-400">256-bit Encryption</span></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Performance</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><span className="text-cyan-400">99.9% Uptime</span></li>
                <li><span className="text-purple-400">1.2ms Response</span></li>
                <li><span className="text-green-400">94.7% AI Accuracy</span></li>
                <li><span className="text-orange-400">24/7 Monitoring</span></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 ZeroTrust AI Policy Administration System. Powered by Advanced AI, Blockchain Technology, and Zero-Trust Architecture.
            </p>
            <div className="mt-4 flex justify-center space-x-6">
              <div className="flex items-center text-xs text-gray-500">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                All Systems Operational
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-1"></div>
                AI Engine Active
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-1"></div>
                Blockchain Synced
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
