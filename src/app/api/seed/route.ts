import { NextRequest, NextResponse } from 'next/server'
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
    console.log('🌙 Setting up Muslim Wedding Marketplace database...')
    
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

    // Create demo vendor
    console.log('Setting up demo vendor...')
    const demoVendor = await prisma.vendor.upsert({
      where: { userId: adminUser.id },
      update: {},
      create: {
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

    await prisma.vendorPhoto.create({
      data: {
        vendorId: demoVendor.id,
        url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&h=600&fit=crop',
        isMain: false,
        order: 3
      }
    })

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

    await prisma.review.create({
      data: {
        vendorId: demoVendor.id,
        reviewerName: 'Bilal & Dounia',
        rating: 4,
        comment: 'Great venue with excellent Islamic facilities. The no-alcohol policy was strictly enforced and made our families very comfortable.',
        approved: true
      }
    })

    // Add demo quote request
    console.log('Adding demo quote request...')
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

    console.log('✅ Database seeding completed successfully!')
    
    return NextResponse.json({
      message: 'Database seeded successfully',
      vendorId: demoVendor.id
    })
    
  } catch (error) {
    console.error('Error seeding database:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 