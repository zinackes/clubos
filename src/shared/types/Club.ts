import z from "zod";


export const clubSportsValidator = z.enum(
  ["football", "basketball", "volleyball"],
  "Le sport sélectionné est invalide"
)

export const clubValidator = z.object({
  name: z.string().min(1, "Le nom est requis"),
  slug: z.string().min(1, "L'url du club est requis").toLowerCase(),
  directorId: z.string(""),
  category: clubSportsValidator,
  federation: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  isPublic: z.boolean(),
  publicEmail: z.email("L'email public est invalide").min(1, "L'email public est requis"),
  privateEmail: z.email("L'email privé est invalide").optional().nullable(),
  city: z.string().min(1, "La ville est requise"),
  phoneNumber: z.string().min(1, "Le numéro de téléphone est requis"),
  website: z.url("L'URL du site est invalide").optional().nullable().or(z.literal("")),
  headquarters_address: z.string().optional().nullable(),
  logo_url: z.url("L'URL du logo est invalide").optional().nullable(),
  main_color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Couleur invalide").optional().nullable(),
  secondary_color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Couleur invalide").optional().nullable(),
  typography: z.string().optional().nullable(),
  button_radius: z.string().optional().nullable(),
})


export type clubSportsType = z.infer<typeof clubSportsValidator>;
export type clubType = z.infer<typeof clubValidator>;
