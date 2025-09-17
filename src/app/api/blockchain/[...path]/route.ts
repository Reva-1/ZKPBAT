import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = params.path?.join('/') || '';
    const searchParams = request.nextUrl.searchParams.toString();
    const fullPath = searchParams ? `${path}?${searchParams}` : path;
    
    // Get the authorization header
    const authorization = request.headers.get('authorization');
    
    const response = await fetch(`${BACKEND_URL}/api/blockchain/${fullPath}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authorization && { Authorization: authorization }),
      },
    });

    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Blockchain API error:', error);
    return NextResponse.json(
      { error: 'Failed to communicate with blockchain service' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = params.path?.join('/') || '';
    const body = await request.json();
    
    // Get the authorization header
    const authorization = request.headers.get('authorization');
    
    const response = await fetch(`${BACKEND_URL}/api/blockchain/${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authorization && { Authorization: authorization }),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Blockchain API error:', error);
    return NextResponse.json(
      { error: 'Failed to communicate with blockchain service' },
      { status: 500 }
    );
  }
}
