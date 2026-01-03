'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const NoAccessPage = () => {
  const router = useRouter()

  // Handle redirect back to the homepage or other route
  const handleRedirect = () => {
    router.push('/') // Redirect to homepage or any other route
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader>
          <h1 className="text-xl font-bold text-center text-red-600">
            You Don't Have Access to This Page
          </h1>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-700 mb-4">
            Sorry, you are not authorized to view this page.
          </p>
          <div className="flex justify-center">
            <Button onClick={handleRedirect} variant="outline">
              Go Back to Homepage
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default NoAccessPage


