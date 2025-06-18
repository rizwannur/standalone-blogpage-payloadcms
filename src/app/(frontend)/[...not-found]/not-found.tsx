'use client'

import { useEffect, useState } from 'react'
import { Home, ArrowLeft, Search, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState('')
  const [glitchText, setGlitchText] = useState('404')
  const [isSearching, setIsSearching] = useState(false)
  
  // Glitch effect for 404 text
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      const characters = '!@#$%^&*()_+-=[]{}|;:,.<>?/\\'
      const randomChar = () => characters.charAt(Math.floor(Math.random() * characters.length))
      
      if (Math.random() > 0.8) {
        setGlitchText(`4${randomChar()}4`)
        setTimeout(() => setGlitchText('404'), 100)
      }
    }, 2000)
    
    return () => clearInterval(glitchInterval)
  }, [])
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    
    setIsSearching(true)
    setTimeout(() => {
      setIsSearching(false)
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }, 1500)
  }
  
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl mx-auto bg-card p-8 rounded-xl shadow-lg border border-border/50 backdrop-blur-sm"
      >
        {/* 404 Animation */}
        <motion.div 
          className="mb-8 relative"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 20 
          }}
        >
          <div className="text-9xl font-bold text-primary/10 mb-4 relative overflow-hidden">
            <span className="relative inline-block transform hover:scale-110 transition-transform duration-300 cursor-default">
              {glitchText.split('').map((char, i) => (
                <span 
                  key={i} 
                  className={`inline-block ${i === 1 ? 'animate-pulse text-primary/30' : ''}`}
                  style={{ 
                    textShadow: '0 0 5px currentColor',
                    animationDelay: `${i * 0.1}s`
                  }}
                >
                  {char}
                </span>
              ))}
            </span>
          </div>
          <motion.div 
            className="w-32 h-1.5 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 mx-auto rounded-full"
            animate={{ 
              width: ["8rem", "10rem", "8rem"],
              opacity: [1, 0.8, 1]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          />
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Page Not Found</h1>
          <p className="text-lg text-muted-foreground mb-8">
            The page you&apos;re looking for has vanished into the digital void. It might have been moved, deleted, or perhaps never existed at all.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
            <Input
              type="text"
              placeholder="Try searching instead..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={isSearching}>
              {isSearching ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </form>
        </motion.div>

        {/* Actions */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Button asChild variant="default" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Link>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="border-blue-500/30 hover:border-blue-500/60 transition-all duration-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </motion.div>

        {/* Helpful Links */}
        <motion.div 
          className="mt-12 pt-8 border-t border-border/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <p className="text-sm text-muted-foreground mb-4">Or explore these popular destinations:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link 
              href="/posts" 
              className="px-4 py-2 rounded-full bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors duration-300"
            >
              Blog Posts
            </Link>
            <Link 
              href="/projects" 
              className="px-4 py-2 rounded-full bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 transition-colors duration-300"
            >
              Projects
            </Link>
            <Link 
              href="/about" 
              className="px-4 py-2 rounded-full bg-pink-500/10 text-pink-500 hover:bg-pink-500/20 transition-colors duration-300"
            >
              About Me
            </Link>
            <Link 
              href="/contact" 
              className="px-4 py-2 rounded-full bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors duration-300"
            >
              Contact
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
