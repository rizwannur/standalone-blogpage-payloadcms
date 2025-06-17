import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Post, Category } from '@/payload-types'

// Get Payload instance
export const getPayloadClient = async () => {
  return await getPayload({ config: configPromise })
}

// Fetch all posts with optional filtering
export async function getPosts({
  limit = 10,
  categories,
}: {
  limit?: number
  categories?: string[]
} = {}) {
  const payload = await getPayloadClient()

  const whereConditions: any = {}

  // Filter by categories if provided
  if (categories && categories.length > 0) {
    whereConditions.categories = {
      in: categories,
    }
  }

  const posts = await payload.find({
    collection: 'posts',
    depth: 2,
    limit,
    where: Object.keys(whereConditions).length > 0 ? whereConditions : undefined,
    sort: '-publishedAt',
  })

  return posts.docs
}

// Fetch a single post by slug
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const payload = await getPayloadClient()

  const posts = await payload.find({
    collection: 'posts',
    depth: 2,
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  return posts.docs[0] || null
}

// Fetch all categories
export async function getCategories(): Promise<Category[]> {
  const payload = await getPayloadClient()

  const categories = await payload.find({
    collection: 'categories',
    depth: 1,
    limit: 100,
    sort: 'title',
  })

  return categories.docs
}

// Fetch featured posts (first N posts as featured for now)
export async function getFeaturedPosts(limit: number = 3): Promise<Post[]> {
  return await getPosts({ limit })
}

// Fetch related posts (excluding current post)
export async function getRelatedPosts(
  currentPostId: string | number,
  category?: any,
  limit: number = 3,
): Promise<Post[]> {
  const payload = await getPayloadClient()

  const whereConditions: any = {
    id: {
      not_equals: currentPostId,
    },
  }

  // If category provided, find posts in same category
  if (category) {
    const categoryId = typeof category === 'string' ? category : category.id
    if (categoryId) {
      whereConditions.categories = {
        in: [categoryId],
      }
    }
  }

  const posts = await payload.find({
    collection: 'posts',
    depth: 2,
    limit,
    where: whereConditions,
    sort: '-publishedAt',
  })

  return posts.docs
}
