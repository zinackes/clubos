import { ClubInvitationLinkDbType, clubInvitationLinkTable } from "@db/schema";
import { zValidator } from "@hono/zod-validator";
import { clubInvitationCodeValidator } from "@shared/types/ClubInvitationLink";
import { Hono } from "hono";
import { db } from "src";
import { eq } from 'drizzle-orm';
import { getUniqueInviteCode } from "src/services/invitation.service";
import { ApiResponseSuccess } from "@shared/types/ApiResponse";


export const invitationCodeRoutes = new Hono()
.post('/create/:club_id', zValidator('form', clubInvitationCodeValidator), async (c) => {
    try {
        const formData = c.req.valid('form');
        const club_id = c.req.param('club_id');

        console.log(club_id);

        if (!club_id) {
            return c.json({ error: "L'id du club est manquant" }, 400);
        }

        const code = await getUniqueInviteCode();
        
        const [codeDb] = await db.insert(clubInvitationLinkTable)
        .values({
            label: formData.label,
            preassigned_team_id: formData.preassigned_team_id,
            expiry_date: formData.expiry_date ? new Date(formData.expiry_date) : null,
            max_uses: formData.max_uses,
            code,
            clubId: club_id
        }).returning();

        return c.json({
            codeDb
        });

    } catch (error) {
        console.error(error);
        return c.json({ error: "Internal server error" }, 500);
    }
})
.get('/get/:club_id', async (c) => {
    try {
        
        const club_id = c.req.param('club_id');

        if (!club_id) {
            return c.json({ error: "L'id du club est manquant" }, 400);
        }

        const invitations_codes = await db.query.clubInvitationLinkTable.findMany({
            where: eq(clubInvitationLinkTable.clubId, club_id)
        })

        return c.json({ data: invitations_codes} satisfies ApiResponseSuccess<ClubInvitationLinkDbType[]>, 200);

    } catch (error) {
        console.error(error);
        return c.json({ error: "Internal server error" }, 500);
    }
})


export type InvitationCodeRoutes = typeof invitationCodeRoutes;