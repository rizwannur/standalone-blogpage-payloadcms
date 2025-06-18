'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarIcon, UserIcon } from 'lucide-react'
import Image from 'next/image'

interface SearchResult {
  id: string
  title: string
  slug: string
  excerpt: string
  publishedAt: string
  author: {
    name: string
  }
  featuredImage?: {
    url: string
    alt: string
  }
  tags?: Array<{
    name: string
  }>
}

interface SearchResponse {
  posts: SearchResult[]
  total: number
  hasMore: boolean
}

// Utility function for formatting dates
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return 'Unknown date'
  }
}

export default function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [results, setResults] = useState<SearchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!query.trim()) {
      setResults(null)
      return
    }

    const searchPosts = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=20`)
        
        if (!response.ok) {
          throw new Error('Search failed')
        }
        
        const data = await response.json()
        setResults(data)
      } catch (err) {
        setError('Failed to search posts. Please try again.')
        console.error('Search error:', err)
      } finally {
        setLoading(false)
      }
    }

    searchPosts()
  }, [query])

  if (!query.trim()) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Enter a search term to find posts.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-muted rounded w-1/2 mb-4"></div>
            <div className="h-3 bg-muted rounded w-full mb-2"></div>
            <div className="h-3 bg-muted rounded w-2/3"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    )
  }

  if (!results || results.posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No posts found for &ldquo;{query}&rdquo;. Try different keywords.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-muted-foreground">
          Found {results.total} result{results.total !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
        </p>
      </div>
      
      <div className="space-y-6">
        {results.posts.map((post) => (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="hover:text-blue-600 transition-colors">
                    <Link href={`/posts/${post.slug}`}>
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {post.excerpt}
                  </CardDescription>
                </div>
                {post.featuredImage && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={post.featuredImage.url}
                      alt={post.featuredImage.alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  {formatDate(post.publishedAt)}
                </div>
                <div className="flex items-center gap-1">
                  <UserIcon className="h-4 w-4" />
                  {post.author.name}
                </div>
              </div>
              
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      {results.hasMore && (
        <div className="text-center mt-8">
          <p className="text-muted-foreground text-sm">
            Showing first {results.posts.length} results. Refine your search for more specific results.
          </p>
        </div>
      )}
    </div>
  )
}