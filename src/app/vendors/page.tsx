import { Suspense } from 'react'
import { Filter, Star, MapPin, Check, Send } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/prisma"
import Logo from "../../components/Logo"

interface SearchParams {
  location?: string
  category?: string
  priceRange?: string
  halal?: string
  prayerSpace?: string
  genderSeparated?: string
  noAlcohol?: string
  femaleStaff?: string
}



const islamicCompliances = [
  { key: 'halal', label: 'Halal food only', icon: '🥘' },
  { key: 'prayerSpace', label: 'Prayer space available', icon: '🕌' },
  { key: 'genderSeparated', label: 'Gender-separated services', icon: '👥' },
  { key: 'noAlcohol', label: 'No alcohol venues', icon: '🚫' },
  { key: 'femaleStaff', label: 'Female staff available', icon: '👩' },
]

const categories = [
  { value: 'VENUES', label: 'Venues' },
  { value: 'CATERERS', label: 'Caterers' },
  { value: 'PHOTOGRAPHERS', label: 'Photographers' },
  { value: 'VIDEOGRAPHERS', label: 'Videographers' },
  { value: 'FLORISTS', label: 'Florists' },
  { value: 'BRIDAL', label: 'Bridal' },
  { value: 'NIKAH_OFFICIANTS', label: 'Nikah Officiants' },
  { value: 'HAIR_MAKEUP', label: 'Hair & Makeup' },
  { value: 'JEWELRY', label: 'Jewelry' },
  { value: 'DECORATIONS', label: 'Decorations' },
  { value: 'TRANSPORTATION', label: 'Transportation' },
  { value: 'ENTERTAINMENT', label: 'Entertainment' },
]

const priceRanges = [
  { value: 'BUDGET', label: '$500 - $2,000', description: 'Budget-friendly' },
  { value: 'MODERATE', label: '$2,000 - $5,000', description: 'Moderate pricing' },
  { value: 'LUXURY', label: '$5,000 - $10,000', description: 'Luxury services' },
  { value: 'ULTRA_LUXURY', label: '$10,000+', description: 'Ultra-luxury' },
]

async function getVendors(searchParams: SearchParams) {
  // Return empty array if no database connection
  if (!prisma) {
    return []
  }
  
  try {
    const whereClause: any = {
      subscriptionActive: true,
    }

    if (searchParams.location) {
      whereClause.OR = [
        { city: { contains: searchParams.location, mode: 'insensitive' } },
        { state: { contains: searchParams.location, mode: 'insensitive' } },
      ]
    }

    if (searchParams.category) {
      whereClause.category = searchParams.category
    }

    if (searchParams.priceRange) {
      whereClause.priceRange = searchParams.priceRange
    }

    // Islamic compliance filters
    if (searchParams.halal || searchParams.prayerSpace || searchParams.genderSeparated || 
        searchParams.noAlcohol || searchParams.femaleStaff) {
      const complianceFilters = []
      if (searchParams.halal) complianceFilters.push('halal')
      if (searchParams.prayerSpace) complianceFilters.push('prayerSpace')
      if (searchParams.genderSeparated) complianceFilters.push('genderSeparated')
      if (searchParams.noAlcohol) complianceFilters.push('noAlcohol')
      if (searchParams.femaleStaff) complianceFilters.push('femaleStaff')
      
      whereClause.islamicCompliances = {
        array_contains: complianceFilters
      }
    }

    const vendors = await prisma.vendor.findMany({
      where: whereClause,
      include: {
        photos: {
          where: { isMain: true },
          take: 1
        },
        _count: {
          select: { reviews: true }
        }
      },
      orderBy: [
        { verified: 'desc' },
        { rating: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return vendors
  } catch (error) {
    console.error('Error fetching vendors:', error)
    return []
  }
}

function VendorCard({ vendor }: { vendor: any }) {
  const vendorCompliances = vendor.islamicCompliances as string[] || []
  
  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl hover:border-emerald-200 transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {vendor.photos[0] ? (
          <Image
            src={vendor.photos[0].url}
            alt={vendor.businessName}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-sm">No Image</span>
            </div>
          </div>
        )}
        {vendor.verified && (
          <div className="absolute top-4 right-4">
            <span className="bg-emerald-600 text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center shadow-lg">
              <Check className="w-3 h-3 mr-1" />
              Verified
            </span>
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-full text-sm font-semibold shadow-md">
            {priceRanges.find(p => p.value === vendor.priceRange)?.label || '$'}
          </span>
        </div>
        <div className="absolute bottom-4 left-4">
          <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-semibold text-gray-900">
              {vendor.rating?.toFixed(1) || 'New'}
            </span>
            <span className="text-sm text-gray-600">
              ({vendor._count.reviews})
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
            {vendor.businessName}
          </h3>
          <p className="text-emerald-600 font-medium text-sm uppercase tracking-wide">
            {vendor.category.replace(/_/g, ' ')}
          </p>
        </div>
        
        <div className="flex items-center mb-4 text-gray-600">
          <MapPin className="w-4 h-4 mr-2" />
          <span className="text-sm">{vendor.city}, {vendor.state}</span>
        </div>

        {vendor.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
            {vendor.description}
          </p>
        )}

        {/* Islamic Compliance Badges */}
        {vendorCompliances.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {vendorCompliances.slice(0, 2).map((compliance) => {
                const complianceInfo = islamicCompliances.find(ic => ic.key === compliance)
                return complianceInfo ? (
                  <span
                    key={compliance}
                    className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl text-xs font-medium flex items-center border border-emerald-200"
                  >
                    <span className="mr-1.5">{complianceInfo.icon}</span>
                    {complianceInfo.label}
                  </span>
                ) : null
              })}
              {vendorCompliances.length > 2 && (
                <span className="bg-gray-50 text-gray-600 px-3 py-1.5 rounded-xl text-xs font-medium border border-gray-200">
                  +{vendorCompliances.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className="mb-6">
          <Link
            href={`/vendor/${vendor.id}#quote-form`}
            className="inline-flex items-center justify-center w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-4 py-2 rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 font-medium text-sm shadow-md"
          >
            <Send className="w-4 h-4 mr-2" />
            Request Quote
          </Link>
        </div>

        <Link
          href={`/vendor/${vendor.id}`}
          className="block w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-center py-3 rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 font-semibold shadow-lg shadow-emerald-600/25"
        >
          View Profile
        </Link>
      </div>
    </div>
  )
}

function FilterSidebar({ searchParams }: { searchParams: SearchParams }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
      <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-6 border-b border-emerald-200">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center mr-3">
            <Filter className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Filters</h3>
        </div>
      </div>

      <form method="GET" className="p-6 space-y-8">
        {/* Location */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-3">
            📍 Location
          </label>
          <input
            type="text"
            name="location"
            defaultValue={searchParams.location || ''}
            placeholder="Enter city or state"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-3">
            🏷️ Category
          </label>
          <select
            name="category"
            defaultValue={searchParams.category || ''}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors appearance-none cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-4">
            💰 Price Range
          </label>
          <div className="space-y-3">
            {priceRanges.map((range) => (
              <label key={range.value} className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
                <input
                  type="radio"
                  name="priceRange"
                  value={range.value}
                  defaultChecked={searchParams.priceRange === range.value}
                  className="text-emerald-600 focus:ring-emerald-500 focus:ring-2"
                />
                <div className="ml-3">
                  <div className="flex items-center">
                    <span className="font-semibold text-emerald-600 mr-2">{range.label}</span>
                    <span className="text-sm text-gray-600">{range.description}</span>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Islamic Compliance */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-4">
            🕌 Islamic Compliance
          </label>
          <div className="space-y-3">
            {islamicCompliances.map((compliance) => (
              <label key={compliance.key} className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
                <input
                  type="checkbox"
                  name={compliance.key}
                  value="true"
                  defaultChecked={searchParams[compliance.key as keyof SearchParams] === 'true'}
                  className="text-emerald-600 focus:ring-emerald-500 focus:ring-2 rounded"
                />
                <div className="ml-3 flex items-center">
                  <span className="text-lg mr-2">{compliance.icon}</span>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {compliance.label}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-4 px-6 rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 font-semibold shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/30"
        >
          Apply Filters
        </button>
      </form>
    </div>
  )
}

async function VendorsContent({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const vendors = await getVendors(params)

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
              <Link href="/vendors" className="text-emerald-600 font-semibold border-b-2 border-emerald-600 pb-1">Find Vendors</Link>
              <Link href="/vendor/register" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">List Your Business</Link>
              <Link href="/vendor/login" className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-2.5 rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 font-medium shadow-lg shadow-emerald-600/25">Vendor Login</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Wedding Vendors</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find verified Muslim wedding vendors who understand your needs and traditions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <FilterSidebar searchParams={params} />
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-4 sm:mb-0">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {vendors.length} vendor{vendors.length !== 1 ? 's' : ''} found
                    </h3>
                    <p className="text-sm text-gray-600">
                      Verified Islamic-compliant wedding vendors
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <select className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm">
                      <option>Sort by: Featured</option>
                      <option>Sort by: Rating</option>
                      <option>Sort by: Price</option>
                      <option>Sort by: Reviews</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {vendors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {vendors.map((vendor) => (
                  <VendorCard key={vendor.id} vendor={vendor} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No vendors found</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Try adjusting your filters or search in a different location to find vendors that match your needs.
                </p>
                <Link
                  href="/vendors"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 font-semibold shadow-lg shadow-emerald-600/25"
                >
                  Clear All Filters
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VendorsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <VendorsContent searchParams={searchParams} />
    </Suspense>
  )
}