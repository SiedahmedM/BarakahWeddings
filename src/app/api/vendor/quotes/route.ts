import { NextRequest, NextResponse } from 'next/server'
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

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get the vendor associated with the current user
    const vendor = await prisma.vendor.findUnique({
      where: { userId: (session.user as any).id },
      include: {
        quoteRequests: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      )
    }

    // Format the quote requests for the frontend
    const quotes = vendor.quoteRequests.map(quote => ({
      id: quote.id,
      customerName: quote.customerName,
      customerEmail: quote.customerEmail,
      customerPhone: quote.customerPhone,
      eventDate: quote.eventDate,
      message: quote.message,
      status: quote.status,
      createdAt: quote.createdAt
    }))

    return NextResponse.json({
      quotes,
      vendorId: vendor.id
    })

  } catch (error) {
    console.error('Error fetching vendor quotes:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 