'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Star, MessageSquare, Calendar, Eye, Phone, Mail, Clock, Check, X, Send } from 'lucide-react'
import Logo from '../../../components/Logo'

interface QuoteRequest {
  id: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  eventDate?: string
  message: string
  status: string
  createdAt: string
}

export default function VendorDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user) {
      router.push('/vendor/login')
      return
    }

    // Fetch quote requests
    fetchQuoteRequests()
  }, [session, status, router])

  const fetchQuoteRequests = async () => {
    try {
      const response = await fetch('/api/vendor/quotes')
      if (response.ok) {
        const data = await response.json()
        setQuoteRequests(data.quotes)
      }
    } catch (error) {
      console.error('Error fetching quote requests:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  const mockVendor = {
    id: '1',
    businessName: 'Sample Business',
    category: 'VENUES',
    rating: 4.8,
    reviewCount: 24,
    profileViews: 156,
    verified: false,
    verificationStatus: 'PENDING'
  }

  // Get actual vendor data from session
  const actualVendor = (session.user as any)?.vendor
  const vendor = actualVendor || mockVendor

  const stats = [
    {
      name: 'Total Views',
      value: mockVendor.profileViews,
      icon: Eye,
      color: 'text-blue-600'
    },
    {
      name: 'Quote Requests',
      value: quoteRequests.length,
      icon: MessageSquare,
      color: 'text-emerald-600'
    },
    {
      name: 'Rating',
      value: `${mockVendor.rating}/5`,
      icon: Star,
      color: 'text-yellow-600'
    },
    {
      name: 'Reviews',
      value: mockVendor.reviewCount,
      icon: MessageSquare,
      color: 'text-purple-600'
    }
  ]

  // Show verification status banner for unverified vendors
  const showVerificationBanner = !vendor.verified

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/">
              <Logo size="md" />
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">Welcome, {session.user.name}</span>
              <button
                onClick={() => router.push('/api/auth/signout')}
                className="text-gray-500 hover:text-emerald-600 font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Verification Status Banner */}
        {showVerificationBanner && (
          <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center">
              <Clock className="w-6 h-6 text-yellow-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-800">
                  Application Under Review
                </h3>
                                  <p className="text-yellow-700 mt-1">
                    Your vendor application is currently being reviewed by our team. 
                    You&apos;ll receive an email notification once your account is approved.
                  </p>
                <p className="text-yellow-600 text-sm mt-2">
                  Status: {vendor.verificationStatus?.replace('_', ' ') || 'PENDING'}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendor Dashboard</h1>
          <p className="text-gray-600">
            {vendor.verified 
              ? 'Manage your business profile and customer inquiries'
              : 'Your dashboard will be fully accessible once your application is approved'
            }
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quote Requests */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Recent Quote Requests</h2>
              </div>
              <div className="p-6">
                {!vendor.verified ? (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Account Pending Approval</h3>
                    <p className="text-gray-600">
                      Quote requests will appear here once your account is verified and customers can find your profile.
                    </p>
                  </div>
                ) : quoteRequests.length > 0 ? (
                  <div className="space-y-4">
                    {quoteRequests.slice(0, 5).map((quote) => (
                      <QuoteRequestCard key={quote.id} quote={quote} onUpdate={fetchQuoteRequests} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No quote requests yet</h3>
                    <p className="text-gray-600">When customers request quotes, they&apos;ll appear here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {vendor.verified ? (
                  <>
                    <Link
                      href={`/vendor/${vendor.id}`}
                      className="block w-full bg-emerald-600 text-white text-center py-2 px-4 rounded-md hover:bg-emerald-700 transition duration-200"
                    >
                      View Public Profile
                    </Link>
                    <button className="block w-full bg-gray-600 text-white text-center py-2 px-4 rounded-md hover:bg-gray-700 transition duration-200">
                      Edit Profile
                    </button>
                    <button className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200">
                      Manage Photos
                    </button>
                    <button className="block w-full bg-purple-600 text-white text-center py-2 px-4 rounded-md hover:bg-purple-700 transition duration-200">
                      View Analytics
                    </button>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-600 text-sm">
                      Actions will be available once your account is approved.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Business Status */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Profile Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    vendor.verified 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {vendor.verified ? 'Verified' : 'Pending Approval'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Subscription</span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Profile Completion</span>
                  <span className="text-emerald-600 font-medium">85%</span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-emerald-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-emerald-900 mb-2">💡 Tips to Get More Bookings</h3>
              <ul className="text-sm text-emerald-800 space-y-2">
                <li>• Add high-quality photos to your gallery</li>
                <li>• Complete your Islamic compliance badges</li>
                <li>• Respond to quote requests within 24 hours</li>
                <li>• Encourage satisfied customers to leave reviews</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Quote Request Card Component with Actions
function QuoteRequestCard({ quote, onUpdate }: { quote: QuoteRequest; onUpdate: () => void }) {
  const [isResponding, setIsResponding] = useState(false)
  const [responseMessage, setResponseMessage] = useState('')
  const [proposedPrice, setProposedPrice] = useState('')
  const [additionalDetails, setAdditionalDetails] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleQuoteAction = async (action: 'accept' | 'decline' | 'respond') => {
    if (action === 'respond' && !responseMessage.trim()) {
      alert('Please enter a response message')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/vendor/quotes/${quote.id}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          message: responseMessage || getDefaultMessage(action),
          proposedPrice: proposedPrice || undefined,
          additionalDetails: additionalDetails || undefined
        })
      })

      if (response.ok) {
        onUpdate() // Refresh the quote requests
        setIsResponding(false)
        setResponseMessage('')
        setProposedPrice('')
        setAdditionalDetails('')
      } else {
        alert('Failed to respond to quote request')
      }
    } catch (error) {
      console.error('Error responding to quote:', error)
      alert('Failed to respond to quote request')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getDefaultMessage = (action: string) => {
    switch (action) {
      case 'accept':
        return "Thank you for your interest! I'd be happy to help make your special day perfect. Let's discuss the details further."
      case 'decline':
        return "Thank you for considering our services. Unfortunately, we're not available for your requested date. I wish you the best for your special day!"
      default:
        return ''
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'RESPONDED':
        return 'bg-green-100 text-green-800'
      case 'DECLINED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900">{quote.customerName}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
          {quote.status}
        </span>
      </div>
      
      <p className="text-gray-600 text-sm mb-3">{quote.message}</p>
      
      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Mail className="w-4 h-4 mr-1" />
            {quote.customerEmail}
          </div>
          {quote.customerPhone && (
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-1" />
              {quote.customerPhone}
            </div>
          )}
        </div>
        <span>{new Date(quote.createdAt).toLocaleDateString()}</span>
      </div>
      
      {quote.eventDate && (
        <div className="mb-3 flex items-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-1" />
          Event Date: {new Date(quote.eventDate).toLocaleDateString()}
        </div>
      )}

      {/* Action Buttons */}
      {quote.status === 'PENDING' && (
        <div className="border-t pt-3 mt-3">
          {!isResponding ? (
            <div className="flex space-x-2">
              <button
                onClick={() => handleQuoteAction('accept')}
                disabled={isSubmitting}
                className="flex items-center px-3 py-1.5 bg-emerald-600 text-white text-sm rounded-md hover:bg-emerald-700 disabled:opacity-50"
              >
                <Check className="w-4 h-4 mr-1" />
                Accept
              </button>
              <button
                onClick={() => handleQuoteAction('decline')}
                disabled={isSubmitting}
                className="flex items-center px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                <X className="w-4 h-4 mr-1" />
                Decline
              </button>
              <button
                onClick={() => setIsResponding(true)}
                className="flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
              >
                <Send className="w-4 h-4 mr-1" />
                Custom Response
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Response Message *
                </label>
                <textarea
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  placeholder="Write your response to the customer..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Proposed Price (optional)
                  </label>
                  <input
                    type="number"
                    value={proposedPrice}
                    onChange={(e) => setProposedPrice(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Details (optional)
                  </label>
                  <input
                    type="text"
                    value={additionalDetails}
                    onChange={(e) => setAdditionalDetails(e.target.value)}
                    placeholder="Extra information"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleQuoteAction('respond')}
                  disabled={isSubmitting || !responseMessage.trim()}
                  className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-md hover:bg-emerald-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send Response'}
                </button>
                <button
                  onClick={() => setIsResponding(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}