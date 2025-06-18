import * as React from 'react'
import { Palette, Code, Zap, Smartphone, Monitor, Layers, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// Mock data - replace with actual data from your backend
const allTools = [
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

const categories = [
  'All',
  'Design',
  'Development',
  'Components',
  'Testing',
  'Performance',
  'Design Systems',
]

export default function ToolsPage() {
  const [selectedCategory, setSelectedCategory] = React.useState('All')
  const [searchQuery, setSearchQuery] = React.useState('')

  const filteredTools = allTools.filter((tool) => {
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory
    const matchesSearch =
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="container py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Free UI/UX Tools</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Discover our collection of free tools designed to help you create better user interfaces
          and experiences.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        {/* Search */}
        <div className="relative max-w-md mx-auto mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTools.map((tool) => {
          const Icon = tool.icon
          return (
            <Card
              key={tool.id}
              className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200 dark:hover:border-blue-800"
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                      <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <Badge variant="secondary">{tool.category}</Badge>
                </div>
                <CardTitle className="group-hover:text-blue-600 transition-colors">
                  {tool.title}
                </CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <a href={tool.href}>Try Tool</a>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* No results */}
      {filteredTools.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No tools found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}
