"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { X } from "lucide-react"
import type { LinkedInProfile } from "@/lib/types"

interface ProfileFiltersProps {
  profiles: LinkedInProfile[]
  onFilterChange: (filteredProfiles: LinkedInProfile[]) => void
}

interface FilterState {
  search: string
  locations: string[]
  companies: string[]
  skills: string[]
  hasExperience: boolean
  hasEducation: boolean
  hasAwards: boolean
  hasCertifications: boolean
}

export function ProfileFilters({ profiles, onFilterChange }: ProfileFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    locations: [],
    companies: [],
    skills: [],
    hasExperience: false,
    hasEducation: false,
    hasAwards: false,
    hasCertifications: false,
  })

  // Extract unique values for filter options
  const uniqueLocations = Array.from(new Set(profiles.map((p) => p.location).filter(Boolean)))
  const uniqueCompanies = Array.from(new Set(profiles.flatMap((p) => p.experience?.map((e) => e.company) || [])))
  const uniqueSkills = Array.from(new Set(profiles.flatMap((p) => p.skills || []))).slice(0, 20) // Limit to top 20 skills

  // Apply filters
  useEffect(() => {
    let filtered = profiles

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (profile) =>
          profile.linkedinUrl.toLowerCase().includes(searchLower) ||
          profile.headline?.toLowerCase().includes(searchLower) ||
          profile.location?.toLowerCase().includes(searchLower),
      )
    }

    // Location filter
    if (filters.locations.length > 0) {
      filtered = filtered.filter((profile) => profile.location && filters.locations.includes(profile.location))
    }

    // Company filter
    if (filters.companies.length > 0) {
      filtered = filtered.filter((profile) =>
        profile.experience?.some((exp) => filters.companies.includes(exp.company)),
      )
    }

    // Skills filter
    if (filters.skills.length > 0) {
      filtered = filtered.filter((profile) => profile.skills?.some((skill) => filters.skills.includes(skill)))
    }

    // Boolean filters
    if (filters.hasExperience) {
      filtered = filtered.filter((profile) => profile.experience && profile.experience.length > 0)
    }
    if (filters.hasEducation) {
      filtered = filtered.filter((profile) => profile.education && profile.education.length > 0)
    }
    if (filters.hasAwards) {
      filtered = filtered.filter((profile) => profile.awards && profile.awards.length > 0)
    }
    if (filters.hasCertifications) {
      filtered = filtered.filter((profile) => profile.certifications && profile.certifications.length > 0)
    }

    onFilterChange(filtered)
  }, [filters, profiles, onFilterChange])

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const toggleArrayFilter = (key: "locations" | "companies" | "skills", value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key].filter((item) => item !== value) : [...prev[key], value],
    }))
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      locations: [],
      companies: [],
      skills: [],
      hasExperience: false,
      hasEducation: false,
      hasAwards: false,
      hasCertifications: false,
    })
  }

  const activeFiltersCount =
    (filters.search ? 1 : 0) +
    filters.locations.length +
    filters.companies.length +
    filters.skills.length +
    (filters.hasExperience ? 1 : 0) +
    (filters.hasEducation ? 1 : 0) +
    (filters.hasAwards ? 1 : 0) +
    (filters.hasCertifications ? 1 : 0)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{activeFiltersCount}</Badge>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search by name, headline, location..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
          />
        </div>

        <Separator />

        {/* Locations */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Locations</Label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {uniqueLocations.slice(0, 10).map((location) => (
              <div key={location} className="flex items-center space-x-2">
                <Checkbox
                  id={`location-${location}`}
                  checked={filters.locations.includes(location || "")}
                  onCheckedChange={() => toggleArrayFilter("locations", location || "")}
                />
                <Label htmlFor={`location-${location}`} className="text-sm font-normal cursor-pointer">
                  {location}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Companies */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Companies</Label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {uniqueCompanies.slice(0, 10).map((company) => (
              <div key={company} className="flex items-center space-x-2">
                <Checkbox
                  id={`company-${company}`}
                  checked={filters.companies.includes(company)}
                  onCheckedChange={() => toggleArrayFilter("companies", company)}
                />
                <Label htmlFor={`company-${company}`} className="text-sm font-normal cursor-pointer">
                  {company}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Skills */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Skills</Label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {uniqueSkills.map((skill) => (
              <div key={skill} className="flex items-center space-x-2">
                <Checkbox
                  id={`skill-${skill}`}
                  checked={filters.skills.includes(skill)}
                  onCheckedChange={() => toggleArrayFilter("skills", skill)}
                />
                <Label htmlFor={`skill-${skill}`} className="text-sm font-normal cursor-pointer">
                  {skill}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Boolean Filters */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Profile Completeness</Label>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasExperience"
                checked={filters.hasExperience}
                onCheckedChange={(checked) => updateFilter("hasExperience", checked)}
              />
              <Label htmlFor="hasExperience" className="text-sm font-normal cursor-pointer">
                Has Experience
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasEducation"
                checked={filters.hasEducation}
                onCheckedChange={(checked) => updateFilter("hasEducation", checked)}
              />
              <Label htmlFor="hasEducation" className="text-sm font-normal cursor-pointer">
                Has Education
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasAwards"
                checked={filters.hasAwards}
                onCheckedChange={(checked) => updateFilter("hasAwards", checked)}
              />
              <Label htmlFor="hasAwards" className="text-sm font-normal cursor-pointer">
                Has Awards
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasCertifications"
                checked={filters.hasCertifications}
                onCheckedChange={(checked) => updateFilter("hasCertifications", checked)}
              />
              <Label htmlFor="hasCertifications" className="text-sm font-normal cursor-pointer">
                Has Certifications
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
