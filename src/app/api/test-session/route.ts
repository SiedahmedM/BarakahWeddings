import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    return NextResponse.json({
      session: {
        exists: !!session,
        user: session?.user ? {
          id: (session.user as any).id,
          email: session.user.email,
          name: session.user.name,
          vendor: (session.user as any).vendor
        } : null
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error testing session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 