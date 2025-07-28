import Link from 'next/link'
import { CheckCircle, Clock, Mail, Phone } from 'lucide-react'
import Logo from '../../../components/Logo'

export default function RegistrationSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-emerald-50 to-emerald-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mb-8">
            <Link href="/" className="inline-block mb-6">
              <Logo size="lg" />
            </Link>
            
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Application Submitted Successfully!
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              Thank you for applying to join our Muslim wedding marketplace. 
              Your application is now under review.
            </p>
          </div>

          {/* Verification Process */}
          <div className="bg-emerald-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-emerald-900 mb-4">
              What Happens Next?
            </h2>
            
            <div className="space-y-4 text-left">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <Clock className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-medium text-emerald-900">Review Process</h3>
                  <p className="text-sm text-emerald-700">
                    Our team will review your application, including business information, 
                    Islamic compliance features, and overall suitability for our platform.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <Mail className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-medium text-emerald-900">Email Notification</h3>
                  <p className="text-sm text-emerald-700">
                                         You&apos;ll receive an email notification within 2-3 business days 
                     with the status of your application.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-medium text-emerald-900">Account Activation</h3>
                  <p className="text-sm text-emerald-700">
                    Once approved, your vendor profile will be live and visible to 
                    Muslim couples searching for wedding services.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* What We Look For */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">
              What We Look For
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div>
                <h3 className="font-medium text-blue-900 mb-2">Business Standards</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Professional business practices</li>
                  <li>• Quality of previous work</li>
                  <li>• Customer service excellence</li>
                  <li>• Valid business licenses</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-blue-900 mb-2">Islamic Compliance</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Halal food certification (caterers)</li>
                  <li>• Prayer space availability</li>
                  <li>• Gender-separated services</li>
                  <li>• Alcohol-free venues</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Questions About Your Application?
            </h2>
            
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-6">
              <div className="flex items-center">
                <Mail className="w-4 h-4 text-gray-500 mr-2" />
                <span className="text-sm text-gray-600">support@muslimweddinghub.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 text-gray-500 mr-2" />
                <span className="text-sm text-gray-600">+1 (555) 123-4567</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Link
              href="/vendor/login"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 transition duration-200"
            >
              Sign In to Your Account
            </Link>
            
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition duration-200"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 