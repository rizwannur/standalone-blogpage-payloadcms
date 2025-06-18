'use client'

import React, { useState, useEffect } from 'react'
import { useAdmin } from '@/components/providers/AdminProvider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import AvatarManager from './AvatarManager'

import {
  User,
  Mail,
  Calendar,
  Edit,
  Save,
  X,
  Settings,
  CheckCircle,
  AlertCircle,
  Camera,
  Key,
  Loader2,
  Globe,
} from 'lucide-react'
import { toast } from 'sonner'
import type { User as PayloadUser, Media } from '@/payload-types'

// Utility function for formatting dates
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

interface UserProfileData {
  id: string
  email: string
  name: string
  role: string
  bio?: string
  avatar?: string
  createdAt: string
  updatedAt: string
  isActive?: boolean
  website?: string
  location?: string
  preferences: {
    emailNotifications?: boolean
    newsletterSubscription?: boolean
  }
  stats: {
    postsCount: number
    commentsCount: number
    likesReceived: number
  }
  socialLinks: {
    twitter?: string | null
    linkedin?: string | null
    github?: string | null
    website?: string | null
  }
}

interface UserProfileProps {
  showEditButton?: boolean
  compact?: boolean
}

const UserProfile: React.FC<UserProfileProps> = ({ showEditButton = true, compact = false }) => {
  const { user, isAuthenticated, loading: authLoading, refreshUser } = useAdmin()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [profileData, setProfileData] = useState<Partial<UserProfileData>>({
    id: user?.id || '',
    email: user?.email || '',
    name: user?.name || '',
    role: user?.role || '',
    bio: user?.bio || '',
    avatar: typeof user?.avatar === 'string' ? user.avatar : (user?.avatar as Media)?.url || '',
    createdAt: user?.createdAt || '',
    updatedAt: user?.updatedAt || '',
    preferences: {
      emailNotifications: user?.preferences?.emailNotifications || false,
      newsletterSubscription: user?.preferences?.newsletterSubscription || false,
    },
    stats: {
      postsCount: 0,
      commentsCount: 0,
      likesReceived: 0,
    },
    socialLinks: user?.socialLinks || {},
  })

  useEffect(() => {
    if (user) {
      const userData = {
        id: user.id,
        email: user.email,
        name: user.name || '',
        role: user.role,
        bio: user.bio || '',
        avatar: typeof user.avatar === 'string' ? user.avatar : (user.avatar as Media)?.url || '',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        preferences: {
          emailNotifications: user.preferences?.emailNotifications || false,
          newsletterSubscription: user.preferences?.newsletterSubscription || false,
        },
        socialLinks: user.socialLinks || {},
        stats: {
          postsCount: 0,
          commentsCount: 0,
          likesReceived: 0,
        },
      }
      setProfileData(userData)
      setFormData(userData)
    }
  }, [user])

  const [formData, setFormData] = useState<Partial<UserProfileData>>({})
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'profile' | 'avatar' | 'security' | 'preferences'>('profile')

  useEffect(() => {
    if (profileData) {
      setFormData(profileData)
    }
  }, [profileData])

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePreferenceChange = (field: string, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value,
      },
    }))
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    if (!profileData) return

    setLoading(true)
    try {
      let avatarId = formData.avatar

      // Upload avatar if a new file is selected
      if (avatarFile) {
        const formDataUpload = new FormData()
        formDataUpload.append('file', avatarFile)

        const uploadResponse = await fetch('/api/media', {
          method: 'POST',
          body: formDataUpload,
        })

        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json()
          avatarId = uploadResult.doc.id
        } else {
          toast.error('Failed to upload avatar')
          return
        }
      }

      const updateData = {
        ...formData,
        ...(avatarId && { avatar: avatarId }),
      }

      const response = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        const updatedUser = await response.json()
        const userData = {
          ...updatedUser,
          avatar:
            typeof updatedUser.avatar === 'string'
              ? updatedUser.avatar
              : (updatedUser.avatar as Media)?.url || '',
        }
        setProfileData(userData)
        setFormData(userData)
        setIsEditing(false)
        setAvatarFile(null)
        setAvatarPreview(null)
        await refreshUser()
        toast.success('Profile updated successfully!')
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Profile update error:', error)
      toast.error('An error occurred while updating your profile')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData(profileData || {})
    setIsEditing(false)
    setAvatarFile(null)
    setAvatarPreview(null)
  }

  // Format date utility
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (authLoading) {
    return (
      <Card className={compact ? 'w-full' : 'max-w-4xl mx-auto'}>
        <CardContent className="p-8 text-center">
          <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground">Loading profile...</p>
        </CardContent>
      </Card>
    )
  }

  if (!isAuthenticated || !profileData) {
    return (
      <Card className={compact ? 'w-full' : 'max-w-4xl mx-auto'}>
        <CardContent className="p-8 text-center">
          <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Not Authenticated</h3>
          <p className="text-muted-foreground mb-4">Please log in to view your profile.</p>
          <Button onClick={() => (window.location.href = '/admin/login')}>Log In</Button>
        </CardContent>
      </Card>
    )
  }

  if (compact) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={profileData.avatar} alt={profileData.name} />
              <AvatarFallback>
                {profileData.name
                  ? profileData.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                  : profileData.email?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold truncate">{profileData.name || 'Anonymous User'}</h3>
                <Badge variant="secondary" className="text-xs">
                  <span className="capitalize">{profileData.role}</span>
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground truncate">{profileData.email}</p>
              {profileData.bio && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{profileData.bio}</p>
              )}
            </div>
            {showEditButton && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarPreview || profileData.avatar} alt={profileData.name} />
                <AvatarFallback className="text-2xl">
                  {profileData.name
                    ? profileData.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                    : profileData.email
                      ? profileData.email[0].toUpperCase()
                      : 'U'}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    id="avatar-upload"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute -bottom-2 -right-2 h-8 w-8 p-0"
                    onClick={() => document.getElementById('avatar-upload')?.click()}
                    type="button"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold">{profileData.name || 'Anonymous User'}</h1>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="secondary">
                      <span className="capitalize">{profileData.role}</span>
                    </Badge>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                </div>
                {showEditButton && (
                  <div className="flex space-x-2">
                    {isEditing ? (
                      <>
                        <Button variant="outline" onClick={handleCancel} disabled={loading}>
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={loading}>
                          {loading ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4 mr-2" />
                          )}
                          Save
                        </Button>
                      </>
                    ) : (
                      <Button onClick={() => setIsEditing(true)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    )}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Mail className="h-4 w-4 mr-2" />
                  {profileData.email}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  Joined {profileData.createdAt ? formatDate(profileData.createdAt) : 'Unknown'}
                </div>
                {profileData.location && (
                  <div className="flex items-center text-muted-foreground">
                    <Globe className="h-4 w-4 mr-2" />
                    {profileData.location}
                  </div>
                )}
                {profileData.website && (
                  <div className="flex items-center text-muted-foreground">
                    <Globe className="h-4 w-4 mr-2" />
                    <a
                      href={profileData.socialLinks?.website || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary"
                    >
                      {profileData.socialLinks?.website || 'Not provided'}
                    </a>
                  </div>
                )}
              </div>
              {profileData.bio && <p className="mt-4 text-muted-foreground">{profileData.bio}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex space-x-1 border-b">
        {[
          { id: 'profile', label: 'Profile', icon: User },
          { id: 'avatar', label: 'Avatar', icon: Camera },
          { id: 'security', label: 'Security', icon: Key },
          { id: 'preferences', label: 'Preferences', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              onClick={() => setActiveTab(tab.id as any)}
              className="rounded-b-none"
            >
              <Icon className="h-4 w-4 mr-2" />
              {tab.label}
            </Button>
          )
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'profile' && (
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio || ''}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  disabled={!isEditing}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    value={formData.socialLinks?.twitter || ''}
                    onChange={(e) =>
                      handleInputChange('socialLinks', {
                        ...formData.socialLinks,
                        twitter: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                    placeholder="@username"
                  />
                </div>

                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={formData.socialLinks?.linkedin || ''}
                    onChange={(e) =>
                      handleInputChange('socialLinks', {
                        ...formData.socialLinks,
                        linkedin: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                    placeholder="linkedin.com/in/username"
                  />
                </div>

                <div>
                  <Label htmlFor="github">GitHub</Label>
                  <Input
                    id="github"
                    value={formData.socialLinks?.github || ''}
                    onChange={(e) =>
                      handleInputChange('socialLinks', {
                        ...formData.socialLinks,
                        github: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                    placeholder="github.com/username"
                  />
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.socialLinks?.website || ''}
                    onChange={(e) =>
                      handleInputChange('socialLinks', {
                        ...formData.socialLinks,
                        website: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'avatar' && (
        <AvatarManager 
          onAvatarUpdate={(avatarData) => {
            // Update the profile data when avatar is changed
            setProfileData(prev => ({
              ...prev,
              avatar: typeof avatarData.avatar === 'string' 
                ? avatarData.avatar 
                : avatarData.avatar 
                  ? (avatarData.avatar as Media)?.url || '' 
                  : ''
            }))
            // Refresh user data in the admin provider
            refreshUser()
          }}
          className="w-full"
        />
      )}

      {activeTab === 'security' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Security Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Account Status</Label>
                <div className="flex items-center gap-2 mt-1">
                  {profileData.isActive ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600">Active</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-red-600">Inactive</span>
                    </>
                  )}
                </div>
              </div>

              <div>
                <Label>User Role</Label>
                <p className="text-sm text-muted-foreground mt-1 capitalize">
                  {profileData?.role || 'User'}
                </p>
              </div>

              <div>
                <Label>Member Since</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {profileData?.createdAt ? formatDate(profileData.createdAt) : 'Unknown'}
                </p>
              </div>

              <div>
                <Label>Last Updated</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {profileData?.updatedAt ? formatDate(profileData.updatedAt) : 'Unknown'}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button variant="outline" className="w-full">
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'preferences' && (
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications about your account activity
                  </p>
                </div>
                <Switch
                  checked={profileData?.preferences?.emailNotifications || false}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange('emailNotifications', checked)
                  }
                  disabled={!isEditing}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Newsletter Subscription</Label>
                  <p className="text-sm text-muted-foreground">
                    Stay updated with our latest news and updates
                  </p>
                </div>
                <Switch
                  checked={profileData?.preferences?.newsletterSubscription || false}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange('newsletterSubscription', checked)
                  }
                  disabled={!isEditing}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default UserProfile
