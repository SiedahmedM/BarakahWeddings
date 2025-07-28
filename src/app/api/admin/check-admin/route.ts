import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  if (!prisma) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    )
  }

  try {
    const session = await getServerSession(authOptions)

    // Check admin user in database
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@muslimweddinghub.com' },
      include: {
        vendor: true
      }
    })

    return NextResponse.json({
      session: {
        exists: !!session,
        user: session?.user ? {
          email: session.user.email,
          name: session.user.name,
          id: (session.user as any).id
        } : null
      },
      adminUser: adminUser ? {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        hasPassword: !!adminUser.password,
        hasVendor: !!adminUser.vendor,
        vendor: adminUser.vendor ? {
          id: adminUser.vendor.id,
          businessName: adminUser.vendor.businessName,
          verified: adminUser.vendor.verified,
          verificationStatus: adminUser.vendor.verificationStatus
        } : null
      } : null,
      isAdmin: session?.user?.email === 'admin@muslimweddinghub.com'
    })

  } catch (error) {
    console.error('Error checking admin status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 