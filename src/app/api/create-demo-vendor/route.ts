import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  if (!prisma) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    )
  }
  
  try {
    console.log('Creating demo vendor account...')
    
    // Check if demo vendor already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'demo@muslimweddinghub.com' }
    })

    if (existingUser) {
      return NextResponse.json({
        message: 'Demo vendor already exists',
        credentials: {
          email: 'demo@muslimweddinghub.com',
          password: 'demo123'
        }
      })
    }

    // Create demo user and vendor
    const demoUser = await prisma.user.create({
      data: {
        email: 'demo@muslimweddinghub.com',
        name: 'Demo Vendor',
      }
    })

    const demoVendor = await prisma.vendor.create({
      data: {
        userId: demoUser.id,
        businessName: 'Demo Wedding Services',
        description: 'A demonstration vendor account for testing the platform features.',
        category: 'VENUES',
        phone: '+1 (555) 123-4567',
        whatsapp: '+1 (555) 123-4567',
        email: 'demo@muslimweddinghub.com',
        website: 'https://demo-wedding-services.com',
        address: '123 Demo Street',
        city: 'Toronto',
        state: 'Ontario',
        priceRange: 'MODERATE',
        islamicCompliances: ['halal', 'prayerSpace'],
        subscriptionActive: true,
        verified: true,
        rating: 4.5
      }
    })

    // Add some demo photos
    await prisma.vendorPhoto.create({
      data: {
        vendorId: demoVendor.id,
        url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop',
        isMain: true,
        order: 1
      }
    })

    // Add some demo reviews
    await prisma.review.create({
      data: {
        vendorId: demoVendor.id,
        reviewerName: 'Test Customer',
        rating: 5,
        comment: 'Great demo vendor for testing purposes!',
        approved: true
      }
    })

    // Add some demo quote requests
    await prisma.quoteRequest.create({
      data: {
        vendorId: demoVendor.id,
        customerName: 'Test Customer',
        customerEmail: 'test@example.com',
        customerPhone: '+1 (555) 987-6543',
        eventDate: new Date('2024-12-15'),
        message: 'This is a test quote request to demonstrate the dashboard.',
        status: 'PENDING'
      }
    })

    console.log('✅ Demo vendor account created successfully!')
    
    return NextResponse.json({
      message: 'Demo vendor account created successfully',
      credentials: {
        email: 'demo@muslimweddinghub.com',
        password: 'demo123'
      },
      vendorId: demoVendor.id
    })
    
  } catch (error) {
    console.error('❌ Error creating demo vendor:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create demo vendor',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 