import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    if (!prisma) {
      return NextResponse.json({
        success: false,
        error: 'Database not configured'
      }, { status: 503 })
    }
    
    // Test database connection
    const userCount = await prisma.user.count()
    const vendorCount = await prisma.vendor.count()
    
    return NextResponse.json({
      success: true,
      database: 'connected',
      userCount,
      vendorCount,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function POST() {
  try {
    if (!prisma) {
      return NextResponse.json({
        success: false,
        error: 'Database not configured'
      }, { status: 503 })
    }
    
    // Test basic form data processing
    const testData = {
      name: 'Test User',
      email: `test-${Date.now()}@example.com`,
      businessName: 'Test Business',
      category: 'VENUES',
      description: 'Test description',
      phone: '1234567890',
      city: 'Test City',
      state: 'Test State',
      priceRange: 'MODERATE'
    }
    
    console.log('Testing with minimal data:', testData)
    
    // Test if we can create a basic user/vendor pair
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: testData.name,
          email: testData.email,
          password: 'test-hash'
        } as any
      })
      
      const vendor = await tx.vendor.create({
        data: {
          userId: user.id,
          businessName: testData.businessName,
          description: testData.description,
          category: testData.category as any,
          phone: testData.phone,
          email: testData.email,
          city: testData.city,
          state: testData.state,
          priceRange: testData.priceRange as any,
          islamicCompliances: [],
          serviceAreas: [],
          eventTypes: [],
          businessHours: {},
          paymentMethods: [],
          workSampleUrls: [],
          subscriptionActive: true,
          verified: false,
          verificationStatus: 'PENDING'
        } as any
      })
      
      return { user, vendor }
    })
    
    // Clean up test data
    await prisma.vendor.delete({ where: { id: result.vendor.id } })
    await prisma.user.delete({ where: { id: result.user.id } })
    
    return NextResponse.json({
      success: true,
      message: 'Registration test passed',
      testUserId: result.user.id,
      testVendorId: result.vendor.id
    })
    
  } catch (error) {
    console.error('Registration test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
} 