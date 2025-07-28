import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const apiKey = process.env.RESEND_API_KEY
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'RESEND_API_KEY not found in environment variables'
      })
    }

    // Check API key format
    const isValidFormat = apiKey.startsWith('re_') && apiKey.length > 10
    
    // Check if it's not just a placeholder
    const isNotPlaceholder = !apiKey.includes('your_resend_api_key_here') && 
                            !apiKey.includes('placeholder') &&
                            apiKey !== 're_your_resend_api_key_here'

    return NextResponse.json({
      success: true,
      validation: {
        exists: true,
        length: apiKey.length,
        startsWithRe: apiKey.startsWith('re_'),
        isValidFormat,
        isNotPlaceholder,
        first10Chars: apiKey.substring(0, 10) + '...',
        last4Chars: '...' + apiKey.substring(apiKey.length - 4)
      },
      recommendations: {
        ...(isValidFormat && isNotPlaceholder ? {} : {
          issues: [
            ...(isValidFormat ? [] : ['API key format appears invalid']),
            ...(isNotPlaceholder ? [] : ['API key appears to be a placeholder'])
          ]
        })
      }
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
} 