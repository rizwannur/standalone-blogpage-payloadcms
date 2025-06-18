import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function PATCH(request: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Get the current user from the request
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, bio, socialLinks, preferences, avatar } = body

    // Update the user profile
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        ...(name && { name }),
        ...(bio !== undefined && { bio }),
        ...(socialLinks && { socialLinks }),
        ...(preferences && { preferences }),
        ...(avatar && { avatar }),
      },
    })

    // Get the updated user data with populated avatar
    const updatedUser = await payload.findByID({
      collection: 'users',
      id: user.id,
      depth: 2, // Populate relationships
    })

    // Return the updated user data (excluding sensitive fields)
    const { password, salt, hash, resetPasswordToken, resetPasswordExpiration, ...safeUser } =
      updatedUser

    return NextResponse.json(safeUser)
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Get the current user from the request
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Get the full user data with populated avatar
    const fullUser = await payload.findByID({
      collection: 'users',
      id: user.id,
      depth: 2, // Populate relationships
    })

    // Get user stats (posts and comments count)
    const [postsCount, commentsCount] = await Promise.all([
      payload.count({
        collection: 'posts',
        where: {
          author: {
            equals: user.id,
          },
        },
      }),
      payload.count({
        collection: 'comments',
        where: {
          author: {
            equals: user.id,
          },
        },
      }),
    ])

    // Return user profile with stats
    const { password, salt, hash, resetPasswordToken, resetPasswordExpiration, ...safeUser } =
      fullUser

    return NextResponse.json({
      ...safeUser,
      stats: {
        postsCount: postsCount.totalDocs,
        commentsCount: commentsCount.totalDocs,
        likesReceived: 0, // TODO: Implement likes system
      },
    })
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
