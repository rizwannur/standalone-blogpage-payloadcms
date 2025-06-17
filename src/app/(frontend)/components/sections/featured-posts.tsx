import * as React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getFeaturedPosts } from '@/lib/payload'

import { Button } from '@/app/(frontend)/components/ui/button'
import { CollectionArchive } from '@/client/components/CollectionArchive'

export async function FeaturedPosts() {
  const featuredPosts = await getFeaturedPosts(3)

  return (
    <section className="py-24 bg-muted/50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Featured Posts
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our latest insights and practical guides to help you create better user
            experiences.
          </p>
        </div>

        {featuredPosts.length > 0 ? (
          <CollectionArchive
            posts={featuredPosts}
            relationTo="posts"
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No featured posts available yet.
            </p>
          </div>
        )}

        <div className="text-center mt-12">
          <Button asChild size="lg">
            <Link href="/pages/posts">
              View All Posts
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
