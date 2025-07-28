import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function POST(request: NextRequest) {
  // Return error if no database connection
  if (!prisma) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    )
  }
  
  try {
    const formData = await request.formData()
    
    const vendorId = formData.get('vendorId') as string
    const customerName = formData.get('customerName') as string
    const customerEmail = formData.get('customerEmail') as string
    const customerPhone = formData.get('customerPhone') as string
    const eventDate = formData.get('eventDate') as string
    const message = formData.get('message') as string

    // Validate required fields
    if (!vendorId || !customerName || !customerEmail || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify vendor exists
    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId }
    })

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      )
    }

    // Create quote request
    const quoteRequest = await prisma.quoteRequest.create({
      data: {
        vendorId,
        customerName,
        customerEmail,
        customerPhone: customerPhone || null,
        eventDate: eventDate ? new Date(eventDate) : null,
        message,
        status: 'PENDING'
      }
    })

    // In a real app, you would send an email notification to the vendor here
    // For now, we'll just redirect back to the vendor page with a success message
    
    return NextResponse.redirect(
      new URL(`/vendor/${vendorId}?quote=sent`, request.url)
    )
  } catch (error) {
    console.error('Error creating quote request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}