import { client } from "@/lib/rpc";
import type { clubDbType, clubStatsType } from "@/shared/types/Club";
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

export const clubsQueryOptions = (userId: string) => 
    queryOptions({
        queryKey: ['userId', userId],
        queryFn: async () : Promise<clubDbType[]> => {
            const res = await client.api.club.get["by-user"][":user_id"].$get({
                param: {
                    user_id: userId
                }
            })

            if (!res.ok){
                throw new Error('Impossible de trouver les clubs');
            }

            const result = await res.json();
            
            return result.data;
        }
})



export const clubStatsQueryOptions = (clubId: string, beginDate?: Date, endDate?: Date, seasonId?: string, comparisonType?: string) => 
    queryOptions({
        queryKey: ['clubId', clubId],
        queryFn: async () : Promise<clubStatsType["data"]> => {
            const comparisonTypeSafe = comparisonType ?? "monthly";
            const now = new Date();
            const firstDayPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const lastDayPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0);

            const beginDateSafe = beginDate?.toISOString() ?? firstDayPreviousMonth.toISOString();
            const endDateSafe = endDate?.toISOString() ?? lastDayPreviousMonth.toISOString();

            const res = await client.api.club.get["statistics"][":club_id"].$get({
                param: {
                    club_id: clubId
                },
                query: {
                    beginDate: beginDateSafe,
                    endDate : endDateSafe,
                    seasonId,
                    comparisonType: comparisonTypeSafe
                }
            })

            if (!res.ok){
                throw new Error('Impossible de trouver les statistiques du club');
            }

            const result = await res.json();
            
            return result.data;
        }
})