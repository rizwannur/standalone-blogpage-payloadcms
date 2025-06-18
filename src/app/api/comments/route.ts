import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getHeaders } from '@/utilities/getHeaders'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = new URL(request.url)
    
    const postId = searchParams.get('post')
    const status = searchParams.get('status') || 'approved'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const parentComment = searchParams.get('parentComment')
    
    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      )
    }

    // Build where clause
    const where: any = {
      post: {
        equals: postId,
      },
    }

    // Filter by status
    if (status !== 'all') {
      where.status = {
        equals: status,
      }
    }

    // Filter by parent comment (for replies)
    if (parentComment) {
      where.parentComment = {
        equals: parentComment,
      }
    } else {
      // Only get top-level comments (no parent)
      where.parentComment = {
        exists: false,
      }
    }

    const comments = await payload.find({
      collection: 'comments',
      where,
      page,
      limit,
      sort: '-createdAt',
      depth: 2, // Include author and post data
    })

    // For each comment, fetch its replies
    const commentsWithReplies = await Promise.all(
      comments.docs.map(async (comment) => {
        const replies = await payload.find({
          collection: 'comments',
          where: {
            parentComment: {
              equals: comment.id,
            },
            status: {
              equals: 'approved',
            },
          },
          sort: 'createdAt',
          depth: 2,
        })

        return {
          ...comment,
          replies: replies.docs,
        }
      })
    )

    return NextResponse.json({
      ...comments,
      docs: commentsWithReplies,
    })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const headers = await getHeaders()
    const body = await request.json()
    
    const {
      content,
      post,
      parentComment,
      authorName,
      authorEmail,
      authorWebsite,
    } = body

    // Validate required fields
    if (!content || !post) {
      return NextResponse.json(
        { error: 'Content and post ID are required' },
        { status: 400 }
      )
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { error: 'Comment content must be 1000 characters or less' },
        { status: 400 }
      )
    }

    // Check if user is authenticated
    let user = null
    try {
      const authResult = await payload.auth({ headers })
      user = authResult.user
    } catch (authError) {
      // User is not authenticated, which is fine for anonymous comments
    }

    // If user is not authenticated, require name and email
    if (!user && (!authorName || !authorEmail)) {
      return NextResponse.json(
        { error: 'Name and email are required for anonymous comments' },
        { status: 400 }
      )
    }

    // Validate email format for anonymous comments
    if (!user && authorEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(authorEmail)) {
        return NextResponse.json(
          { error: 'Please provide a valid email address' },
          { status: 400 }
        )
      }
    }

    // Validate website URL if provided
    if (authorWebsite) {
      try {
        new URL(authorWebsite)
      } catch {
        return NextResponse.json(
          { error: 'Please provide a valid website URL' },
          { status: 400 }
        )
      }
    }

    // Verify that the post exists
    try {
      await payload.findByID({
        collection: 'posts',
        id: post,
      })
    } catch {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Verify parent comment exists if provided
    if (parentComment) {
      try {
        await payload.findByID({
          collection: 'comments',
          id: parentComment,
        })
      } catch {
        return NextResponse.json(
          { error: 'Parent comment not found' },
          { status: 404 }
        )
      }
    }

    // Get client IP address
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'

    // Prepare comment data
    const commentData: any = {
      content,
      post,
      ipAddress: ip,
      userAgent: request.headers.get('user-agent') || 'unknown',
    }

    if (user) {
      commentData.author = user.id
      // Auto-approve comments from authenticated users
      commentData.status = 'approved'
    } else {
      commentData.authorName = authorName
      commentData.authorEmail = authorEmail
      if (authorWebsite) {
        commentData.authorWebsite = authorWebsite
      }
      // Anonymous comments need moderation
      commentData.status = 'pending'
    }

    if (parentComment) {
      commentData.parentComment = parentComment
    }

    // Create the comment
    const comment = await payload.create({
      collection: 'comments',
      data: commentData,
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}