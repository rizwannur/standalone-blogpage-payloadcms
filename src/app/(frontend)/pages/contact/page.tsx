'use client'

import * as React from 'react'
import { Mail, MessageSquare, Send, MapPin, Clock } from 'lucide-react'

import { Button } from '@/app/(frontend)/components/ui/button'
import { Input } from '@/app/(frontend)/components/ui/input'
import { Textarea } from '@/app/(frontend)/components/ui/textarea'
import { Label } from '@/app/(frontend)/components/ui/label'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/(frontend)/components/ui/card'

const contactInfo = [
  {
    icon: Mail,
    title: 'Email',
    description: 'Send me an email',
    value: 'hello@uisurgeon.com',
    action: 'mailto:hello@uisurgeon.com',
  },
  {
    icon: MessageSquare,
    title: 'Social Media',
    description: 'Follow me on Twitter',
    value: '@uisurgeon',
    action: 'https://twitter.com/uisurgeon',
  },
  {
    icon: MapPin,
    title: 'Location',
    description: 'Based in',
    value: 'San Francisco, CA',
    action: null,
  },
  {
    icon: Clock,
    title: 'Response Time',
    description: 'I typically respond within',
    value: '24-48 hours',
    action: null,
  },
]

const faqs = [
  {
    question: 'Do you offer design consultations?',
    answer:
      'Yes! I offer design consultations for UI/UX projects, design system creation, and frontend development guidance. Feel free to reach out to discuss your project needs.',
  },
  {
    question: 'Can you help with my existing project?',
    answer:
      'Absolutely! I can help with design reviews, code audits, performance optimization, and accessibility improvements for existing projects.',
  },
  {
    question: 'Do you write guest posts?',
    answer:
      "I'm always interested in sharing knowledge with the community. If you have a publication or blog that aligns with design and development topics, I'd love to hear from you.",
  },
  {
    question: 'Are you available for speaking engagements?',
    answer:
      'I&apos;m available for freelance projects, consulting, and full-time opportunities. Feel free to reach out to discuss your needs.',
  },
]

export default function ContactPage() {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitStatus, setSubmitStatus] = React.useState<'idle' | 'success' | 'error'>('idle')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Simulate API call - replace with actual implementation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Here you would typically send the form data to your backend
      console.log('Form submitted:', formData)

      setSubmitStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (_error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          I&apos;d love to hear from you! Whether you have a project in mind, want to collaborate,
          or just want to say hello, don&apos;t hesitate to reach out.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Send me a message</CardTitle>
              <p className="text-sm text-muted-foreground">
                I&apos;ll get back to you as soon as possible.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    placeholder="Tell me more about your project or question..."
                  />
                </div>

                {submitStatus === 'success' && (
                  <div className="p-4 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-md">
                    Thanks for your message! I&apos;ll get back to you soon.
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-md">
                    Something went wrong. Please try again or send me an email directly.
                  </div>
                )}

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? (
                    'Sending...'
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Contact Info & FAQs */}
        <div className="space-y-8">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contactInfo.map((info, index) => {
                const Icon = info.icon
                const content = (
                  <Card
                    key={index}
                    className={
                      info.action ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
                    }
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-3">
                        <Icon className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <h3 className="font-medium">{info.title}</h3>
                          <p className="text-sm text-muted-foreground mb-1">{info.description}</p>
                          <p className="text-sm font-medium">{info.value}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )

                return info.action ? (
                  <a
                    key={index}
                    href={info.action}
                    target={info.action.startsWith('http') ? '_blank' : undefined}
                    rel={info.action.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {content}
                  </a>
                ) : (
                  content
                )
              })}
            </div>
          </div>

          {/* FAQs */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
