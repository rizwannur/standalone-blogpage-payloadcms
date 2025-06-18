import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getHeaders } from '@/utilities/getHeaders'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const payload = await getPayload({ config })
    const headers = await getHeaders()
    const body = await request.json()
    const { id } = params

    const { content } = body

    // Validate required fields
    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { error: 'Comment content must be 1000 characters or less' },
        { status: 400 },
      )
    }

    // Check if user is authenticated
    let user = null
    try {
      const authResult = await payload.auth({ headers })
      user = authResult.user
    } catch (authError) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Get the existing comment
    let existingComment
    try {
      existingComment = await payload.findByID({
        collection: 'comments',
        id,
      })
    } catch {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    // Check permissions: admin can edit any comment, readers can edit their own
    if (user.role !== 'admin' && existingComment.author !== user.id) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 })
    }

    // Update the comment
    const updatedComment = await payload.update({
      collection: 'comments',
      id,
      data: {
        content,
      },
    })

    return NextResponse.json(updatedComment)
  } catch (error) {
    console.error('Error updating comment:', error)
    return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const payload = await getPayload({ config })
    const headers = await getHeaders()
    const { id } = params

    // Check if user is authenticated
    let user = null
    try {
      const authResult = await payload.auth({ headers })
      user = authResult.user
    } catch (authError) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Get the existing comment
    let existingComment
    try {
      existingComment = await payload.findByID({
        collection: 'comments',
        id,
      })
    } catch {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    // Check permissions: admin can delete any comment, readers can delete their own
    if (user.role !== 'admin' && existingComment.author !== user.id) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 })
    }

    // Delete the comment
    await payload.delete({
      collection: 'comments',
      id,
    })

    return NextResponse.json({ message: 'Comment deleted successfully' })
  } catch (error) {
    console.error('Error deleting comment:', error)
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 })
  }
}