'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface SearchResult {
  id: string
  title: string
  slug: string
  excerpt?: string
  category?: string
  publishedAt: string
}

interface SearchBarProps {
  className?: string
  placeholder?: string
}

export function SearchBar({ className, placeholder = "Search posts..." }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setIsOpen(false)
      return
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        if (response.ok) {
          const data = await response.json()
          setResults(data.results || [])
          setIsOpen(true)
        }
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const handleResultClick = () => {
    setIsOpen(false)
    setQuery('')
  }

  return (
    <div ref={searchRef} className={cn("relative", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10"
          onFocus={() => query.trim() && results.length > 0 && setIsOpen(true)}
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
            onClick={clearSearch}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </form>

      {/* Search Results Dropdown */}
      {isOpen && (query.trim() || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-96 overflow-y-auto rounded-md border bg-popover p-1 shadow-lg">
          {results.length > 0 ? (
            <>
              {results.map((result) => (
                <Link
                  key={result.id}
                  href={`/posts/${result.slug}`}
                  onClick={handleResultClick}
                  className="block rounded-sm px-3 py-2 hover:bg-accent hover:text-accent-foreground"
                >
                  <div className="font-medium text-sm">{result.title}</div>
                  {result.excerpt && (
                    <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {result.excerpt}
                    </div>
                  )}
                  {result.category && (
                    <div className="text-xs text-primary mt-1">{result.category}</div>
                  )}
                </Link>
              ))}
              <div className="border-t mt-1 pt-1">
                <Link
                  href={`/search?q=${encodeURIComponent(query)}`}
                  onClick={handleResultClick}
                  className="block rounded-sm px-3 py-2 text-sm text-primary hover:bg-accent hover:text-accent-foreground"
                >
                  View all results for "{query}"
                </Link>
              </div>
            </>
          ) : query.trim() && !isLoading ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              No results found for "{query}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}