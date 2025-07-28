import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendEmail, generateQuoteResponseEmail } from '@/lib/email'
import { QuoteStatus } from '@prisma/client'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || !(session.user as any)?.vendor) {
      return NextResponse.json({ error: 'Unauthorized - vendor access required' }, { status: 401 })
    }

    if (!prisma) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    const { id } = await params
    const { action, message, proposedPrice, additionalDetails } = await request.json()
    const vendor = (session.user as any).vendor

    // Find the quote request and verify it belongs to this vendor
    const quoteRequest = await prisma.quoteRequest.findFirst({
      where: {
        id,
        vendorId: vendor.id
      },
      include: {
        vendor: {
          select: { businessName: true, email: true }
        }
      }
    })

    if (!quoteRequest) {
      return NextResponse.json({ error: 'Quote request not found' }, { status: 404 })
    }

    // Update quote request status based on action
    let newStatus: any = quoteRequest.status
    if (action === 'accept') {
      newStatus = 'RESPONDED'
    } else if (action === 'decline') {
      newStatus = 'DECLINED'
    } else if (action === 'respond') {
      newStatus = 'RESPONDED'
    }

    // Update the quote request
    const updatedQuote = await prisma.quoteRequest.update({
      where: { id },
      data: {
        status: newStatus,
        vendorResponse: message,
        respondedAt: new Date(),
        ...(proposedPrice && { proposedPrice: parseFloat(proposedPrice) }),
        ...(additionalDetails && { additionalDetails })
      }
    })

    // Send email notification to customer
    try {
      const emailSubject = action === 'decline' 
        ? `Quote Request Update from ${vendor.businessName}`
        : `Quote Response from ${vendor.businessName}`
      
      const emailHtml = generateQuoteResponseEmail({
        customerName: quoteRequest.customerName,
        vendorName: vendor.businessName,
        action,
        message,
        proposedPrice,
        additionalDetails,
        customerPhone: quoteRequest.customerPhone,
        eventDate: quoteRequest.eventDate
      })

      await sendEmail({
        to: quoteRequest.customerEmail,
        subject: emailSubject,
        html: emailHtml
      })

      console.log(`Email sent to ${quoteRequest.customerEmail} for ${action}ed quote request`)
    } catch (emailError) {
      console.error('Failed to send customer notification email:', emailError)
      // Don't fail the whole request if email fails
    }

    console.log(`Vendor ${vendor.businessName} ${action}ed quote request from ${quoteRequest.customerName}`)

    return NextResponse.json({
      success: true,
      message: `Quote request ${action}ed successfully`,
      quoteRequest: updatedQuote
    })

  } catch (error) {
    console.error('Error responding to quote request:', error)
    return NextResponse.json(
      { error: 'Failed to respond to quote request' },
      { status: 500 }
    )
  }
} 