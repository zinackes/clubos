import BadgeSuccess from '@/components/BadgeSuccess';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { clubQueryOptions, clubStatsQueryOptions } from '@/hooks/queries/club-queries';
import { useQuery, useSuspenseQueries, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowDownRight, ArrowUpRight, Info, Users } from 'lucide-react';

export const Route = createFileRoute('/club/dashboard/$club_id/')({
  component: RouteComponent,
})

function RouteComponent() {

  const {club_id} = Route.useParams();

  const { data: club, isPending, isSuccess, isError} = useSuspenseQuery(clubQueryOptions(club_id));

  const { data: stats, isPending: isStatsPending, isError: isStatsError} = useSuspenseQuery(clubStatsQueryOptions(club_id));
  
  console.log(stats);

  return (
    <div className='space-y-3'>
      <div className='flex justify-between'>
        <h1 className='font-title text-3xl font-bold'>
          {club.name}
        </h1>
      </div>
      <div className='grid grid-cols-3 gap-5'>
        <Card className='shadow-none'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
                <div className='p-2 bg-slate-100 rounded'>
                    <Users className='text-slate-600' size={13}/>
                </div>
                <h4>Total Adhérents</h4>
                <Tooltip>
                  <TooltipTrigger className='ml-auto'>
                      <Info  size={13} className='text-slate-600'/>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Nombre d'Adhérents</p>
                  </TooltipContent>
                </Tooltip>
            </CardTitle>
            <CardContent className='px-0 flex items-center gap-3'>
              <p className='font-medium font-title text-3xl'>{stats.totalMembers.total}</p>
              <Badge 
                className='rounded-sm flex items-center gap-1 px-1.5 py-0.5' 
                variant={stats.totalMembers.isPositive ? "success_outline" : "destructive_outline"}
              >
                <span>
                  {Math.abs(stats.totalMembers.percentage)}%
                </span>
                
                {stats.totalMembers.isPositive ? (
                  <ArrowUpRight size={14} strokeWidth={2.5} />
                ) : (
                  <ArrowDownRight size={14} strokeWidth={2.5} />
                )}
              </Badge>
            </CardContent>
          </CardHeader>
        </Card>
        <Card className='shadow-none'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
                <div className='p-2 bg-slate-100 rounded'>
                    <Users className='text-slate-600' size={13}/>
                </div>
                <h4>Revenues totaux</h4>
                <Tooltip>
                  <TooltipTrigger className='ml-auto'>
                      <Info  size={13} className='text-slate-600'/>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Nombre d'Adhérents</p>
                  </TooltipContent>
                </Tooltip>
            </CardTitle>
            <CardContent className='px-0 flex items-center gap-3'>
              <p className='font-medium font-title text-3xl'>{stats.totalRevenue.total ?? 0}</p>
              <Badge 
                className='rounded-sm flex items-center gap-1 px-1.5 py-0.5' 
                variant={stats.totalRevenue.isPositive ? "success_outline" : "destructive_outline"}
              >
                <span>
                  {Math.abs(stats.totalRevenue.percentage)}%
                </span>
                
                {stats.totalRevenue.isPositive ? (
                  <ArrowUpRight size={14} strokeWidth={2.5} />
                ) : (
                  <ArrowDownRight size={14} strokeWidth={2.5} />
                )}
              </Badge>
            </CardContent>
          </CardHeader>
        </Card>
        
        <Card className='shadow-none'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
                <div className='p-2 bg-slate-100 rounded'>
                    <Users className='text-slate-600' size={13}/>
                </div>
                <h4>Dossiers en attentes</h4>
                <Tooltip>
                  <TooltipTrigger className='ml-auto'>
                      <Info  size={13} className='text-slate-600'/>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Nombre de dossiers qui sont en attentes</p>
                  </TooltipContent>
                </Tooltip>
            </CardTitle>
            <CardContent className='px-0 flex items-center gap-3'>
              <p className='font-medium font-title text-3xl'>{stats.pendingDocs.total}</p>
              <Badge 
                className='rounded-sm flex items-center gap-1 px-1.5 py-0.5' 
                variant={stats.pendingDocs.isPositive ? "success_outline" : "destructive_outline"}
              >
                <span>
                  {Math.abs(stats.pendingDocs.percentage)}%
                </span>
                
                {stats.pendingDocs.isPositive ? (
                  <ArrowUpRight size={14} strokeWidth={2.5} />
                ) : (
                  <ArrowDownRight size={14} strokeWidth={2.5} />
                )}
              </Badge>
            </CardContent>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
