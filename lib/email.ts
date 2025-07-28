import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailData {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailData) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured, skipping email send')
      return { success: false, error: 'Email service not configured - RESEND_API_KEY missing' }
    }

    console.log('Attempting to send email to:', to)
    console.log('Using API key:', process.env.RESEND_API_KEY ? 'Present' : 'Missing')

    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', // Use Resend's default domain for testing
      to: [to],
      subject,
      html,
    })

    if (error) {
      console.error('Resend API error:', error)
      return { success: false, error: `Resend API error: ${error.message}` }
    }

    console.log('Email sent successfully:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Email service error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown email service error' 
    }
  }
}

export function generateApprovalEmail(vendorName: string, businessName: string) {
  return {
    subject: '🎉 Your Vendor Application Has Been Approved!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #059669; margin: 0;">🎉 Congratulations!</h1>
        </div>
        
        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h2 style="color: #166534; margin-top: 0;">Your Application Has Been Approved!</h2>
          <p style="color: #166534; margin-bottom: 0;">
            Dear ${vendorName},
          </p>
        </div>
        
        <p style="color: #374151; line-height: 1.6;">
          Great news! Your vendor application for <strong>${businessName}</strong> has been reviewed and approved by our team.
        </p>
        
        <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #111827; margin-top: 0;">What's Next?</h3>
          <ul style="color: #374151; line-height: 1.6;">
            <li>Your business profile is now live on our platform</li>
            <li>You can log in to your vendor dashboard to manage your profile</li>
            <li>Start receiving quote requests from potential clients</li>
            <li>Update your availability and portfolio as needed</li>
          </ul>
        </div>
        
        <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #1e40af; margin-top: 0;">Login to Your Dashboard</h3>
          <p style="color: #1e40af; margin-bottom: 15px;">
            Access your vendor dashboard to start managing your business:
          </p>
          <a href="${process.env.NEXTAUTH_URL}/vendor/login" 
             style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
            Login to Dashboard
          </a>
        </div>
        
        <div style="background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #92400e; margin-top: 0;">Need Help?</h3>
          <p style="color: #92400e; margin-bottom: 0;">
            If you have any questions or need assistance setting up your profile, please don't hesitate to contact our support team.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">
            Thank you for choosing Muslim Wedding Hub!<br>
            We're excited to help you connect with Muslim couples in your area.
          </p>
        </div>
      </div>
    `
  }
}

export function generateRejectionEmail(vendorName: string, businessName: string, reason?: string) {
  return {
    subject: 'Update on Your Vendor Application',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #dc2626; margin: 0;">Application Update</h1>
        </div>
        
        <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h2 style="color: #991b1b; margin-top: 0;">Application Status Update</h2>
          <p style="color: #991b1b; margin-bottom: 0;">
            Dear ${vendorName},
          </p>
        </div>
        
        <p style="color: #374151; line-height: 1.6;">
          Thank you for your interest in joining Muslim Wedding Hub. After careful review of your application for <strong>${businessName}</strong>, we regret to inform you that we are unable to approve your application at this time.
        </p>
        
        ${reason ? `
        <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #111827; margin-top: 0;">Feedback</h3>
          <p style="color: #374151; line-height: 1.6; margin-bottom: 0;">
            ${reason}
          </p>
        </div>
        ` : ''}
        
        <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #1e40af; margin-top: 0;">What You Can Do</h3>
          <ul style="color: #374151; line-height: 1.6;">
            <li>Review the feedback provided above</li>
            <li>Address any concerns mentioned</li>
            <li>Consider reapplying in the future with updated information</li>
            <li>Ensure your business meets our quality standards and Islamic compliance requirements</li>
          </ul>
        </div>
        
        <div style="background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #92400e; margin-top: 0;">Questions?</h3>
          <p style="color: #92400e; margin-bottom: 0;">
            If you have any questions about this decision or would like to discuss your application further, please contact our support team. We're here to help you understand our requirements and improve your application.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">
            Thank you for your interest in Muslim Wedding Hub.<br>
            We wish you the best in your business endeavors.
          </p>
        </div>
      </div>
    `
  }
} 