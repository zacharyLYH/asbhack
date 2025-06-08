"use client"

import { ProfileCard } from "@/components/profile-card"
import { ProfileFilters } from "@/components/profile-filters"
import { ProfileTable } from "@/components/profile-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { LinkedInProfile } from "@/lib/types"
import { Briefcase, GraduationCap, Grid, List, MapPin, Users } from "lucide-react"
import { useMemo, useState } from "react"

interface ProfilesViewProps {
  profiles: LinkedInProfile[]
  filteredProfiles: LinkedInProfile[]
  onFilterChange: (profiles: LinkedInProfile[]) => void
}

export function ProfilesView({ profiles, filteredProfiles, onFilterChange }: ProfilesViewProps) {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const stats = useMemo(() => {
    const locations = new Set(filteredProfiles.map((p) => p.location).filter(Boolean))
    const companies = new Set(filteredProfiles.flatMap((p) => p.experience?.map((e) => e.company) || []))
    const universities = new Set(filteredProfiles.flatMap((p) => p.education?.map((e) => e.institution) || []))

    return {
      total: filteredProfiles.length,
      locations: locations.size,
      companies: companies.size,
      universities: universities.size,
    }
  }, [filteredProfiles])

  const sortedProfiles = useMemo(() => {
    return [...filteredProfiles].sort((a, b) => {
      let aValue: any = a[sortBy as keyof LinkedInProfile]
      let bValue: any = b[sortBy as keyof LinkedInProfile]

      if (typeof aValue === "string") aValue = aValue.toLowerCase()
      if (typeof bValue === "string") bValue = bValue.toLowerCase()

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
  }, [filteredProfiles, sortBy, sortOrder])

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profiles</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.total / profiles.length) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Locations</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.locations}</div>
            <p className="text-xs text-muted-foreground">Unique locations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Companies</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.companies}</div>
            <p className="text-xs text-muted-foreground">Unique companies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Universities</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.universities}</div>
            <p className="text-xs text-muted-foreground">Educational institutions</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className="lg:w-80">
          <ProfileFilters profiles={profiles} onFilterChange={onFilterChange} />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "grid" | "table")}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TabsList>
                  <TabsTrigger value="grid">
                    <Grid className="h-4 w-4 mr-2" />
                    Grid
                  </TabsTrigger>
                  <TabsTrigger value="table">
                    <List className="h-4 w-4 mr-2" />
                    Table
                  </TabsTrigger>
                </TabsList>
                <Badge variant="secondary">{sortedProfiles.length} profiles</Badge>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border rounded px-2 py-1"
                >
                  <option value="name">Name</option>
                  <option value="location">Location</option>
                  <option value="headline">Headline</option>
                </select>
                <Button variant="outline" size="sm" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                  {sortOrder === "asc" ? "↑" : "↓"}
                </Button>
              </div>
            </div>

            <TabsContent value="grid" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sortedProfiles.map((profile, index) => (
                  <ProfileCard key={profile.linkedinUrl || `profile-${index}`} profile={profile} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="table">
              <ProfileTable profiles={sortedProfiles} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
