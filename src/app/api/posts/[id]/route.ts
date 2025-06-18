import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = await getPayload({ config })
    const data = await request.json()
    const { id } = await params

    // Get the current user from the request
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has permission to edit posts
    const hasPermission = user.role === 'admin' || user.role === 'blogger'

    if (!hasPermission) {
      return NextResponse.json({ message: 'Insufficient permissions' }, { status: 403 })
    }

    // Update the post
    const updatedPost = await payload.update({
      collection: 'posts',
      id,
      data,
      user,
    })

    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const payload = await getPayload({ config })
    const { id } = await params

    // Get the current user from the request
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has permission to delete posts
    const hasPermission = user.role === 'admin' || user.role === 'blogger'

    if (!hasPermission) {
      return NextResponse.json({ message: 'Insufficient permissions' }, { status: 403 })
    }

    // Delete the post
    await payload.delete({
      collection: 'posts',
      id,
      user,
    })

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
