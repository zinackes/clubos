import { ClubInvitationLinkDbType, clubInvitationLinkTable, clubInvitationLinkView } from "@db/schema";
import { zValidator } from "@hono/zod-validator";
import { ClubInvitationCodeDbAndStatsType, clubInvitationCodeValidator } from "@shared/types/ClubInvitationLink";
import { Hono } from "hono";
import { db } from "src";
import { eq, sql } from 'drizzle-orm';
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
            data: codeDb
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

        
        const [invitationRows, statsRows] = await Promise.all([
            db.select().from(clubInvitationLinkView).where(eq(clubInvitationLinkView.clubId, club_id)),
    
            db.select({
                total_codes: sql<number>`count(*)`,
                total_available_codes: sql<number>`count(*) filter (where is_active = true AND is_full = false)`,
                total_nearly_expired_codes: sql<number>`count(*) filter (where is_nearly_expired = true)`,
                total_expired_codes: sql<number>`count(*) filter (where is_expired = true)`
            })
            .from(clubInvitationLinkView)
            .where(eq(clubInvitationLinkView.clubId, club_id))
        ]);
    
        const stats = statsRows[0];

        return c.json({ data: invitationRows, stats: {
            total_codes: Number(stats.total_codes),
            total_available_codes: Number(stats.total_available_codes),
            total_nearly_expired_codes: Number(stats.total_nearly_expired_codes),
            total_expired_codes: Number(stats.total_expired_codes)
        }}, 200);

    } catch (error) {
        console.error(error);
        return c.json({ error: "Internal server error" }, 500);
    }
})


export type InvitationCodeRoutes = typeof invitationCodeRoutes;