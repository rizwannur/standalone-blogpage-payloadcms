'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useAdmin } from '@/components/providers/AdminProvider'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Edit, MoreVertical, Eye, Trash2, Copy, Zap } from 'lucide-react'
import { toast } from 'sonner'
import { QuickEditModal } from '@/components/admin/QuickEditModal'
import type { Post, Page } from '@/payload-types'

interface AdminActionsProps {
  doc: Post | Page
  collection: 'posts' | 'pages'
  className?: string
}

export const AdminActions: React.FC<AdminActionsProps> = ({ doc, collection, className }) => {
  const { isAuthenticated, isAdmin, isBlogger } = useAdmin()
  const [quickEditOpen, setQuickEditOpen] = useState(false)

  // Only show admin actions if user is authenticated and has appropriate permissions
  if (!isAuthenticated || (!isAdmin && !isBlogger)) {
    return null
  }

  // Bloggers can only edit their own posts
  if (isBlogger && !isAdmin && collection === 'posts') {
    const post = doc as Post
    // Add author check here if needed
    // if (post.authors && !post.authors.some(author => author.id === user.id)) {
    //   return null
    // }
  }

  const handleDuplicate = async () => {
    try {
      const response = await fetch(`/api/${collection}/${doc.id}`, {
        credentials: 'include',
      })
      
      if (response.ok) {
        const data = await response.json()
        // Create a copy with modified title and slug
        const duplicateData = {
          ...data,
          title: `${data.title} (Copy)`,
          slug: `${data.slug}-copy`,
          id: undefined,
          createdAt: undefined,
          updatedAt: undefined,
        }
        
        const createResponse = await fetch(`/api/${collection}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(duplicateData),
        })
        
        if (createResponse.ok) {
          toast.success(`${collection.slice(0, -1)} duplicated successfully!`)
        } else {
          toast.error('Failed to duplicate')
        }
      }
    } catch (error) {
      toast.error('Failed to duplicate')
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete this ${collection.slice(0, -1)}?`)) {
      return
    }

    try {
      const response = await fetch(`/api/${collection}/${doc.id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      
      if (response.ok) {
        toast.success(`${collection.slice(0, -1)} deleted successfully!`)
        // Refresh the page or update the UI
        window.location.reload()
      } else {
        toast.error('Failed to delete')
      }
    } catch (error) {
      toast.error('Failed to delete')
    }
  }

  return (
    <div className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity ${className}`}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setQuickEditOpen(true)}>
            <Zap className="h-4 w-4 mr-2" />
            Quick Edit
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link href={`/admin/collections/${collection}/${doc.id}`}>
              <Edit className="h-4 w-4 mr-2" />
              Full Edit
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link href={`/${collection}/${doc.slug}`} target="_blank">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Link>
          </DropdownMenuItem>
          
          {isAdmin && (
            <>
              <DropdownMenuItem onClick={handleDuplicate}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      
      <QuickEditModal
        doc={doc}
        collection={collection}
        open={quickEditOpen}
        onOpenChange={setQuickEditOpen}
        onSave={() => window.location.reload()}
      />
    </div>
  )
}