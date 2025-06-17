'use client'

import * as React from 'react'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

import { Button } from '@/app/(frontend)/components/ui/button'
import { ThemeToggle } from '@/app/(frontend)/components/theme-toggle'
import { Logo } from '@/app/(frontend)/components/ui/logo'
import type { Header as HeaderType } from '@/payload-types'

// Default navigation fallback
const defaultNavigation = [
  { label: 'Home', url: '/', type: 'reference' as const },
  { label: 'Posts', url: '/posts', type: 'reference' as const },
  { label: 'About', url: '/about', type: 'reference' as const },
  { label: 'Contact', url: '/contact', type: 'reference' as const },
]

interface HeaderProps {
  header?: HeaderType
}

export function Header({ header }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Use header data from Payload or fallback to default navigation
  const navigation = header?.navItems?.length ? header.navItems : defaultNavigation

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navigation.map((item, index) => {
            const href = item.type === 'reference' && item.reference?.value 
              ? `/${item.reference.relationTo}/${item.reference.value.slug}`
              : item.url || '/'
            
            return (
              <Link
                key={index}
                href={href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Button asChild className="hidden md:inline-flex">
            <Link href="/login">Join Us</Link>
          </Button>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container py-4 space-y-3">
            {navigation.map((item, index) => {
              const href = item.type === 'reference' && item.reference?.value 
                ? `/${item.reference.relationTo}/${item.reference.value.slug}`
                : item.url || '/'
              
              return (
                <Link
                  key={index}
                  href={href}
                  className="block py-2 text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              )
            })}
            <div className="pt-2">
              <Button asChild className="w-full">
                <Link href="/login">Join Us</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
