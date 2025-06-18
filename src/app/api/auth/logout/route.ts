import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {

    // Create response
    const response = NextResponse.json({ message: 'Logged out successfully' })

    // Clear the token cookie
    response.cookies.set('payload-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}