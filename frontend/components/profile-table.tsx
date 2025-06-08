'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { LinkedInProfile } from "@/lib/types"
import { ExternalLink, Mail } from "lucide-react"

interface ProfileTableProps {
  profiles: LinkedInProfile[]
}

export function ProfileTable({ profiles }: ProfileTableProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Profile</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Current Role</TableHead>
            <TableHead>Education</TableHead>
            <TableHead>Skills</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profiles.map((profile, index) => {
            const currentJob = profile.experience?.[0]
            const latestEducation = profile.education?.[0]

            return (
              <TableRow key={profile.linkedinUrl || `profile-${index}`}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile.profileImage || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">{getInitials(profile.name || "")}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{profile.name}</p>
                      {profile.headline && (
                        <p className="text-xs text-muted-foreground line-clamp-1 max-w-xs">{profile.headline}</p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{profile.location || "—"}</span>
                </TableCell>
                <TableCell>
                  {currentJob ? (
                    <div>
                      <p className="text-sm font-medium">{currentJob.title}</p>
                      <p className="text-xs text-muted-foreground">{currentJob.company}</p>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {latestEducation ? (
                    <div>
                      <p className="text-sm font-medium">{latestEducation.degree}</p>
                      <p className="text-xs text-muted-foreground">{latestEducation.institution}</p>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {profile.skills && profile.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {profile.skills.slice(0, 2).map((skill, skillIndex) => (
                        <Badge key={`${profile.linkedinUrl}-skill-${skillIndex}`} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {profile.skills.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{profile.skills.length - 2}
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Mail className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
