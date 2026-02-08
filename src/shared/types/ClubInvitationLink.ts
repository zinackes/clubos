import type { ClubInvitationLinkDbType } from "@server/db/schema";
import z from "zod";


export const clubInvitationCodeValidator = z.object({
  label: z.string().min(1, "Le libellé est requis"),
  preassigned_team_id: z.string().optional(),
  expiry_date: z.string().min(1, 'La date d\'expiration est requise'),
  max_uses: z.coerce.number().min(0),
  code: z.string().max(10, "Le code doit contenir au maximum 10 caractères").optional(),
})


export type clubInvitationCodeType = z.infer<typeof clubInvitationCodeValidator>;


export type ClubInvitationCodeDbAndStatsType = ClubInvitationLinkDbType & {
  total_codes: number,
  total_available_codes: number,
  total_nearly_expired_codes: number,
  total_expired_codes: number
} 