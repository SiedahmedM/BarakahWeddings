import { Search, Star, MapPin, Phone, MessageCircle, Heart, Calendar, CheckCircle, Lightbulb, Globe, Users, FileText, Send } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import Logo from "../components/Logo"

const categories = [
  { name: "Venues", icon: "🏛️", href: "/vendors?category=VENUES" },
  { name: "Caterers", icon: "🍽️", href: "/vendors?category=CATERERS" },
  { name: "Photographers", icon: "📸", href: "/vendors?category=PHOTOGRAPHERS" },
  { name: "Bridal", icon: "👰", href: "/vendors?category=BRIDAL" },
  { name: "Nikah Officiants", icon: "📿", href: "/vendors?category=NIKAH_OFFICIANTS" },
  { name: "Hair & Makeup", icon: "💄", href: "/vendors?category=HAIR_MAKEUP" },
]

const realWeddings = [
  {
    couple: "Ahmed & Dima",
    image: "/placeholder-wedding-1.jpg",
    location: "Dubai, UAE",
    description: "A beautiful traditional ceremony with modern touches"
  },
  {
    couple: "Mubasher & Sarah",
    image: "/placeholder-wedding-2.jpg", 
    location: "London, UK",
    description: "Elegant nikah celebration with family and friends"
  },
  {
    couple: "Bilal & Dounia",
    image: "/placeholder-wedding-3.jpg",
    location: "Toronto, Canada", 
    description: "A beautiful blend of traditional nikah ceremony with modern Canadian hospitality"
  }
]

const weddingTools = [
  {
    title: "Free Wedding Website",
    description: "Create your personalized wedding website to share with guests",
    icon: Globe,
    href: "#"
  },
  {
    title: "Wedding Checklist", 
    description: "Comprehensive timeline and checklist for your special day",
    icon: CheckCircle,
    href: "#"
  },
  {
    title: "Budget Planner",
    description: "Track expenses and stay within your wedding budget",
    icon: FileText,
    href: "#"
  },
  {
    title: "Seating Chart",
    description: "Plan perfect seating arrangements for your reception",
    icon: Users,
    href: "#"
  }
]

const weddingTips = [
  {
    title: "Incorporating Islamic Traditions",
    description: "How to beautifully blend traditional nikah ceremonies with modern celebrations",
    icon: Heart
  },
  {
    title: "Halal Catering Ideas",
    description: "Creative menu options that respect Islamic dietary guidelines",
    icon: Calendar
  },
  {
    title: "Prayer Space Design",
    description: "Creating beautiful and functional prayer areas for your wedding",
    icon: Lightbulb
  }
]

const howItWorks = [
  {
    step: 1,
    title: "Search",
    description: "Find halal-certified vendors in your area"
  },
  {
    step: 2,
    title: "Compare",
    description: "Review profiles, ratings, and Islamic compliance"
  },
  {
    step: 3,
    title: "Contact",
    description: "Request quotes and connect with vendors"
  }
]

async function getFeaturedVendors() {
  // Return empty array if no database connection
  if (!prisma) {
    return []
  }
  
  try {
    const vendors = await prisma.vendor.findMany({
      take: 6,
      where: {
        subscriptionActive: true,
        verified: true
      },
      include: {
        photos: {
          where: { isMain: true },
          take: 1
        },
        _count: {
          select: { reviews: true }
        }
      },
      orderBy: {
        rating: 'desc'
      }
    })
    return vendors
  } catch (error) {
    console.error('Database error:', error)
    return []
  }
}

export default async function HomePage() {
  const featuredVendors = await getFeaturedVendors()

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Logo size="md" />
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/vendors" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">Find Vendors</Link>
              <Link href="/vendor/register" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">List Your Business</Link>
              <Link href="/vendor/login" className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-2.5 rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 font-medium shadow-lg shadow-emerald-600/25">Vendor Login</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section - Moved 80% closer to header */}
      <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-50 overflow-hidden pt-8">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-5">
            <div className="w-full h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full blur-3xl"></div>
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium mb-4">
              🕌 Trusted by 10,000+ Muslim couples
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Find Your Perfect
            <span className="block bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 bg-clip-text text-transparent">
              Halal Wedding Vendors
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            Connect with verified Muslim wedding vendors who understand your values and traditions. 
            From venues with prayer spaces to halal caterers.
          </p>
          
          {/* Modern Search Bar - Switched category and location */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <form action="/vendors" method="GET" className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <select
                    name="category"
                    className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg bg-white/80 appearance-none cursor-pointer"
                  >
                    <option value="">All Categories</option>
                    <option value="VENUES">Wedding Venues</option>
                    <option value="CATERERS">Halal Caterers</option>
                    <option value="PHOTOGRAPHERS">Photographers</option>
                    <option value="BRIDAL">Bridal & Fashion</option>
                    <option value="NIKAH_OFFICIANTS">Nikah Officiants</option>
                    <option value="HAIR_MAKEUP">Hair & Makeup</option>
                  </select>
                </div>
                <div className="flex-1 relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="location"
                    placeholder="Enter city or state"
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg bg-white/80"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-8 py-4 rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 flex items-center justify-center text-lg font-semibold shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/30 transform hover:scale-105"
                >
                  <Search className="w-6 h-6 mr-3" />
                  Search Vendors
                </button>
              </form>
              
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                <span className="text-sm text-gray-500">Popular searches:</span>
                <Link href="/vendors?category=VENUES" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">Halal Venues</Link>
                <Link href="/vendors?halal=true" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">Halal Catering</Link>
                <Link href="/vendors?prayerSpace=true" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">Prayer Spaces</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories - Updated title and horizontal scroll */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Find the right vendor for you</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover specialized vendors for every aspect of your Muslim wedding celebration
            </p>
          </div>
          
          <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
            {categories.map((category, index) => (
              <Link
                key={category.name}
                href={category.href}
                className="group flex-shrink-0 bg-white rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-emerald-200 hover:-translate-y-2 min-w-[280px]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm group-hover:text-emerald-600 transition-colors">
                    Explore verified vendors
                  </p>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Real Weddings Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Real Weddings</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Beautiful celebrations from real Muslim couples who found their perfect vendors
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {realWeddings.map((wedding, index) => (
              <div key={index} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl hover:border-emerald-200 transition-all duration-300 hover:-translate-y-1">
                <div className="relative h-64 bg-gradient-to-br from-emerald-100 to-emerald-200 overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-emerald-600">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-emerald-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-8 h-8" />
                      </div>
                      <span className="text-sm font-medium">Wedding Photo</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
                    {wedding.couple}
                  </h3>
                  <p className="text-emerald-600 font-medium text-sm mb-3">
                    {wedding.location}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {wedding.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plan Your Wedding With Us Section */}
      <section className="py-16 bg-gradient-to-br from-emerald-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Plan your wedding with us!</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Free tools and resources to help you plan the perfect Muslim wedding
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {weddingTools.map((tool, index) => (
              <Link
                key={tool.title}
                href={tool.href}
                className="group bg-white rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-emerald-200 hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200 transition-colors">
                  <tool.icon className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
                  {tool.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {tool.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Ideas and Tips Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Ideas and Tips</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Creative inspiration and practical advice for a successful Muslim wedding
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {weddingTips.map((tip, index) => (
              <div key={tip.title} className="group bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-emerald-200">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-200 transition-colors">
                  <tip.icon className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-emerald-700 transition-colors">
                  {tip.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {tip.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vendors - Reduced spacing */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Featured Vendors</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Handpicked vendors with exceptional service and verified Islamic compliance
            </p>
          </div>
          
          {featuredVendors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredVendors.map((vendor) => (
                <div key={vendor.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl hover:border-emerald-200 transition-all duration-300 hover:-translate-y-1">
                  <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    {vendor.photos[0] ? (
                      <img
                        src={vendor.photos[0].url}
                        alt={vendor.businessName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                    <div className="absolute top-4 right-4">
                      <span className="bg-emerald-600 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg">
                        ✓ Verified
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
                        {vendor.category.replace('_', ' ')}
                      </p>
                    </div>
                    
                    <div className="flex items-center mb-4 text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-sm">{vendor.city}, {vendor.state}</span>
                    </div>
                    
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
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Featured Vendors Yet</h3>
              <p className="text-gray-600 mb-6">Check back soon to see our handpicked vendors!</p>
              <Link
                href="/vendors"
                className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-semibold"
              >
                Browse All Vendors
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* How It Works - Reduced spacing */}
      <section className="py-16 bg-gradient-to-br from-emerald-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three simple steps to find your perfect Muslim wedding vendors
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-emerald-200 via-emerald-300 to-emerald-200"></div>
            
            {howItWorks.map((step, index) => (
              <div key={step.step} className="text-center relative">
                <div className="relative inline-block mb-6">
                  <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto shadow-lg shadow-emerald-600/25">
                    {step.step}
                  </div>
                  {index < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 left-full w-8 h-0.5 bg-emerald-300 transform -translate-y-1/2"></div>
                  )}
                </div>
                
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              href="/vendors"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 font-semibold text-lg shadow-lg shadow-emerald-600/25"
            >
              Start Your Search
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer */}
          <div className="py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-2">
                <Logo size="md" className="mb-6" />
                <p className="text-gray-400 mb-6 text-lg leading-relaxed max-w-md">
                  Connecting Muslim couples with trusted halal wedding vendors who understand your values and traditions.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-emerald-600 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-emerald-600 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-emerald-600 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.750-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                    </svg>
                  </a>
                </div>
              </div>
              
              <div>
                <h4 className="font-bold text-lg mb-6 text-white">For Couples</h4>
                <ul className="space-y-3">
                  <li><Link href="/vendors" className="text-gray-400 hover:text-emerald-400 transition-colors">Find Vendors</Link></li>
                  <li><Link href="/vendors?halal=true" className="text-gray-400 hover:text-emerald-400 transition-colors">Halal Vendors</Link></li>
                  <li><Link href="/vendors?prayerSpace=true" className="text-gray-400 hover:text-emerald-400 transition-colors">Prayer Spaces</Link></li>
                  <li><Link href="/how-it-works" className="text-gray-400 hover:text-emerald-400 transition-colors">How It Works</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold text-lg mb-6 text-white">For Vendors</h4>
                <ul className="space-y-3">
                  <li><Link href="/vendor/register" className="text-gray-400 hover:text-emerald-400 transition-colors">Join Our Network</Link></li>
                  <li><Link href="/vendor/login" className="text-gray-400 hover:text-emerald-400 transition-colors">Vendor Login</Link></li>
                  <li><Link href="/vendor/dashboard" className="text-gray-400 hover:text-emerald-400 transition-colors">Dashboard</Link></li>
                  <li><Link href="/pricing" className="text-gray-400 hover:text-emerald-400 transition-colors">Pricing</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Bottom Footer */}
          <div className="border-t border-gray-800 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm mb-4 md:mb-0">
                &copy; 2024 Muslim Wedding Hub. All rights reserved.
              </div>
              <div className="flex space-x-6 text-sm">
                <Link href="/privacy" className="text-gray-400 hover:text-emerald-400 transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="text-gray-400 hover:text-emerald-400 transition-colors">Terms of Service</Link>
                <Link href="/contact" className="text-gray-400 hover:text-emerald-400 transition-colors">Contact Us</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
