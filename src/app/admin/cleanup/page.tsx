'use client'

import { useState } from 'react'
import { CheckCircle, Loader2, Trash2, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import Logo from '../../../components/Logo'

export default function AdminCleanupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [analysisData, setAnalysisData] = useState<any>(null)
  const [cleanupResults, setCleanupResults] = useState<any>(null)

  const analyzeDuplicates = async () => {
    setIsAnalyzing(true)
    setMessage('')

    try {
      const response = await fetch('/api/test-quotes')
      
      if (response.ok) {
        const data = await response.json()
        setAnalysisData(data)
        setMessage('Analysis complete! Review the results below.')
      } else {
        setMessage('Failed to analyze duplicates')
      }
    } catch {
      setMessage('Error analyzing duplicates. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const cleanupDuplicates = async () => {
    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/cleanup-duplicates', {
        method: 'POST'
      })
      
      if (response.ok) {
        const data = await response.json()
        setCleanupResults(data)
        setIsSuccess(true)
        setMessage('Cleanup completed successfully!')
        
        // Refresh analysis data
        setTimeout(() => {
          analyzeDuplicates()
        }, 1000)
      } else {
        const errorData = await response.json()
        setMessage(errorData.error || 'Failed to cleanup duplicates')
      }
    } catch {
      setMessage('Error cleaning up duplicates. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-emerald-50 to-emerald-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-4">
              <Logo size="lg" />
            </Link>
            
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Duplicate Quote Cleanup</h2>
            <p className="text-gray-600">
              Analyze and remove duplicate quote requests from the database
            </p>
          </div>

          {message && (
            <div className={`mb-6 px-4 py-3 rounded-md ${
              isSuccess 
                ? 'bg-green-50 border border-green-200 text-green-600' 
                : 'bg-red-50 border border-red-200 text-red-600'
            }`}>
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Step 1: Analyze</h3>
              <p className="text-sm text-blue-700 mb-4">
                Check for duplicate quote requests in the database
              </p>
              <button
                onClick={analyzeDuplicates}
                disabled={isAnalyzing}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Analyze Duplicates
                  </>
                )}
              </button>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-red-800 mb-2">Step 2: Cleanup</h3>
              <p className="text-sm text-red-700 mb-4">
                Remove duplicate quote requests (keeps the first occurrence)
              </p>
              <button
                onClick={cleanupDuplicates}
                disabled={isLoading || !analysisData}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Cleaning Up...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-5 h-5 mr-2" />
                    Cleanup Duplicates
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Analysis Results */}
          {analysisData && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Results</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{analysisData.summary?.totalVendors || 0}</div>
                    <div className="text-sm text-gray-600">Total Vendors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{analysisData.summary?.totalQuoteRequests || 0}</div>
                    <div className="text-sm text-gray-600">Total Quotes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{analysisData.summary?.vendorsWithDuplicates || 0}</div>
                    <div className="text-sm text-gray-600">Vendors with Duplicates</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {analysisData.duplicateAnalysis?.reduce((sum: number, vendor: any) => sum + vendor.duplicates, 0) || 0}
                    </div>
                    <div className="text-sm text-gray-600">Total Duplicates</div>
                  </div>
                </div>

                {analysisData.duplicateAnalysis?.map((vendor: any, index: number) => (
                  <div key={index} className="border-t border-gray-200 pt-4 mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">{vendor.businessName}</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>Total: {vendor.totalQuotes}</div>
                      <div>Unique: {vendor.uniqueQuotes}</div>
                      <div className="text-red-600">Duplicates: {vendor.duplicates}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cleanup Results */}
          {cleanupResults && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cleanup Results</h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="font-medium text-green-800">Cleanup Completed</span>
                </div>
                <p className="text-green-700 mb-4">
                  Removed {cleanupResults.totalRemoved} duplicate quote requests
                </p>
                
                {cleanupResults.cleanupResults?.map((result: any, index: number) => (
                  <div key={index} className="border-t border-green-200 pt-2 mt-2">
                    <div className="text-sm">
                      <span className="font-medium">{result.businessName}:</span> Removed {result.removed} duplicates
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-center space-x-4">
            <Link
              href="/admin/vendors"
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-200"
            >
              Back to Admin Dashboard
            </Link>
            <Link
              href="/vendor/login"
              className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition duration-200"
            >
              Vendor Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 