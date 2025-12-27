import { client } from '@/lib/rpc';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface AddRolesParams {
  userId: string;
  roles: ("owner" | "coach" | "player" | "parent" | "child" | "visitor")[];
}

export function useAddRoles(){
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({userId, roles} : AddRolesParams) => {
      const res = await client.api["user-management"]["signup-user-roles"][":user_id"].$post({
        param: { user_id: userId },
        json: { roles }
      })

      if(!res.ok){
        const errorData = await res.json();
        throw new Error(errorData.error || "Erreur lors de l'ajout des rôles");
      }

      return await res.json();
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['session'] });
      console.log("Rôles mis à jour avec succès !");
    }
  })
}
