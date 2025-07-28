'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Logo from '../../../components/Logo'

export default function AdminDebugPage() {
  const { data: session, status } = useSession()
  const [serverSession, setServerSession] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchServerSession()
  }, [])

  const fetchServerSession = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/test-session')
      if (response.ok) {
        const data = await response.json()
        setServerSession(data)
      }
    } catch (error) {
      console.error('Error fetching server session:', error)
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
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Session Debug</h2>
            <p className="text-gray-600">
              Compare client-side and server-side session data
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Client Side Session */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Client-Side Session</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-700">Status:</span>
                  <div className="flex items-center">
                    {status === 'loading' ? (
                      <Loader2 className="w-4 h-4 text-blue-500 mr-2 animate-spin" />
                    ) : status === 'authenticated' ? (
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 mr-2" />
                    )}
                    <span className="text-sm font-medium">
                      {status === 'loading' ? 'Loading...' : 
                       status === 'authenticated' ? 'Authenticated' : 
                       status === 'unauthenticated' ? 'Not Authenticated' : 
                       'Unknown'}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-blue-700">User Email:</span>
                  <div className="mt-1">
                    <span className="text-sm">
                      {session?.user?.email || 'None'}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-blue-700">User ID:</span>
                  <div className="mt-1">
                    <span className="text-sm">
                      {(session?.user as any)?.id || 'None'}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-blue-700">Vendor Data:</span>
                  <div className="mt-1">
                    <span className="text-sm">
                      {(session?.user as any)?.vendor ? 'Present' : 'None'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Server Side Session */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-4">Server-Side Session</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-700">Status:</span>
                  <div className="flex items-center">
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 text-green-500 mr-2 animate-spin" />
                    ) : serverSession?.session?.exists ? (
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 mr-2" />
                    )}
                    <span className="text-sm font-medium">
                      {isLoading ? 'Loading...' : 
                       serverSession?.session?.exists ? 'Exists' : 'Not Found'}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-green-700">User Email:</span>
                  <div className="mt-1">
                    <span className="text-sm">
                      {serverSession?.session?.user?.email || 'None'}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-green-700">User ID:</span>
                  <div className="mt-1">
                    <span className="text-sm">
                      {serverSession?.session?.user?.id || 'None'}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-green-700">Vendor Data:</span>
                  <div className="mt-1">
                    <span className="text-sm">
                      {serverSession?.session?.user?.vendor ? 'Present' : 'None'}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-green-700">Timestamp:</span>
                  <div className="mt-1">
                    <span className="text-sm">
                      {serverSession?.timestamp || 'None'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={fetchServerSession}
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50"
            >
              {isLoading ? 'Refreshing...' : 'Refresh Server Session'}
            </button>
            
            <Link
              href="/admin/vendors"
              className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition duration-200"
            >
              Try Admin Dashboard
            </Link>
            
            <Link
              href="/vendor/login"
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-200"
            >
              Login Page
            </Link>
          </div>

          {/* Analysis */}
          {serverSession && status !== 'loading' && (
            <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-yellow-800 mb-2">Analysis:</h4>
              <div className="text-sm text-yellow-700 space-y-1">
                {status === 'authenticated' && serverSession.session.exists ? (
                  <p>✅ Both client and server sessions are working correctly</p>
                ) : status === 'authenticated' && !serverSession.session.exists ? (
                  <p>⚠️ Client session exists but server session is missing - this indicates a session persistence issue</p>
                ) : status === 'unauthenticated' && serverSession.session.exists ? (
                  <p>⚠️ Server session exists but client session is missing - this indicates a client-side hydration issue</p>
                ) : (
                  <p>❌ No sessions found - user needs to login</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 