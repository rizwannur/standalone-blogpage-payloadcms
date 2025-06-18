import type { Access } from 'payload'

export const bloggerOnly: Access = ({ req: { user } }) => {
  // Only allow users with 'blogger' role
  return Boolean(user?.role === 'blogger')
}