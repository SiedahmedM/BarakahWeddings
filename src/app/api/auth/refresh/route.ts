import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'No session found' },
        { status: 401 }
      )
    }

    // Return the session data to help with client-side hydration
    return NextResponse.json({
      session: {
        user: {
          id: (session.user as any)?.id,
          email: session.user?.email,
          name: session.user?.name,
          vendor: (session.user as any)?.vendor
        }
      },
      message: 'Session refreshed successfully'
    })

  } catch (error) {
    console.error('Error refreshing session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 