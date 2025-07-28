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
    
    // Helper function to safely parse JSON
    const safeJsonParse = (value: string | null, fallback: any = []) => {
      if (!value) return fallback
      try {
        return JSON.parse(value)
      } catch {
        return fallback
      }
    }
    
    // Extract form data safely
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      businessName: formData.get('businessName') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      phone: formData.get('phone') as string,
      whatsapp: formData.get('whatsapp') as string || null,
      website: formData.get('website') as string || null,
      address: formData.get('address') as string || null,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      priceRange: formData.get('priceRange') as string,
      islamicCompliances: safeJsonParse(formData.get('islamicCompliances') as string, []),
      yearsInBusiness: formData.get('yearsInBusiness') as string || null,
      serviceAreas: safeJsonParse(formData.get('serviceAreas') as string, []),
      maxCapacity: formData.get('maxCapacity') as string || null,
      minCapacity: formData.get('minCapacity') as string || null,
      eventTypes: safeJsonParse(formData.get('eventTypes') as string, []),
      businessHours: safeJsonParse(formData.get('businessHours') as string, {}),
      paymentMethods: safeJsonParse(formData.get('paymentMethods') as string, []),
      workSamples: formData.getAll('workSamples') as File[]
    }

    console.log('Registration data received:', {
      ...data,
      password: '[HIDDEN]',
      workSamples: `${data.workSamples.length} files`
    })

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
      workSamples: _workSamples // TODO: Implement file upload to storage
    } = data

    // Validate required fields (based on your specification)
    const requiredFields = { name, email, password, businessName, category, description, phone, city, state, priceRange }
    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value)
      .map(([key]) => key)
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields)
      return NextResponse.json(
        { 
          error: 'Missing required fields', 
          missingFields,
          details: `Required fields are missing: ${missingFields.join(', ')}`
        },
        { status: 400 }
      )
    }

    // Validate work samples requirement
    if (!_workSamples || _workSamples.length === 0) {
      console.error('No work samples provided')
      return NextResponse.json(
        { 
          error: 'Work samples are required',
          details: 'Please upload at least one image or video of your work'
        },
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
    console.log('Creating user and vendor...')
    const result = await prisma.$transaction(async (tx) => {
      console.log('Creating user with email:', email)
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        } as any
      })

      console.log('User created with ID:', user.id)
      console.log('Creating vendor with business name:', businessName)
      const vendor = await tx.vendor.create({
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
          workSampleUrls: [], // TODO: Store uploaded file URLs here
          subscriptionActive: true,
          verified: false,
          verificationStatus: 'PENDING',
          verificationNotes: 'New vendor application submitted. Awaiting manual review.'
        } as any
      })

      console.log('Vendor created with ID:', vendor.id)
      return { user, vendor }
    })

    console.log('Registration successful for vendor ID:', result.vendor.id)
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
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    
    // Check for specific Prisma errors
    if (error && typeof error === 'object' && 'code' in error) {
      console.error('Prisma error code:', (error as any).code)
      console.error('Prisma error meta:', (error as any).meta)
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error during registration',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}