import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  if (!prisma) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    )
  }

  try {
    // Check if admin user exists and has a password
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@muslimweddinghub.com' },
      select: {
        id: true,
        email: true,
        password: true
      }
    })

    if (!adminUser) {
      return NextResponse.json({
        hasPassword: false,
        message: 'Admin user not found'
      })
    }

    return NextResponse.json({
      hasPassword: !!adminUser.password,
      email: adminUser.email
    })

  } catch (error) {
    console.error('Error checking admin status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 