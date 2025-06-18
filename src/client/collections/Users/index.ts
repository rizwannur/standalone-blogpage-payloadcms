import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { adminOnly } from '../../access/adminOnly'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: () => true, // Allow public user creation for signup
    delete: adminOnly, // Only admin can delete users
    read: authenticated,
    update: ({ req: { user } }) => {
      // Users can update their own profile, admin can update anyone
      if (user?.role === 'admin') return true
      return {
        id: {
          equals: user?.id,
        },
      }
    },
  },
  admin: {
    defaultColumns: ['name', 'email', 'role', 'isActive'],
    useAsTitle: 'name',
    group: 'User Management',
  },
  auth: {
    tokenExpiration: 7200, // 2 hours
    verify: false,
    maxLoginAttempts: 5,
    lockTime: 600000, // 10 minutes
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      maxLength: 100,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'blogger',
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Blogger',
          value: 'blogger',
        },
        {
          label: 'Reader',
          value: 'reader',
        },
      ],
      access: {
        create: ({ req: { user }, data }) => {
          // Allow setting role during signup (when no user is authenticated)
          // or when admin is creating users
          if (!user) return data?.role === 'blogger' // Only allow blogger role for public signup
          return user.role === 'admin'
        },
        read: ({ req }) => {
          if (!req.user) return false
          return req.user.role === 'admin'
        },
        update: ({ req }) => {
          if (!req.user) return false
          return req.user.role === 'admin'
        },
      },
      admin: {
        description: 'User role determines access permissions',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      access: {
        create: ({ req: { user } }) => {
          return !!(user && user.role === 'admin')
        },
        read: ({ req }) => {
          if (!req.user) return false
          return req.user.role === 'admin'
        },
        update: ({ req }) => {
          if (!req.user) return false
          return req.user.role === 'admin'
        },
      },
      admin: {
        description: 'Inactive users cannot log in',
      },
    },
    {
      name: 'bio',
      type: 'textarea',
      maxLength: 500,
      access: {
        create: ({ req: { user } }) => {
          return !!(
            user &&
            (user.role === 'admin' || user.role === 'reader' || user.role === 'blogger')
          )
        },
        read: () => true, // Bio is public
        update: ({ req: { user } }) => {
          if (!user) return false
          return user.role === 'admin' || user.role === 'reader' || user.role === 'blogger'
        },
      },
      admin: {
        description: 'Brief biography for author profile',
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      access: {
        create: ({ req: { user } }) => {
          // Users can set avatar during profile creation, admins can set for anyone
          return !!(
            user &&
            (user.role === 'admin' || user.role === 'reader' || user.role === 'blogger')
          )
        },
        read: () => true, // Avatar is public
        update: ({ req: { user } }) => {
          // Users can update their own avatar, admin can update anyone's
          if (!user) return false
          return user.role === 'admin' || user.role === 'reader' || user.role === 'blogger'
        },
      },
      admin: {
        description: 'Profile picture',
      },
    },
    {
      name: 'socialLinks',
      type: 'group',
      access: {
        create: ({ req: { user } }) => {
          return !!(
            user &&
            (user.role === 'admin' || user.role === 'reader' || user.role === 'blogger')
          )
        },
        read: () => true, // Social links are public
        update: ({ req: { user } }) => {
          if (!user) return false
          return user.role === 'admin' || user.role === 'reader' || user.role === 'blogger'
        },
      },
      fields: [
        {
          name: 'twitter',
          type: 'text',
          admin: {
            placeholder: 'https://twitter.com/username',
          },
        },
        {
          name: 'linkedin',
          type: 'text',
          admin: {
            placeholder: 'https://linkedin.com/in/username',
          },
        },
        {
          name: 'github',
          type: 'text',
          admin: {
            placeholder: 'https://github.com/username',
          },
        },
        {
          name: 'website',
          type: 'text',
          admin: {
            placeholder: 'https://yourwebsite.com',
          },
        },
      ],
    },
    {
      name: 'preferences',
      type: 'group',
      fields: [
        {
          name: 'emailNotifications',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Receive email notifications for comments and mentions',
          },
        },
        {
          name: 'newsletterSubscription',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Subscribe to newsletter updates',
          },
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        // Ensure admin role cannot be removed if it's the last admin
        if (data.role !== 'admin' && req.user?.role === 'admin') {
          // This would need additional logic to check if there are other admins
          // For now, we'll allow the change
        }
        return data
      },
    ],
    beforeLogin: [
      ({ user }) => {
        // Check if user is active
        if (!user.isActive) {
          throw new Error('Account is deactivated. Please contact an administrator.')
        }
        return user
      },
    ],
  },
  timestamps: true,
}
