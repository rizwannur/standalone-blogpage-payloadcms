'use client'

import { Home, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/app/(frontend)/components/ui/button'

export default function NotFound() {
  return (
    <div className="container py-24">
      <div className="text-center max-w-2xl mx-auto">
        {/* 404 Animation */}
        <div className="mb-8">
          <div className="text-8xl md:text-9xl font-bold text-muted-foreground/20 mb-4">404</div>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full" />
        </div>

        {/* Content */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved,
          deleted, or you entered the wrong URL.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t">
          <p className="text-sm text-muted-foreground mb-4">Here are some helpful links instead:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/posts" className="text-blue-600 hover:underline">
              Browse Posts
            </Link>
            <Link href="/tools" className="text-blue-600 hover:underline">
              Free Tools
            </Link>
            <Link href="/about" className="text-blue-600 hover:underline">
              About Me
            </Link>
            <Link href="/contact" className="text-blue-600 hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}