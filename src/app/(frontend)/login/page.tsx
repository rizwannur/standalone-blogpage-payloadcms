import { Metadata } from 'next'
import { LoginForm } from '@/components/auth/LoginForm'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Login | Rafey\'s Blog',
  description: 'Sign in to your account to access exclusive content and features.',
  openGraph: {
    title: 'Login | Rafey\'s Blog',
    description: 'Sign in to your account to access exclusive content and features.',
    type: 'website',
  },
}

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your account to continue reading and commenting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don\'t have an account?{' '}
                <Link href="/signup" className="font-medium text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}