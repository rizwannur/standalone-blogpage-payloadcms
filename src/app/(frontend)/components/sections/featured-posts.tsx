import * as React from 'react'
import Link from 'next/link'
import { Calendar, ArrowRight } from 'lucide-react'

import { Button } from '@/app/(frontend)/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/(frontend)/components/ui/card'

// Mock data - replace with actual data from your backend
const featuredPosts = [
  {
    id: 1,
    title: '10 Essential UI Design Principles Every Designer Should Know',
    description:
      'Learn the fundamental principles that make great user interfaces, from visual hierarchy to consistency and beyond.',
    date: '2024-01-15',
    readTime: '8 min read',
    category: 'Design',
    image: '/api/placeholder/400/250',
    slug: 'ui-design-principles',
  },
  {
    id: 2,
    title: 'Building Accessible Components with React and TypeScript',
    description:
      'A comprehensive guide to creating inclusive user interfaces that work for everyone, with practical examples.',
    date: '2024-01-12',
    readTime: '12 min read',
    category: 'Development',
    image: '/api/placeholder/400/250',
    slug: 'accessible-react-components',
  },
  {
    id: 3,
    title: 'The Complete Guide to Design Systems in 2024',
    description:
      'Everything you need to know about creating, maintaining, and scaling design systems for modern applications.',
    date: '2024-01-10',
    readTime: '15 min read',
    category: 'Design Systems',
    image: '/api/placeholder/400/250',
    slug: 'design-systems-guide',
  },
]

export function FeaturedPosts() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Posts</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our latest insights on design, development, and user experience
          </p>
        </div>

        {/* Posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredPosts.map((post) => (
            <Card key={post.id} className="group hover:shadow-lg transition-all duration-300">
              <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">{post.category}</span>
                </div>
              </div>
              <CardHeader>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                  <span>•</span>
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

        {/* View all button */}
        <div className="text-center">
          <Button asChild size="lg">
            <Link href="/posts">
              View All Posts
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
