import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { ThemeProvider } from '@/app/(frontend)/components/theme-provider'
import { Header } from '@/app/(frontend)/components/layout/header'
import { Footer } from '@/app/(frontend)/components/layout/footer'
import { getCachedGlobal } from '@/client/utilities/getGlobals'
import type { Header as HeaderType, Footer as FooterType } from '@/payload-types'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Rizwan Nur - Blog',
  description:
    'Discover practical tools, insights, and resources to help you create exceptional user experiences that users love.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [header, footer] = await Promise.all([
    getCachedGlobal('header', 1)() as Promise<HeaderType>,
    getCachedGlobal('footer', 1)() as Promise<FooterType>,
  ])

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, 'antialiased')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Header header={header} />
            <main className="flex-1">{children}</main>
            <Footer footer={footer} />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
