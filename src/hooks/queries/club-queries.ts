import { client } from "@/lib/rpc";
import { queryOptions } from "@tanstack/react-query";


export const clubQueryOptions = (clubId: string) => 
    queryOptions({
        queryKey: ['club', clubId],
        queryFn: async () => {
            const res = await client.api.club.get[":club_id"].$get({
                param: {
                    club_id: clubId
                }
            })

            if (!res.ok){
                throw new Error('Impossible de trouver le club');
            }

            const result = await res.json();
            
            return result.data;
        }
    })