import { createFileRoute, Outlet } from '@tanstack/react-router'
import { clubQueryOptions, clubStatsQueryOptions } from '@/hooks/queries/club-queries'

export const Route = createFileRoute('/club/dashboard/$club_id')({
  loader: ({ context: { queryClient }, params }) => {
    queryClient.ensureQueryData(clubQueryOptions(params.club_id))
    queryClient.ensureQueryData(clubStatsQueryOptions(params.club_id))
  },
  beforeLoad: ({ params }) => {
    return {
      clubId: params.club_id,
      breadcrumb: `Dashboard / ${params.club_id}` 
    }
  },
  
  component: ClubLayoutComponent,
})

function ClubLayoutComponent() {
  return (
    <Outlet />
  )
}