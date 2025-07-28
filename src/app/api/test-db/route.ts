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
          databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 30) + '...',
          directUrlPrefix: process.env.DIRECT_URL?.substring(0, 30) + '...',
        }
      })
    }

    // Test database connection
    console.log('Testing database connection...')
    await prisma.$connect()
    console.log('Database connected successfully')
    
    // Try a simple query
    const userCount = await prisma.user.count()
    console.log(`User count: ${userCount}`)
    
    await prisma.$disconnect()
    console.log('Database disconnected')

    return NextResponse.json({
      status: 'success',
      message: 'Database connection successful',
      userCount: userCount,
      env: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasDirectUrl: !!process.env.DIRECT_URL,
        databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 30) + '...',
        directUrlPrefix: process.env.DIRECT_URL?.substring(0, 30) + '...',
        databaseUrlProtocol: process.env.DATABASE_URL?.split('://')[0],
        directUrlProtocol: process.env.DIRECT_URL?.split('://')[0],
      }
    })

  } catch (error) {
    console.error('Database test failed:', error)
    
    // Provide connection troubleshooting tips
    let troubleshootingTips: string[] = []
    
    if (error instanceof Error) {
      if (error.message.includes('Can\'t reach database server')) {
        troubleshootingTips = [
          'Try using the shared pooler: postgresql://postgres.zgwvnmzjrwuyveojklvo:password@aws-0-us-west-1.pooler.supabase.com:5432/postgres',
          'Check if connection pooling is enabled in Supabase',
          'Verify there are no IP restrictions in Supabase settings',
          'Try the direct connection for migrations only'
        ]
      } else if (error.message.includes('authentication')) {
        troubleshootingTips = [
          'Check if the database password is correct',
          'Verify the database user has proper permissions',
          'Check if the database exists'
        ]
      }
    }
    
    return NextResponse.json({
      status: 'error',
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      troubleshootingTips,
      env: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasDirectUrl: !!process.env.DIRECT_URL,
        databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 30) + '...',
        directUrlPrefix: process.env.DIRECT_URL?.substring(0, 30) + '...',
        databaseUrlProtocol: process.env.DATABASE_URL?.split('://')[0],
        directUrlProtocol: process.env.DIRECT_URL?.split('://')[0],
      }
    }, { status: 500 })
  }
} 