import * as React from 'react'
import Link from 'next/link'
import { Calendar, Clock, ArrowRight, Search } from 'lucide-react'

import { Button } from '@/app/(frontend)/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/(frontend)/components/ui/card'

// Mock data - replace with actual data from your backend
const allPosts = [
  {
    id: 1,
    title: '10 Essential UI Design Principles Every Designer Should Know',
    description:
      'Learn the fundamental principles that make great user interfaces, from visual hierarchy to consistency and beyond.',
    date: '2024-01-15',
    readTime: '8 min read',
    category: 'Design',
    author: 'UI Surgeon',
    slug: 'ui-design-principles',
    featured: true,
  },
  {
    id: 2,
    title: 'Building Accessible Components with React and TypeScript',
    description:
      'A comprehensive guide to creating inclusive user interfaces that work for everyone, with practical examples.',
    date: '2024-01-12',
    readTime: '12 min read',
    category: 'Development',
    author: 'UI Surgeon',
    slug: 'accessible-react-components',
    featured: true,
  },
  {
    id: 3,
    title: 'The Complete Guide to Design Systems in 2024',
    description:
      'Everything you need to know about creating, maintaining, and scaling design systems for modern applications.',
    date: '2024-01-10',
    readTime: '15 min read',
    category: 'Design Systems',
    author: 'UI Surgeon',
    slug: 'design-systems-guide',
    featured: true,
  },
  {
    id: 4,
    title: 'Mastering CSS Grid: Advanced Layout Techniques',
    description:
      'Deep dive into CSS Grid with advanced techniques for creating complex, responsive layouts.',
    date: '2024-01-08',
    readTime: '10 min read',
    category: 'Development',
    author: 'UI Surgeon',
    slug: 'css-grid-advanced',
    featured: false,
  },
  {
    id: 5,
    title: 'Color Theory for UI Designers: A Practical Guide',
    description:
      'Understanding color psychology and how to apply it effectively in your user interface designs.',
    date: '2024-01-05',
    readTime: '7 min read',
    category: 'Design',
    author: 'UI Surgeon',
    slug: 'color-theory-ui',
    featured: false,
  },
  {
    id: 6,
    title: 'Performance Optimization for React Applications',
    description:
      'Learn how to optimize your React apps for better performance and user experience.',
    date: '2024-01-03',
    readTime: '14 min read',
    category: 'Development',
    author: 'UI Surgeon',
    slug: 'react-performance',
    featured: false,
  },
]

const categories = ['All', 'Design', 'Development', 'Design Systems', 'UX Research']

export default function PostsPage() {
  const [selectedCategory, setSelectedCategory] = React.useState('All')
  const [searchQuery, setSearchQuery] = React.useState('')

  const filteredPosts = allPosts.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const featuredPosts = filteredPosts.filter((post) => post.featured)
  const regularPosts = filteredPosts.filter((post) => !post.featured)

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
      <div className="mb-12">
        {/* Search */}
        <div className="relative max-w-md mx-auto mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Featured Posts</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredPosts.map((post) => (
              <Card key={post.id} className="group hover:shadow-lg transition-all duration-300">
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-t-lg flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">{post.category}</span>
                </div>
                <CardHeader>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                    <span>•</span>
                    <Clock className="h-4 w-4" />
                    <span>{post.readTime}</span>
                  </div>
                  <CardTitle className="group-hover:text-blue-600 transition-colors">
                    <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                  </CardTitle>
                  <CardDescription>{post.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="ghost" className="p-0 h-auto font-medium">
                    <Link href={`/posts/${post.slug}`} className="flex items-center">
                      Read more
                      <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Regular Posts */}
      {regularPosts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-8">
            {featuredPosts.length > 0 ? 'More Posts' : 'All Posts'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <Card key={post.id} className="group hover:shadow-lg transition-all duration-300">
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-t-lg flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">{post.category}</span>
                </div>
                <CardHeader>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                    <span>•</span>
                    <Clock className="h-4 w-4" />
                    <span>{post.readTime}</span>
                  </div>
                  <CardTitle className="group-hover:text-blue-600 transition-colors">
                    <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-2">{post.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="ghost" className="p-0 h-auto font-medium">
                    <Link href={`/posts/${post.slug}`} className="flex items-center">
                      Read more
                      <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No results */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No posts found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}
