"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { MapPin, Briefcase, Users, TrendingUp } from "lucide-react"
import type { LinkedInProfile } from "@/lib/types"

interface AnalyticsViewProps {
  profiles: LinkedInProfile[]
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

export function AnalyticsView({ profiles }: AnalyticsViewProps) {
  const analytics = useMemo(() => {
    // Location distribution
    const locationCounts = profiles.reduce(
      (acc, profile) => {
        if (profile.location) {
          acc[profile.location] = (acc[profile.location] || 0) + 1
        }
        return acc
      },
      {} as Record<string, number>,
    )

    const topLocations = Object.entries(locationCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([location, count]) => ({ location, count }))

    // Company distribution
    const companyCounts = profiles.reduce(
      (acc, profile) => {
        profile.experience?.forEach((exp) => {
          acc[exp.company] = (acc[exp.company] || 0) + 1
        })
        return acc
      },
      {} as Record<string, number>,
    )

    const topCompanies = Object.entries(companyCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([company, count]) => ({ company, count }))

    // Skills distribution
    const skillCounts = profiles.reduce(
      (acc, profile) => {
        profile.skills?.forEach((skill) => {
          acc[skill] = (acc[skill] || 0) + 1
        })
        return acc
      },
      {} as Record<string, number>,
    )

    const topSkills = Object.entries(skillCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 15)
      .map(([skill, count]) => ({ skill, count }))

    // Profile completeness
    const completeness = {
      hasExperience: profiles.filter((p) => p.experience && p.experience.length > 0).length,
      hasEducation: profiles.filter((p) => p.education && p.education.length > 0).length,
      hasSkills: profiles.filter((p) => p.skills && p.skills.length > 0).length,
      hasAwards: profiles.filter((p) => p.awards && p.awards.length > 0).length,
      hasCertifications: profiles.filter((p) => p.certifications && p.certifications.length > 0).length,
      hasProjects: profiles.filter((p) => p.projects && p.projects.length > 0).length,
    }

    // Education levels
    const educationLevels = profiles.reduce(
      (acc, profile) => {
        profile.education?.forEach((edu) => {
          const level =
            edu.degree.toLowerCase().includes("phd") || edu.degree.toLowerCase().includes("doctorate")
              ? "PhD/Doctorate"
              : edu.degree.toLowerCase().includes("master") || edu.degree.toLowerCase().includes("mba")
                ? "Masters"
                : edu.degree.toLowerCase().includes("bachelor")
                  ? "Bachelors"
                  : "Other"
          acc[level] = (acc[level] || 0) + 1
        })
        return acc
      },
      {} as Record<string, number>,
    )

    const educationData = Object.entries(educationLevels).map(([level, count]) => ({ level, count }))

    return {
      topLocations,
      topCompanies,
      topSkills,
      completeness,
      educationData,
      totalProfiles: profiles.length,
    }
  }, [profiles])

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profiles</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalProfiles}</div>
            <p className="text-xs text-muted-foreground">Scraped profiles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Completeness</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                (Object.values(analytics.completeness).reduce((a, b) => a + b, 0) /
                  (analytics.totalProfiles * Object.keys(analytics.completeness).length)) *
                  100,
              )}
              %
            </div>
            <p className="text-xs text-muted-foreground">Profile completeness</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Location</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.topLocations[0]?.location.split(",")[0] || "N/A"}</div>
            <p className="text-xs text-muted-foreground">{analytics.topLocations[0]?.count || 0} profiles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Company</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.topCompanies[0]?.company || "N/A"}</div>
            <p className="text-xs text-muted-foreground">{analytics.topCompanies[0]?.count || 0} profiles</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Locations Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Top Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.topLocations}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="location" angle={-45} textAnchor="end" height={80} fontSize={12} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Education Levels Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Education Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.educationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ level, percent }) => `${level} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {analytics.educationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Profile Completeness */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Completeness Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(analytics.completeness).map(([key, count]) => {
              const percentage = (count / analytics.totalProfiles) * 100
              const label = key
                .replace("has", "")
                .replace(/([A-Z])/g, " $1")
                .trim()

              return (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{label}</span>
                    <span className="text-sm text-muted-foreground">
                      {count}/{analytics.totalProfiles}
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                  <span className="text-xs text-muted-foreground">{percentage.toFixed(1)}% of profiles</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Top Skills */}
      <Card>
        <CardHeader>
          <CardTitle>Most Common Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {analytics.topSkills.map((skill, index) => (
              <Badge key={skill.skill} variant={index < 5 ? "default" : "secondary"} className="text-sm">
                {skill.skill} ({skill.count})
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Companies */}
      <Card>
        <CardHeader>
          <CardTitle>Top Companies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.topCompanies.map((company, index) => (
              <div key={company.company} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                  <span className="text-sm font-medium">{company.company}</span>
                </div>
                <Badge variant="secondary">{company.count} profiles</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
