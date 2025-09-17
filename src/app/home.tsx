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
  CheckCircle
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-indigo-600" />
              <h1 className="ml-2 text-xl font-bold text-gray-900">
                Policy Administration System
              </h1>
            </div>
            <nav className="flex space-x-4">
              <Link 
                href="/login" 
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
              <Link 
                href="/register" 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Register
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Blockchain-Based Policy 
            <span className="text-indigo-600"> Administration</span>
          </h2>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Secure, transparent, and immutable policy management with blockchain technology. 
            Streamline your organization's policy lifecycle with complete audit trails.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                href="/login"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
              >
                Get Started
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Link
                href="/demo"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
              >
                View Demo
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FileText className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Policies
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        127
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
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Active Users
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        1,234
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
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Compliance Rate
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        98.5%
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
                    <Activity className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Blockchain Tx
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        2,847
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="mt-20">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-900">
              Key Features
            </h3>
            <p className="mt-4 text-lg text-gray-500">
              Everything you need to manage policies effectively
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                <Shield className="h-6 w-6" />
              </div>
              <h4 className="mt-4 text-lg font-medium text-gray-900 text-center">
                Blockchain Security
              </h4>
              <p className="mt-2 text-base text-gray-500 text-center">
                Immutable policy records stored on blockchain for complete transparency and tamper-proof audit trails.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mx-auto">
                <Users className="h-6 w-6" />
              </div>
              <h4 className="mt-4 text-lg font-medium text-gray-900 text-center">
                Role-Based Access
              </h4>
              <p className="mt-2 text-base text-gray-500 text-center">
                Granular permissions with Admin, Policy Manager, User, and Auditor roles for secure access control.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                <Clock className="h-6 w-6" />
              </div>
              <h4 className="mt-4 text-lg font-medium text-gray-900 text-center">
                Version Control
              </h4>
              <p className="mt-2 text-base text-gray-500 text-center">
                Track all policy changes with detailed version history and automated change documentation.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white mx-auto">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h4 className="mt-4 text-lg font-medium text-gray-900 text-center">
                Analytics Dashboard
              </h4>
              <p className="mt-2 text-base text-gray-500 text-center">
                Real-time insights into policy compliance, user engagement, and system performance metrics.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-500 text-white mx-auto">
                <Activity className="h-6 w-6" />
              </div>
              <h4 className="mt-4 text-lg font-medium text-gray-900 text-center">
                Audit Trails
              </h4>
              <p className="mt-2 text-base text-gray-500 text-center">
                Complete audit logging of all system activities for compliance and security monitoring.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-yellow-500 text-white mx-auto">
                <Settings className="h-6 w-6" />
              </div>
              <h4 className="mt-4 text-lg font-medium text-gray-900 text-center">
                Automated Workflows
              </h4>
              <p className="mt-2 text-base text-gray-500 text-center">
                Streamlined policy approval processes with automated notifications and deadline management.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-20">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © 2024 Policy Administration System. Built with Next.js, Node.js, and Blockchain Technology.
          </p>
        </div>
      </footer>
    </div>
  )
}
