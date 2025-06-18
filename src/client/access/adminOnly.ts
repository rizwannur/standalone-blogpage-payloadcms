import type { Access } from 'payload'
import type { User } from '@/payload-types'

/**
 * Access control for admin-only operations
 * Only users with 'admin' role can perform these actions
 */
export const adminOnly: Access<User> = ({ req: { user } }) => {
  // Check if user exists and has admin role
  if (user && user.role === 'admin') {
    return true
  }

  return false
}