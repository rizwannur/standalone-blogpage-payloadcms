'use client'

import * as React from 'react'
import { useState } from 'react'
import { Mail, CheckCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)

    // Simulate API call - replace with actual newsletter subscription logic
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitted(true)
    setIsLoading(false)
    setEmail('')

    // Reset success state after 3 seconds
    setTimeout(() => setIsSubmitted(false), 3000)
  }

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container">
        <Card className="max-w-4xl mx-auto border-2 shadow-xl">
          <CardContent className="p-8 md:p-12">
            <div className="text-center">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
                <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>

              {/* Heading */}
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Get the latest development insights, tutorials, and articles delivered to your inbox. Join
                10,000+ designers and developers.
              </p>

              {/* Newsletter form */}
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="flex-1 px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Button type="submit" size="lg" disabled={isLoading} className="px-8">
                      {isLoading ? 'Subscribing...' : 'Subscribe'}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    No spam, unsubscribe at any time.
                  </p>
                </form>
              ) : (
                <div className="max-w-md mx-auto">
                  <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400 mb-4">
                    <CheckCircle className="h-6 w-6" />
                    <span className="font-medium">Successfully subscribed!</span>
                  </div>
                  <p className="text-muted-foreground">
                    Thank you for subscribing. Check your email for confirmation.
                  </p>
                </div>
              )}

              {/* Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-8 border-t">
                <div className="text-center">
                  <div className="font-semibold mb-2">Weekly Insights</div>
                  <div className="text-sm text-muted-foreground">
                    Curated design and development tips
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-semibold mb-2">Exclusive Content</div>
            <div className="text-sm text-muted-foreground">
              Early access to new articles and tutorials
            </div>
                </div>
                <div className="text-center">
                  <div className="font-semibold mb-2">Community</div>
                  <div className="text-sm text-muted-foreground">
                    Join a community of like-minded creators
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
