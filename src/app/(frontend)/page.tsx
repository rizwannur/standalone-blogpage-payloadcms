import React from 'react'

import { Hero } from '@/components/sections/hero'
import { About } from '@/components/sections/about'
import { FeaturedPosts } from '@/components/sections/featured-posts'
import { Newsletter } from '@/components/sections/newsletter'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <FeaturedPosts />
      <About />
      <Newsletter />
    </main>
  )
}
