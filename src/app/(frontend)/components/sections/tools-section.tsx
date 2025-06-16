import * as React from 'react'
import Link from 'next/link'
import { Palette, Code, Zap, Smartphone, Monitor, Layers, ArrowRight } from 'lucide-react'

import { Button } from '@/app/(frontend)/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/(frontend)/components/ui/card'

// Mock data - replace with actual data from your backend
const tools = [
  {
    id: 1,
    title: 'Color Palette Generator',
    description:
      'Generate beautiful color palettes for your next design project with AI-powered suggestions.',
    icon: Palette,
    category: 'Design',
    href: '/tools/color-palette',
    featured: true,
  },
  {
    id: 2,
    title: 'CSS Grid Generator',
    description:
      'Create complex CSS Grid layouts with an intuitive visual interface and export clean code.',
    icon: Code,
    category: 'Development',
    href: '/tools/css-grid',
    featured: true,
  },
  {
    id: 3,
    title: 'Component Library',
    description: 'Browse and copy production-ready React components built with Tailwind CSS.',
    icon: Layers,
    category: 'Components',
    href: '/tools/components',
    featured: true,
  },
  {
    id: 4,
    title: 'Responsive Checker',
    description:
      "Test your website's responsiveness across different device sizes and orientations.",
    icon: Smartphone,
    category: 'Testing',
    href: '/tools/responsive-checker',
    featured: false,
  },
  {
    id: 5,
    title: 'Performance Analyzer',
    description: "Analyze your website's performance and get actionable insights to improve speed.",
    icon: Zap,
    category: 'Performance',
    href: '/tools/performance',
    featured: false,
  },
  {
    id: 6,
    title: 'Design System Builder',
    description: 'Build and maintain consistent design systems with automated documentation.',
    icon: Monitor,
    category: 'Design Systems',
    href: '/tools/design-system',
    featured: false,
  },
]

export function ToolsSection() {
  const featuredTools = tools.filter((tool) => tool.featured)

  return (
    <section className="py-20">
      <div className="container">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Free Tools</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful, free tools to help you design and develop better user interfaces
          </p>
        </div>

        {/* Featured tools grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredTools.map((tool) => {
            const Icon = tool.icon
            return (
              <Card
                key={tool.id}
                className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200 dark:hover:border-blue-800"
              >
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                      <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {tool.category}
                    </span>
                  </div>
                  <CardTitle className="group-hover:text-blue-600 transition-colors">
                    {tool.title}
                  </CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="ghost" className="p-0 h-auto font-medium">
                    <Link href={tool.href} className="flex items-center">
                      Try it now
                      <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* All tools grid */}
        <div className="bg-muted/30 rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-6 text-center">More Tools</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {tools
              .filter((tool) => !tool.featured)
              .map((tool) => {
                const Icon = tool.icon
                return (
                  <Link
                    key={tool.id}
                    href={tool.href}
                    className="flex items-center space-x-3 p-4 rounded-lg hover:bg-background transition-colors group"
                  >
                    <div className="p-2 bg-muted rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                      <Icon className="h-5 w-5 text-muted-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium group-hover:text-blue-600 transition-colors">
                        {tool.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">{tool.category}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </Link>
                )
              })}
          </div>

          {/* View all tools button */}
          <div className="text-center">
            <Button asChild size="lg">
              <Link href="/tools">
                View All Tools
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
