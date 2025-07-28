import { notFound } from 'next/navigation'
import { Star, MapPin, Phone, MessageCircle, Mail, Globe, Check, Calendar, Send } from "lucide-react"
import Link from "next/link"
import { prisma } from "../../../../lib/prisma"
import Logo from "../../../components/Logo"

const islamicComplianceIcons: { [key: string]: { icon: string; label: string } } = {
  halal: { icon: '🥘', label: 'Halal food only' },
  prayerSpace: { icon: '🕌', label: 'Prayer space available' },
  genderSeparated: { icon: '👥', label: 'Gender-separated services' },
  noAlcohol: { icon: '🚫', label: 'No alcohol venues' },
  femaleStaff: { icon: '👩', label: 'Female staff available' },
}

const priceRangeLabels: { [key: string]: string } = {
  BUDGET: '$',
  MODERATE: '$$',
  LUXURY: '$$$',
  ULTRA_LUXURY: '$$$$'
}

async function getVendor(id: string) {
  // Return null if no database connection
  if (!prisma) {
    return null
  }
  
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { id },
      include: {
        user: true,
        photos: {
          orderBy: [
            { isMain: 'desc' },
            { order: 'asc' }
          ]
        },
        reviews: {
          where: { approved: true },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        _count: {
          select: { reviews: true }
        }
      }
    })

    if (!vendor) {
      return null
    }

    return vendor
  } catch (error) {
    console.error('Error fetching vendor:', error)
    return null
  }
}

function QuoteRequestForm({ vendorId }: { vendorId: string }) {
  return (
    <form action={`/api/quotes`} method="POST" className="space-y-4">
      <input type="hidden" name="vendorId" value={vendorId} />
      
      <div>
        <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name *
        </label>
        <input
          type="text"
          id="customerName"
          name="customerName"
          required
          placeholder="Your full name"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>
      
      <div>
        <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-1">
          Email *
        </label>
        <input
          type="email"
          id="customerEmail"
          name="customerEmail"
          required
          placeholder="your.email@example.com"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div>
        <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          id="customerPhone"
          name="customerPhone"
          placeholder="+1 (555) 123-4567"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>
      
      <div>
        <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-1">
          Event Date
        </label>
        <input
          type="date"
          id="eventDate"
          name="eventDate"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          placeholder="Tell us about your wedding plans, guest count, budget, and any specific requirements..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-3 px-6 rounded-md hover:from-emerald-700 hover:to-emerald-800 transition duration-200 font-semibold shadow-lg shadow-emerald-600/25"
      >
        <Send className="w-4 h-4 inline mr-2" />
        Send Quote Request
      </button>
      
      <p className="text-xs text-gray-500 text-center">
        By submitting this form, you agree to be contacted by this vendor regarding your wedding inquiry.
      </p>
    </form>
  )
}

export default async function VendorProfilePage({ params }: { params: { id: string } }) {
  const vendor = await getVendor(params.id)

  if (!vendor) {
    notFound()
  }

  const islamicCompliances = (vendor.islamicCompliances as string[]) || []
  const mainPhoto = vendor.photos.find(p => p.isMain) || vendor.photos[0]
  const galleryPhotos = vendor.photos.filter(p => !p.isMain).slice(0, 9)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/">
              <Logo size="md" />
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/vendors" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">Find Vendors</Link>
              <Link href="/vendor/register" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">List Your Business</Link>
              <Link href="/vendor/login" className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-2.5 rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 font-medium shadow-lg shadow-emerald-600/25">Vendor Login</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="text-gray-500 hover:text-emerald-600">Home</Link>
            </li>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li>
              <Link href="/vendors" className="text-gray-500 hover:text-emerald-600">Vendors</Link>
            </li>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li>
              <span className="text-gray-900 font-medium">{vendor.businessName}</span>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {mainPhoto && (
                <div className="h-64 md:h-96 relative">
                  <img
                    src={mainPhoto.url}
                    alt={vendor.businessName}
                    className="w-full h-full object-cover"
                  />
                  {vendor.verified && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-sm flex items-center">
                        <Check className="w-4 h-4 mr-1" />
                        Verified Muslim Wedding
                      </span>
                    </div>
                  )}
                </div>
              )}
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{vendor.businessName}</h1>
                    <p className="text-xl text-emerald-600 capitalize">
                      {vendor.category.replace(/_/g, ' ').toLowerCase()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-emerald-600 mb-1">
                      {priceRangeLabels[vendor.priceRange]}
                    </div>
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="ml-1 font-semibold">
                        {vendor.rating?.toFixed(1) || 'New'}
                      </span>
                      <span className="ml-1 text-gray-600">
                        ({vendor._count.reviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-gray-600">
                    {vendor.address}, {vendor.city}, {vendor.state} {vendor.zipCode}
                  </span>
                </div>

                {/* Primary CTA - Request Quote */}
                <div className="mb-6">
                  <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Get Your Custom Quote
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Contact this vendor to discuss your wedding needs and get a personalized quote.
                    </p>
                    <a
                      href="#quote-form"
                      className="inline-flex items-center bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-8 py-3 rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 font-semibold text-lg shadow-lg shadow-emerald-600/25"
                    >
                      <Send className="w-5 h-5 mr-2" />
                      Request Quote
                    </a>
                  </div>
                </div>

                {/* Website Link (if available) */}
                {vendor.website && (
                  <div className="mb-6">
                    <a
                      href={vendor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition duration-200 border border-blue-200"
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      Visit Website
                    </a>
                  </div>
                )}

                {/* Islamic Compliance Badges */}
                {islamicCompliances.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Islamic Compliance</h3>
                    <div className="flex flex-wrap gap-2">
                      {islamicCompliances.map((compliance) => {
                        const complianceInfo = islamicComplianceIcons[compliance]
                        return complianceInfo ? (
                          <span
                            key={compliance}
                            className="bg-emerald-100 text-emerald-800 px-3 py-2 rounded-full text-sm flex items-center"
                          >
                            <span className="mr-2">{complianceInfo.icon}</span>
                            {complianceInfo.label}
                          </span>
                        ) : null
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* About Section */}
            {vendor.description && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">About</h2>
                <p className="text-gray-700 leading-relaxed">{vendor.description}</p>
              </div>
            )}

            {/* Photo Gallery */}
            {galleryPhotos.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {galleryPhotos.map((photo) => (
                    <div key={photo.id} className="aspect-square rounded-lg overflow-hidden">
                      <img
                        src={photo.url}
                        alt={photo.alt || vendor.businessName}
                        className="w-full h-full object-cover hover:scale-105 transition duration-200"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Reviews</h2>
              {vendor.reviews.length > 0 ? (
                <div className="space-y-6">
                  {vendor.reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 font-semibold">{review.reviewerName}</span>
                        {review.verifiedMuslimWedding && (
                          <span className="ml-2 bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs">
                            Verified Muslim Wedding
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                      <p className="text-gray-500 text-sm mt-2">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No reviews yet. Be the first to review this vendor!</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Enhanced Quote Request Form */}
              <div id="quote-form" className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Request a Quote</h3>
                <p className="text-gray-600 mb-4">
                  Get in touch with this vendor to discuss your wedding needs and receive a personalized quote.
                </p>
                <QuoteRequestForm vendorId={vendor.id} />
              </div>
              
              {/* Location Info Card */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Location</h3>
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 text-gray-400 mr-3 mt-1" />
                  <span className="text-gray-700">
                    {vendor.address}<br />
                    {vendor.city}, {vendor.state} {vendor.zipCode}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}