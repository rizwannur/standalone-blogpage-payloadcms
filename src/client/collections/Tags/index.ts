import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { adminOrBlogger } from '../../access/adminOrBlogger'
import { slugField } from '../../fields/slug'

export const Tags: CollectionConfig = {
  slug: 'tags',
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
    defaultColumns: ['name', 'slug', 'color', 'postCount'],
    group: 'Content Management',
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      maxLength: 50,
      admin: {
        description: 'Tag name (e.g., "JavaScript", "Tutorial")',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      maxLength: 200,
      admin: {
        description: 'Brief description of what this tag represents',
      },
    },
    {
      name: 'color',
      type: 'select',
      defaultValue: 'blue',
      options: [
        { label: 'Blue', value: 'blue' },
        { label: 'Green', value: 'green' },
        { label: 'Red', value: 'red' },
        { label: 'Yellow', value: 'yellow' },
        { label: 'Purple', value: 'purple' },
        { label: 'Pink', value: 'pink' },
        { label: 'Indigo', value: 'indigo' },
        { label: 'Gray', value: 'gray' },
      ],
      admin: {
        description: 'Color theme for the tag display',
      },
    },
    {
      name: 'postCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Number of posts using this tag (auto-calculated)',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Featured tags appear prominently in tag clouds',
      },
    },
    ...slugField(),
  ],
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        // Update post count for this tag
        try {
          const postCount = await req.payload.count({
            collection: 'posts',
            where: {
              tags: {
                contains: doc.id,
              },
              status: {
                equals: 'published',
              },
            },
          })

          await req.payload.update({
            collection: 'tags',
            id: doc.id,
            data: {
              postCount: postCount.totalDocs,
            },
          })
        } catch (error) {
          console.error('Error updating tag post count:', error)
        }
      },
    ],
  },
  timestamps: true,
}
