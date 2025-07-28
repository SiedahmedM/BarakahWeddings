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
    console.log('🔧 Fixing admin user setup...')

    // Find or create admin user
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@muslimweddinghub.com' },
      update: {},
      create: {
        name: 'System Administrator',
        email: 'admin@muslimweddinghub.com',
        emailVerified: new Date(),
      }
    })

    console.log('✅ Admin user found/created')

    // Check if admin already has a vendor record
    const existingVendor = await prisma.vendor.findUnique({
      where: { userId: adminUser.id }
    })

    if (!existingVendor) {
      // Create a vendor record for admin (this is needed for session to work)
      const adminVendor = await prisma.vendor.create({
        data: {
          userId: adminUser.id,
          businessName: 'System Administrator',
          description: 'Platform administrator account',
          category: 'VENUES',
          phone: '+1 (555) 000-0000',
          email: 'admin@muslimweddinghub.com',
          address: 'System Address',
          city: 'System City',
          state: 'System State',
          zipCode: '00000',
          priceRange: 'MODERATE',
          islamicCompliances: [],
          subscriptionActive: true,
          verified: true,
          verificationStatus: 'APPROVED'
        }
      })
      console.log('✅ Admin vendor record created')
    } else {
      console.log('✅ Admin vendor record already exists')
    }

    return NextResponse.json({
      message: 'Admin user setup fixed successfully',
      adminUser: {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name
      }
    })

  } catch (error) {
    console.error('❌ Error fixing admin user:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fix admin user',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 