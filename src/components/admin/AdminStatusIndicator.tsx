'use client'

import React from 'react'
import { useAdmin } from '@/components/providers/AdminProvider'
import { Badge } from '@/components/ui/badge'
import { Clock, Eye, EyeOff, Calendar, User } from 'lucide-react'
import type { Post, Page } from '@/payload-types'
import './AdminStatusIndicator.scss'

interface AdminStatusIndicatorProps {
  doc: Post | Page
  className?: string
}

export const AdminStatusIndicator: React.FC<AdminStatusIndicatorProps> = ({ doc, className }) => {
  const { isAuthenticated, isAdmin, isBlogger } = useAdmin()

  // Only show status indicators if user is authenticated
  if (!isAuthenticated || (!isAdmin && !isBlogger)) {
    return null
  }

  const isDraft = doc._status === 'draft'
  const isPublished = doc._status === 'published'
  const publishedAt = 'publishedAt' in doc ? doc.publishedAt : null
  const updatedAt = doc.updatedAt
  const authors = 'authors' in doc ? doc.authors : null

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Status Badge */}
      <div className="flex items-center gap-2">
        {isDraft && (
          <Badge variant="secondary" className="text-xs">
            <EyeOff className="h-3 w-3 mr-1" />
            Draft
          </Badge>
        )}
        {isPublished && (
          <Badge variant="default" className="text-xs">
            <Eye className="h-3 w-3 mr-1" />
            Published
          </Badge>
        )}
      </div>

      {/* Additional Info */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        {publishedAt && (
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Published {new Date(publishedAt).toLocaleDateString()}</span>
          </div>
        )}
        
        {updatedAt && (
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Updated {new Date(updatedAt).toLocaleDateString()}</span>
          </div>
        )}
        
        {authors && Array.isArray(authors) && authors.length > 0 && (
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>
              {authors.map((author, index) => {
                const authorName = typeof author === 'object' && author !== null 
                  ? author.name || author.email 
                  : 'Unknown'
                return index === 0 ? authorName : `, ${authorName}`
              }).join('')}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}