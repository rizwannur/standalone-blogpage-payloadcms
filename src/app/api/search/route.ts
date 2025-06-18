import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { emailService } from '@/client/utilities/emailService'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = new URL(request.url)

    const query = searchParams.get('q')
    const category = searchParams.get('category')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!query && !category) {
      return NextResponse.json({ error: 'Search query or category is required' }, { status: 400 })
    }

    // Track search analytics
    if (query) {
      try {
        await payload.create({
          collection: 'analytics',
          data: {
            type: 'search',
            searchQuery: query,
            category: category || null,
            date: new Date().toISOString(),
            // IP and userAgent will be auto-populated by the beforeChange hook
          },
        })
      } catch (analyticsError) {
        console.error('Failed to track search analytics:', analyticsError)
      }
    }

    // Search directly in posts collection
    if (query) {
      const searchWhere: any = {
        _status: {
          equals: 'published',
        },
        or: [
          {
            title: {
              contains: query,
            },
          },
          {
            content: {
              contains: query,
            },
          },
        ],
      }

      // Add category filter if specified
      if (category) {
        searchWhere['categories.value'] = {
          equals: category,
        }
      }

      const posts = await payload.find({
        collection: 'posts',
        where: searchWhere,
        page,
        limit,
        sort: '-publishedAt',
        depth: 2,
      })

      // Transform posts to match SearchBar expected format
      const results = posts.docs.map((post: any) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        category: post.categories?.[0]?.title || '',
        publishedAt: post.publishedAt || post.createdAt,
      }))

      // Send email notification for no results to help improve content
      if (posts.totalDocs === 0 && query) {
        try {
          const settings = await payload.findGlobal({
            slug: 'settings',
          })

          if (settings.adminEmail) {
            await emailService.sendSearchNotification(
              settings.adminEmail,
              query,
              category || 'All categories',
              0,
            )
          }
        } catch (emailError) {
          console.error('Failed to send search notification email:', emailError)
        }
      }

      return NextResponse.json({
        results,
        total: posts.totalDocs,
        page: posts.page,
        totalPages: posts.totalPages,
      })
    } else if (category) {
      // If only category filter, search directly in posts
      const posts = await payload.find({
        collection: 'posts',
        where: {
          _status: {
            equals: 'published',
          },
          'categories.value': {
            equals: category,
          },
        },
        page,
        limit,
        sort: '-publishedAt',
        depth: 2,
      })

      // Transform posts to match SearchBar expected format
      const results = posts.docs.map((post: any) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        category: post.categories?.[0]?.title || '',
        publishedAt: post.publishedAt || post.createdAt,
      }))

      return NextResponse.json({
        results,
        total: posts.totalDocs,
        page: posts.page,
        totalPages: posts.totalPages,
      })
    }

    return NextResponse.json({
      results: [],
      total: 0,
      page: 1,
      totalPages: 1,
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
