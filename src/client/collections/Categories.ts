import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { adminOrBlogger } from '../access/adminOrBlogger'
import { slugField } from '@/client/fields/slug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: ({ req: { user } }) => {
      // Admin has almighty access
      if (user?.role === 'admin') return true
      return user?.role === 'blogger'
    },
    delete: ({ req: { user } }) => {
      // Admin has almighty access
      if (user?.role === 'admin') return true
      return user?.role === 'blogger'
    },
    read: anyone,
    update: ({ req: { user } }) => {
      // Admin has almighty access
      if (user?.role === 'admin') return true
      return user?.role === 'blogger'
    },
  },
  admin: {
    defaultColumns: ['title', 'slug', 'postCount', 'featured'],
    group: 'Content Management',
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      unique: true,
      maxLength: 100,
      admin: {
        description: 'Category name (e.g., "Technology", "Tutorials")',
      },
    },
    {
      name: 'description',
      type: 'richText',
      admin: {
        description: 'Detailed description of this category',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Category featured image',
      },
    },
    {
      name: 'color',
      type: 'text',
      admin: {
        description: 'Hex color code for category theming (e.g., #3B82F6)',
        placeholder: '#3B82F6',
      },
      validate: (value: string | string[] | null | undefined) => {
        if (!value || (Array.isArray(value) && value.length === 0)) return true
        const colorValue = Array.isArray(value) ? value[0] : value
        if (typeof colorValue !== 'string') return true
        const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
        return (
          hexColorRegex.test(colorValue) || 'Please enter a valid hex color code (e.g., #3B82F6)'
        )
      },
    },
    {
      name: 'postCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Number of published posts in this category (auto-calculated)',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Featured categories appear prominently on the homepage',
      },
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories',
      admin: {
        description: 'Parent category for hierarchical organization',
      },
      filterOptions: ({ id }) => {
        return {
          id: {
            not_equals: id,
          },
        }
      },
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          maxLength: 60,
          admin: {
            description: 'Custom meta title for SEO (defaults to category title)',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          maxLength: 160,
          admin: {
            description: 'Meta description for search engines',
          },
        },
      ],
    },
    ...slugField(),
  ],
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        // Update post count for this category
        try {
          const postCount = await req.payload.count({
            collection: 'posts',
            where: {
              categories: {
                contains: doc.id,
              },
              status: {
                equals: 'published',
              },
            },
          })

          await req.payload.update({
            collection: 'categories',
            id: doc.id,
            data: {
              postCount: postCount.totalDocs,
            },
          })
        } catch (error) {
          console.error('Error updating category post count:', error)
        }
      },
    ],
  },
  timestamps: true,
}
