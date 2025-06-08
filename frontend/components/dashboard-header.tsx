'use client'

import { Button } from "@/components/ui/button"
import { LinkedInProfile } from "@/lib/types"
import { Download, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { AddProfileDialog } from "./add-profile-dialog"

export function DashboardHeader({ profiles }: { profiles: LinkedInProfile[] }) {
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

          <AddProfileDialog />
        </div>
      </div>
    </header>
  )
}
