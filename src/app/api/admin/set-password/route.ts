import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  if (!prisma) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    )
  }

  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Update admin user with password
    const adminUser = await prisma.user.update({
      where: { email: 'admin@muslimweddinghub.com' },
      data: {
        password: hashedPassword
      }
    })

    console.log('✅ Admin password set successfully')

    return NextResponse.json({
      message: 'Admin password set successfully',
      email: adminUser.email
    })

  } catch (error) {
    console.error('Error setting admin password:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 