import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/animate-ui/components/radix/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Notification from '@/components/ui/notification'
import { Separator } from '@/components/ui/separator'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar'
import { TeamSwitcher } from '@/components/ui/team-switcher'
import { authClient } from '@/lib/auth-client'
import { hasUserPermission } from '@/lib/permissions'
import type { userRoleType } from '@/shared/types/UserRole'
import { createFileRoute, Link, Outlet, redirect, Router, useNavigate } from '@tanstack/react-router'
import { AudioWaveform, Baby, Calendar, Calendars, Command, CreditCard, FileText, GalleryVerticalEnd, House, LifeBuoy, LogOut, Settings, Shield, Trophy, User, Users } from 'lucide-react'

export const Route = createFileRoute('/club')({
  component: RouteComponent,
  beforeLoad: ({ context, location}) => {
    if(!context.auth){
      throw redirect({
              to: '/login',
              search: {
                redirect: location.href,
              },
            });
    }
  }
})

function RouteComponent() {

  const teams = [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ];
  
  const { auth } = Route.useRouteContext();
  
  
  console.table(auth);
  
  const userRoles: userRoleType[] = auth?.roles ?? [];
  
  
  const navigate = useNavigate();

  

  return (
    <Outlet />
  )
}
