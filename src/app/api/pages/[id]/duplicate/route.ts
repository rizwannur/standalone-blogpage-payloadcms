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

    // Check if user has permission to create pages
    const hasPermission = user.role === 'admin' || user.role === 'blogger'
    
    if (!hasPermission) {
      return NextResponse.json(
        { message: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    // Get the original page
    const originalPage = await payload.findByID({
      collection: 'pages',
      id,
      user,
    })

    if (!originalPage) {
      return NextResponse.json(
        { message: 'Page not found' },
        { status: 404 }
      )
    }

    // Create a duplicate with modified title and slug
    const duplicateData = {
      ...originalPage,
      title: `${originalPage.title} (Copy)`,
      slug: `${originalPage.slug}-copy-${Date.now()}`,
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

    // Create the duplicate page
    const duplicatedPage = await payload.create({
      collection: 'pages',
      data: duplicateData,
      user,
    })

    return NextResponse.json(duplicatedPage)
  } catch (error) {
    console.error('Error duplicating page:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}