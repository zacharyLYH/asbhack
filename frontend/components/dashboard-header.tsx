'use client'

import { Button } from "@/components/ui/button"
import { LinkedInProfile } from "@/lib/types"
import { Download, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { AddProfileDialog } from "./add-profile-dialog"

export function DashboardHeader({ profiles }: { profiles: LinkedInProfile[] }) {
  const router = useRouter()

  const handleAddProfiles = async (urls: string[]) => {
    // Process each URL - you can navigate to the profile page or handle bulk processing
    for (const url of urls) {
      // Option 1: Navigate to each profile page (opens in new tab/window)
      window.open(`/profiles?url=${encodeURIComponent(url)}`, '_blank')
    }
    
    // Option 2: If you want to handle bulk processing, you could:
    // - Make API calls to fetch all profiles at once
    // - Update the profiles state in the parent component
    // - Show a loading state while processing
    
    // For now, we'll just refresh to show any newly added profiles
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => {
            window.location.reload()
          }}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>

            <Button variant="outline" size="sm" onClick={() => {
                const csv = profiles.map(profile => `${profile.name},${profile.location},${profile.experience?.[0]?.title},${profile.education?.[0]?.degree}`).join("\n")
                const blob = new Blob([csv], { type: "text/csv" })
                const url = URL.createObjectURL(blob)
                const a = document.createElement("a")
                a.href = url
                a.download = "profiles.csv"
                a.click()
                }}>
                <Download className="h-4 w-4 mr-2" />
                Export as CSV
            </Button>

          <AddProfileDialog onAddProfiles={handleAddProfiles} />
        </div>
      </div>
    </header>
  )
}
