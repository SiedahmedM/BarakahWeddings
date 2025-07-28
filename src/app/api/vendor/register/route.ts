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
    const formData = await request.formData()
    
    // Extract form data
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      businessName: formData.get('businessName') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      phone: formData.get('phone') as string,
      whatsapp: formData.get('whatsapp') as string,
      website: formData.get('website') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      priceRange: formData.get('priceRange') as string,
      islamicCompliances: JSON.parse(formData.get('islamicCompliances') as string || '[]'),
      yearsInBusiness: formData.get('yearsInBusiness') as string,
      serviceAreas: JSON.parse(formData.get('serviceAreas') as string || '[]'),
      maxCapacity: formData.get('maxCapacity') as string,
      minCapacity: formData.get('minCapacity') as string,
      eventTypes: JSON.parse(formData.get('eventTypes') as string || '[]'),
      businessHours: JSON.parse(formData.get('businessHours') as string || '{}'),
      paymentMethods: JSON.parse(formData.get('paymentMethods') as string || '[]'),
      workSamples: formData.getAll('workSamples') as File[]
    }

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
      priceRange,
      islamicCompliances,
      // Essential fields
      yearsInBusiness,
      serviceAreas,
      maxCapacity,
      minCapacity,
      eventTypes,
      businessHours,
      paymentMethods,
      workSamples: _workSamples // Intentionally unused - file uploads handled separately
    } = data

    // Validate required fields
    if (!name || !email || !password || !businessName || !category || !description || !phone || !city || !state || !priceRange) {
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
          password: hashedPassword, // Store the hashed password
        } as any
      })

      const vendor = await prisma.vendor.create({
        data: {
          userId: user.id,
          businessName,
          description: description || null,
          category: category as any,
          phone,
          whatsapp: whatsapp || null,
          email,
          website: website || null,
          address: address || null,
          city,
          state,
          zipCode: null, // No longer required
          priceRange: priceRange as any,
          islamicCompliances: islamicCompliances || [],
          // Essential fields
          yearsInBusiness: yearsInBusiness || null,
          serviceAreas: serviceAreas || [],
          maxCapacity: maxCapacity || null,
          minCapacity: minCapacity || null,
          eventTypes: eventTypes || [],
          businessHours: businessHours || {},
          paymentMethods: paymentMethods || [],
          portfolioUrl: null, // Replaced with work samples upload
          subscriptionActive: true,
          verified: false,
          verificationStatus: 'PENDING',
          verificationNotes: 'New vendor application submitted. Awaiting manual review.'
        } as any
      })

      return { user, vendor }
    })

    return NextResponse.json(
      { 
        message: 'Vendor registration successful! Your application is under review.',
        vendorId: result.vendor.id,
        status: 'PENDING'
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