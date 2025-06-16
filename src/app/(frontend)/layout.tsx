import type { Metadata } from 'next'
import './globals.css'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  description: 'A modern blog built with Payload CMS, Next.js, and Tailwind CSS.',
  title: 'Rafey Blog - Modern Web Development',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" className="h-full">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        "flex flex-col"
      )}>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  )
}
