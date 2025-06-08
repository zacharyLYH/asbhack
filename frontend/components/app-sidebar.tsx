"use client"

import {
  BarChart3,
  Database,
  Download,
  Filter,
  Settings,
  Users,
  TrendingUp,
  MapPin,
  Briefcase,
  GraduationCap,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface AppSidebarProps {
  currentView: string
  onViewChange: (view: string) => void
  profileCount: number
  totalCount: number
}

const navigationItems = [
  {
    title: "Profiles",
    icon: Users,
    id: "profiles",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    id: "analytics",
  },
]

const quickStats = [
  {
    title: "Locations",
    icon: MapPin,
    count: "45+",
  },
  {
    title: "Companies",
    icon: Briefcase,
    count: "120+",
  },
  {
    title: "Universities",
    icon: GraduationCap,
    count: "80+",
  },
]

export function AppSidebar({ currentView, onViewChange, profileCount, totalCount }: AppSidebarProps) {
  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Database className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">LinkedIn Scraper</h2>
            <p className="text-xs text-muted-foreground">Profile Dashboard</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton onClick={() => onViewChange(item.id)} isActive={currentView === item.id}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Quick Stats</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-3 px-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Profiles</span>
                <Badge variant="secondary">{totalCount}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Filtered</span>
                <Badge variant="outline">{profileCount}</Badge>
              </div>
              {quickStats.map((stat) => (
                <div key={stat.title} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <stat.icon className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{stat.title}</span>
                  </div>
                  <Badge variant="outline">{stat.count}</Badge>
                </div>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
