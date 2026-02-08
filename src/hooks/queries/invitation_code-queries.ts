import { client } from "@/lib/rpc";
import { queryOptions } from "@tanstack/react-query";



export const invitationsCodesQueryOptions = (clubId: string) => 
    queryOptions({
        queryKey: ['club', clubId, "invitations"],
        queryFn: async () => {


            const res = await client.api.invitation.get[":club_id"].$get({
                param: {
                    club_id: clubId
                }
            })


            if (!res.ok){
                throw new Error("Impossible de trouver des codes d'invitations pour le club");
            }

            const result = await res.json();
            
            return result.data;
        }
})