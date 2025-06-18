import type { Access } from 'payload'
import type { User } from '@/payload-types'

/**
 * Access control for post operations
 * Users can only edit/delete their own posts unless they are admin
 * Admin can access all posts
 */
export const ownPostsOrAdmin: Access<User> = ({ req: { user } }) => {
  // Admin can access all posts
  if (user && user.role === 'admin') {
    return true
  }

  // Bloggers can only access their own posts
  if (user && user.role === 'blogger') {
    return {
      author: {
        equals: user.id,
      },
    }
  }

  return false
}
