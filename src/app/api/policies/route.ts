import { NextRequest, NextResponse } from 'next/server'

// Mock policy data - in a real application, this would come from a database
const mockPolicies = [
  {
    id: '1',
    title: 'Zero Trust Network Access Policy',
    description: 'Comprehensive zero trust security framework requiring continuous verification of all users and devices',
    type: 'security',
    status: 'active',
    version: '2.1.0',
    effectiveDate: '2024-01-15',
    createdAt: '2024-01-10'
  },
  {
    id: '2',
    title: 'Data Privacy & GDPR Compliance',
    description: 'Privacy-preserving data handling with ZK-proof verification for EU compliance',
    type: 'compliance',
    status: 'active',
    version: '1.8.2',
    effectiveDate: '2024-02-01',
    createdAt: '2024-01-25'
  },
  {
    id: '3',
    title: 'Cross-Chain Asset Management',
    description: 'Multi-blockchain policy synchronization with automated compliance verification',
    type: 'blockchain',
    status: 'active',
    version: '3.0.1',
    effectiveDate: '2024-03-01',
    createdAt: '2024-02-20'
  },
  {
    id: '4',
    title: 'AI-Powered Threat Detection',
    description: 'Machine learning based behavioral analysis for anomaly detection and prevention',
    type: 'security',
    status: 'draft',
    version: '1.0.0',
    effectiveDate: '2024-10-01',
    createdAt: '2024-09-01'
  },
  {
    id: '5',
    title: 'Identity Verification with ZK-SNARKs',
    description: 'Zero-knowledge identity verification without revealing personal information',
    type: 'identity',
    status: 'active',
    version: '2.2.1',
    effectiveDate: '2024-04-01',
    createdAt: '2024-03-15'
  }
]

export async function GET(request: NextRequest) {
  try {
    // Check for authorization header
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - Missing or invalid authorization header' },
        { status: 401 }
      )
    }

    // In a real application, you would verify the JWT token here
    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    
    // For demo purposes, accept any non-empty token
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      )
    }

    // Return policies data
    return NextResponse.json({
      success: true,
      policies: mockPolicies,
      total: mockPolicies.length
    })

  } catch (error) {
    console.error('Error in policies API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check for authorization header
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - Missing or invalid authorization header' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Validate required fields
    if (!body.title || !body.description || !body.type) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, type' },
        { status: 400 }
      )
    }

    // Create new policy object
    const newPolicy = {
      id: Date.now().toString(),
      title: body.title,
      description: body.description,
      type: body.type,
      status: 'draft',
      version: '1.0.0',
      effectiveDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0]
    }

    // In a real application, you would save to database here
    // For demo, just return the created policy
    return NextResponse.json({
      success: true,
      policy: newPolicy,
      message: 'Policy created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating policy:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
