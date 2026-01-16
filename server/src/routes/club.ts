import { Hono } from 'hono'
import { db } from '..';
import { user } from '../db/schema/user-schema';
import { eq } from 'drizzle-orm';
import { zValidator } from '@hono/zod-validator';
import { userRoleValidator, roleEnum } from "@shared/types/UserRole";
import { userRole } from '../db/schema';
import { clubDbType, clubValidator, CustomFieldDbType } from '@shared/types/Club';
import { clubTable, customFieldClub } from '@db/schema/club-schema';
import { createClient } from '@supabase/supabase-js';
import { ApiResponseError, ApiResponseSuccess } from '@shared/types/ApiResponse';

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

  return c.json(clubs);

})
.get("/get/:club_id", async(c) => {
  const club_id = c.req.param("club_id");

  const club = await db.query.clubTable.findFirst({
    where: eq(clubTable.id, club_id)
  });

  if(!club) return c.json({ error: 'Aucun club trouvé pour cet id'} satisfies ApiResponseError, 404);

  return c.json({ data: club} satisfies ApiResponseSuccess<clubDbType>, 200);

})

export type ClubRoutes = typeof clubRoutes;
