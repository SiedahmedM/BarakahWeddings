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
    // Get all vendors
    const vendors = await prisma.vendor.findMany({
      include: {
        quoteRequests: true,
        user: true
      }
    })

    // Get all quote requests
    const allQuotes = await prisma.quoteRequest.findMany({
      include: {
        vendor: {
          include: {
            user: true
          }
        }
      }
    })

    return NextResponse.json({
      vendors: vendors.map(v => ({
        id: v.id,
        businessName: v.businessName,
        email: v.email,
        userEmail: v.user.email,
        quoteRequestCount: v.quoteRequests.length
      })),
      allQuotes: allQuotes.map(q => ({
        id: q.id,
        customerName: q.customerName,
        customerEmail: q.customerEmail,
        vendorId: q.vendorId,
        vendorName: q.vendor.businessName,
        vendorEmail: q.vendor.email,
        status: q.status,
        createdAt: q.createdAt
      }))
    })

  } catch (error) {
    console.error('Error fetching test data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 