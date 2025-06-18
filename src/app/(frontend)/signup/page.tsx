import { Metadata } from 'next'
import { SignupForm } from '@/components/auth/SignupForm'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Sign Up | Rafey\'s Blog',
  description: 'Create an account to join the community and start commenting.',
  openGraph: {
    title: 'Sign Up | Rafey\'s Blog',
    description: 'Create an account to join the community and start commenting.',
    type: 'website',
  },
}

export default function SignupPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Join Rafey\'s Blog</CardTitle>
            <CardDescription>
              Create an account to access exclusive content and join the discussion
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignupForm />
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}