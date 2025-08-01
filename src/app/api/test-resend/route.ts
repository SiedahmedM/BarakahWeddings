import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function GET() {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    
    console.log('Testing Resend API key...')
    console.log('API Key present:', !!process.env.RESEND_API_KEY)
    console.log('API Key starts with:', process.env.RESEND_API_KEY?.substring(0, 10) + '...')

    // Test a simple email send
    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: ['test@example.com'], // This won't actually send, just tests the API
      subject: 'Test Email',
      html: '<p>This is a test email</p>',
    })

    console.log('Resend test response:', result)

    if (result.error) {
      console.error('Resend test error:', result.error)
      return NextResponse.json({
        success: false,
        error: result.error.message || result.error,
        apiKeyPresent: !!process.env.RESEND_API_KEY
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Resend API is working',
      data: result.data,
      apiKeyPresent: !!process.env.RESEND_API_KEY
    })

  } catch (error) {
    console.error('Resend test failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      apiKeyPresent: !!process.env.RESEND_API_KEY
    })
  }
} 