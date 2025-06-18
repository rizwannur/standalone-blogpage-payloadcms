import React from 'react'

import { Hero } from '@/components/sections/hero'
import { FeaturedPosts } from '@/components/sections/featured-posts'
import { ToolsSection } from '@/components/sections/tools-section'
import { About } from '@/components/sections/about'
import { Newsletter } from '@/components/sections/newsletter'

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
