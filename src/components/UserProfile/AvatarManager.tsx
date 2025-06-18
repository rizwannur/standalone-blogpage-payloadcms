'use client'

import React, { useState, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Camera, Upload, Trash2, Loader2, X } from 'lucide-react'
import { toast } from 'sonner'
import type { Media } from '@/payload-types'

interface AvatarData {
  id: string
  email: string
  name: string
  avatar?: Media | string | null
}

interface AvatarManagerProps {
  onAvatarUpdate?: (avatarData: AvatarData) => void
  className?: string
}

const AvatarManager: React.FC<AvatarManagerProps> = ({ onAvatarUpdate, className }) => {
  const [avatarData, setAvatarData] = useState<AvatarData | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch current avatar data
  const fetchAvatarData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/users/avatar', {
        method: 'GET',
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setAvatarData(data)
      } else if (response.status === 401) {
        toast.error('Please log in to manage your avatar')
      } else {
        toast.error('Failed to fetch avatar data')
      }
    } catch (error) {
      console.error('Avatar fetch error:', error)
      toast.error('An error occurred while fetching avatar data')
    } finally {
      setLoading(false)
    }
  }

  // Load avatar data on component mount
  React.useEffect(() => {
    fetchAvatarData()
  }, [])

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB')
        return
      }

      setAvatarFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Upload and update avatar
  const handleAvatarUpdate = async () => {
    if (!avatarFile) {
      toast.error('Please select an image first')
      return
    }

    setUploading(true)
    try {
      // First, upload the image to media collection
      const formData = new FormData()
      formData.append('file', avatarFile)

      const uploadResponse = await fetch('/api/media', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image')
      }

      const uploadResult = await uploadResponse.json()
      const mediaId = uploadResult.doc.id

      // Then, update the user's avatar
      const updateResponse = await fetch('/api/users/avatar', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ avatar: mediaId }),
        credentials: 'include',
      })

      if (updateResponse.ok) {
        const updatedData = await updateResponse.json()
        setAvatarData(updatedData)
        setAvatarFile(null)
        setAvatarPreview(null)
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }

        toast.success('Avatar updated successfully!')
        
        // Notify parent component
        if (onAvatarUpdate) {
          onAvatarUpdate(updatedData)
        }
      } else {
        const error = await updateResponse.json()
        toast.error(error.message || 'Failed to update avatar')
      }
    } catch (error) {
      console.error('Avatar update error:', error)
      toast.error('An error occurred while updating your avatar')
    } finally {
      setUploading(false)
    }
  }

  // Remove avatar
  const handleAvatarRemove = async () => {
    setUploading(true)
    try {
      const response = await fetch('/api/users/avatar', {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.ok) {
        // Refresh avatar data
        await fetchAvatarData()
        toast.success('Avatar removed successfully!')
        
        // Notify parent component
        if (onAvatarUpdate && avatarData) {
          onAvatarUpdate({ ...avatarData, avatar: null })
        }
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to remove avatar')
      }
    } catch (error) {
      console.error('Avatar removal error:', error)
      toast.error('An error occurred while removing your avatar')
    } finally {
      setUploading(false)
    }
  }

  // Cancel file selection
  const handleCancel = () => {
    setAvatarFile(null)
    setAvatarPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Get avatar URL
  const getAvatarUrl = () => {
    if (avatarPreview) return avatarPreview
    if (!avatarData?.avatar) return null
    
    if (typeof avatarData.avatar === 'string') {
      return avatarData.avatar
    }
    
    return (avatarData.avatar as Media)?.url || null
  }

  // Get user initials
  const getUserInitials = () => {
    if (!avatarData) return 'U'
    
    if (avatarData.name) {
      return avatarData.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    
    return avatarData.email?.[0]?.toUpperCase() || 'U'
  }

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Avatar Management
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground">Loading avatar data...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Avatar Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Avatar Display */}
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={getAvatarUrl() || undefined} alt={avatarData?.name || 'User avatar'} />
            <AvatarFallback className="text-lg">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          
          <div className="text-center">
            <p className="font-medium">{avatarData?.name || 'Anonymous User'}</p>
            <p className="text-sm text-muted-foreground">{avatarData?.email}</p>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="avatar-upload" className="text-sm font-medium">
              Upload New Avatar
            </Label>
            <Input
              ref={fileInputRef}
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="mt-1"
              disabled={uploading}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Supported formats: JPG, PNG, GIF. Max size: 5MB
            </p>
          </div>

          {/* Preview and Actions */}
          {avatarFile && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={avatarPreview || undefined} alt="Preview" />
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Preview</p>
                    <p className="text-xs text-muted-foreground">{avatarFile.name}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  disabled={uploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={handleAvatarUpdate}
                  disabled={uploading}
                  className="flex-1"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Update Avatar
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={uploading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Remove Avatar Option */}
          {avatarData?.avatar && !avatarFile && (
            <div className="pt-4 border-t">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleAvatarRemove}
                disabled={uploading}
                className="w-full"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Removing...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove Avatar
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default AvatarManager