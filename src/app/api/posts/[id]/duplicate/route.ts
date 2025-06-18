import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = await getPayload({ config })
    const { id } = params

    // Get the current user from the request
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user has permission to create posts
    const hasPermission = user.role === 'admin' || user.role === 'blogger'
    
    if (!hasPermission) {
      return NextResponse.json(
        { message: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    // Get the original post
    const originalPost = await payload.findByID({
      collection: 'posts',
      id,
      user,
    })

    if (!originalPost) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      )
    }

    // Create a duplicate with modified title and slug
    const duplicateData = {
      ...originalPost,
      title: `${originalPost.title} (Copy)`,
      slug: `${originalPost.slug}-copy-${Date.now()}`,
      _status: 'draft' as 'draft' | 'published',
      publishedAt: null,
      createdAt: undefined,
      updatedAt: undefined,
      id: undefined,
    }

    // Remove any fields that shouldn't be duplicated
    delete duplicateData.id
    delete duplicateData.createdAt
    delete duplicateData.updatedAt

    // Create the duplicate post
    const duplicatedPost = await payload.create({
      collection: 'posts',
      data: duplicateData,
      user,
    })

    return NextResponse.json(duplicatedPost)
  } catch (error) {
    console.error('Error duplicating post:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}