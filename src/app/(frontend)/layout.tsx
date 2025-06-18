import type { Metadata } from 'next'
import './globals.css'
import '@/components/admin/admin-dashboard.scss'
import { cn } from '@/lib/utils'
import { ThemeProvider } from '@/components/theme-provider'
import { AdminProvider } from '@/components/providers/AdminProvider'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { AdminToolbar } from '@/components/admin/AdminToolbar'
import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = {
  title: 'Your Name - Personal Blog',
  description:
    'My personal blog where I share my thoughts, experiences, and insights about technology, programming, and more.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('font-sans antialiased')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AdminProvider>
            <div className="relative flex min-h-screen flex-col">
              <AdminToolbar />
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </AdminProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
