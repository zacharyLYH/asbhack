"use client"

import { useState, useEffect } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { ProfilesView } from "@/components/profiles-view"
import { AnalyticsView } from "@/components/analytics-view"
// import { mockProfiles } from "@/lib/mock-data"
import { LinkedInProfile } from "@/lib/types"

export default function Dashboard() {
  const [currentView, setCurrentView] = useState("profiles")
  const [profiles, setProfiles] = useState<LinkedInProfile[]>([])
  const [filteredProfiles, setFilteredProfiles] = useState<LinkedInProfile[]>([])

  useEffect(() => {
    const fetchProfiles = async () => {
      const response = await fetch("http://localhost:8000/profiles")
      const data = await response.json()
      setProfiles(data)
      setFilteredProfiles(data)
    }
    fetchProfiles()
  }, [])

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <AppSidebar
          currentView={currentView}
          onViewChange={setCurrentView}
          profileCount={filteredProfiles.length}
          totalCount={profiles.length}
        />
        <div className="flex-1 flex flex-col">
          <DashboardHeader profiles={profiles} />
          <main className="flex-1 p-6 bg-muted/20">
            {currentView === "profiles" && (
              <ProfilesView
                profiles={profiles}
                filteredProfiles={filteredProfiles}
                onFilterChange={setFilteredProfiles}
              />
            )}
            {currentView === "analytics" && <AnalyticsView profiles={filteredProfiles} />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
