import Link from 'next/link'
import { ArrowRight, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getPosts, getCategories } from '@/lib/payload'
import { CollectionArchive } from '@/components/CollectionArchive'

interface PostsPageProps {
  searchParams: {
    page?: string
    category?: string
    search?: string
  }
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const resolvedSearchParams = await searchParams
  const currentPage = Number(resolvedSearchParams.page) || 1
  const selectedCategory = resolvedSearchParams.category
  const searchQuery = resolvedSearchParams.search
  const postsPerPage = 12

  // Fetch data from Payload CMS
  const [allPosts, categories] = await Promise.all([
    getPosts({
      limit: postsPerPage * currentPage, // Load posts for current page
      categories: selectedCategory ? [selectedCategory] : undefined,
    }),
    getCategories(),
  ])

  // Filter posts by search query if provided
  const filteredPosts = searchQuery
    ? allPosts.filter(
        (post) =>
          post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.meta?.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : allPosts

  // Separate featured and regular posts
  const hasMorePosts = filteredPosts.length === postsPerPage * currentPage

  return (
    <div className="container py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog Posts</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Insights, tutorials, and thoughts on UI/UX design, development, and everything in between.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-12 space-y-6">
        {/* Search Bar */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              className="pl-10"
              defaultValue={searchQuery}
              name="search"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2">
          <Link href="/pages/posts">
            <Button variant={!selectedCategory ? 'default' : 'outline'} size="sm">
              All
            </Button>
          </Link>
          {categories.map((category) => (
            <Link key={category.id} href={`/pages/posts?category=${category.slug}`}>
              <Button
                variant={selectedCategory === category.slug ? 'default' : 'outline'}
                size="sm"
              >
                {category.title}
              </Button>
            </Link>
          ))}
        </div>

        {/* Active Filters Display */}
        {(selectedCategory || searchQuery) && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {searchQuery && `Searching for "${searchQuery}"`}
              {searchQuery && selectedCategory && ' in '}
              {selectedCategory &&
                `"${categories.find((c) => c.slug === selectedCategory)?.title}" category`}
              {' • '}
              <Link href="/pages/posts" className="text-primary hover:underline">
                Clear filters
              </Link>
            </p>
          </div>
        )}
      </div>

      {/* Posts Grid using CollectionArchive */}
      {filteredPosts.length > 0 ? (
        <CollectionArchive posts={filteredPosts} relationTo="posts" />
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            {searchQuery || selectedCategory
              ? 'No posts found matching your criteria.'
              : 'No posts found.'}
          </p>
          {(searchQuery || selectedCategory) && (
            <Link href="/pages/posts" className="text-primary hover:underline mt-2 inline-block">
              View all posts
            </Link>
          )}
        </div>
      )}

      {/* Load More Button */}
      {hasMorePosts && (
        <div className="text-center mt-12">
          <Link
            href={`/pages/posts?page=${currentPage + 1}${selectedCategory ? `&category=${selectedCategory}` : ''}${searchQuery ? `&search=${searchQuery}` : ''}`}
          >
            <Button variant="outline" size="lg">
              Load More Posts
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
