import { client } from "@/lib/rpc";
import type { clubInvitationCodeType } from "@/shared/types/ClubInvitationLink";

// Fonction pure asynchrone
export const createInvitationCodeFn = async ({ data, club_id }: { data: clubInvitationCodeType, club_id: string }) => {
  console.log("Creating code for club:", club_id);

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
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Erreur lors de la création du code");
  }

  return await res.json();
};