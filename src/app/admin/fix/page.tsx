'use client'

import { useState } from 'react'
import { CheckCircle, AlertTriangle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Logo from '../../../components/Logo'

export default function AdminFixPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const fixAdminSetup = async () => {
    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/admin/fix-admin', {
        method: 'POST'
      })
      
      if (response.ok) {
        await response.json()
        setIsSuccess(true)
        setMessage('Admin setup fixed successfully! You can now login.')
      } else {
        const errorData = await response.json()
        setMessage(errorData.error || 'Failed to fix admin setup')
      }
    } catch {
      setMessage('Error fixing admin setup. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-emerald-50 to-emerald-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <Link href="/" className="inline-block mb-4">
              <Logo size="lg" />
            </Link>
            
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Fix Admin Setup</h2>
            <p className="text-gray-600 mb-6">
              This will fix the admin account configuration so you can access the admin dashboard.
            </p>
          </div>

          {isSuccess ? (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Setup Fixed!</h3>
              <p className="text-gray-600 mb-6">
                Your admin account has been properly configured.
              </p>
              <div className="space-y-3">
                <Link
                  href="/vendor/login"
                  className="block w-full bg-emerald-600 text-white text-center py-2 px-4 rounded-md hover:bg-emerald-700 transition duration-200"
                >
                  Login as Admin
                </Link>
                <Link
                  href="/admin/vendors"
                  className="block w-full bg-gray-600 text-white text-center py-2 px-4 rounded-md hover:bg-gray-700 transition duration-200"
                >
                  Go to Admin Dashboard
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {message && (
                <div className={`px-4 py-3 rounded-md ${
                  isSuccess 
                    ? 'bg-green-50 border border-green-200 text-green-600' 
                    : 'bg-red-50 border border-red-200 text-red-600'
                }`}>
                  {message}
                </div>
              )}

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-yellow-800 mb-2">What this will do:</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Ensure admin user exists</li>
                  <li>• Create required vendor association</li>
                  <li>• Set proper verification status</li>
                  <li>• Enable admin dashboard access</li>
                </ul>
              </div>

              <button
                onClick={fixAdminSetup}
                disabled={isLoading}
                className="w-full bg-yellow-600 text-white py-3 px-4 rounded-md hover:bg-yellow-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Fixing Admin Setup...
                  </>
                ) : (
                  'Fix Admin Setup'
                )}
              </button>

              <div className="text-center">
                <Link
                  href="/vendor/login"
                  className="text-sm text-gray-600 hover:text-emerald-600"
                >
                  ← Back to Login
                </Link>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Admin Email: <span className="font-medium">admin@muslimweddinghub.com</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 