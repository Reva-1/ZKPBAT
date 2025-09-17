import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// This would normally connect to your backend API
// For now, we'll create a mock registration endpoint
export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, role, organization } = await request.json()

    // Basic validation
    if (!email || !password || !firstName || !lastName || !organization) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Forward to backend API
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        firstName,
        lastName,
        role: role || 'USER',
        organization
      }),
    })

    const backendData = await backendResponse.json()

    if (!backendResponse.ok) {
      return NextResponse.json(
        { message: backendData.message || 'Registration failed' },
        { status: backendResponse.status }
      )
    }

    return NextResponse.json(
      { 
        message: 'Registration successful',
        user: {
          id: backendData.user.id,
          email: backendData.user.email,
          firstName: backendData.user.firstName,
          lastName: backendData.user.lastName,
          role: backendData.user.role
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
