import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Calendar, Clock, ArrowLeft, Twitter, Linkedin, Facebook, Share2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getPostBySlug, getRelatedPosts, getPosts } from '@/lib/payload'
import RichText from '@/components/RichText'
import { CollectionArchive } from '@/components/CollectionArchive'
import { Comments } from '@/components/Comments'

// Helper functions
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function calculateReadTime(content: any): string {
  if (!content) return '5 min read'
  const text = JSON.stringify(content)
  const wordsPerMinute = 200
  const wordCount = text.split(/\s+/).length
  const readTime = Math.ceil(wordCount / wordsPerMinute)
  return `${readTime} min read`
}

function getImageUrl(image: any): string {
  if (!image) return '/placeholder-image.jpg'
  if (typeof image === 'string') return image
  return image.url || '/placeholder-image.jpg'
}

interface PageProps {
  params: {
    slug: string
  }
}

export default async function PostPage({ params }: PageProps) {
  const resolvedParams = await params
  const post = await getPostBySlug(resolvedParams.slug)

  if (!post) {
    notFound()
  }

  // Get related posts
  const relatedPosts = await getRelatedPosts(post.id, post.categories?.[0] || null, 2)

  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/posts/${post.slug}`
  const shareText = `Check out this article: ${post.title}`

  return (
    <div className="container py-12">
      {/* Back button */}
      <div className="mb-8">
        <Button variant="ghost" asChild>
          <Link href="/posts" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Posts
          </Link>
        </Button>
      </div>

      {/* Article header */}
      <article className="max-w-4xl mx-auto">
        <header className="mb-12">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
            {post.categories && post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.categories.map((category, index) => (
                  <Badge key={index} variant="secondary">
                    {typeof category === 'string' ? category : category.title}
                  </Badge>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(post.publishedAt || post.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{calculateReadTime(post.content)}</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{post.title}</h1>

          <p className="text-xl text-muted-foreground mb-8">
            {post.meta?.description || 'Read this article to learn more.'}
          </p>

          {/* Hero Image */}
          {post.heroImage && (
            <div className="mb-8">
              <Image
                src={getImageUrl(post.heroImage)}
                width={1200}
                height={630}
                priority
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Share buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-6 border-t">
            <div className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              <span className="text-sm font-medium">Share this article:</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </header>

        {/* Article content */}
        <div className="mb-12">
          {post.content ? (
            <RichText
              data={post.content}
              enableGutter={false}
              enableProse={true}
              className="prose prose-lg dark:prose-invert max-w-none"
            />
          ) : (
            <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground">
              <p>Content will be rendered here once you create some posts in the CMS.</p>
            </div>
          )}
        </div>

        {/* Author info */}
        {post.authors && post.authors.length > 0 && (
          <Card className="mb-12">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                  {typeof post.authors[0] !== 'string' && post.authors[0]?.avatar ? (
                    <img
                      src={typeof post.authors[0].avatar === 'string' ? post.authors[0].avatar : post.authors[0].avatar?.url || ''}
                      alt={post.authors[0]?.name || 'Author'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    (typeof post.authors[0] === 'string'
                      ? post.authors[0].charAt(0).toUpperCase()
                      : post.authors[0]?.name?.charAt(0).toUpperCase() || 'A')
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">
                    {typeof post.authors[0] === 'string'
                      ? post.authors[0]
                      : post.authors[0]?.name || 'Anonymous'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {typeof post.authors[0] !== 'string' && post.authors[0]?.bio
                      ? post.authors[0].bio
                      : 'Passionate writer sharing insights and knowledge with the community.'}
                  </p>
                  {typeof post.authors[0] !== 'string' && post.authors[0]?.socialLinks && (
                    <div className="flex space-x-2">
                      {post.authors[0].socialLinks.twitter && (
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={post.authors[0].socialLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Twitter"
                          >
                            Twitter
                          </a>
                        </Button>
                      )}
                      {post.authors[0].socialLinks.linkedin && (
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={post.authors[0].socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                          >
                            LinkedIn
                          </a>
                        </Button>
                      )}
                      {post.authors[0].socialLinks.github && (
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={post.authors[0].socialLinks.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub"
                          >
                            GitHub
                          </a>
                        </Button>
                      )}
                      {post.authors[0].socialLinks.website && (
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={post.authors[0].socialLinks.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Website"
                          >
                            Website
                          </a>
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Comments Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <Comments postId={post.id} postTitle={post.title} />
        </div>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
            <CollectionArchive posts={relatedPosts} relationTo="posts" />
          </div>
        )}
      </article>
    </div>
  )
}

// Generate static params for static generation
export async function generateStaticParams() {
  try {
    const posts = await getPosts()
    return posts.map((post) => ({
      slug: post.slug,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params
  const post = await getPostBySlug(resolvedParams.slug)

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested post could not be found.',
    }
  }

  return {
    title: post.title,
    description: post.meta?.description || 'Read this article to learn more.',
    openGraph: {
      title: post.title,
      description: post.meta?.description || 'Read this article to learn more.',
      type: 'article',
      publishedTime: post.publishedAt || post.createdAt,
      authors:
        post.authors && post.authors.length > 0
          ? [
              typeof post.authors[0] === 'string'
                ? post.authors[0]
                : post.authors[0]?.name || 'Anonymous',
            ]
          : ['Anonymous'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.meta?.description || 'Read this article to learn more.',
    },
  }
}
