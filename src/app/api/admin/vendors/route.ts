import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  // Return error if no database connection
  if (!prisma) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    )
  }

  try {
    // Get the current session
    const session = await getServerSession(authOptions)

    // Check if user is admin
    if (!session?.user || session.user.email !== 'admin@muslimweddinghub.com') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    // Get all vendors with their verification status
    const vendors = await prisma.vendor.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: [
        { verificationStatus: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    // Format the response
    const formattedVendors = vendors.map(vendor => ({
      id: vendor.id,
      businessName: vendor.businessName,
      category: vendor.category,
      email: vendor.email,
      phone: vendor.phone,
      city: vendor.city,
      state: vendor.state,
      verificationStatus: vendor.verificationStatus,
      verificationNotes: vendor.verificationNotes,
      createdAt: vendor.createdAt,
      verifiedAt: vendor.verifiedAt,
      verifiedBy: vendor.verifiedBy
    }))

    return NextResponse.json({
      vendors: formattedVendors
    })

  } catch (error) {
    console.error('Error fetching vendors for admin:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 