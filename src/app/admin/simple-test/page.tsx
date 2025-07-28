'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import Link from 'next/link'

export default function SimpleTestPage() {
  const { data: session, status } = useSession()
  const [testResult, setTestResult] = useState<string>('')

  const testSession = async () => {
    try {
      const response = await fetch('/api/test-session')
      const data = await response.json()
      setTestResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setTestResult('Error: ' + error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Simple NextAuth Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Client Session Status</h2>
          <div className="space-y-2">
            <p><strong>Status:</strong> {status}</p>
            <p><strong>Email:</strong> {session?.user?.email || 'None'}</p>
            <p><strong>Name:</strong> {session?.user?.name || 'None'}</p>
            <p><strong>User ID:</strong> {(session?.user as any)?.id || 'None'}</p>
            <p><strong>Vendor:</strong> {(session?.user as any)?.vendor ? 'Present' : 'None'}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Server Session Test</h2>
          <button
            onClick={testSession}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Test Server Session
          </button>
          {testResult && (
            <pre className="mt-4 p-4 bg-gray-100 rounded text-sm overflow-auto">
              {testResult}
            </pre>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Actions</h2>
          <div className="space-y-2">
            <Link
              href="/vendor/login"
              className="block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-center"
            >
              Go to Login
            </Link>
            <button
              onClick={() => fetch('/api/auth/signout', { method: 'POST' })}
              className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Debug Info</h3>
                      <p className="text-sm text-yellow-700">
              This page tests basic NextAuth functionality. If the client session shows as authenticated 
              but the server session doesn&apos;t match, there&apos;s a configuration issue.
            </p>
        </div>
      </div>
    </div>
  )
} 