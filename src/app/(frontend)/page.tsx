import React from 'react'

import { Hero } from '@/app/(frontend)/components/sections/hero'
import { FeaturedPosts } from '@/app/(frontend)/components/sections/featured-posts'
import { ToolsSection } from '@/app/(frontend)/components/sections/tools-section'
import { About } from '@/app/(frontend)/components/sections/about'
import { Newsletter } from '@/app/(frontend)/components/sections/newsletter'

export default function Page() {
  return (
    <>
      <Hero />
      <FeaturedPosts />
      <ToolsSection />
      <About />
      <Newsletter />
    </>
  )
}
