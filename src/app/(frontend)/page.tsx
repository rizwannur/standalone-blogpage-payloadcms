import { getHeaders } from '@/utilities/getHeaders'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'
import { cn } from '@/lib/utils'

import config from '@/payload.config'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-6 md:p-12 lg:p-24">
      <div className="flex flex-col items-center justify-center flex-1 max-w-4xl mx-auto text-center space-y-8">
        <div className="flex items-center justify-center p-4 rounded-full bg-muted">
          <Image
            alt="Payload Logo"
            height={80}
            src="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-favicon.svg"
            width={80}
            className="dark:invert"
          />
        </div>
        
        <div className="space-y-4">
          {!user && (
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Welcome to your new project
            </h1>
          )}
          {user && (
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Welcome back, <span className="text-primary">{user.email}</span>
            </h1>
          )}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
            A modern blog built with Payload CMS, Next.js, and Tailwind CSS
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <a
            className={cn(
              "inline-flex items-center justify-center rounded-md text-sm font-medium",
              "ring-offset-background transition-colors focus-visible:outline-none",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:pointer-events-none disabled:opacity-50",
              "bg-primary text-primary-foreground hover:bg-primary/90",
              "h-10 px-4 py-2"
            )}
            href={payloadConfig.routes.admin}
            rel="noopener noreferrer"
            target="_blank"
          >
            Go to admin panel
          </a>
          <a
            className={cn(
              "inline-flex items-center justify-center rounded-md text-sm font-medium",
              "ring-offset-background transition-colors focus-visible:outline-none",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:pointer-events-none disabled:opacity-50",
              "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
              "h-10 px-4 py-2"
            )}
            href="https://payloadcms.com/docs"
            rel="noopener noreferrer"
            target="_blank"
          >
            Documentation
          </a>
        </div>
      </div>
      
      <footer className="flex flex-col sm:flex-row items-center gap-2 text-sm text-muted-foreground">
        <p>Update this page by editing</p>
        <a 
          className="inline-flex items-center rounded bg-muted px-2 py-1 font-mono text-xs hover:bg-muted/80 transition-colors"
          href={fileURL}
        >
          app/(frontend)/page.tsx
        </a>
      </footer>
    </div>
  )
}
