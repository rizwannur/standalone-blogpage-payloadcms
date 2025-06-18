'use client'

import * as React from 'react'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, User, LogOut } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { Logo } from '@/components/ui/logo'
import { SearchBar } from '@/components/search/SearchBar'
import { useAdmin } from '@/components/providers/AdminProvider'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

// Define navigation item type
interface NavItem {
  label: string;
  url: string;
  type: 'reference' | 'custom';
  reference?: {
    relationTo?: string;
    value?: {
      slug?: string;
    };
  };
}

// Default navigation fallback
const defaultNavigation: NavItem[] = [
  { label: 'Home', url: '/', type: 'reference' },
  { label: 'Blog', url: '/posts', type: 'reference' },
  { label: 'Projects', url: '/projects', type: 'reference' },
  { label: 'About', url: '/about', type: 'reference' },
  { label: 'Contact', url: '/contact', type: 'reference' },
]

interface HeaderProps {
  header?: {
    navItems?: NavItem[];
  }
}

export function Header({ header }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout } = useAdmin()

  // Use header data from Payload or fallback to default navigation
  const navigation = header?.navItems?.length ? header.navItems : defaultNavigation

  const handleLogout = async () => {
    await logout()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navigation.map((item: NavItem, index: number) => {
            const href =
              item.type === 'reference' && item.reference?.value
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

        {/* Search Bar - Desktop */}
        <div className="hidden md:block flex-1 max-w-sm mx-8">
          <SearchBar />
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={typeof user.avatar === 'string' ? user.avatar : user.avatar?.url || ''} alt={user.name || 'User'} />
                    <AvatarFallback>
                      {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {user.name && <p className="font-medium">{user.name}</p>}
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}

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
          <div className="container py-4 space-y-4">
            {/* Mobile Search */}
            <div className="pb-2">
              <SearchBar placeholder="Search posts..." />
            </div>
            
            {/* Mobile Navigation Links */}
            <nav className="space-y-3">
              {navigation.map((item: NavItem, index: number) => {
                const href =
                  item.type === 'reference' && item.reference?.value
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
            </nav>
            
            {/* Mobile Auth Actions */}
            <div className="pt-2 space-y-2">
              {user ? (
                <>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </Button>
                  <Button onClick={handleLogout} variant="ghost" className="w-full">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                      Sign Up
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
