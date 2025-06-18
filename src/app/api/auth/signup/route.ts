import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json(
        { message: 'Name, email and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config })

    // Check if user already exists
    const existingUsers = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email.toLowerCase(),
        },
      },
    })

    if (existingUsers.docs.length > 0) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Create user (Payload will handle password hashing automatically)
    const newUser = await payload.create({
      collection: 'users',
      data: {
        email: email.toLowerCase(),
        password,
        name,
        role: 'blogger', // Default role
        isActive: true,
      },
    })

    // Login the user after successful signup
    const loginResult = await payload.login({
      collection: 'users',
      data: {
        email: email.toLowerCase(),
        password,
      },
    })

    if (loginResult.user && loginResult.token) {
      const response = NextResponse.json({
        message: 'Account created successfully',
        user: {
          id: loginResult.user.id,
          email: loginResult.user.email,
          name: loginResult.user.name,
          role: loginResult.user.role,
        },
        token: loginResult.token,
      })

      // Set the token as an HTTP-only cookie
      response.cookies.set('payload-token', loginResult.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      })

      return response
    } else {
      return NextResponse.json(
        { message: 'Account created but login failed' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}