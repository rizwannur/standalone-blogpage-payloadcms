import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * GET /api/users/avatar
 * Fetch the current user's avatar information
 */
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Get the current user from the request
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Get the user data with populated avatar
    const userData = await payload.findByID({
      collection: 'users',
      id: user.id,
      depth: 2, // Populate avatar relationship
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
      },
    })

    return NextResponse.json({
      id: userData.id,
      email: userData.email,
      name: userData.name,
      avatar: userData.avatar,
    })
  } catch (error) {
    console.error('Avatar fetch error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PATCH /api/users/avatar
 * Update the current user's avatar
 */
export async function PATCH(request: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Get the current user from the request
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { avatar } = body

    // Validate avatar field
    if (avatar === undefined) {
      return NextResponse.json(
        { message: 'Avatar field is required' },
        { status: 400 }
      )
    }

    // If avatar is provided and not null, validate it exists in media collection
    if (avatar !== null) {
      try {
        await payload.findByID({
          collection: 'media',
          id: avatar,
        })
      } catch {
        return NextResponse.json(
          { message: 'Invalid avatar media ID' },
          { status: 400 }
        )
      }
    }

    // Update only the avatar field
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        avatar,
      },
    })

    // Get the updated user data with populated avatar
    const updatedUser = await payload.findByID({
      collection: 'users',
      id: user.id,
      depth: 2, // Populate avatar relationship
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
      },
    })

    return NextResponse.json({
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      avatar: updatedUser.avatar,
      message: 'Avatar updated successfully',
    })
  } catch (error) {
    console.error('Avatar update error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/users/avatar
 * Remove the current user's avatar
 */
export async function DELETE(request: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Get the current user from the request
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Remove the avatar by setting it to null
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        avatar: null,
      },
    })

    return NextResponse.json({
      message: 'Avatar removed successfully',
    })
  } catch (error) {
    console.error('Avatar removal error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}