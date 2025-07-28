'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, User, Mail, Phone, MapPin, Building, Calendar, Clock, Globe } from 'lucide-react'
import Logo from '../../../components/Logo'

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
  { value: 'BUDGET', label: '$ - Budget-friendly' },
  { value: 'MODERATE', label: '$$ - Moderate pricing' },
  { value: 'LUXURY', label: '$$$ - Luxury services' },
  { value: 'ULTRA_LUXURY', label: '$$$$ - Ultra-luxury' },
]

const islamicCompliances = [
  { key: 'halal', label: 'Halal food only' },
  { key: 'prayerSpace', label: 'Prayer space available' },
  { key: 'genderSeparated', label: 'Gender-separated services' },
  { key: 'noAlcohol', label: 'No alcohol venues' },
  { key: 'femaleStaff', label: 'Female staff available' },
]

const eventTypes = [
  { key: 'nikah', label: 'Nikah Ceremony' },
  { key: 'walima', label: 'Walima Reception' },
  { key: 'mehndi', label: 'Mehndi Ceremony' },
  { key: 'engagement', label: 'Engagement Party' },
  { key: 'aqeeqah', label: 'Aqeeqah Ceremony' },
  { key: 'other', label: 'Other Events' },
]

const paymentMethods = [
  { key: 'cash', label: 'Cash' },
  { key: 'check', label: 'Check' },
  { key: 'creditCard', label: 'Credit Card' },
  { key: 'bankTransfer', label: 'Bank Transfer' },
  { key: 'paypal', label: 'PayPal' },
  { key: 'other', label: 'Other' },
]

const timeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
  '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM',
  '9:00 PM', '9:30 PM', '10:00 PM'
]

export default function VendorRegisterPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    // User data
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    
    // Basic business data
    businessName: '',
    description: '',
    category: '',
    phone: '',
    whatsapp: '',
    website: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    priceRange: '',
    islamicCompliances: [] as string[],
    
    // Essential business data
    yearsInBusiness: '',
    serviceAreas: [] as string[],
    maxCapacity: '',
    minCapacity: '',
    eventTypes: [] as string[],
    businessHours: {
      monday: { open: '', close: '', closed: false },
      tuesday: { open: '', close: '', closed: false },
      wednesday: { open: '', close: '', closed: false },
      thursday: { open: '', close: '', closed: false },
      friday: { open: '', close: '', closed: false },
      saturday: { open: '', close: '', closed: false },
      sunday: { open: '', close: '', closed: false }
    },
    paymentMethods: [] as string[],
    workSamples: [] as File[]
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleArrayChange = (field: keyof typeof formData, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked
        ? [...(prev[field] as string[]), value]
        : (prev[field] as string[]).filter(item => item !== value)
    }))
  }

  const handleBusinessHoursChange = (day: string, field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day as keyof typeof prev.businessHours],
          [field]: value
        }
      }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    // Validate work samples
    if (formData.workSamples.length === 0) {
      setError('Please upload at least one work sample')
      setIsLoading(false)
      return
    }

    try {
      const formDataToSend = new FormData()
      
      // Add all form data
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'workSamples') {
          // Handle file uploads
          formData.workSamples.forEach((file, index) => {
            formDataToSend.append(`workSamples`, file)
          })
        } else if (Array.isArray(value)) {
          formDataToSend.append(key, JSON.stringify(value))
        } else if (typeof value === 'object' && value !== null) {
          formDataToSend.append(key, JSON.stringify(value))
        } else {
          formDataToSend.append(key, value as string)
        }
      })

      const response = await fetch('/api/vendor/register', {
        method: 'POST',
        body: formDataToSend,
      })

      if (response.ok) {
        const data = await response.json()
        if (data.status === 'PENDING') {
          router.push('/vendor/registration-success')
        } else {
          router.push('/vendor/login?registered=true')
        }
      } else {
        const data = await response.json()
        setError(data.error || 'Registration failed')
      }
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 5))
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-emerald-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-4">
              <Logo size="lg" />
            </Link>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Join Our Vendor Network</h2>
            <p className="text-gray-600">Connect with Muslim couples looking for your services</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                    step <= currentStep ? 'bg-emerald-600' : 'bg-gray-300'
                  }`}>
                    {step}
                  </div>
                  {step < 5 && (
                    <div className={`w-12 h-1 ${
                      step < currentStep ? 'bg-emerald-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-600">
              <span>Account</span>
              <span>Business</span>
              <span>Services</span>
              <span>Hours</span>
              <span>Review</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
                {error}
              </div>
            )}

            {/* Step 1: Account Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      autoComplete="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Your full name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        autoComplete="new-password"
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full pl-3 pr-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Confirm password"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Basic Business Information */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Business Information</h3>
                
                <div>
                  <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                    Business Name *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="businessName"
                      name="businessName"
                      required
                      value={formData.businessName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Your business name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      required
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700 mb-1">
                      Price Range *
                    </label>
                    <select
                      id="priceRange"
                      name="priceRange"
                      required
                      value={formData.priceRange}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">Select price range</option>
                      {priceRanges.map((range) => (
                        <option key={range.value} value={range.value}>
                          {range.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Business Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Tell us about your business and services..."
                  />
                </div>

                <div>
                  <label htmlFor="yearsInBusiness" className="block text-sm font-medium text-gray-700 mb-1">
                    Years in Business
                  </label>
                  <input
                    type="number"
                    id="yearsInBusiness"
                    name="yearsInBusiness"
                    min="0"
                    value={formData.yearsInBusiness}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g., 5"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Services & Capacity */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Services & Capacity</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Event Types You Serve *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {eventTypes.map((eventType) => (
                      <label key={eventType.key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.eventTypes.includes(eventType.key)}
                          onChange={(e) => handleArrayChange('eventTypes', eventType.key, e.target.checked)}
                          className="text-emerald-600 focus:ring-emerald-500 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{eventType.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="minCapacity" className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Guest Capacity
                    </label>
                    <input
                      type="number"
                      id="minCapacity"
                      name="minCapacity"
                      min="1"
                      value={formData.minCapacity}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="e.g., 50"
                    />
                  </div>

                  <div>
                    <label htmlFor="maxCapacity" className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Guest Capacity
                    </label>
                    <input
                      type="number"
                      id="maxCapacity"
                      name="maxCapacity"
                      min="1"
                      value={formData.maxCapacity}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="e.g., 300"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="serviceAreas" className="block text-sm font-medium text-gray-700 mb-1">
                    Service Areas (cities/states)
                  </label>
                  <textarea
                    id="serviceAreas"
                    name="serviceAreas"
                    rows={3}
                    value={formData.serviceAreas.join(', ')}
                    onChange={(e) => setFormData(prev => ({ ...prev, serviceAreas: e.target.value.split(',').map(s => s.trim()).filter(s => s) }))}
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g., Toronto, Mississauga, Brampton, Ontario"
                  />
                </div>

                <div>
                  <label htmlFor="workSamples" className="block text-sm font-medium text-gray-700 mb-1">
                    Work Samples *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      id="workSamples"
                      name="workSamples"
                      multiple
                      accept="image/*,video/*"
                      required
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        setFormData(prev => ({ ...prev, workSamples: files }));
                      }}
                    />
                    <label htmlFor="workSamples" className="cursor-pointer">
                      <div className="space-y-2">
                        <div className="text-gray-600">
                          <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <div>
                          <span className="text-emerald-600 hover:text-emerald-700 font-medium">Click to upload</span>
                          <span className="text-gray-500"> or drag and drop</span>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF, MP4 up to 10MB each</p>
                      </div>
                    </label>
                  </div>
                  {formData.workSamples && formData.workSamples.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">Selected files: {formData.workSamples.length}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Contact & Business Hours */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
                        WhatsApp Number
                      </label>
                      <input
                        type="tel"
                        id="whatsapp"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleInputChange}
                        className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Business Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Street address (optional)"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="City"
                      />
                    </div>

                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        required
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                        placeholder="State"
                      />
                    </div>


                  </div>

                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="url"
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Hours</h3>
                  <div className="space-y-3">
                    {Object.entries(formData.businessHours).map(([day, hours]) => (
                      <div key={day} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
                        <div className="w-20">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={!hours.closed}
                              onChange={(e) => handleBusinessHoursChange(day, 'closed', !e.target.checked)}
                              className="text-emerald-600 focus:ring-emerald-500 rounded"
                            />
                            <span className="ml-2 text-sm font-medium capitalize">{day}</span>
                          </label>
                        </div>
                        
                        {!hours.closed && (
                          <>
                            <select
                              value={hours.open}
                              onChange={(e) => handleBusinessHoursChange(day, 'open', e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                              <option value="">Open</option>
                              {timeSlots.map(time => (
                                <option key={time} value={time}>{time}</option>
                              ))}
                            </select>
                            
                            <span className="text-gray-500">to</span>
                            
                            <select
                              value={hours.close}
                              onChange={(e) => handleBusinessHoursChange(day, 'close', e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                              <option value="">Close</option>
                              {timeSlots.map(time => (
                                <option key={time} value={time}>{time}</option>
                              ))}
                            </select>
                          </>
                        )}
                        
                        {hours.closed && (
                          <span className="text-gray-500 text-sm">Closed</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Payment Methods Accepted
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {paymentMethods.map((method) => (
                      <label key={method.key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.paymentMethods.includes(method.key)}
                          onChange={(e) => handleArrayChange('paymentMethods', method.key, e.target.checked)}
                          className="text-emerald-600 focus:ring-emerald-500 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{method.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Islamic Compliance (select all that apply)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {islamicCompliances.map((compliance) => (
                      <label key={compliance.key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.islamicCompliances.includes(compliance.key)}
                          onChange={(e) => handleArrayChange('islamicCompliances', compliance.key, e.target.checked)}
                          className="text-emerald-600 focus:ring-emerald-500 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{compliance.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Review & Submit */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Your Information</h3>
                
                <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Account Information</h4>
                    <p><strong>Name:</strong> {formData.name}</p>
                    <p><strong>Email:</strong> {formData.email}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Business Information</h4>
                    <p><strong>Business Name:</strong> {formData.businessName}</p>
                    <p><strong>Category:</strong> {categories.find(c => c.value === formData.category)?.label}</p>
                    <p><strong>Price Range:</strong> {priceRanges.find(p => p.value === formData.priceRange)?.label}</p>
                    <p><strong>Years in Business:</strong> {formData.yearsInBusiness || 'Not specified'}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Services</h4>
                    <p><strong>Event Types:</strong> {formData.eventTypes.length > 0 ? formData.eventTypes.map(et => eventTypes.find(e => e.key === et)?.label).join(', ') : 'None selected'}</p>
                    <p><strong>Capacity:</strong> {formData.minCapacity && formData.maxCapacity ? `${formData.minCapacity}-${formData.maxCapacity} guests` : 'Not specified'}</p>
                                         <p><strong>Service Areas:</strong> {formData.serviceAreas.length > 0 ? formData.serviceAreas.join(', ') : 'Not specified'}</p>
                     <p><strong>Work Samples:</strong> {formData.workSamples.length > 0 ? `${formData.workSamples.length} files selected` : 'No files selected'}</p>
                   </div>
                   
                   <div>
                     <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                     <p><strong>Phone:</strong> {formData.phone}</p>
                     <p><strong>Location:</strong> {formData.city}, {formData.state}</p>
                     <p><strong>Address:</strong> {formData.address || 'Not provided'}</p>
                     <p><strong>Website:</strong> {formData.website || 'Not provided'}</p>
                   </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">Important Note</h4>
                  <p className="text-yellow-700 text-sm">
                    Your application will be reviewed by our team. You'll receive an email notification once your account is approved and activated.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition duration-200"
                >
                  Previous
                </button>
              )}
              
              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700 transition duration-200 ml-auto"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700 transition duration-200 ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              )}
            </div>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/vendor/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-gray-600 hover:text-emerald-600">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}