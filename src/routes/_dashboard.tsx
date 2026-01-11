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

export const Route = createFileRoute('/_dashboard')({
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
    <SidebarProvider>
      <Sidebar variant='inset' className='font-base'>
        <SidebarHeader>
          <TeamSwitcher teams={teams} />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>
              Général
            </SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem className='space-y-1'>
                <SidebarMenuButton asChild>
                  <Link
                    to="/dashboard"
                    activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground" }}>
                    <House/>
                    <span>Accueil</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuButton asChild>
                  <Link
                    to="/"
                    activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground" }}>
                    <Trophy/>
                    <span>Clubs</span>

                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          {hasUserPermission(userRoles, ["owner"]) && (
            <SidebarGroup>
              <SidebarGroupLabel>
                Communauté
              </SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem className='space-y-1'>
                  <SidebarMenuButton asChild>
                    <Link
                      to="/"
                      activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground" }}>
                      <Users/>
                      <span>Utilisateurs</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          )}

          {hasUserPermission(userRoles, ["parent"]) && (
            <SidebarGroup>
              <SidebarGroupLabel>
                Famille
              </SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem className='space-y-1'>
                  <SidebarMenuButton asChild>
                    <Link
                      to="/"
                      activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground" }}>
                      <Baby/>
                      <span>Enfants</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          )}

          <SidebarGroup>
            <SidebarGroupLabel>
              Planification
            </SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem className='space-y-1'>
                <SidebarMenuButton asChild>
                  <Link
                    to="/"
                    activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground" }}>
                    <Calendar/>
                    <span>Calendrier personnel</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuButton asChild>
                  <Link
                    to="/"
                    activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground" }}>
                    <Calendars/>
                    <span>Événements inter‑clubs</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
          
          {hasUserPermission(userRoles, ["owner"]) && (
            <SidebarGroup>
              <SidebarGroupLabel>
                Administration
              </SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem className='space-y-1'>
                  <SidebarMenuButton asChild>
                    <Link
                      to="/"
                      activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground" }}>
                      <CreditCard/>
                      <span>Finances</span>
                    </Link>
                  </SidebarMenuButton>
                  <SidebarMenuButton asChild>
                    <Link
                      to="/"
                      activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground" }}>
                      <Shield/>
                      <span>Documents Admin</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          )}

          
          <SidebarGroup>
            <SidebarGroupLabel>
              Ressources
            </SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem className='space-y-1'>
                <SidebarMenuButton asChild>
                  <Link
                    to="/"
                    activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground" }}>
                    <FileText/>
                    <span>Documents</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuButton asChild>
                  <Link
                    to="/"
                    activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground" }}>
                    <LifeBuoy/>
                    <span>Aide</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <main className="bg-sidebar relative flex w-full flex-1 flex-col md:peer-data-[variant=inset]:m-[var(--content-margin)]
          md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm
          md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-[var(--content-margin)]">
          <header className='bg-background/40 sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 border-b backdrop-blur-md
            transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) md:rounded-tl-xl md:rounded-tr-xl'>
              <div className='flex w-full items-center gap-1 px-4 lg:gap-2'>
                <SidebarTrigger className="-ml-1" />
                <Separator orientation='vertical' className="!h-5"/>
                <div className='lg:flex-1'>

                </div>
                <div className='ml-auto flex items-center gap-2'>
                  <Notification/>
                  <Separator orientation='vertical' className="!h-5 mx-2"/>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Avatar className="rounded-lg">
                        <AvatarImage
                          src="https://github.com/evilrabbit.png"
                          alt="@evilrabbit"
                        />
                        <AvatarFallback>ER</AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <User/>
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings/>
                        <span>Settings</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={async () => {
                        await authClient.signOut({
                          fetchOptions: {
                            onSuccess: () => {
                              navigate({ to: "/login"});
                            }
                          }
                          
                        })
                      }}>
                        <LogOut/>
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
          </header>
          <div className='bg-muted/40 flex flex-1 flex-col font-base p-6'>
            <Outlet />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
