'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { LinkedInProfile } from "@/lib/types"
import { Award, Briefcase, ExternalLink, GraduationCap, Mail, MapPin } from "lucide-react"
import ProfilePage from "./profile-page"

interface ProfileCardProps {
  profile: LinkedInProfile
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const currentJob = profile.experience?.[0]
  const latestEducation = profile.education?.[0]

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback>{getInitials(profile.name || "")}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">{profile.name}</h3>
            {profile.headline && <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{profile.headline}</p>}
            {profile.location && (
              <div className="flex items-center gap-1 mt-2">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{profile.location}</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {currentJob && (
          <div className="flex items-start gap-2">
            <Briefcase className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-medium truncate">{currentJob.title}</p>
              <p className="text-xs text-muted-foreground truncate">{currentJob.company}</p>
            </div>
          </div>
        )}

        {latestEducation && (
          <div className="flex items-start gap-2">
            <GraduationCap className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-medium truncate">{latestEducation.degree}</p>
              <p className="text-xs text-muted-foreground truncate">{latestEducation.institution}</p>
            </div>
          </div>
        )}

        {profile.skills && profile.skills.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium">Skills</p>
            <div className="flex flex-wrap gap-1">
              {profile.skills.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs px-2 py-0">
                  {skill}
                </Badge>
              ))}
              {profile.skills.length > 3 && (
                <Badge variant="outline" className="text-xs px-2 py-0">
                  +{profile.skills.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {profile.awards && profile.awards.length > 0 && (
          <div className="flex items-center gap-1">
            <Award className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {profile.awards.length} award{profile.awards.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Dialog>
            <DialogTrigger asChild> 
              <Button size="sm" variant="outline" className="flex-1 text-xs">
                <ExternalLink className="h-3 w-3 mr-1" />
                View Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Profile</DialogTitle>
              </DialogHeader>
              <ProfilePage profile={profile} /> 
            </DialogContent>
          </Dialog>
            
          {/* create a new page to send email to the profile */}
          <Button size="sm" variant="outline" className="flex-1 text-xs">
            <Mail className="h-3 w-3 mr-1" />
            Contact
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
