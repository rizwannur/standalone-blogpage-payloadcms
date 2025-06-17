import * as React from 'react'
import Link from 'next/link'
import { Mail, Twitter, Github, Linkedin, Award, Users, BookOpen, Coffee } from 'lucide-react'

import { Button } from '@/app/(frontend)/components/ui/button'
import { Badge } from '@/app/(frontend)/components/ui/badge'
import { Card, CardContent } from '@/app/(frontend)/components/ui/card'

const stats = [
  {
    icon: BookOpen,
    value: '100+',
    label: 'Articles Published',
  },
  {
    icon: Users,
    value: '50K+',
    label: 'Monthly Readers',
  },
  {
    icon: Award,
    value: '5+',
    label: 'Years Experience',
  },
  {
    icon: Coffee,
    value: '∞',
    label: 'Cups of Coffee',
  },
]

const skills = [
  'UI/UX Design',
  'Frontend Development',
  'React & Next.js',
  'TypeScript',
  'Design Systems',
  'Accessibility',
  'Performance Optimization',
  'User Research',
]

const timeline = [
  {
    year: '2024',
    title: 'Senior UI/UX Designer',
    company: 'Tech Startup',
    description:
      'Leading design initiatives for a fast-growing SaaS platform, focusing on user experience and design systems.',
  },
  {
    year: '2022',
    title: 'Frontend Developer',
    company: 'Digital Agency',
    description:
      'Developed responsive web applications and collaborated with design teams to create pixel-perfect implementations.',
  },
  {
    year: '2020',
    title: 'Junior Designer',
    company: 'Startup',
    description:
      'Started my journey in UI/UX design, learning the fundamentals and working on various client projects.',
  },
  {
    year: '2019',
    title: 'Started UI Surgeon Blog',
    company: 'Personal Project',
    description:
      'Launched this blog to share knowledge and connect with the design and development community.',
  },
]

export default function AboutPage() {
  return (
    <div className="container py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
          US
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">About UI Surgeon</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Hi! I&apos;m a passionate UI/UX designer and frontend developer who loves creating
          beautiful, functional, and accessible digital experiences. Welcome to my corner of the
          internet where I share insights, tutorials, and thoughts on design and development.
        </p>
        <div className="flex justify-center space-x-4">
          <Button asChild>
            <Link href="/contact">
              <Mail className="mr-2 h-4 w-4" />
              Get in Touch
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/posts">Read My Posts</Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <Icon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* About Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-3xl font-bold mb-6">My Story</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              My journey into design and development started with a simple curiosity about how
              digital products work. What began as tinkering with HTML and CSS in my spare time
              evolved into a full-fledged career passion.
            </p>
            <p>
              Over the years, I&apos;ve had the privilege of working with startups, agencies, and
              established companies, helping them create user-centered digital experiences. Each
              project has taught me something new about the intersection of design, technology, and
              human behavior.
            </p>
            <p>
              When I&apos;m not designing or coding, you&apos;ll find me writing about my
              experiences, experimenting with new tools and techniques, or contributing to
              open-source projects. I believe in the power of sharing knowledge and lifting up the
              entire community.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold mb-6">What I Do</h2>
          <div className="space-y-4 text-muted-foreground mb-8">
            <p>
              I specialize in creating intuitive user interfaces and seamless user experiences. My
              approach combines design thinking with technical implementation, ensuring that
              beautiful designs translate into functional, accessible products.
            </p>
            <p>
              Through this blog, I share practical tutorials, design insights, and development tips
              that I&apos;ve learned throughout my career. My goal is to help other designers and
              developers grow their skills and create better digital experiences.
            </p>
          </div>

          <h3 className="text-xl font-semibold mb-4">Skills & Expertise</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <Badge key={index} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">My Journey</h2>
        <div className="max-w-3xl mx-auto">
          {timeline.map((item, index) => (
            <div key={index} className="relative pl-8 pb-8 last:pb-0">
              {/* Timeline line */}
              {index !== timeline.length - 1 && (
                <div className="absolute left-3 top-8 w-0.5 h-full bg-border" />
              )}

              {/* Timeline dot */}
              <div className="absolute left-0 top-2 w-6 h-6 bg-blue-600 rounded-full border-4 border-background" />

              {/* Content */}
              <div className="ml-4">
                <div className="text-sm text-blue-600 font-medium mb-1">{item.year}</div>
                <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                <div className="text-sm text-muted-foreground mb-2">{item.company}</div>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Social Links */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-8">Let&apos;s Connect</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          I&apos;m always excited to connect with fellow designers, developers, and anyone
          passionate about creating great digital experiences. Feel free to reach out!
        </p>
        <div className="flex justify-center space-x-4">
          <Button variant="outline" size="icon" asChild>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <Twitter className="h-4 w-4" />
            </a>
          </Button>
          <Button variant="outline" size="icon" asChild>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4" />
            </a>
          </Button>
          <Button variant="outline" size="icon" asChild>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <Linkedin className="h-4 w-4" />
            </a>
          </Button>
          <Button variant="outline" size="icon" asChild>
            <a href="mailto:hello@uisurgeon.com">
              <Mail className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
