import { Button } from '@/components/ui/button'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Plus } from 'lucide-react'

export const Route = createFileRoute('/_dashboard/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate();

  
  return (
    <div>
      <div className='flex justify-between'>
        <h1 className='font-title text-3xl font-bold'>
          Tableau de bord
        </h1>
        <div>
          <Button variant="outline" onClick={() => {
            navigate({ to : "/create/club"})
          }}>
            <Plus/>
              Créer un club
          </Button>
        </div>
      </div>
    </div>
  )
}
