'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Search as SearchIcon,
  Filter,
  X,
  Calendar,
  User,
  Tag,
  FileText,
  Loader2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import Link from 'next/link'

// Local utility function
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Simple debounce function
const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

interface SearchResult {
  posts: {
    docs: any[]
    totalDocs: number
    page: number
    totalPages: number
  }
  categories: {
    docs: any[]
    totalDocs: number
  }
  pages: {
    docs: any[]
    totalDocs: number
  }
  query: string
  category: string
  totalResults: number
}

interface SearchProps {
  initialQuery?: string
  initialCategory?: string
  categories?: any[]
  showFilters?: boolean
  compact?: boolean
}

const SearchResultItem: React.FC<{
  item: any
  type: 'post' | 'category' | 'page' | 'search'
  query: string
}> = ({ item, type, query }) => {
  const highlightText = (text: string, query: string) => {
    if (!query) return text
    const regex = new RegExp(`(${query})`, 'gi')
    const parts = text.split(regex)
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800">
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  // Handle search results from Payload's search plugin
  const getActualItem = () => {
    if (type === 'search' && item.doc?.value) {
      return item.doc.value
    }
    return item
  }

  const actualItem = getActualItem()
  const itemSlug = item.slug || actualItem.slug
  const itemTitle = item.title || actualItem.title
  const itemMeta = item.meta || actualItem.meta

  const getItemUrl = () => {
    switch (type) {
      case 'search':
      case 'post':
        return `/posts/${itemSlug}`
      case 'category':
        return `/posts?category=${itemSlug}`
      case 'page':
        return `/${itemSlug}`
      default:
        return '#'
    }
  }

  const getItemIcon = () => {
    switch (type) {
      case 'search':
      case 'post':
        return <FileText className="h-4 w-4" />
      case 'category':
        return <Tag className="h-4 w-4" />
      case 'page':
        return <FileText className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="mt-1">{getItemIcon()}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="outline" className="text-xs">
                {type === 'search' ? 'post' : type}
              </Badge>
              {(type === 'post' || type === 'search') && actualItem.publishedAt && (
                <span className="text-xs text-muted-foreground flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(actualItem.publishedAt)}
                </span>
              )}
            </div>
            <Link href={getItemUrl()} className="block group">
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors mb-2">
                {highlightText(itemTitle, query)}
              </h3>
              {(itemMeta?.description || actualItem.excerpt || actualItem.description) && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {highlightText(
                    itemMeta?.description || actualItem.excerpt || actualItem.description,
                    query,
                  )}
                </p>
              )}
            </Link>
            {(type === 'post' || type === 'search') &&
              actualItem.authors &&
              actualItem.authors.length > 0 && (
                <div className="flex items-center mt-2 text-xs text-muted-foreground">
                  <User className="h-3 w-3 mr-1" />
                  {actualItem.authors.map((author: any, index: number) => (
                    <span key={author.id}>
                      {author.name}
                      {index < actualItem.authors.length - 1 && ', '}
                    </span>
                  ))}
                </div>
              )}
            {(type === 'post' || type === 'search') &&
              (actualItem.categories || item.categories) && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {(actualItem.categories || item.categories)?.slice(0, 3).map((category: any) => (
                    <Badge key={category.id} variant="secondary" className="text-xs">
                      {category.title}
                    </Badge>
                  ))}
                  {(actualItem.categories || item.categories)?.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{(actualItem.categories || item.categories).length - 3} more
                    </Badge>
                  )}
                </div>
              )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export const Search: React.FC<SearchProps> = ({
  initialQuery = '',
  initialCategory = '',
  categories = [],
  showFilters = true,
  compact = false,
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(initialQuery)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [results, setResults] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [sortBy, setSortBy] = useState('-publishedAt')
  const [page, setPage] = useState(1)

  const performSearch = useCallback(
    async (searchQuery: string, category: string, currentPage: number = 1) => {
      if (!searchQuery.trim() && !category) {
        setResults(null)
        return
      }

      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (searchQuery.trim()) params.append('q', searchQuery.trim())
        if (category) params.append('category', category)
        params.append('page', currentPage.toString())
        params.append('sort', sortBy)
        params.append('limit', '10')

        const response = await fetch(`/api/search?${params.toString()}`)
        if (response.ok) {
          const data = await response.json()
          setResults(data)
        } else {
          console.error('Search failed')
          setResults(null)
        }
      } catch (error) {
        console.error('Search error:', error)
        setResults(null)
      } finally {
        setLoading(false)
      }
    },
    [sortBy],
  )

  const debouncedSearch = useCallback(
    debounce((searchQuery: string, category: string) => {
      performSearch(searchQuery, category, 1)
      setPage(1)
    }, 300),
    [performSearch],
  )

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(query, selectedCategory, 1)
    setPage(1)

    // Update URL
    const params = new URLSearchParams()
    if (query.trim()) params.append('q', query.trim())
    if (selectedCategory) params.append('category', selectedCategory)
    router.push(`/search?${params.toString()}`)
  }

  const handleClearSearch = () => {
    setQuery('')
    setSelectedCategory('')
    setResults(null)
    router.push('/search')
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    performSearch(query, selectedCategory, newPage)
  }

  useEffect(() => {
    const queryParam = searchParams.get('q') || ''
    const categoryParam = searchParams.get('category') || ''

    setQuery(queryParam)
    setSelectedCategory(categoryParam)

    if (queryParam || categoryParam) {
      performSearch(queryParam, categoryParam, 1)
    }
  }, [searchParams, performSearch])

  useEffect(() => {
    debouncedSearch(query, selectedCategory)
  }, [query, selectedCategory, debouncedSearch])

  if (compact) {
    return (
      <div className="relative">
        <form onSubmit={handleSearch} className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search posts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </form>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <SearchIcon className="h-5 w-5" />
            <span>Search</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search posts, pages, and categories..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 pr-10"
              />
              {query && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {showFilters && (
              <div className="space-y-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full justify-between"
                >
                  <span className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    Advanced Filters
                  </span>
                  {showAdvanced ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>

                {showAdvanced && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Category</label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full p-2 border rounded-md bg-background"
                      >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Sort By</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full p-2 border rounded-md bg-background"
                      >
                        <option value="-publishedAt">Newest First</option>
                        <option value="publishedAt">Oldest First</option>
                        <option value="title">Title A-Z</option>
                        <option value="-title">Title Z-A</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <SearchIcon className="h-4 w-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Search Results */}
      {results && (
        <div className="space-y-6">
          {/* Results Summary */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Search Results ({results.totalResults})</h2>
                  {results.query && (
                    <p className="text-sm text-muted-foreground">
                      Showing results for &quot;{results.query}&quot;
                    </p>
                  )}
                </div>
                {(results.query || results.category) && (
                  <Button variant="outline" onClick={handleClearSearch}>
                    Clear Search
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Posts Results */}
          {results.posts.docs.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Posts ({results.posts.totalDocs})
              </h3>
              <div className="space-y-4">
                {results.posts.docs.map((post) => (
                  <SearchResultItem key={post.id} item={post} type="post" query={results.query} />
                ))}
              </div>

              {/* Pagination */}
              {results.posts.totalPages > 1 && (
                <div className="flex justify-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                  >
                    Previous
                  </Button>
                  <span className="flex items-center px-4">
                    Page {page} of {results.posts.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= results.posts.totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Categories Results */}
          {results.categories.docs.length > 0 && (
            <div className="space-y-4">
              <Separator />
              <h3 className="text-xl font-semibold flex items-center">
                <Tag className="h-5 w-5 mr-2" />
                Categories ({results.categories.totalDocs})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.categories.docs.map((category) => (
                  <SearchResultItem
                    key={category.id}
                    item={category}
                    type="category"
                    query={results.query}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Pages Results */}
          {results.pages.docs.length > 0 && (
            <div className="space-y-4">
              <Separator />
              <h3 className="text-xl font-semibold flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Pages ({results.pages.totalDocs})
              </h3>
              <div className="space-y-4">
                {results.pages.docs.map((page) => (
                  <SearchResultItem key={page.id} item={page} type="page" query={results.query} />
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {results.totalResults === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <SearchIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground mb-4">
                  {results.query
                    ? `No results found for "${results.query}"`
                    : 'No results found for the selected filters'}
                </p>
                <Button onClick={handleClearSearch}>Clear Search</Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && !results && (
        <Card>
          <CardContent className="p-8 text-center">
            <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin" />
            <p className="text-muted-foreground">Searching...</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Search
