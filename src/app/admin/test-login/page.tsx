'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Logo from '../../../components/Logo'

export default function AdminTestLoginPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [adminStatus, setAdminStatus] = useState<any>(null)


  useEffect(() => {
    checkAdminStatus()
  }, [session, status])

  const checkAdminStatus = async () => {
    try {
      const response = await fetch('/api/admin/check-admin')
      if (response.ok) {
        const data = await response.json()
        setAdminStatus(data)
      }
    } catch {
      console.error('Error checking admin status')
    }
  }

  const handleLogin = () => {
    router.push('/vendor/login')
  }

  const handleLogout = async () => {
    await fetch('/api/auth/signout', { method: 'POST' })
    router.push('/vendor/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-emerald-50 to-emerald-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-4">
              <Logo size="lg" />
            </Link>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Admin Login Test</h2>
            <p className="text-gray-600">
              Debug admin authentication and session status
            </p>
          </div>

          {/* Session Status */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Status</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">Status:</span>
                  <div className="flex items-center mt-1">
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
                       'Not Authenticated'}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">User Email:</span>
                  <div className="mt-1">
                    <span className="text-sm">
                      {session?.user?.email || 'None'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Status */}
          {adminStatus && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Status</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Admin User Exists:</span>
                    <div className="flex items-center">
                      {adminStatus.adminUser ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500 mr-2" />
                      )}
                      <span className="text-sm">{adminStatus.adminUser ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Has Password:</span>
                    <div className="flex items-center">
                      {adminStatus.adminUser?.hasPassword ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500 mr-2" />
                      )}
                      <span className="text-sm">{adminStatus.adminUser?.hasPassword ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Has Vendor Record:</span>
                    <div className="flex items-center">
                      {adminStatus.adminUser?.hasVendor ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500 mr-2" />
                      )}
                      <span className="text-sm">{adminStatus.adminUser?.hasVendor ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Is Admin Session:</span>
                    <div className="flex items-center">
                      {adminStatus.isAdmin ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500 mr-2" />
                      )}
                      <span className="text-sm">{adminStatus.isAdmin ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-4">
            {status === 'authenticated' ? (
              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-blue-800">You are logged in!</span>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">
                    Email: {session?.user?.email}
                  </p>
                </div>
                
                {adminStatus?.isAdmin ? (
                  <div className="space-y-2">
                    <Link
                      href="/admin/vendors"
                      className="block w-full bg-emerald-600 text-white text-center py-2 px-4 rounded-md hover:bg-emerald-700 transition duration-200"
                    >
                      Go to Admin Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition duration-200"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                      <span className="text-sm font-medium text-yellow-800">Not Admin Account</span>
                    </div>
                    <p className="text-sm text-yellow-700 mt-1">
                      You are logged in as {session?.user?.email}, but this is not the admin account.
                    </p>
                    <button
                      onClick={handleLogout}
                      className="mt-2 w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 transition duration-200"
                    >
                      Sign Out and Login as Admin
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <XCircle className="w-5 h-5 text-red-600 mr-2" />
                    <span className="text-sm font-medium text-red-800">Not Logged In</span>
                  </div>
                  <p className="text-sm text-red-700 mt-1">
                    You need to login with the admin account first.
                  </p>
                </div>
                
                <button
                  onClick={handleLogin}
                  className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 transition duration-200"
                >
                  Login as Admin
                </button>
              </div>
            )}
          </div>

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