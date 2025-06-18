'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MessageCircle, Reply, Send, User, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { useAdmin } from '@/components/providers/AdminProvider'
import { toast } from 'sonner'

interface Comment {
  id: string
  content: string
  author?: {
    id: string
    name?: string
    email: string
  }
  authorName?: string
  authorEmail?: string
  authorWebsite?: string
  parentComment?: string | Comment
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
  replyCount: number
  replies?: Comment[]
}

interface CommentsProps {
  postId: string
  postTitle: string
}

interface CommentFormData {
  content: string
  authorName?: string
  authorEmail?: string
  authorWebsite?: string
  parentComment?: string
}

const CommentItem: React.FC<{
  comment: Comment
  onReply: (parentId: string) => void
  level: number
}> = ({ comment, onReply, level }) => {
  const maxLevel = 3
  const isNested = level > 0
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getAuthorName = () => {
    return comment.author?.name || comment.authorName || 'Anonymous'
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getStatusBadge = () => {
    switch (comment.status) {
      case 'approved':
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        )
      case 'pending':
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case 'rejected':
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            <AlertCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className={`${isNested ? 'ml-8 mt-4' : 'mt-6'} ${level >= maxLevel ? 'ml-0' : ''}`}>
      <Card className={`${isNested ? 'border-l-4 border-l-primary/20' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {getInitials(getAuthorName())}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-sm">{getAuthorName()}</span>
                  {getStatusBadge()}
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <p className="text-sm text-foreground mb-3 whitespace-pre-wrap">
                {comment.content}
              </p>
              <div className="flex items-center space-x-4">
                {level < maxLevel && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onReply(comment.id)}
                    className="text-xs h-7"
                  >
                    <Reply className="h-3 w-3 mr-1" />
                    Reply
                  </Button>
                )}
                {comment.replyCount > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {comment.replyCount} {comment.replyCount === 1 ? 'reply' : 'replies'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Render replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              level={level + 1}
            />
          ))
          }
        </div>
      )}
    </div>
  )
}

const CommentForm: React.FC<{
  postId: string
  parentComment?: string
  onSubmit: (data: CommentFormData) => Promise<void>
  onCancel?: () => void
  isSubmitting: boolean
}> = ({ postId, parentComment, onSubmit, onCancel, isSubmitting }) => {
  const { user, isAuthenticated } = useAdmin()
  const [formData, setFormData] = useState<CommentFormData>({
    content: '',
    authorName: '',
    authorEmail: '',
    authorWebsite: '',
    parentComment,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.content.trim()) {
      toast.error('Please enter a comment')
      return
    }

    if (!isAuthenticated && (!formData.authorName || !formData.authorEmail)) {
      toast.error('Please provide your name and email')
      return
    }

    await onSubmit(formData)
    
    // Reset form
    setFormData({
      content: '',
      authorName: '',
      authorEmail: '',
      authorWebsite: '',
      parentComment,
    })
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">
          {parentComment ? 'Reply to Comment' : 'Leave a Comment'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="content">Comment *</Label>
            <Textarea
              id="content"
              placeholder="Share your thoughts..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="min-h-[100px] mt-1"
              maxLength={1000}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formData.content.length}/1000 characters
            </p>
          </div>

          {!isAuthenticated && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="authorName">Name *</Label>
                <Input
                  id="authorName"
                  type="text"
                  placeholder="Your name"
                  value={formData.authorName}
                  onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="authorEmail">Email *</Label>
                <Input
                  id="authorEmail"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.authorEmail}
                  onChange={(e) => setFormData({ ...formData, authorEmail: e.target.value })}
                  className="mt-1"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="authorWebsite">Website (optional)</Label>
                <Input
                  id="authorWebsite"
                  type="url"
                  placeholder="https://yourwebsite.com"
                  value={formData.authorWebsite}
                  onChange={(e) => setFormData({ ...formData, authorWebsite: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Button type="submit" disabled={isSubmitting}>
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Submitting...' : 'Submit Comment'}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export const Comments: React.FC<CommentsProps> = ({ postId, postTitle }) => {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  const fetchComments = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/comments?post=${postId}&status=approved`)
      if (response.ok) {
        const data = await response.json()
        setComments(data.docs || [])
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
      toast.error('Failed to load comments')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitComment = async (formData: CommentFormData) => {
    try {
      setIsSubmitting(true)
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          post: postId,
        }),
      })

      if (response.ok) {
        toast.success('Comment submitted successfully! It will be reviewed before appearing.')
        setReplyingTo(null)
        await fetchComments()
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to submit comment')
      }
    } catch (error) {
      console.error('Error submitting comment:', error)
      toast.error('Failed to submit comment')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReply = (parentId: string) => {
    setReplyingTo(parentId)
  }

  const handleCancelReply = () => {
    setReplyingTo(null)
  }

  useEffect(() => {
    fetchComments()
  }, [postId])

  if (loading) {
    return (
      <div className="mt-12">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading comments...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mt-12">
      <div className="flex items-center space-x-2 mb-6">
        <MessageCircle className="h-6 w-6" />
        <h2 className="text-2xl font-bold">
          Comments ({comments.length})
        </h2>
      </div>

      {/* Comment Form */}
      {!replyingTo && (
        <CommentForm
          postId={postId}
          onSubmit={handleSubmitComment}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Comments List */}
      {comments.length === 0 ? (
        <Card className="mt-6">
          <CardContent className="p-8 text-center">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No comments yet</h3>
            <p className="text-muted-foreground">
              Be the first to share your thoughts on this post!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-6">
          {comments.map((comment) => (
            <div key={comment.id}>
              <CommentItem
                comment={comment}
                onReply={handleReply}
                level={0}
              />
              {replyingTo === comment.id && (
                <div className="ml-8 mt-4">
                  <CommentForm
                    postId={postId}
                    parentComment={comment.id}
                    onSubmit={handleSubmitComment}
                    onCancel={handleCancelReply}
                    isSubmitting={isSubmitting}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Comments