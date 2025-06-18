import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Get the current user from the request
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })
    }

    // Get the full user data with populated relationships
    const fullUser = await payload.findByID({
      collection: 'users',
      id: user.id,
      depth: 2, // Populate relationships like avatar
    })

    // Return user data without sensitive information
    const { password, salt, hash, resetPasswordToken, resetPasswordExpiration, ...safeUser } =
      fullUser

    return NextResponse.json({
      user: safeUser,
    })
  } catch (error) {
    console.error('Auth me error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
