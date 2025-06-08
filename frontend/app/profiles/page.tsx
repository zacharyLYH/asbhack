'use client'

import { LinkedInProfile } from "@/lib/types"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-blue-400 rounded-full animate-pulse"></div>
        </div>
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900">Loading profile...</p>
          <p className="text-sm text-gray-500 mt-1">Please wait while we fetch the data</p>
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const searchParams = useSearchParams()
  const url = searchParams.get("url")
  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState<LinkedInProfile | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!url) {
      setIsLoading(false)
      return
    }

    const fetchProfile = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch(`/api/profile?url=${encodeURIComponent(url)}`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch profile: ${response.statusText}`)
        }
        
        const data = await response.json() as LinkedInProfile
        setProfile(data)
        console.log(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching profile:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [url])

  if (!url) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900">No URL provided</p>
          <p className="text-sm text-gray-500 mt-1">Please provide a LinkedIn profile URL</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-lg font-medium text-red-600">Error loading profile</p>
          <p className="text-sm text-gray-500 mt-1">{error}</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900">No profile found</p>
          <p className="text-sm text-gray-500 mt-1">Unable to load profile data</p>
        </div>
      </div>
    )
  }

  return <div>{url}</div>
}
