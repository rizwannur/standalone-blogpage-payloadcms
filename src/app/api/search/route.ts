import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = new URL(request.url)
    
    const query = searchParams.get('q')
    const category = searchParams.get('category')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    
    if (!query && !category) {
      return NextResponse.json(
        { error: 'Search query or category is required' },
        { status: 400 }
      )
    }

    let searchResults: any = { docs: [], totalDocs: 0, page: 1, totalPages: 1 }
    let categories: any = { docs: [], totalDocs: 0 }
    let pages: any = { docs: [], totalDocs: 0 }

    // Use Payload's search plugin for posts
    if (query) {
      const searchWhere: any = {
        title: {
          contains: query,
        },
      }

      // Add category filter to search if specified
      if (category) {
        searchWhere['categories.categoryID'] = {
          equals: category,
        }
      }

      const searchResponse = await payload.find({
        collection: 'search',
        where: searchWhere,
        page,
        limit,
        depth: 2,
      })

      searchResults = {
        docs: searchResponse.docs,
        totalDocs: searchResponse.totalDocs,
        page: searchResponse.page,
        totalPages: searchResponse.totalPages,
      }

      // Also search categories
      categories = await payload.find({
        collection: 'categories',
        where: {
          title: {
            contains: query,
          },
        },
        limit: 5,
      })

      // Search pages
      pages = await payload.find({
        collection: 'pages',
        where: {
          _status: {
            equals: 'published',
          },
          title: {
            contains: query,
          },
        },
        limit: 5,
        depth: 1,
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

      // Transform posts to match search result format
      searchResults = {
        docs: posts.docs.map(post => ({
          doc: {
            relationTo: 'posts',
            value: post,
          },
          title: post.title,
          slug: post.slug,
          meta: post.meta,
          categories: post.categories,
        })),
        totalDocs: posts.totalDocs,
        page: posts.page,
        totalPages: posts.totalPages,
      }
    }

    return NextResponse.json({
      posts: searchResults,
      categories,
      pages,
      query,
      category,
      totalResults: searchResults.totalDocs + categories.totalDocs + pages.totalDocs,
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}