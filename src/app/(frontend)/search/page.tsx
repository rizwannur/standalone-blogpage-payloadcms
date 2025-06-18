import React from 'react'
import { Metadata } from 'next/dist/lib/metadata/types/metadata-interface'
import { getCategories } from '@/lib/payload'
import Search from '@/components/Search'

export const metadata: Metadata = {
  title: 'Search | Rafey Blog',
  description: 'Search through blog posts, categories, and pages.',
  openGraph: {
    title: 'Search | Rafey Blog',
    description: 'Search through blog posts, categories, and pages.',
    type: 'website',
  },
}

interface SearchPageProps {
  searchParams: {
    q?: string
    category?: string
  }
}

const SearchPage: React.FC<SearchPageProps> = async ({ searchParams }) => {
  const { q: query = '', category = '' } = searchParams
  
  // Fetch categories for filter options
  const categories = await getCategories()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Search</h1>
          <p className="text-muted-foreground">
            Find blog posts, categories, and pages across the site.
          </p>
        </div>
        
        <Search
          initialQuery={query}
          initialCategory={category}
          categories={categories}
          showFilters={true}
          compact={false}
        />
      </div>
    </div>
  )
}

export default SearchPage