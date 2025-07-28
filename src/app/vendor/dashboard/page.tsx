'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Star, MessageSquare, Calendar, Settings, Eye, Phone, Mail } from 'lucide-react'
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
    verified: true
  }

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendor Dashboard</h1>
          <p className="text-gray-600">Manage your business profile and customer inquiries</p>
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
                {quoteRequests.length > 0 ? (
                  <div className="space-y-4">
                    {quoteRequests.slice(0, 5).map((quote) => (
                      <div key={quote.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-900">{quote.customerName}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            quote.status === 'PENDING' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : quote.status === 'RESPONDED'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {quote.status}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{quote.message}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
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
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <Calendar className="w-4 h-4 mr-1" />
                            Event Date: {new Date(quote.eventDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
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
                <Link
                  href={`/vendor/${mockVendor.id}`}
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
              </div>
            </div>

            {/* Business Status */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Profile Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    mockVendor.verified 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {mockVendor.verified ? 'Verified' : 'Pending'}
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