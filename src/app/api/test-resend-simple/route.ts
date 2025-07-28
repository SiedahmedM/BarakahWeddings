import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('=== RESEND DEBUG START ===')
    console.log('NODE_ENV:', process.env.NODE_ENV)
    console.log('API Key exists:', !!process.env.RESEND_API_KEY)
    console.log('API Key length:', process.env.RESEND_API_KEY?.length)
    console.log('API Key starts with:', process.env.RESEND_API_KEY?.substring(0, 10))
    
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'RESEND_API_KEY not found in environment variables'
      })
    }

    // Import Resend dynamically to see if there are any import issues
    const { Resend } = await import('resend')
    console.log('Resend imported successfully')
    
    const resend = new Resend(process.env.RESEND_API_KEY)
    console.log('Resend client created')

    // Try a very simple test
    const testResult = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'test@example.com',
      subject: 'Test',
      html: '<p>Test</p>'
    })

    console.log('Test result:', JSON.stringify(testResult, null, 2))
    console.log('=== RESEND DEBUG END ===')

    return NextResponse.json({
      success: true,
      result: testResult
    })

  } catch (error) {
    console.error('=== RESEND ERROR ===')
    console.error('Error type:', typeof error)
    console.error('Error message:', error instanceof Error ? error.message : error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack')
    console.error('Full error:', error)
    console.error('=== RESEND ERROR END ===')

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      errorType: typeof error,
      stack: error instanceof Error ? error.stack : undefined
    })
  }
} 