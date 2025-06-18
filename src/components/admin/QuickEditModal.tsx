'use client'

import React, { useState, useEffect } from 'react'
import { useAdmin } from '@/components/providers/AdminProvider'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import './QuickEditModal.scss'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import type { Post, Page } from '@/payload-types'

interface QuickEditModalProps {
  doc: Post | Page
  collection: 'posts' | 'pages'
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: () => void
}

export const QuickEditModal: React.FC<QuickEditModalProps> = ({
  doc,
  collection,
  open,
  onOpenChange,
  onSave,
}) => {
  const { isAuthenticated, isAdmin, isBlogger } = useAdmin()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: doc.title || '',
    slug: doc.slug || '',
    description: doc.meta?.description || '',
    status: (doc._status || 'draft') as 'draft' | 'published',
    publishedAt: 'publishedAt' in doc ? doc.publishedAt || '' : '',
  })

  useEffect(() => {
    setFormData({
      title: doc.title || '',
      slug: doc.slug || '',
      description: doc.meta?.description || '',
      status: (doc._status || 'draft') as 'draft' | 'published',
      publishedAt: 'publishedAt' in doc ? doc.publishedAt || '' : '',
    })
  }, [doc])

  if (!isAuthenticated || (!isAdmin && !isBlogger)) {
    return null
  }

  const handleSave = async () => {
    setLoading(true)
    
    try {
      const updateData = {
        title: formData.title,
        slug: formData.slug,
        meta: {
          ...doc.meta,
          description: formData.description,
        },
        _status: formData.status,
        ...(collection === 'posts' && formData.publishedAt && {
          publishedAt: formData.publishedAt,
        }),
      }

      const response = await fetch(`/api/${collection}/${doc.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        toast.success(`${collection.slice(0, -1)} updated successfully!`)
        onOpenChange(false)
        onSave?.()
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Failed to update')
      }
    } catch (error) {
      toast.error('Failed to update')
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    setFormData(prev => ({ ...prev, slug }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Quick Edit {collection.slice(0, -1)}</DialogTitle>
          <DialogDescription>
            Make quick changes to this {collection.slice(0, -1)} without leaving the page.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter title..."
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="slug">Slug</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generateSlug}
                disabled={!formData.title}
              >
                Generate from title
              </Button>
            </div>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              placeholder="enter-slug-here"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Meta Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter meta description..."
              rows={3}
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as 'draft' | 'published' }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Published Date (for posts) */}
          {collection === 'posts' && (
            <div className="space-y-2">
              <Label htmlFor="publishedAt">Published Date</Label>
              <Input
                id="publishedAt"
                type="datetime-local"
                value={formData.publishedAt ? new Date(formData.publishedAt).toISOString().slice(0, 16) : ''}
                onChange={(e) => setFormData(prev => ({ ...prev, publishedAt: e.target.value }))}
              />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}