import type { GlobalConfig } from 'payload'

import { adminOnly } from '../../access/adminOnly'

export const Settings: GlobalConfig = {
  slug: 'settings',
  access: {
    read: () => true, // Public read access for frontend
    update: adminOnly,
  },
  admin: {
    group: 'Configuration',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            {
              name: 'siteName',
              type: 'text',
              required: true,
              defaultValue: 'My Blog',
              admin: {
                description: 'The name of your blog/website',
              },
            },
            {
              name: 'siteDescription',
              type: 'textarea',
              required: true,
              defaultValue: 'A modern blog built with Next.js and Payload CMS',
              admin: {
                description: 'Brief description of your blog for SEO',
              },
            },
            {
              name: 'siteUrl',
              type: 'text',
              required: true,
              defaultValue: 'https://yourdomain.com',
              admin: {
                description: 'Your website URL (used for SEO and social sharing)',
              },
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Site logo',
              },
            },
            {
              name: 'favicon',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Site favicon',
              },
            },
            {
              name: 'timezone',
              type: 'select',
              defaultValue: 'UTC',
              options: [
                { label: 'UTC', value: 'UTC' },
                { label: 'America/New_York', value: 'America/New_York' },
                { label: 'America/Chicago', value: 'America/Chicago' },
                { label: 'America/Denver', value: 'America/Denver' },
                { label: 'America/Los_Angeles', value: 'America/Los_Angeles' },
                { label: 'Europe/London', value: 'Europe/London' },
                { label: 'Europe/Paris', value: 'Europe/Paris' },
                { label: 'Asia/Tokyo', value: 'Asia/Tokyo' },
                { label: 'Asia/Shanghai', value: 'Asia/Shanghai' },
                { label: 'Australia/Sydney', value: 'Australia/Sydney' },
              ],
              admin: {
                description: 'Default timezone for the blog',
              },
            },
            {
              name: 'language',
              type: 'select',
              defaultValue: 'en',
              options: [
                { label: 'English', value: 'en' },
                { label: 'Spanish', value: 'es' },
                { label: 'French', value: 'fr' },
                { label: 'German', value: 'de' },
                { label: 'Italian', value: 'it' },
                { label: 'Portuguese', value: 'pt' },
                { label: 'Chinese', value: 'zh' },
                { label: 'Japanese', value: 'ja' },
              ],
              admin: {
                description: 'Default language for the blog',
              },
            },
          ],
        },
        {
          label: 'Blog Settings',
          fields: [
            {
              name: 'postsPerPage',
              type: 'number',
              defaultValue: 10,
              min: 1,
              max: 50,
              admin: {
                description: 'Number of posts to display per page',
              },
            },
            {
              name: 'enableComments',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Allow comments on blog posts',
              },
            },
            {
              name: 'moderateComments',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Require admin approval for comments',
                condition: (data) => data.enableComments,
              },
            },
            {
              name: 'enableNewsletter',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Enable newsletter subscription',
              },
            },
            {
              name: 'enableSearch',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Enable search functionality',
              },
            },
            {
              name: 'enableAnalytics',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Enable analytics tracking',
              },
            },
            {
              name: 'enableSocialSharing',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Enable social media sharing buttons',
              },
            },
            {
              name: 'enableReadingTime',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show estimated reading time for posts',
              },
            },
          ],
        },
        {
          label: 'SEO & Social',
          fields: [
            {
              name: 'defaultSeoImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Default image for social media sharing',
              },
            },
            {
              name: 'twitterHandle',
              type: 'text',
              admin: {
                description: 'Twitter handle (without @)',
              },
            },
            {
              name: 'facebookAppId',
              type: 'text',
              admin: {
                description: 'Facebook App ID for Open Graph',
              },
            },
            {
              name: 'googleAnalyticsId',
              type: 'text',
              admin: {
                description: 'Google Analytics tracking ID',
              },
            },
            {
              name: 'googleTagManagerId',
              type: 'text',
              admin: {
                description: 'Google Tag Manager container ID',
              },
            },
            {
              name: 'enableSitemap',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Generate XML sitemap',
              },
            },
            {
              name: 'enableRobotsTxt',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Generate robots.txt file',
              },
            },
          ],
        },
        {
          label: 'Email Settings',
          fields: [
            {
              name: 'smtpHost',
              type: 'text',
              admin: {
                description: 'SMTP server hostname',
              },
            },
            {
              name: 'smtpPort',
              type: 'number',
              defaultValue: 587,
              admin: {
                description: 'SMTP server port',
              },
            },
            {
              name: 'smtpUser',
              type: 'text',
              admin: {
                description: 'SMTP username',
              },
            },
            {
              name: 'smtpPassword',
              type: 'text',
              admin: {
                description: 'SMTP password',
                hidden: true, // Hide this field in admin
              },
            },
            {
              name: 'fromEmail',
              type: 'email',
              admin: {
                description: 'Default "from" email address',
              },
            },
            {
              name: 'fromName',
              type: 'text',
              admin: {
                description: 'Default "from" name',
              },
            },
            {
              name: 'adminEmail',
              type: 'email',
              admin: {
                description: 'Admin email address for notifications',
              },
            },
          ],
        },
        {
          label: 'Social Links',
          fields: [
            {
              name: 'socialLinks',
              type: 'array',
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Twitter', value: 'twitter' },
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'LinkedIn', value: 'linkedin' },
                    { label: 'YouTube', value: 'youtube' },
                    { label: 'GitHub', value: 'github' },
                    { label: 'Discord', value: 'discord' },
                    { label: 'TikTok', value: 'tiktok' },
                    { label: 'Pinterest', value: 'pinterest' },
                    { label: 'Reddit', value: 'reddit' },
                  ],
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Full URL to your social media profile',
                  },
                },
                {
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: true,
                },
              ],
              admin: {
                description: 'Social media links for the footer and author profiles',
              },
            },
          ],
        },
        {
          label: 'Advanced',
          fields: [
            {
              name: 'maintenanceMode',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Enable maintenance mode (shows maintenance page to non-admin users)',
              },
            },
            {
              name: 'maintenanceMessage',
              type: 'richText',
              admin: {
                description: 'Message to display during maintenance mode',
                condition: (data) => data.maintenanceMode,
              },
            },
            {
              name: 'customCss',
              type: 'code',
              admin: {
                description: 'Custom CSS to inject into the site',
                language: 'css',
              },
            },
            {
              name: 'customJs',
              type: 'code',
              admin: {
                description: 'Custom JavaScript to inject into the site',
                language: 'javascript',
              },
            },
            {
              name: 'enableCaching',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Enable page caching for better performance',
              },
            },
            {
              name: 'cacheTimeout',
              type: 'number',
              defaultValue: 3600,
              admin: {
                description: 'Cache timeout in seconds',
                condition: (data) => data.enableCaching,
              },
            },
          ],
        },
      ],
    },
  ],
}
