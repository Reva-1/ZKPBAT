import { NextRequest, NextResponse } from 'next/server'

// Mock user database - in production this would be from your database
const users = [
  {
    id: 1,
    email: 'admin@policyapp.com',
    password: 'admin123',
    role: 'admin',
    trustScore: 95
  },
  {
    id: 2,
    email: 'manager@policyapp.com',
    password: 'manager123',
    role: 'manager',
    trustScore: 88
  },
  {
    id: 3,
    email: 'user@policyapp.com',
    password: 'user123',
    role: 'user',
    trustScore: 82
  }
]

// Simple JWT-like token generation for demo
const generateToken = (payload: any) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = btoa(JSON.stringify(payload))
  const signature = btoa(`signature-${Date.now()}`)
  return `${header}.${body}.${signature}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, deviceFingerprint, trustMetrics } = body

    // Find user
    const user = users.find(u => u.email === email)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Simple password verification for demo
    const isValidPassword = user.password === password
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Calculate overall trust score
    const overallTrustScore = trustMetrics 
      ? (trustMetrics.deviceTrust + trustMetrics.locationTrust + trustMetrics.behavioralTrust) / 3
      : user.trustScore

    // Generate simple token for demo
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      trustScore: overallTrustScore,
      iat: Date.now(),
      exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    })

    // Log authentication event (in production this would go to blockchain)
    console.log(`Authentication successful for ${email} - Trust Score: ${overallTrustScore}`)

    // Determine if additional authentication is required
    const requiresAdditionalAuth = overallTrustScore < 85

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        trustScore: overallTrustScore
      },
      requiresAdditionalAuth,
      message: 'Authentication successful'
    })

  } catch (error) {
    console.error('Authentication error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}
