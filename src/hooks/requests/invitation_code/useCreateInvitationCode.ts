import { client } from "@/lib/rpc";
import type { clubInvitationCodeType } from "@/shared/types/ClubInvitationLink";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export function useCreateInvitationCode(){
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async ({data, club_id} : { data: clubInvitationCodeType, club_id: number}) => {

        console.log(club_id);

        const res = await client.api["invitation"]["create"][":club_id"].$post({
          param: {
            club_id: club_id
          },
          form: { 
            label: data.label,
            preassigned_team_id: data.preassigned_team_id,
            expiry_date: data.expiry_date,
            max_uses: Number(data.max_uses),
            code: data.code
           }
        })
  
        if(!res.ok){
          const errorData = await res.json();
          throw new Error(errorData.error || "Erreur lors de la création du code d'invitation");
        }
  
        return await res.json();
      },
      onSuccess: async (data) => {
        await queryClient.invalidateQueries({ queryKey: ['session'] });
        console.log("Code de création créé avec succès !", data);
      }
    })
  }
  