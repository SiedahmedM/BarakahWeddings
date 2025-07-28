import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  // Return error if no database connection
  if (!prisma) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    )
  }
  
  try {
    const data = await request.json()

    const {
      name,
      email,
      password,
      businessName,
      description,
      category,
      phone,
      whatsapp,
      website,
      address,
      city,
      state,
      zipCode,
      priceRange,
      islamicCompliances
    } = data

    // Validate required fields
    if (!name || !email || !password || !businessName || !category || !phone || !address || !city || !state || !zipCode || !priceRange) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user and vendor in a transaction
    const result = await prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          name,
          email,
          // Note: We're not storing the password for this MVP
          // In production, you would store the hashed password
        }
      })

      const vendor = await prisma.vendor.create({
        data: {
          userId: user.id,
          businessName,
          description: description || null,
          category,
          phone,
          whatsapp: whatsapp || null,
          email,
          website: website || null,
          address,
          city,
          state,
          zipCode,
          priceRange,
          islamicCompliances: islamicCompliances || [],
          subscriptionActive: true,
          verified: false
        }
      })

      return { user, vendor }
    })

    return NextResponse.json(
      { 
        message: 'Vendor registration successful',
        vendorId: result.vendor.id
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error registering vendor:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}