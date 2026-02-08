import { boolean, index, integer, pgEnum, pgSchema, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { timestamps } from "../../utils/timestamps";
import { user } from "./user-schema";

export const fieldTypeEnum = pgEnum("field_type_enum", ["text", "email", "boolean", "phone_number", "date", "integer", "file"]);

export const clubTable = pgTable(
  "club",
  {
    id: text("id").primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    directorId: text("director_id").notNull().references(() => user.id, { onDelete: "cascade"}),
    category: text("category").notNull(),
    federation: text("federation"),
    description: text("description"),
    isPublic: boolean("is_public").notNull(),
    public_email: text("public_email").notNull().unique(), // For people to contact the club
    private_email: text("private_email").notNull().unique(), // To receive email from us
    city: text("city").notNull(),
    phone_number: text("phone_number").notNull(),
    website: text("website"),
    address: text("address"),
    logo_url: text("logo_url"),
    ...timestamps
  },
  (table) => [index("club_directorId_idx").on(table.directorId)],
)

export const customFieldClub = pgTable(
  "custom_field_club",
  {
    id: text("id").primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    field: text("field").notNull(),
    type: fieldTypeEnum("type").notNull(),
    required: boolean("required").notNull().default(false),
    clubId: text("club_id").notNull().references(() => clubTable.id, { onDelete: "cascade"}),
    ...timestamps
  },
  (table) => [index("customFieldClub_clubId_idx").on(table.clubId)],
)

export const clubSeason = pgTable(
  "club_season",
  {
    id: text("id").primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    clubId: text("club_id").notNull().references(() => clubTable.id, { onDelete: "cascade"}),
    ...timestamps
  },
  (table) => [index("clubSeason_clubId_idx").on(table.clubId)]
)


export const clubInvitationLinkTable = pgTable(
  "club_invitation_link",
  {
    id: text("id").primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    label: text("label").notNull(),
    preassigned_team_id: text("preassigned_team_id"),
    expiry_date: timestamp("expiry_date"),
    max_uses: integer("max_uses"),
    uses: integer("uses").notNull().default(0),
    is_active: boolean("is_active").notNull().default(true),
    is_deleted: boolean("is_deleted").notNull().default(false),
    is_expired: boolean("is_expired").notNull().default(false),
    is_used: boolean("is_used").notNull().default(false),
    code: text("code"),
    clubId: text("club_id").notNull().references(() => clubTable.id, { onDelete: "cascade"}),
    ...timestamps
  },
  (table) => [index("clubInvitationLink_clubId_idx").on(table.clubId)]
)
