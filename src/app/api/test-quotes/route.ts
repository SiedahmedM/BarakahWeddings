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
    // Get all vendors with their quote requests
    const vendors = await prisma.vendor.findMany({
      include: {
        quoteRequests: {
          orderBy: { createdAt: 'desc' }
        },
        user: {
          select: {
            email: true,
            name: true
          }
        }
      }
    })

    // Check for duplicates
    const duplicateAnalysis = vendors.map(vendor => {
      const quoteRequests = vendor.quoteRequests
      const duplicates = quoteRequests.filter((quote, index) => {
        return quoteRequests.findIndex(q => 
          q.customerName === quote.customerName &&
          q.customerEmail === quote.customerEmail &&
          q.message === quote.message
        ) !== index
      })

      return {
        vendorId: vendor.id,
        businessName: vendor.businessName,
        totalQuotes: quoteRequests.length,
        uniqueQuotes: quoteRequests.length - duplicates.length,
        duplicates: duplicates.length,
        duplicateDetails: duplicates.map(d => ({
          id: d.id,
          customerName: d.customerName,
          customerEmail: d.customerEmail,
          createdAt: d.createdAt
        }))
      }
    })

    return NextResponse.json({
      vendors: vendors.map(vendor => ({
        id: vendor.id,
        businessName: vendor.businessName,
        userEmail: vendor.user?.email,
        userName: vendor.user?.name,
        quoteRequests: vendor.quoteRequests.map(quote => ({
          id: quote.id,
          customerName: quote.customerName,
          customerEmail: quote.customerEmail,
          customerPhone: quote.customerPhone,
          eventDate: quote.eventDate,
          message: quote.message,
          status: quote.status,
          createdAt: quote.createdAt
        }))
      })),
      duplicateAnalysis,
      summary: {
        totalVendors: vendors.length,
        totalQuoteRequests: vendors.reduce((sum, v) => sum + v.quoteRequests.length, 0),
        vendorsWithDuplicates: duplicateAnalysis.filter(d => d.duplicates > 0).length
      }
    })

  } catch (error) {
    console.error('Error fetching test data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 