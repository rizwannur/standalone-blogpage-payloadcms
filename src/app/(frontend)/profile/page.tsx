import React from 'react'
import { Metadata } from 'next/dist/lib/metadata/types/metadata-interface'
import UserProfile from '@/components/UserProfile'

export const metadata: Metadata = {
  title: 'My Profile | Rafey Blog',
  description: 'Manage your account information and preferences.',
  openGraph: {
    title: 'My Profile | Rafey Blog',
    description: 'Manage your account information and preferences.',
    type: 'website',
  },
}

const ProfilePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-muted-foreground">
          Manage your account information and preferences.
        </p>
      </div>
      
      <UserProfile showEditButton={true} compact={false} />
    </div>
  )
}

export default ProfilePage