'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Shield, 
  FileText, 
  Users, 
  Activity, 
  Database, 
  Server, 
  Globe,
  Code,
  Play,
  CheckCircle,
  AlertCircle,
  Info,
  Zap
} from 'lucide-react'

interface DemoSection {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  status: 'completed' | 'active' | 'pending'
  features: string[]
}

export default function DemoPage() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null)

  const demoSections: DemoSection[] = [
    {
      id: 'authentication',
      title: 'Authentication System',
      description: 'User registration, login, and role-based access control',
      icon: <Shield className="h-6 w-6" />,
      status: 'completed',
      features: [
        'User Registration with validation',
        'Secure login with JWT tokens',
        'Role-based permissions (Admin, Manager, User)',
        'Password hashing with bcrypt',
        'Protected routes and middleware'
      ]
    },
    {
      id: 'policy-management',
      title: 'Policy Management',
      description: 'Create, update, and manage organizational policies',
      icon: <FileText className="h-6 w-6" />,
      status: 'completed',
      features: [
        'CRUD operations for policies',
        'Policy versioning system',
        'Category-based organization',
        'Status management (Draft, Active, Archived)',
        'Rich text content support'
      ]
    },
    {
      id: 'dashboard',
      title: 'Admin Dashboard',
      description: 'Comprehensive dashboard with analytics and metrics',
      icon: <Activity className="h-6 w-6" />,
      status: 'completed',
      features: [
        'Policy statistics overview',
        'User activity monitoring',
        'Compliance rate tracking',
        'Interactive data tables',
        'Real-time updates'
      ]
    },
    {
      id: 'database',
      title: 'Database Layer',
      description: 'PostgreSQL with Prisma ORM for data management',
      icon: <Database className="h-6 w-6" />,
      status: 'completed',
      features: [
        'PostgreSQL database setup',
        'Prisma ORM integration',
        'Automated migrations',
        'Data seeding scripts',
        'Relationship management'
      ]
    },
    {
      id: 'blockchain',
      title: 'Blockchain Integration',
      description: 'Smart contracts for policy immutability and verification',
      icon: <Zap className="h-6 w-6" />,
      status: 'active',
      features: [
        'Ethereum/Polygon smart contracts',
        'Policy hash verification',
        'Immutable audit trails',
        'Cross-chain compatibility',
        'Gas optimization'
      ]
    },
    {
      id: 'api',
      title: 'RESTful API',
      description: 'Complete backend API with Express.js',
      icon: <Server className="h-6 w-6" />,
      status: 'completed',
      features: [
        'RESTful API endpoints',
        'Request validation middleware',
        'Error handling',
        'API documentation',
        'Rate limiting and security'
      ]
    }
  ]

  const testCredentials = [
    {
      role: 'Administrator',
      email: 'admin@policyapp.com',
      password: 'admin123',
      description: 'Full system access and management capabilities'
    },
    {
      role: 'Policy Manager',
      email: 'manager@policyapp.com',
      password: 'manager123',
      description: 'Can create, edit, and manage policies'
    },
    {
      role: 'User',
      email: 'user@policyapp.com',
      password: 'user123',
      description: 'Can view and acknowledge assigned policies'
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'active':
        return <Play className="h-5 w-5 text-blue-500" />
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      default:
        return <Info className="h-5 w-5 text-gray-500" />
    }
  }

  const runDemo = async (demoId: string) => {
    setActiveDemo(demoId)
    // Simulate demo execution
    setTimeout(() => {
      setActiveDemo(null)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-indigo-600" />
              <h1 className="ml-2 text-xl font-bold text-gray-900">
                Policy Admin System - Demo
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Go to App
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Introduction */}
        <div className="bg-white rounded-lg shadow mb-8 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Blockchain Policy Administration System Demo
          </h2>
          <p className="text-gray-600 mb-4">
            This demo showcases a comprehensive policy administration system built with modern web technologies
            and blockchain integration. The system provides secure, transparent, and immutable policy management
            for organizations.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Globe className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-900">Full-Stack Solution</h3>
              <p className="text-sm text-blue-700">Next.js, Express.js, PostgreSQL</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-green-900">Secure & Compliant</h3>
              <p className="text-sm text-green-700">JWT, RBAC, Audit Trails</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Zap className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-purple-900">Blockchain Ready</h3>
              <p className="text-sm text-purple-700">Smart Contracts, Immutable Records</p>
            </div>
          </div>
        </div>

        {/* Demo Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {demoSections.map((section) => (
            <div key={section.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-2 bg-indigo-100 rounded-lg">
                    {section.icon}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
                    <p className="text-sm text-gray-500">{section.description}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {getStatusIcon(section.status)}
                </div>
              </div>

              <ul className="space-y-2 mb-4">
                {section.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => runDemo(section.id)}
                disabled={activeDemo === section.id}
                className={`w-full px-4 py-2 rounded-md text-sm font-medium ${
                  activeDemo === section.id
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {activeDemo === section.id ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2"></div>
                    Running Demo...
                  </div>
                ) : (
                  'Test Component'
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Test Credentials */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Test Credentials
          </h3>
          <p className="text-gray-600 mb-4">
            Use these pre-configured accounts to test different user roles and permissions:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testCredentials.map((cred, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">{cred.role}</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Email:</span> {cred.email}</p>
                  <p><span className="font-medium">Password:</span> {cred.password}</p>
                  <p className="text-gray-600 text-xs mt-2">{cred.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Core Functionality Testing */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Code className="h-5 w-5 mr-2" />
            Core Functionality Testing Guide
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Authentication Testing</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Test user registration with validation</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Login with different user roles</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Verify role-based access control</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Test protected route navigation</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Policy Management Testing</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Create new policies (Admin/Manager only)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>View policy dashboard and statistics</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Test policy search and filtering</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Verify different access levels per role</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h5 className="font-semibold text-blue-900 mb-1">Testing Instructions</h5>
                <p className="text-sm text-blue-800">
                  1. Start by logging in with different user accounts to test role-based access<br/>
                  2. Navigate through the dashboard to explore available features<br/>
                  3. Try creating policies with Admin/Manager accounts<br/>
                  4. Test the registration flow with new user accounts<br/>
                  5. Verify that users see appropriate content based on their roles
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
