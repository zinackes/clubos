import { clubQueryOptions } from '@/hooks/queries/club-queries';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/club/dashboard/$club_id/')({
  component: RouteComponent,
})

function RouteComponent() {

  const {club_id} = Route.useParams();

  const { data: club, isPending, isSuccess, isError} = useQuery(clubQueryOptions(club_id));

  if(isPending) return <p>Ca charge mdrr</p>

  console.log(club);
  
  return (
    <div>
      <div className='flex justify-between'>
        <h1 className='font-title text-3xl font-bold'>
          {club.name}
        </h1>
      </div>
    </div>
  )
}
