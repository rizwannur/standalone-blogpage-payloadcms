import * as React from 'react'
import Link from 'next/link'
import { Github, Twitter, Linkedin, Mail } from 'lucide-react'

import { Logo } from '@/components/ui/logo'

// Default footer links
const defaultFooterLinks = {
  content: [
    { name: 'Blog', href: '/posts' },
    { name: 'Projects', href: '/projects' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ],
  resources: [
    { name: 'Newsletter', href: '/newsletter' },
    { name: 'RSS Feed', href: '/rss.xml' },
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
  ],
  social: [
    { name: 'Twitter', href: 'https://twitter.com/yourusername', icon: Twitter },
    { name: 'GitHub', href: 'https://github.com/yourusername', icon: Github },
    { name: 'LinkedIn', href: 'https://linkedin.com/in/yourusername', icon: Linkedin },
    { name: 'Email', href: 'mailto:your.email@example.com', icon: Mail },
  ],
}

// Default navigation items
const defaultNavigation = [
  { label: 'Home', url: '/', type: 'reference' as const },
  { label: 'Blog', url: '/posts', type: 'reference' as const },
  { label: 'Projects', url: '/projects', type: 'reference' as const },
  { label: 'About', url: '/about', type: 'reference' as const },
  { label: 'Contact', url: '/contact', type: 'reference' as const },
]

export function Footer() {
  // Use default navigation and footer links
  const navigation = defaultNavigation
  const footerLinks = defaultFooterLinks

  return (
    <footer className="border-t bg-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Logo />
            </Link>
            <p className="text-sm text-muted-foreground max-w-md">
              Welcome to my personal blog where I share my thoughts, experiences, and insights about technology, programming, and my journey as a developer.
            </p>
            <div className="flex space-x-4 mt-6">
              {footerLinks.social.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              {navigation.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.url}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Content links */}
          <div>
            <h3 className="font-semibold mb-4">Content</h3>
            <ul className="space-y-2">
              {footerLinks.content.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources links */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Your Name. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
