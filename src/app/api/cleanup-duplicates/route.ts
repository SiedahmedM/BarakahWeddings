import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  if (!prisma) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    )
  }

  try {
    console.log('🧹 Starting duplicate cleanup...')

    // Get all vendors with their quote requests
    const vendors = await prisma.vendor.findMany({
      include: {
        quoteRequests: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    let totalRemoved = 0
    const cleanupResults = []

    for (const vendor of vendors) {
      const quoteRequests = vendor.quoteRequests
      const seen = new Set()
      const toDelete = []

      // Find duplicates (keep the first occurrence, mark others for deletion)
      for (const quote of quoteRequests) {
        const key = `${quote.customerName}-${quote.customerEmail}-${quote.message}`
        
        if (seen.has(key)) {
          toDelete.push(quote.id)
        } else {
          seen.add(key)
        }
      }

      if (toDelete.length > 0) {
        console.log(`Removing ${toDelete.length} duplicates from vendor: ${vendor.businessName}`)
        
        // Delete duplicate quote requests
        const deleteResult = await prisma.quoteRequest.deleteMany({
          where: {
            id: { in: toDelete }
          }
        })

        totalRemoved += deleteResult.count
        cleanupResults.push({
          vendorId: vendor.id,
          businessName: vendor.businessName,
          removed: deleteResult.count,
          originalCount: quoteRequests.length,
          remainingCount: quoteRequests.length - deleteResult.count
        })
      }
    }

    console.log(`✅ Cleanup completed. Removed ${totalRemoved} duplicate quote requests.`)

    return NextResponse.json({
      message: 'Duplicate cleanup completed successfully',
      totalRemoved,
      cleanupResults,
      summary: {
        vendorsProcessed: vendors.length,
        vendorsWithDuplicates: cleanupResults.length,
        totalRemoved
      }
    })

  } catch (error) {
    console.error('❌ Error during cleanup:', error)
    return NextResponse.json(
      { 
        error: 'Cleanup failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 