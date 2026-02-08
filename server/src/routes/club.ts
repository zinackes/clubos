import { Hono } from 'hono'
import { db } from '..';
import { user } from '../db/schema/user-schema';
import { and, count, eq, gte, lte, sql, sum } from 'drizzle-orm';
import { zValidator } from '@hono/zod-validator';
import { userRoleValidator, roleEnum } from "@shared/types/UserRole";
import { userRole } from '../db/schema';
import { clubDbType, clubValidator, CustomFieldDbType } from '@shared/types/Club';
import { clubTable, customFieldClub } from '@db/schema/club-schema';
import { createClient } from '@supabase/supabase-js';
import { ApiResponseError, ApiResponseSuccess } from '@shared/types/ApiResponse';
import { memberClubTable, memberDocumentTable, memberPaymentTable } from '@db/schema/member-club-schema';
import z, { number } from 'zod';
import { calculateTrend } from 'src/utils/math';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const clubRoutes = new Hono()
.post(
  "/create",
  zValidator("form", clubValidator),
  async (c) => {
    try {
      const formData = c.req.valid("form");

      const existing = await Promise.all([
        db.query.clubTable.findFirst({ where: eq(clubTable.slug, formData.slug) }),
        db.query.clubTable.findFirst({ where: eq(clubTable.public_email, formData.publicEmail) }),
        db.query.clubTable.findFirst({ where: eq(clubTable.private_email, formData.privateEmail) })
      ]);

      if (existing[0]) return c.json({ error: "L'identifiant unique est déjà utilisé.", errorField: "slug" } satisfies ApiResponseError, 400);
      if (existing[1]) return c.json({ error: "L'email public est déjà utilisé.", errorField: "publicEmail" } satisfies ApiResponseError, 400);
      if (existing[2]) return c.json({ error: "L'email privé est déjà utilisé.", errorField: "privateEmail" } satisfies ApiResponseError, 400);

      let logoUrl = null;
      if (formData.logo_file instanceof File){
        const file = formData.logo_file;
        const fileName = `${crypto.randomUUID()}.${file.name.split(".").pop()}`;
        const filePath = `logos/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('club-logos')
          .upload(filePath, file);

        if (uploadError) return c.json({ error: "Erreur upload logo" } satisfies ApiResponseError, 500);
  
        logoUrl = supabase.storage.from('club-logos').getPublicUrl(filePath).data.publicUrl;
      }

      const [newClub] = await db.insert(clubTable).values({
        name: formData.name,
        slug: formData.slug,
        directorId: formData.directorId,
        category: formData.category,
        federation: formData.federation,
        description: formData.description,
        isPublic: formData.isPublic,
        public_email: formData.publicEmail,
        private_email: formData.privateEmail,
        city: formData.city,
        phone_number: formData.phoneNumber,
        website: formData.website,
        address: formData.address,
        logo_url: logoUrl
      }).returning();

      if (!newClub) return c.json({ error: "Le club n'a pas pu être créé" }, 400);

      let createdCustomFields: CustomFieldDbType[]  = [];
      console.log(formData.customFields);
      if (formData.customFields && formData.customFields.length > 0) {
        try {
          const fieldsToInsert = formData.customFields.map(field => ({
            field: field.label,
            type: field.type,
            required: field.required,
            clubId: newClub.id
          }));

          createdCustomFields = await db.insert(customFieldClub).values(fieldsToInsert).returning();
        } catch (e) {
          console.error("Erreur champs custom:", e);
          return c.json({ error: "Les champs custom n'ont pas pu être créés" }, 400);
        }
      }

      return c.json({ 
        message: `Le club ${formData.name} a bien été créé`, 
        data: {
          ...newClub,
          customFields: createdCustomFields
        }
      }, 200);

    } catch (error) {
      console.error(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }
)
.get("/get/by-user/:user_id", async(c) => {
  const user_id = c.req.param("user_id");

  const clubs = await db.query.clubTable.findMany({
    where: eq(clubTable.directorId, user_id)
  });

  if(!clubs) return c.json({ error: "Aucun club trouvé pour l'utilisateur"} satisfies ApiResponseError, 404);

  return c.json({data: clubs} satisfies ApiResponseSuccess<clubDbType[]>, 200);

})
.get("/get/:club_id", async(c) => {
  const club_id = c.req.param("club_id");

  const club = await db.query.clubTable.findFirst({
    where: eq(clubTable.id, club_id)
  });

  if(!club) return c.json({ error: 'Aucun club trouvé pour cet id'} satisfies ApiResponseError, 404);

  return c.json({ data: club} satisfies ApiResponseSuccess<clubDbType>, 200);
})
.get("/get/statistics/:club_id", 
  zValidator(
    "query",
    z.object({
      beginDate: z.string(),
      endDate: z.string(),
      seasonId: z.string().optional(),
      comparisonType: z.string(),
    })
  ),
  async (c) => {
    const club_id = c.req.param("club_id");
    const { beginDate, endDate, seasonId, comparisonType } = c.req.valid("query");

    const startOfDay = new Date(beginDate);
    const endOfDay = new Date(endDate);
    let beginDateComparison: Date | null = null;
    let endDateComparison: Date | null = null;

    if (comparisonType === "monthly") {
      beginDateComparison = new Date(startOfDay);
      beginDateComparison.setMonth(beginDateComparison.getMonth() - 1);
      
      endDateComparison = new Date(endOfDay);
      endDateComparison.setMonth(endDateComparison.getMonth() - 1);
    }

    // Préparation de la requête
    const queryStats = db.select({
      totalMembers: count(memberClubTable.id).mapWith(Number),
      totalRevenue: sum(memberPaymentTable.amount).mapWith(Number),
      pendingDocs: sql<number>`count(${memberDocumentTable.id}) filter (where ${memberDocumentTable.status} = 'pending')`.mapWith(Number)
    })
    .from(memberClubTable)
    .leftJoin(memberPaymentTable, eq(memberClubTable.id, memberPaymentTable.membershipId))
    .leftJoin(memberDocumentTable, eq(memberClubTable.id, memberDocumentTable.memberClubId))
    .where(
      and(
        eq(memberClubTable.clubId, sql.placeholder('clubId')),
        gte(memberClubTable.createdAt, sql.placeholder('start')),
        lte(memberClubTable.createdAt, sql.placeholder('end'))
        // Note: Si tu veux ajouter seasonId ici, il faut l'ajouter au placeholder
      )
    )
    .prepare("get_stats");

    // Exécution période actuelle
    const [stats] = await queryStats.execute({
      clubId: club_id,
      start: startOfDay.toISOString(), 
      end: endOfDay.toISOString()
    });

    let statsToCompare = { totalMembers: 0, totalRevenue: 0, pendingDocs: 0 };
    if (beginDateComparison && endDateComparison) {
      const [res] = await queryStats.execute({
        clubId: club_id,
        start: beginDateComparison.toISOString(),
        end: endDateComparison.toISOString()
      });
      if (res) statsToCompare = res;
    }

    const calculatedStats = {
      totalMembers: {
        total: stats.totalMembers,
        ...calculateTrend(stats.totalMembers, statsToCompare.totalMembers)
      },
      totalRevenue: {
        total: stats.totalRevenue,
        ...calculateTrend(stats.totalRevenue, statsToCompare.totalRevenue)
      },
      pendingDocs: {
        total: stats.pendingDocs,
        ...calculateTrend(stats.pendingDocs, statsToCompare.pendingDocs)
      }
    };

    return c.json({ data: calculatedStats }, 200);
  }
)

export type ClubRoutes = typeof clubRoutes;
