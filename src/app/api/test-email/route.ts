import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, generateApprovalEmail, generateRejectionEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { testType, email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email address required' },
        { status: 400 }
      )
    }

    let emailData

    if (testType === 'approval') {
      emailData = generateApprovalEmail('Test Vendor', 'Test Business')
    } else if (testType === 'rejection') {
      emailData = generateRejectionEmail('Test Vendor', 'Test Business', 'This is a test rejection email with sample feedback.')
    } else {
      return NextResponse.json(
        { error: 'Invalid test type. Use "approval" or "rejection"' },
        { status: 400 }
      )
    }

    const result = await sendEmail({
      to: email,
      subject: emailData.subject,
      html: emailData.html
    })

    if (result.success) {
      return NextResponse.json({
        message: 'Test email sent successfully',
        email: email,
        testType: testType
      })
    } else {
      return NextResponse.json(
        { error: 'Failed to send test email', details: result.error },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error sending test email:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 