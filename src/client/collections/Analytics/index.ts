import type { CollectionConfig } from 'payload'

import { adminOnly } from '../../access/adminOnly'

export const Analytics: CollectionConfig = {
  slug: 'analytics',
  access: {
    create: () => false, // Analytics are created programmatically
    delete: adminOnly,
    read: adminOnly,
    update: () => false, // Analytics are immutable once created
  },
  admin: {
    defaultColumns: ['type', 'post', 'value', 'date'],
    group: 'Analytics',
    useAsTitle: 'type',
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Page View',
          value: 'page_view',
        },
        {
          label: 'Post View',
          value: 'post_view',
        },
        {
          label: 'Post Like',
          value: 'post_like',
        },
        {
          label: 'Post Share',
          value: 'post_share',
        },
        {
          label: 'Comment',
          value: 'comment',
        },
        {
          label: 'Newsletter Signup',
          value: 'newsletter_signup',
        },
        {
          label: 'Search',
          value: 'search',
        },
        {
          label: 'Download',
          value: 'download',
        },
        {
          label: 'External Link Click',
          value: 'external_link_click',
        },
      ],
      admin: {
        description: 'Type of analytics event',
      },
    },
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
      admin: {
        description: 'Related post (if applicable)',
        condition: (data) =>
          ['post_view', 'post_like', 'post_share', 'comment'].includes(data.type),
      },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'User who performed the action (if logged in)',
      },
    },
    {
      name: 'value',
      type: 'number',
      defaultValue: 1,
      admin: {
        description: 'Numeric value for the event (e.g., reading time, download count)',
      },
    },
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Additional event metadata (referrer, device info, etc.)',
      },
    },
    {
      name: 'sessionId',
      type: 'text',
      admin: {
        description: 'User session identifier',
      },
    },
    {
      name: 'ipAddress',
      type: 'text',
      admin: {
        description: 'IP address of the user',
      },
    },
    {
      name: 'userAgent',
      type: 'text',
      admin: {
        description: 'Browser user agent',
      },
    },
    {
      name: 'referrer',
      type: 'text',
      admin: {
        description: 'Referrer URL',
      },
    },
    {
      name: 'country',
      type: 'text',
      admin: {
        description: 'User country (from IP geolocation)',
      },
    },
    {
      name: 'device',
      type: 'group',
      fields: [
        {
          name: 'type',
          type: 'select',
          options: [
            {
              label: 'Desktop',
              value: 'desktop',
            },
            {
              label: 'Mobile',
              value: 'mobile',
            },
            {
              label: 'Tablet',
              value: 'tablet',
            },
          ],
        },
        {
          name: 'browser',
          type: 'text',
        },
        {
          name: 'os',
          type: 'text',
        },
      ],
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        description: 'Date and time of the event',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        // Auto-populate IP and user agent if not provided
        if (!data.ipAddress) {
          data.ipAddress =
            req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
        }
        if (!data.userAgent) {
          data.userAgent = req.headers.get('user-agent') || 'unknown'
        }
        if (!data.referrer) {
          data.referrer = req.headers.get('referer') || req.headers.get('referrer') || 'direct'
        }

        // Parse device information from user agent
        if (data.userAgent && !data.device?.type) {
          const userAgent = data.userAgent.toLowerCase()
          let deviceType = 'desktop'
          let browser = 'unknown'
          let os = 'unknown'

          // Detect device type
          if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
            deviceType = 'mobile'
          } else if (/tablet|ipad/i.test(userAgent)) {
            deviceType = 'tablet'
          }

          // Detect browser
          if (userAgent.includes('chrome')) browser = 'Chrome'
          else if (userAgent.includes('firefox')) browser = 'Firefox'
          else if (userAgent.includes('safari')) browser = 'Safari'
          else if (userAgent.includes('edge')) browser = 'Edge'
          else if (userAgent.includes('opera')) browser = 'Opera'

          // Detect OS
          if (userAgent.includes('windows')) os = 'Windows'
          else if (userAgent.includes('mac')) os = 'macOS'
          else if (userAgent.includes('linux')) os = 'Linux'
          else if (userAgent.includes('android')) os = 'Android'
          else if (userAgent.includes('ios')) os = 'iOS'

          data.device = {
            type: deviceType,
            browser,
            os,
          }
        }

        return data
      },
    ],
  },
  timestamps: true,
}
