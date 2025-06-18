import * as React from 'react'
import Link from 'next/link'
import { ArrowRight, Users, Target, Lightbulb } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const features = [
  {
    icon: Users,
    title: 'Community Driven',
    description:
      'Built by designers and developers, for designers and developers. Every tool and resource is created based on real community needs.',
  },
  {
    icon: Target,
    title: 'Practical Focus',
    description:
      'No fluff, just practical insights and tutorials that you can immediately apply to your projects and workflow.',
  },
  {
    icon: Lightbulb,
    title: 'Always Learning',
    description:
      'We stay on top of the latest trends and technologies to bring you cutting-edge tutorials and knowledge.',
  },
]

export function About() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">About UI Surgeon</h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              UI Surgeon is your go-to resource for everything related to user interface design and
              development. We provide practical tutorials, in-depth guides, and valuable insights to
              help you create better user experiences.
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Whether you&apos;re a seasoned designer, a developer looking to improve your UI
              skills, or someone just starting their journey in UX/UI, we have something for you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link href="/about">
                  Learn More
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Stats section */}
        <div className="mt-20 pt-12 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                50+
              </div>
              <div className="text-muted-foreground">Articles</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                100+
              </div>
              <div className="text-muted-foreground">Blog Posts</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                10k+
              </div>
              <div className="text-muted-foreground">Monthly Users</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                5k+
              </div>
              <div className="text-muted-foreground">Newsletter Subscribers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
