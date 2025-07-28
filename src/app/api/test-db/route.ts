import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Check if prisma is available
    if (!prisma) {
      return NextResponse.json({
        status: 'error',
        message: 'Prisma client not available',
        env: {
          hasDatabaseUrl: !!process.env.DATABASE_URL,
          hasDirectUrl: !!process.env.DIRECT_URL,
          databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 20) + '...',
        }
      })
    }

    // Test database connection
    await prisma.$connect()
    
    // Try a simple query
    const userCount = await prisma.user.count()
    
    await prisma.$disconnect()

    return NextResponse.json({
      status: 'success',
      message: 'Database connection successful',
      userCount: userCount,
      env: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasDirectUrl: !!process.env.DIRECT_URL,
        databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 20) + '...',
      }
    })

  } catch (error) {
    console.error('Database test failed:', error)
    
    return NextResponse.json({
      status: 'error',
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      env: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasDirectUrl: !!process.env.DIRECT_URL,
        databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 20) + '...',
      }
    }, { status: 500 })
  }
} 