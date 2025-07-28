'use client'

import { useState } from 'react'
import { UserPlus, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function CreateDemoVendorPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; credentials?: any } | null>(null)

  const handleCreateDemoVendor = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/create-demo-vendor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok) {
        setResult({
          success: true,
          message: data.message,
          credentials: data.credentials
        })
      } else {
        setResult({
          success: false,
          message: data.error || 'Failed to create demo vendor'
        })
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Network error occurred while creating demo vendor'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Demo Vendor</h1>
          <p className="text-gray-600">
            Create a demo vendor account to test the vendor dashboard and platform features.
          </p>
        </div>

        <div className="space-y-6">
          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Demo Account:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Email: demo@muslimweddinghub.com</li>
                  <li>Password: demo123</li>
                  <li>Includes sample data for testing</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Create Button */}
          <button
            onClick={handleCreateDemoVendor}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg shadow-blue-600/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Creating Demo Vendor...
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5 mr-2" />
                Create Demo Vendor
              </>
            )}
          </button>

          {/* Result */}
          {result && (
            <div className={`rounded-lg p-4 ${
              result.success 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-start">
                {result.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                )}
                <div className="text-sm">
                  <p className={`font-medium mb-1 ${
                    result.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {result.success ? 'Success!' : 'Error'}
                  </p>
                  <p className={result.success ? 'text-green-700' : 'text-red-700'}>
                    {result.message}
                  </p>
                  {result.success && result.credentials && (
                    <div className="mt-3 p-3 bg-white rounded border">
                      <p className="font-medium text-gray-800 mb-2">Login Credentials:</p>
                      <p className="text-sm text-gray-600">
                        <strong>Email:</strong> {result.credentials.email}<br/>
                        <strong>Password:</strong> {result.credentials.password}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="text-center">
            <p className="text-sm text-gray-500">
              After creating the demo vendor, you can login at{' '}
              <Link href="/vendor/login" className="text-blue-600 hover:text-blue-700 font-medium">
                /vendor/login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 