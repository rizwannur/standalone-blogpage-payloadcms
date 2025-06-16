import * as React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, Clock, ArrowLeft, Twitter, Linkedin, Facebook } from 'lucide-react'

import { Button } from '@/app/(frontend)/components/ui/button'
import { Card, CardContent } from '@/app/(frontend)/components/ui/card'

// Mock data - replace with actual data from your backend
const allPosts = [
  {
    id: 1,
    title: '10 Essential UI Design Principles Every Designer Should Know',
    description:
      'Learn the fundamental principles that make great user interfaces, from visual hierarchy to consistency and beyond.',
    content: `
# 10 Essential UI Design Principles Every Designer Should Know

User Interface (UI) design is both an art and a science. While creativity plays a crucial role, there are fundamental principles that guide effective UI design. Whether you're a beginner or looking to refine your skills, these 10 principles will help you create interfaces that are not only beautiful but also functional and user-friendly.

## 1. Visual Hierarchy

Visual hierarchy is the arrangement of elements in order of importance. It guides users through your interface and helps them understand what to focus on first.

### Key techniques:
- **Size**: Larger elements draw more attention
- **Color**: Bright or contrasting colors stand out
- **Position**: Elements at the top or center get noticed first
- **Typography**: Bold or larger fonts create emphasis

## 2. Consistency

Consistency creates predictability and reduces cognitive load. Users should be able to predict how elements will behave based on their previous interactions.

### Areas to maintain consistency:
- Color schemes and typography
- Button styles and interactions
- Navigation patterns
- Spacing and layout grids

## 3. Simplicity

Simplicity doesn't mean boring—it means removing unnecessary elements that don't serve a purpose. Every element should have a reason for being there.

### Tips for achieving simplicity:
- Remove decorative elements that don't add value
- Use white space effectively
- Limit color palettes
- Focus on essential features

## 4. Accessibility

Designing for accessibility ensures your interface can be used by people with various abilities and disabilities.

### Key considerations:
- Color contrast ratios
- Keyboard navigation
- Screen reader compatibility
- Alternative text for images

## 5. Feedback

Users need to know that their actions have been registered and what's happening in the system.

### Types of feedback:
- Visual feedback (button states, loading indicators)
- Audio feedback (notification sounds)
- Haptic feedback (vibrations on mobile)
- Progress indicators for long processes

## Conclusion

These principles form the foundation of good UI design. While trends come and go, these fundamentals remain constant. Practice applying them in your work, and you'll see a significant improvement in the usability and effectiveness of your designs.

Remember, great design is invisible—users should be able to accomplish their goals without thinking about the interface itself.
    `,
    date: '2024-01-15',
    readTime: '8 min read',
    category: 'Design',
    author: 'UI Surgeon',
    slug: 'ui-design-principles',
    featured: true,
    tags: ['UI Design', 'Design Principles', 'User Experience', 'Visual Design'],
  },
  {
    id: 2,
    title: 'Building Accessible Components with React and TypeScript',
    description:
      'A comprehensive guide to creating inclusive user interfaces that work for everyone, with practical examples.',
    content: `
# Building Accessible Components with React and TypeScript

Accessibility isn't an afterthought—it's a fundamental aspect of good web development. In this guide, we'll explore how to build accessible React components using TypeScript, ensuring your applications work for everyone.

## Why Accessibility Matters

Accessibility benefits everyone, not just users with disabilities. It improves:
- SEO and search engine rankings
- Overall user experience
- Legal compliance
- Market reach

## Setting Up Your Development Environment

Before we start building, let's set up our tools:

\`\`\`bash
npm install @types/react @types/react-dom
npm install --save-dev eslint-plugin-jsx-a11y
\`\`\`

## Building an Accessible Button Component

Let's start with a basic button component:

\`\`\`typescript
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  'aria-label'?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  'aria-label': ariaLabel,
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={\`btn btn-\${variant}\`}
      {...props}
    >
      {children}
    </button>
  );
};
\`\`\`

## Key Accessibility Features

### 1. Semantic HTML
Use the correct HTML elements for their intended purpose.

### 2. ARIA Labels
Provide descriptive labels for screen readers.

### 3. Keyboard Navigation
Ensure all interactive elements are keyboard accessible.

### 4. Focus Management
Manage focus states properly, especially in modals and dynamic content.

## Testing Your Components

Use these tools to test accessibility:
- axe-core for automated testing
- Screen readers for manual testing
- Keyboard-only navigation
- Color contrast analyzers

## Conclusion

Building accessible components requires planning and attention to detail, but the benefits are immense. Start with these basics and gradually incorporate more advanced accessibility features as you grow more comfortable with the concepts.
    `,
    date: '2024-01-12',
    readTime: '12 min read',
    category: 'Development',
    author: 'UI Surgeon',
    slug: 'accessible-react-components',
    featured: true,
    tags: ['React', 'TypeScript', 'Accessibility', 'Web Development'],
  },
]

interface PageProps {
  params: {
    slug: string
  }
}

export default function PostPage({ params }: PageProps) {
  const post = allPosts.find((p) => p.slug === params.slug)

  if (!post) {
    notFound()
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
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
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-full">
              {post.category}
            </span>
            <span>•</span>
            <Calendar className="h-4 w-4" />
            <span>{new Date(post.date).toLocaleDateString()}</span>
            <span>•</span>
            <Clock className="h-4 w-4" />
            <span>{post.readTime}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{post.title}</h1>

          <p className="text-xl text-muted-foreground mb-8">{post.description}</p>

          {/* Tags */}
          {post.tags && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Share buttons */}
          <div className="flex items-center space-x-4 pt-6 border-t">
            <span className="text-sm font-medium">Share this article:</span>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" asChild>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </header>

        {/* Article content */}
        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <div className="whitespace-pre-wrap">{post.content}</div>
        </div>

        {/* Author info */}
        <Card className="mb-12">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                US
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">{post.author}</h3>
                <p className="text-muted-foreground mb-4">
                  UI/UX Designer and Frontend Developer passionate about creating beautiful,
                  functional, and accessible digital experiences. Sharing insights and tutorials to
                  help the design and development community grow.
                </p>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/about">Learn More</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/contact">Get in Touch</Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related posts */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allPosts
              .filter((p) => p.slug !== post.slug && p.category === post.category)
              .slice(0, 2)
              .map((relatedPost) => (
                <Card
                  key={relatedPost.id}
                  className="group hover:shadow-lg transition-all duration-300"
                >
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-t-lg flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">{relatedPost.category}</span>
                  </div>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(relatedPost.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <Clock className="h-4 w-4" />
                      <span>{relatedPost.readTime}</span>
                    </div>
                    <h3 className="font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                      <Link href={`/posts/${relatedPost.slug}`}>{relatedPost.title}</Link>
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {relatedPost.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </article>
    </div>
  )
}

// Generate static params for static generation (optional)
export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post.slug,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const post = allPosts.find((p) => p.slug === params.slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  }
}
