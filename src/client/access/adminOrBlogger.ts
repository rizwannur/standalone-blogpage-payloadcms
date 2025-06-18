import type { Access } from 'payload'
import type { User } from '@/payload-types'

/**
 * Access control for admin and blogger operations
 * Users with 'admin' or 'blogger' roles can perform these actions
 */
export const adminOrBlogger: Access<User> = ({ req: { user } }) => {
  // Check if user exists and has admin or blogger role
  if (user && (user.role === 'admin' || user.role === 'blogger')) {
    return true
  }

  return false
}
