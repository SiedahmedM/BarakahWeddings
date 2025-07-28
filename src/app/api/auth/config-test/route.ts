import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check environment variables (without exposing sensitive data)
    const hasNextAuthSecret = !!process.env.NEXTAUTH_SECRET
    const hasNextAuthUrl = !!process.env.NEXTAUTH_URL
    const nodeEnv = process.env.NODE_ENV
    const isProduction = nodeEnv === 'production'
    
    // Check if we're using secure cookies
    const useSecureCookies = isProduction

    return NextResponse.json({
      config: {
        hasNextAuthSecret,
        hasNextAuthUrl,
        nodeEnv,
        isProduction,
        useSecureCookies,
        nextAuthUrl: process.env.NEXTAUTH_URL || 'Not set'
      },
      message: 'NextAuth configuration check completed'
    })

  } catch (error) {
    console.error('Error checking NextAuth config:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 