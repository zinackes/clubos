import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { clubsQueryOptions } from '@/hooks/queries/club-queries';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/clubs')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate();

  const { auth } = Route.useRouteContext();

  console.log("clubs", typeof auth.user.id);

  const { data: clubs, isPending, isSuccess, isError} = useQuery(clubsQueryOptions(auth.user.id));

  if (isPending) return <p>Chargement des clubs...</p>;

  if (isError) return <p>Une erreur est survenue</p>;

  const goToClub = (club_id: string) => {
    navigate({
      to: '/club/dashboard/$club_id', 
      params: {
        club_id: club_id,
      },
    });
  }

  return (
    <div className='space-y-3'>
      <div className='flex justify-between'>
        <h1 className='font-title text-3xl font-bold'>
          Clubs
        </h1>
      </div>
      <div className='grid grid-cols-4 gap-5'>
        {clubs.map((club, index : number) => (
          <Card key={index} onClick={() => goToClub(club.id)}>
            <CardHeader>
              <CardTitle>
                {club.name}
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
