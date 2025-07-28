import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'No session found' },
        { status: 401 }
      )
    }

    // Return success - the client will handle the refresh
    return NextResponse.json({
      message: 'Session refresh initiated',
      user: {
        id: (session.user as any)?.id,
        email: session.user?.email,
        name: session.user?.name,
        vendor: (session.user as any)?.vendor
      }
    })

  } catch (error) {
    console.error('Error in force refresh:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 