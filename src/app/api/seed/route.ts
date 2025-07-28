import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  // Check if database is connected
  if (!prisma) {
    console.error('Database not configured')
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    )
  }
  
  try {
    console.log('🌙 Starting database seeding...')
    
    // Test database connection first
    try {
      await prisma.$connect()
      console.log('✅ Database connected successfully')
    } catch (connectError) {
      console.error('❌ Database connection failed:', connectError)
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 503 }
      )
    }

    // Check if demo vendor already exists
    const existingVendor = await prisma.vendor.findFirst({
      where: { businessName: 'Muslim Wedding Hub Demo' }
    })

    if (existingVendor) {
      console.log('✅ Demo vendor already exists')
      return NextResponse.json({
        message: 'Demo vendor already exists',
        vendorId: existingVendor.id
      })
    }

    // Create system admin user
    console.log('Creating system admin user...')
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@muslimweddinghub.com' },
      update: {},
      create: {
        email: 'admin@muslimweddinghub.com',
        name: 'System Admin',
      }
    })

    console.log('✅ Admin user created/updated')

    // Create demo vendor
    console.log('Creating demo vendor...')
    const demoVendor = await prisma.vendor.create({
      data: {
        userId: adminUser.id,
        businessName: 'Muslim Wedding Hub Demo',
        description: 'A beautiful demonstration of our Muslim wedding marketplace featuring authentic Islamic traditions and modern elegance.',
        category: 'VENUES',
        phone: '+1 (555) 123-4567',
        whatsapp: '+1 (555) 123-4567',
        email: 'demo@muslimweddinghub.com',
        website: 'https://muslimweddinghub.com',
        address: '123 Islamic Center Way',
        city: 'Toronto',
        state: 'Ontario',
        zipCode: 'M5V 3A8',
        priceRange: 'LUXURY',
        islamicCompliances: ['halal', 'prayerSpace', 'genderSeparated', 'noAlcohol'],
        subscriptionActive: true,
        verified: true,
        rating: 4.8
      }
    })

    console.log('✅ Demo vendor created')

    // Add demo photos
    console.log('Adding demo photos...')
    await prisma.vendorPhoto.create({
      data: {
        vendorId: demoVendor.id,
        url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop',
        isMain: true,
        order: 1
      }
    })

    await prisma.vendorPhoto.create({
      data: {
        vendorId: demoVendor.id,
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
        isMain: false,
        order: 2
      }
    })

    console.log('✅ Demo photos added')

    // Add demo reviews
    console.log('Adding demo reviews...')
    await prisma.review.create({
      data: {
        vendorId: demoVendor.id,
        reviewerName: 'Ahmed & Dima',
        rating: 5,
        comment: 'Absolutely beautiful venue with perfect Islamic compliance. The prayer space was beautifully designed and the halal catering was exceptional.',
        approved: true
      }
    })

    await prisma.review.create({
      data: {
        vendorId: demoVendor.id,
        reviewerName: 'Mubasher & Sarah',
        rating: 5,
        comment: 'The staff was incredibly respectful of our traditions. The gender-separated areas were well-organized and the whole experience was perfect.',
        approved: true
      }
    })

    console.log('✅ Demo reviews added')

    // Add demo quote request
    console.log('Adding demo quote request...')
    
    // Check if demo quote request already exists
    const existingQuote = await prisma.quoteRequest.findFirst({
      where: {
        vendorId: demoVendor.id,
        customerName: 'Demo Customer',
        customerEmail: 'demo@example.com'
      }
    })

    if (!existingQuote) {
      await prisma.quoteRequest.create({
        data: {
          vendorId: demoVendor.id,
          customerName: 'Demo Customer',
          customerEmail: 'demo@example.com',
          customerPhone: '+1 (555) 987-6543',
          eventDate: new Date('2024-12-15'),
          message: 'This is a demo quote request to show how the system works.',
          status: 'PENDING'
        }
      })
      console.log('✅ Demo quote request added')
    } else {
      console.log('✅ Demo quote request already exists')
    }

    console.log('✅ Database seeding completed successfully!')
    
    return NextResponse.json({
      message: 'Database seeded successfully',
      vendorId: demoVendor.id
    })
    
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    
    // Return more specific error information
    return NextResponse.json(
      { 
        error: 'Database seeding failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    // Always disconnect
    try {
      await prisma.$disconnect()
    } catch (disconnectError) {
      console.error('Error disconnecting from database:', disconnectError)
    }
  }
} 