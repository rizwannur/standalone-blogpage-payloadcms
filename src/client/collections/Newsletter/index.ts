import type { CollectionConfig } from 'payload'

import { adminOnly } from '../../access/adminOnly'
import { anyone } from '../../access/anyone'

export const Newsletter: CollectionConfig = {
  slug: 'newsletter',
  access: {
    create: anyone, // Allow public subscription
    delete: adminOnly,
    read: adminOnly,
    update: ({ req: { user }, id }) => {
      // Admin can update any subscription, users can update their own
      if (user?.role === 'admin') {
        return true
      }
      if (user) {
        return {
          user: {
            equals: user.id,
          },
        }
      }
      return false
    },
  },
  admin: {
    defaultColumns: ['email', 'status', 'subscribedAt', 'source'],
    group: 'Marketing',
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      admin: {
        description: 'Subscriber email address',
      },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'Associated user account (if any)',
        position: 'sidebar',
      },
    },
    {
      name: 'firstName',
      type: 'text',
      admin: {
        description: 'Subscriber first name (optional)',
      },
    },
    {
      name: 'lastName',
      type: 'text',
      admin: {
        description: 'Subscriber last name (optional)',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'subscribed',
      options: [
        {
          label: 'Subscribed',
          value: 'subscribed',
        },
        {
          label: 'Unsubscribed',
          value: 'unsubscribed',
        },
        {
          label: 'Bounced',
          value: 'bounced',
        },
        {
          label: 'Complained',
          value: 'complained',
        },
      ],
      admin: {
        position: 'sidebar',
        description: 'Subscription status',
      },
    },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'website',
      options: [
        {
          label: 'Website',
          value: 'website',
        },
        {
          label: 'Blog Post',
          value: 'blog_post',
        },
        {
          label: 'Social Media',
          value: 'social_media',
        },
        {
          label: 'Manual Import',
          value: 'manual_import',
        },
        {
          label: 'API',
          value: 'api',
        },
      ],
      admin: {
        position: 'sidebar',
        description: 'How the subscriber was acquired',
      },
    },
    {
      name: 'preferences',
      type: 'group',
      fields: [
        {
          name: 'frequency',
          type: 'select',
          defaultValue: 'weekly',
          options: [
            {
              label: 'Daily',
              value: 'daily',
            },
            {
              label: 'Weekly',
              value: 'weekly',
            },
            {
              label: 'Monthly',
              value: 'monthly',
            },
          ],
          admin: {
            description: 'Preferred email frequency',
          },
        },
        {
          name: 'categories',
          type: 'relationship',
          relationTo: 'categories',
          hasMany: true,
          admin: {
            description: 'Interested categories for targeted content',
          },
        },
        {
          name: 'format',
          type: 'select',
          defaultValue: 'html',
          options: [
            {
              label: 'HTML',
              value: 'html',
            },
            {
              label: 'Plain Text',
              value: 'text',
            },
          ],
          admin: {
            description: 'Preferred email format',
          },
        },
      ],
    },
    {
      name: 'subscribedAt',
      type: 'date',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Date of subscription',
      },
    },
    {
      name: 'unsubscribedAt',
      type: 'date',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Date of unsubscription',
        condition: (data) => data.status === 'unsubscribed',
      },
    },
    {
      name: 'confirmationToken',
      type: 'text',
      admin: {
        hidden: true,
      },
      access: {
        read: ({ req }) => {
          if (!req.user) return false;
          return req.user.role === 'admin';
        },
        update: ({ req }) => {
          if (!req.user) return false;
          return req.user.role === 'admin';
        },
      },
    },
    {
      name: 'confirmed',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Email confirmation status',
      },
      access: {
        read: ({ req }) => {
          if (!req.user) return false;
          return req.user.role === 'admin';
        },
        update: ({ req }) => {
          if (!req.user) return false;
          return req.user.role === 'admin';
        },
      },
    },
    {
      name: 'ipAddress',
      type: 'text',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'IP address at subscription',
      },
      access: {
        read: ({ req }) => {
          if (!req.user) return false;
          return req.user.role === 'admin';
        },
        update: ({ req }) => {
          if (!req.user) return false;
          return req.user.role === 'admin';
        },
      },
    },
    {
      name: 'userAgent',
      type: 'text',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Browser user agent at subscription',
      },
      access: {
        read: ({ req: { user } }) => {
          return !!(user && user.role === 'admin')
        },
        update: () => false,
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        // Set subscription date for new subscribers
        if (!data.id && !data.subscribedAt) {
          data.subscribedAt = new Date().toISOString()
        }

        // Set unsubscription date when status changes to unsubscribed
        if (data.status === 'unsubscribed' && !data.unsubscribedAt) {
          data.unsubscribedAt = new Date().toISOString()
        }

        // Capture IP and user agent for new subscriptions
        if (!data.id) {
          data.ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
          data.userAgent = req.headers.get('user-agent') || 'unknown'
          
          // Generate confirmation token for double opt-in
          data.confirmationToken = Math.random().toString(36).substring(2, 15) + 
                                  Math.random().toString(36).substring(2, 15)
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc, req, previousDoc }) => {
        // Send welcome email for new confirmed subscribers
        if (doc.confirmed && !previousDoc?.confirmed) {
          // TODO: Implement welcome email sending
          console.log(`Sending welcome email to ${doc.email}`)
        }

        // Send confirmation email for new unconfirmed subscribers
        if (!doc.id && !doc.confirmed) {
          // TODO: Implement confirmation email sending
          console.log(`Sending confirmation email to ${doc.email}`)
        }
      },
    ],
  },
  timestamps: true,
}