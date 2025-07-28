import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
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

    const { vendorId, status, notes } = await request.json()

    if (!vendorId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Find the vendor
    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
      include: {
        user: true
      }
    })

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      )
    }

    // Update vendor verification status
    const updateData: any = {
      verificationStatus: status,
      verificationNotes: notes || null
    }

    if (status === 'APPROVED') {
      updateData.verified = true
      updateData.verifiedAt = new Date()
      updateData.verifiedBy = session.user.email
    } else if (status === 'REJECTED') {
      updateData.verified = false
      updateData.verifiedAt = new Date()
      updateData.verifiedBy = session.user.email
    }

    const updatedVendor = await prisma.vendor.update({
      where: { id: vendorId },
      data: updateData
    })

    // TODO: Send email notification to vendor
    // This would be implemented with a proper email service like SendGrid, Mailgun, etc.
    console.log(`Vendor ${vendor.businessName} ${status.toLowerCase()}`)
    console.log(`Email notification should be sent to: ${vendor.email}`)

    return NextResponse.json({
      message: `Vendor ${status.toLowerCase()} successfully`,
      vendor: {
        id: updatedVendor.id,
        businessName: updatedVendor.businessName,
        verificationStatus: updatedVendor.verificationStatus,
        verified: updatedVendor.verified
      }
    })

  } catch (error) {
    console.error('Error updating vendor verification:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 