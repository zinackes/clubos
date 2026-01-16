import z from "zod";


export const clubSportsValidator = z.enum(
  ["football", "basketball", "volleyball"],
  "Le sport sélectionné est invalide"
)

export const customFieldTypeValidator = z.enum(
  ["text", "email", "boolean", "phone_number", "date", "integer", "file"],
  "Le type sélectionné est invalide"
)

export const customFieldValidator = z.preprocess((val) => {
  console.log(typeof val === "string");
  if (typeof val === "string") {
    console.log(JSON.parse(val));
    try {
      console.log(JSON.parse(val))
      return JSON.parse(val);
    } catch {
      console.log("marche pas");
      return val;
    }
  }
  return val;
}, z.array(
  z.object({
    label: z.string().min(1, "Le libellé est requis"),
    type: customFieldTypeValidator,
    required: z.boolean().default(false),
  })
).optional().default([]));

export const clubValidator = z.object({
  name: z.string().min(1, "Le nom est requis"),
  slug: z.string().min(1, "L'url du club est requis").toLowerCase(),
  directorId: z.string(""),
  category: clubSportsValidator,
  federation: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  isPublic: z.preprocess((val) => {
    if (val === "true") return true;
    if (val === "false") return false;
    return val;
  }, z.boolean()),
  publicEmail: z.email("L'email public est invalide").min(1, "L'email public est requis"),
  privateEmail: z.email("L'email privé est invalide").min(1, "L'email public est requis"),
  city: z.string().min(1, "La ville est requise"),
  phoneNumber: z.string().min(1, "Le numéro de téléphone est requis"),
  website: z.url("L'URL du site est invalide").optional().nullable().or(z.literal("")),
  address: z.string().optional().nullable(),
  logo_file: z.any().refine((file) => !file || file instanceof File || file instanceof Blob, "Fichier invalide")
  .nullable(),
  logo_url: z.string().optional().nullable(),
  seasonName: z.string().optional().nullable(),
  seasonStartDate: z.string().min(1, "Date de début requise"),
  seasonEndDate: z.string().min(1, "Date de fin requise"),
  customFields: customFieldValidator
}).refine((data) => {
  const start = new Date(data.seasonStartDate);
  const end = new Date(data.seasonEndDate);
  return end > start;
}, {
  message: "La date de fin doit être après la date de début",
  path: ["seasonEndDate"],
});


export type clubSportsType = z.infer<typeof clubSportsValidator>;
export type customFieldType = z.infer<typeof customFieldTypeValidator>;
export type clubType = z.infer<typeof clubValidator>;

export type clubDbType = {
  id: string;
  name: string;
  slug: string;
  directorId: string;
  category: string;
  federation: string | null;
  description: string | null;
  isPublic: boolean;
  public_email: string;
  private_email: string;
  city: string;
  phone_number: string;
  website: string | null;
  address: string | null;
  logo_url: string | null;
  createdAt: Date;
  updatedAt: Date; 
};

export type CustomFieldDbType = {
  id: string,
  field: string,
  type: customFieldType,
  required: boolean,
  clubId: string,
  createdAt: Date,
  updatedAt: Date
}
