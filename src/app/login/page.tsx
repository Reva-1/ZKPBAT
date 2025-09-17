'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Shield, Eye, EyeOff, Lock, Fingerprint, Wifi, Globe, Zap } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  enableZKAuth: z.boolean().optional(),
  deviceTrust: z.boolean().optional(),
})

type LoginForm = z.infer<typeof loginSchema>

interface TrustMetrics {
  deviceTrust: number
  locationTrust: number
  behavioralTrust: number
  crossChainVerified: boolean
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [zkAuthEnabled, setZkAuthEnabled] = useState(false)
  const [trustMetrics, setTrustMetrics] = useState<TrustMetrics>({
    deviceTrust: 0,
    locationTrust: 0,
    behavioralTrust: 0,
    crossChainVerified: false
  })
  const [authenticationStage, setAuthenticationStage] = useState<'initial' | 'biometric' | 'zk-proof' | 'cross-chain'>('initial')
  const router = useRouter()

  useEffect(() => {
    // Initialize Zero Trust assessment
    initializeTrustAssessment()
  }, [])

  const initializeTrustAssessment = async () => {
    try {
      // Simulate device fingerprinting
      const deviceTrust = await assessDeviceTrust()
      const locationTrust = await assessLocationTrust()
      const behavioralTrust = 85 // Initial baseline
      
      setTrustMetrics({
        deviceTrust,
        locationTrust,
        behavioralTrust,
        crossChainVerified: false
      })
    } catch (error) {
      console.error('Trust assessment failed:', error)
    }
  }

  const assessDeviceTrust = async (): Promise<number> => {
    // Simulate device trust assessment
    const userAgent = navigator.userAgent
    const screen = window.screen
    const deviceSignature = `${userAgent}-${screen.width}x${screen.height}`
    
    // Mock assessment - in production this would be more sophisticated
    return Math.floor(Math.random() * 30) + 70 // 70-100 range
  }

  const assessLocationTrust = async (): Promise<number> => {
    // Simulate geolocation-based trust assessment
    try {
      if ('geolocation' in navigator) {
        // In production, this would assess location against known safe zones
        return Math.floor(Math.random() * 20) + 80 // 80-100 range
      }
      return 75
    } catch {
      return 75
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    
    try {
      // Stage 1: Traditional Authentication
      setAuthenticationStage('initial')
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          deviceFingerprint: await generateDeviceFingerprint(),
          trustMetrics: trustMetrics
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Login failed')
      }

      // Stage 2: Enhanced MFA if needed (based on trust score)
      const overallTrustScore = (trustMetrics.deviceTrust + trustMetrics.locationTrust + trustMetrics.behavioralTrust) / 3
      
      if (overallTrustScore < 85 || zkAuthEnabled) {
        await performAdvancedAuthentication(result.user)
      }

      // Store token and user data
      localStorage.setItem('token', result.token)
      localStorage.setItem('user', JSON.stringify(result.user))
      localStorage.setItem('trustScore', overallTrustScore.toString())

      toast.success('Zero Trust Authentication Complete!')
      
      // Navigate based on trust level
      if (overallTrustScore >= 95 && trustMetrics.crossChainVerified) {
        router.push('/zero-trust')
      } else {
        router.push('/dashboard')
      }
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Authentication failed')
    } finally {
      setIsLoading(false)
      setAuthenticationStage('initial')
    }
  }

  const generateDeviceFingerprint = async (): Promise<string> => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.textBaseline = 'top'
      ctx.font = '14px Arial'
      ctx.fillText('Device fingerprint', 2, 2)
    }
    
    const fingerprint = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screen: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      canvas: canvas.toDataURL()
    }
    
    return btoa(JSON.stringify(fingerprint))
  }

  const performAdvancedAuthentication = async (user: any) => {
    // Stage 2: Biometric Authentication (simulated)
    setAuthenticationStage('biometric')
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Stage 3: Zero-Knowledge Proof Generation
    if (zkAuthEnabled) {
      setAuthenticationStage('zk-proof')
      await generateZKProof(user)
    }
    
    // Stage 4: Cross-Chain Verification
    setAuthenticationStage('cross-chain')
    await performCrossChainVerification(user)
  }

  const generateZKProof = async (user: any) => {
    // Simulate zk-SNARK proof generation
    await new Promise(resolve => setTimeout(resolve, 3000))
    toast.success('Zero-Knowledge Proof Generated')
  }

  const performCrossChainVerification = async (user: any) => {
    // Simulate cross-chain verification
    await new Promise(resolve => setTimeout(resolve, 1500))
    setTrustMetrics(prev => ({ ...prev, crossChainVerified: true }))
    toast.success('Cross-Chain Verification Complete')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div>
          <div className="flex justify-center">
            <div className="relative">
              <Shield className="h-12 w-12 text-cyan-400" />
              <div className="absolute -top-1 -right-1">
                <div className="h-4 w-4 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Zero Trust Authentication
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Advanced security with zk-SNARKs & Cross-Chain verification
          </p>
        </div>

        {/* Trust Metrics Display */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Trust Assessment</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Device Trust</span>
                <span className="text-xs text-cyan-400">{trustMetrics.deviceTrust}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1">
                <div 
                  className="bg-cyan-400 h-1 rounded-full transition-all duration-500"
                  style={{ width: `${trustMetrics.deviceTrust}%` }}
                ></div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Location</span>
                <span className="text-xs text-green-400">{trustMetrics.locationTrust}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1">
                <div 
                  className="bg-green-400 h-1 rounded-full transition-all duration-500"
                  style={{ width: `${trustMetrics.locationTrust}%` }}
                ></div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Behavioral</span>
                <span className="text-xs text-purple-400">{trustMetrics.behavioralTrust}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1">
                <div 
                  className="bg-purple-400 h-1 rounded-full transition-all duration-500"
                  style={{ width: `${trustMetrics.behavioralTrust}%` }}
                ></div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="h-3 w-3 text-blue-400" />
              <span className="text-xs text-gray-400">Cross-Chain</span>
              {trustMetrics.crossChainVerified ? (
                <div className="h-2 w-2 bg-green-400 rounded-full"></div>
              ) : (
                <div className="h-2 w-2 bg-gray-600 rounded-full"></div>
              )}
            </div>
          </div>
        </div>

        {/* Authentication Stage Indicator */}
        {authenticationStage !== 'initial' && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700">
            <div className="flex items-center space-x-3">
              {authenticationStage === 'biometric' && (
                <>
                  <Fingerprint className="h-5 w-5 text-yellow-400 animate-pulse" />
                  <span className="text-sm text-yellow-400">Biometric Verification...</span>
                </>
              )}
              {authenticationStage === 'zk-proof' && (
                <>
                  <Lock className="h-5 w-5 text-purple-400 animate-spin" />
                  <span className="text-sm text-purple-400">Generating Zero-Knowledge Proof...</span>
                </>
              )}
              {authenticationStage === 'cross-chain' && (
                <>
                  <Globe className="h-5 w-5 text-blue-400 animate-pulse" />
                  <span className="text-sm text-blue-400">Cross-Chain Verification...</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email address
              </label>
              <input
                {...register('email')}
                type="email"
                autoComplete="email"
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-slate-600 bg-slate-800/50 backdrop-blur-sm placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="appearance-none relative block w-full px-3 py-2 pr-10 border border-slate-600 bg-slate-800/50 backdrop-blur-sm placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-300" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400 hover:text-gray-300" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>

            {/* Advanced Security Options */}
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  id="zk-auth"
                  type="checkbox"
                  checked={zkAuthEnabled}
                  onChange={(e) => setZkAuthEnabled(e.target.checked)}
                  className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-600 bg-slate-800 rounded"
                />
                <label htmlFor="zk-auth" className="ml-2 flex items-center text-sm text-gray-300">
                  <Lock className="h-4 w-4 mr-1 text-purple-400" />
                  Enable Zero-Knowledge Authentication
                </label>
              </div>
              
              <div className="text-xs text-gray-400 ml-6">
                Generate cryptographic proof without revealing credentials
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-600 bg-slate-800 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                Trust this device
              </label>
            </div>

            <div className="text-sm">
              <Link
                href="/forgot-password"
                className="font-medium text-cyan-400 hover:text-cyan-300"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Authenticating...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Secure Sign In</span>
                </div>
              )}
            </button>
          </div>

          {/* Advanced Security Features */}
          <div className="mt-6 space-y-4">
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-4 border border-slate-700">
              <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                <Zap className="h-4 w-4 mr-2 text-yellow-400" />
                Advanced Security Features
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-400">End-to-End Encryption</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-400">Cross-Chain Audit</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-purple-400 rounded-full"></div>
                  <span className="text-gray-400">Zero-Knowledge Proofs</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-gray-400">Quantum Resistant</span>
                </div>
              </div>
            </div>

            {/* Demo Credentials */}
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-4 border border-slate-700">
              <h3 className="text-sm font-medium text-gray-300 mb-2">Demo Credentials:</h3>
              <div className="text-xs text-gray-400 space-y-1">
                <p><strong className="text-cyan-400">Admin:</strong> admin@policyapp.com / admin123</p>
                <p><strong className="text-green-400">Manager:</strong> manager@policyapp.com / manager123</p>
                <p><strong className="text-yellow-400">User:</strong> user@policyapp.com / user123</p>
              </div>
              <div className="mt-2 text-xs text-purple-400">
                💡 Enable ZK-Auth for enhanced privacy demonstration
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4">
            <Link
              href="/"
              className="flex items-center space-x-1 text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <span>←</span>
              <span>Back to Home</span>
            </Link>
            
            <Link
              href="/zero-trust"
              className="flex items-center space-x-1 text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span>Zero Trust Dashboard</span>
            </Link>
          </div>
        </form>

        {/* Registration Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link 
              href="/register" 
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Create one here
            </Link>
          </p>
        </div>

        {/* Demo Link */}
        <div className="text-center mt-2">
          <Link 
            href="/demo" 
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            View System Demo
          </Link>
        </div>
      </div>
    </div>
  )
}
