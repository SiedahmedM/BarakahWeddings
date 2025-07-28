'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, CheckCircle, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import Logo from '../../../components/Logo'

export default function AdminSetupPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [adminExists, setAdminExists] = useState(false)

  useEffect(() => {
    // Check if admin already has a password set
    checkAdminStatus()
  }, [])

  const checkAdminStatus = async () => {
    try {
      const response = await fetch('/api/admin/check-status')
      if (response.ok) {
        const data = await response.json()
        if (data.hasPassword) {
          setAdminExists(true)
          setMessage('Admin password is already set. Please login instead.')
        }
      }
    } catch (error) {
      console.error('Error checking admin status:', error)
    } finally {
      setIsChecking(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      setMessage('Password must be at least 8 characters long')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/admin/set-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      if (response.ok) {
        setIsSuccess(true)
        setMessage('Admin password set successfully! You can now login.')
      } else {
        const data = await response.json()
        setMessage(data.error || 'Failed to set password')
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-emerald-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking admin status...</p>
        </div>
      </div>
    )
  }

  if (adminExists) {
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
              
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Admin Already Setup</h2>
              <p className="text-gray-600 mb-6">
                The admin password has already been set. Please login instead.
              </p>
              
              <div className="space-y-3">
                <Link
                  href="/vendor/login"
                  className="block w-full bg-emerald-600 text-white text-center py-2 px-4 rounded-md hover:bg-emerald-700 transition duration-200"
                >
                  Login as Admin
                </Link>
                <Link
                  href="/"
                  className="block w-full bg-gray-600 text-white text-center py-2 px-4 rounded-md hover:bg-gray-700 transition duration-200"
                >
                  Return to Homepage
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-emerald-50 to-emerald-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <Link href="/" className="inline-block mb-4">
              <Logo size="lg" />
            </Link>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Admin Setup</h2>
            <p className="text-gray-600">Set up your admin password</p>
          </div>

          {isSuccess ? (
            <div className="mt-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Setup Complete!</h3>
              <p className="text-gray-600 mb-6">
                Your admin password has been set successfully.
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
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              {message && (
                <div className={`px-4 py-3 rounded-md ${
                  isSuccess 
                    ? 'bg-green-50 border border-green-200 text-green-600' 
                    : 'bg-red-50 border border-red-200 text-red-600'
                }`}>
                  {message}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Admin Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-3 pr-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Enter admin password"
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
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Confirm password"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-600 text-white py-3 px-4 rounded-md hover:bg-emerald-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Setting Password...' : 'Set Admin Password'}
                </button>
              </div>
            </form>
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