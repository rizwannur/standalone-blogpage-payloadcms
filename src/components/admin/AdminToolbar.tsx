'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useAdmin } from '@/components/providers/AdminProvider'
import { Button } from '@/components/ui/button'
import './AdminToolbar.scss'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Settings,
  User,
  LogOut,
  LogIn,
  Edit,
  Plus,
  FileText,
  Image,
  Users,
  BarChart3,
} from 'lucide-react'
import { toast } from 'sonner'

interface AdminToolbarProps {
  className?: string
}

export const AdminToolbar: React.FC<AdminToolbarProps> = ({ className }) => {
  const { user, isAuthenticated, isAdmin, isBlogger, login, logout, loading } = useAdmin()
  const [loginOpen, setLoginOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)

    try {
      const success = await login(email, password)
      if (success) {
        toast.success('Successfully logged in!')
        setLoginOpen(false)
        setEmail('')
        setPassword('')
      } else {
        toast.error('Invalid credentials')
      }
    } catch (error) {
      toast.error('Login failed')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Successfully logged out!')
    } catch (error) {
      toast.error('Logout failed')
    }
  }

  if (loading) {
    return null
  }

  if (!isAuthenticated) {
    return (
      <div className={`fixed top-4 right-4 z-50 ${className}`}>
        <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <LogIn className="h-4 w-4 mr-2" />
              Admin Login
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Admin Login</DialogTitle>
              <DialogDescription>
                Enter your credentials to access admin features.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loginLoading}>
                {loginLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className={`fixed top-4 right-4 z-50 ${className}`}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <User className="h-4 w-4 mr-2" />
            {user?.email}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Admin Panel</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Quick Actions */}
          <DropdownMenuItem asChild>
            <Link href="/admin">
              <Settings className="h-4 w-4 mr-2" />
              Admin Dashboard
            </Link>
          </DropdownMenuItem>

          {(isAdmin || isBlogger) && (
            <>
              <DropdownMenuItem asChild>
                <Link href="/admin/collections/posts/create">
                  <Plus className="h-4 w-4 mr-2" />
                  New Post
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href="/admin/collections/posts">
                  <FileText className="h-4 w-4 mr-2" />
                  Manage Posts
                </Link>
              </DropdownMenuItem>
            </>
          )}

          {isAdmin && (
            <>
              <DropdownMenuItem asChild>
                <Link href="/admin/collections/pages">
                  <Edit className="h-4 w-4 mr-2" />
                  Manage Pages
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href="/admin/collections/media">
                  <Image className="h-4 w-4 mr-2" />
                  Media Library
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href="/admin/collections/users">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href="/admin/collections/analytics">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </Link>
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
