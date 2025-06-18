import * as React from 'react'
import Link from 'next/link'
import { ArrowRight, BookOpen, Coffee } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800" />

      {/* Content */}
      <div className="container relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Coffee className="h-4 w-4" />
            <span>Welcome to Rafey&apos;s Blog</span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Thoughts, Ideas &
            <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              {' '}
              Insights
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Join me on a journey through technology, development, and life. 
            Sharing experiences, lessons learned, and perspectives on building great software.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/posts">
                <BookOpen className="mr-2 h-5 w-5" />
                Read Latest Posts
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
              <Link href="/about">
                About Me
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Featured topics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground mb-2">Development</div>
              <div className="text-sm text-muted-foreground">Web technologies, best practices, and coding insights</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground mb-2">Technology</div>
              <div className="text-sm text-muted-foreground">Latest trends, tutorials, and industry perspectives</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground mb-2">Life & Learning</div>
              <div className="text-sm text-muted-foreground">Personal growth, experiences, and reflections</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/2 left-4 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
      <div className="absolute top-1/2 right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
    </section>
  )
}
