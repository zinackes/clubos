// useCreateClub.tsx
import { client } from '@/lib/rpc';
import type { clubType } from '@/shared/types/Club';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateClub() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: clubType) => {
      const formPayload: any = {};
      
      Object.entries(values).forEach(([key, val]) => {
        if (val instanceof File) {
          formPayload[key] = val;
        } 
        else if (key === "customFields" && Array.isArray(val)) {
          formPayload[key] = JSON.stringify(val); 
        }
        else if (val !== null && val !== undefined) {
          formPayload[key] = String(val);
        }
      });

      const res = await client.api["club"]["create"].$post({
        form: formPayload 
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw errorData;
      }

      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
    }
  });
}