import { columns } from '@/components/invitation_code/columns';
import { DataTable } from '@/components/ui/table/data-table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import FieldInfo from '@/components/ui/FieldInfo';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { clubQueryOptions } from '@/hooks/queries/club-queries';
import { invitationsCodesQueryOptions } from '@/hooks/queries/invitation_code-queries';
import { useCreateInvitationCode } from '@/hooks/requests/useCreateInvitationCode';
import { cn } from '@/lib/utils';
import { clubInvitationCodeValidator, type clubInvitationCodeType } from '@/shared/types/ClubInvitationLink';
import { useForm } from '@tanstack/react-form';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'
import { CalendarDays, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const Route = createFileRoute(
  '/club/dashboard/$club_id/invitation_code',
)({
  component: RouteComponent,
  loader: ({ context: { queryClient }, params }) => {
    queryClient.ensureQueryData(invitationsCodesQueryOptions(params.club_id))
  },
})

function RouteComponent() {

  const {club_id} = Route.useParams();

  const { auth } = Route.useRouteContext();

  const { data: club, isPending, isSuccess, isError} = useSuspenseQuery(clubQueryOptions(club_id));

  const { data: codes} = useSuspenseQuery(invitationsCodesQueryOptions(club_id));


  const { mutate, error} =  useCreateInvitationCode();

  const form = useForm({
    defaultValues: {
      label: "",
      preassigned_team_id: "",
      expiry_date: "",
      max_uses: 0,
      code: "",
    } as clubInvitationCodeType,
    onSubmit: async (values) => {
      console.log(values);

      console.log(club);

      mutate({ data: values.value, club_id: club.id})
    },
    validators: {
      onSubmit: clubInvitationCodeValidator,
    }
  })

  const getDateInDays = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  return (
    
    <div className='space-y-3'>
      <div className='flex justify-between'>
        <h1 className='font-title text-3xl font-bold'>
          Vos liens d'invitation
        </h1>
        <Dialog>
          <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className='size-4' />
                Créer un lien d'invitation
              </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Créer un lien d'invitation
                  </DialogTitle>
                  <DialogDescription>
                    Créez un lien d'invitation pour inviter des utilisateurs à rejoindre votre club.
                  </DialogDescription>
                </DialogHeader>

                
              <form.Field
                name="label"
                children={(field) => (
                  <div className="space-y-3">
                    <Label>Nom de l'invitation</Label>
                    <Input
                      type="text"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldInfo field={field} />
                  </div>
                )}
              />

                <form.Field
                  name="preassigned_team_id"
                  children={(field: any) => (
                    <div className="flex-1">
                      <Label htmlFor="preassigned_team_id">Equipe pré-assignée</Label>
                      <Select
                        value={field.state.value}
                        onValueChange={(value) => field.handleChange(value as any)}
                      >
                        <SelectTrigger 
                          id="preassigned_team_id"
                          onBlur={field.handleBlur}
                          className={`w-full mt-2 ${field.state.meta.errors.length > 0 && field.state.meta.isToucheds ? `border-destructive` : ``}`}
                        >
                          <SelectValue placeholder="Sélectionnez une équipe" />
                        </SelectTrigger>
                        <SelectContent position='popper'>
                          <SelectItem value="football">Football</SelectItem>
                          <SelectItem value="basketball">Basketball</SelectItem>
                          <SelectItem value="volleyball">Volleyball</SelectItem>
                        </SelectContent>
                      </Select>
                      <FieldInfo field={field} />
                    </div>
                  )}
                />

<form.Field
                name="expiry_date"
                children={(field) => {
                  const date7 = getDateInDays(7);
                  const date30 = getDateInDays(30);
                  const date90 = getDateInDays(90);
                  
                  const isCustom = field.state.value && field.state.value !== date7 && field.state.value !== date30 && field.state.value !== date90;

                  return (
                    <div className="space-y-3">
                      <Label>Expiration du lien</Label>
                      
                      {/* Grille de choix rapides */}
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { label: '7 jours', value: date7 },
                          { label: '30 jours', value: date30 },
                          { label: '90 jours', value: date90 },
                          { label: 'Autre', value: 'custom' },
                        ].map((option) => {
                          const isActive = option.value === 'custom' 
                            ? isCustom 
                            : field.state.value === option.value;

                          return (
                            <button
                              key={option.label}
                              type="button"
                              onClick={() => {
                                if (option.value === 'custom') {
                                  if (!isCustom) field.handleChange(""); 
                                } else {
                                  field.handleChange(option.value);
                                }
                              }}
                              className={cn(
                                "flex flex-col items-center justify-center py-2 px-1 rounded-md border text-sm transition-all hover:bg-accent",
                                isActive 
                                  ? "border-primary bg-primary/10 text-primary font-medium ring-1 ring-primary" 
                                  : "border-input bg-transparent text-muted-foreground"
                              )}
                            >
                              {option.label}
                            </button>
                          );
                        })}
                      </div>

                      {isCustom || !field.state.value ? (
                        <div className="relative animate-in fade-in zoom-in-95 duration-200">
                          <CalendarDays className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="date"
                            min={new Date().toISOString().split('T')[0]}
                            value={field.state.value ? String(field.state.value).split('T')[0] : ''}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="pl-9"
                          />
                        </div>
                      ) : null}
                      
                      <FieldInfo field={field} />
                    </div>
                  );
                }}
              />

              <form.Field
                name="max_uses"
                children={(field) => (
                  <div className="space-y-3">
                    <Label>Nombre maximum d'utilisations (0 pour illimité)</Label>
                    <Input
                      type="number"
                      value={field.state.value}
                      min={0}
                      onChange={(e) => field.handleChange(Number(e.target.value))}
                    />
                    <FieldInfo field={field} />
                  </div>
                )}
              />

              <form.Field
                name="code"
                children={(field) => (
                  <div className="space-y-3">
                    <Label>Code personnalisé</Label>
                    <Input
                      type="text"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldInfo field={field} />
                  </div>
                )}
              />
              <Button
              
                onClick={async (e) => {
                  await form.handleSubmit();
                }}
               type="submit">Créer le lien d'invitation</Button>
            </DialogContent>
          </form>
        </Dialog>
      </div>

      <div>
        <DataTable data={codes} columns={columns}/>
      </div>
    </div>
  )
}
