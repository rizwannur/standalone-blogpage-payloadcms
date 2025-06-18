import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { adminOnly } from '../../access/adminOnly'

export const Comments: CollectionConfig = {
  slug: 'comments',
  access: {
    create: anyone, // Allow anonymous comments
    delete: adminOnly, // Only admin can delete comments
    read: ({ req: { user } }) => {
      // Admin can see all comments, others can only see approved comments
      if (user?.role === 'admin') {
        return true
      }
      return {
        status: {
          equals: 'approved',
        },
      }
    },
    update: ({ req: { user } }) => {
      // Admin can update any comment, users can update their own
      if (user?.role === 'admin') {
        return true
      }
      if (user) {
        return {
          author: {
            equals: user.id,
          },
        }
      }
      return false
    },
  },
  admin: {
    defaultColumns: ['content', 'author', 'post', 'status', 'createdAt'],
    group: 'Content Management',
    useAsTitle: 'content',
  },
  fields: [
    {
      name: 'content',
      type: 'textarea',
      required: true,
      maxLength: 1000,
      admin: {
        description: 'Comment content (max 1000 characters)',
      },
    },
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'authorName',
      type: 'text',
      admin: {
        description: 'Name for anonymous commenters',
        condition: (data) => !data.author,
      },
      validate: (value: any, { data }: any) => {
        if (data && !data.author && !value) {
          return 'Author name is required for anonymous comments'
        }
        return true
      },
    },
    {
      name: 'authorEmail',
      type: 'email',
      admin: {
        description: 'Email for anonymous commenters (not displayed publicly)',
        condition: (data) => !data.author,
      },
      validate: (value: any, { data }: any) => {
        if (data && !data.author && !value) {
          return 'Email is required for anonymous comments'
        }
        return true
      },
    },
    {
      name: 'authorWebsite',
      type: 'text',
      admin: {
        description: 'Website URL for anonymous commenters (optional)',
        condition: (data) => !data.author,
      },
    },
    {
      name: 'parentComment',
      type: 'relationship',
      relationTo: 'comments',
      admin: {
        description: 'Parent comment for threaded discussions',
        position: 'sidebar',
      },
      filterOptions: ({ data }: any) => {
        if (data?.post) {
          return {
            post: {
              equals: data.post,
            },
          }
        }
        return false
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Approved',
          value: 'approved',
        },
        {
          label: 'Rejected',
          value: 'rejected',
        },
        {
          label: 'Spam',
          value: 'spam',
        },
      ],
      admin: {
        position: 'sidebar',
        description: 'Comment moderation status',
      },
      access: {
        update: ({ req: { user } }) => {
          return !!(user && user.role === 'admin')
        },
      },
    },
    {
      name: 'ipAddress',
      type: 'text',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'IP address of the commenter',
      },
      access: {
        read: ({ req: { user } }) => {
          return !!(user && user.role === 'admin')
        },
        update: () => false,
      },
    },
    {
      name: 'userAgent',
      type: 'text',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Browser user agent',
      },
      access: {
        read: ({ req: { user } }) => {
          return !!(user && user.role === 'admin')
        },
        update: () => false,
      },
    },
    {
      name: 'likes',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Number of likes received',
      },
    },
    {
      name: 'replies',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Number of replies to this comment',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        // Capture IP address and user agent for new comments
        if (!data.id) {
          data.ipAddress =
            req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
          data.userAgent = req.headers.get('user-agent') || 'unknown'
        }

        // Auto-approve comments from authenticated users with good standing
        if (data.author && !data.id) {
          data.status = 'approved'
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc, req, previousDoc }) => {
        // Update reply count for parent comment
        if (doc.parentComment && doc.status === 'approved') {
          try {
            const replyCount = await req.payload.count({
              collection: 'comments',
              where: {
                parentComment: {
                  equals: doc.parentComment,
                },
                status: {
                  equals: 'approved',
                },
              },
            })

            await req.payload.update({
              collection: 'comments',
              id: doc.parentComment,
              data: {
                replies: replyCount.totalDocs,
              },
            })
          } catch (error) {
            console.error('Error updating parent comment reply count:', error)
          }
        }

        // Send notification to post author when comment is approved
        if (doc.status === 'approved' && previousDoc?.status !== 'approved') {
          // TODO: Implement email notification system
          console.log(`New comment approved on post ${doc.post}`)
        }
      },
    ],
  },
  timestamps: true,
}
