import { index, integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user-schema";
import { clubSeason, clubTable, customFieldClub } from "./club-schema";
import { timestamps } from "src/utils/timestamps";

export const memberClubStatusEnum = pgEnum("member_club_status", ["pending", "active", "rejected", "archived"]);

export const memberClubRoleEnum = pgEnum("member_club_role", ["member"]);

export const documentStatusEnum = pgEnum("document_status", ["pending", "validated", "rejected", "expired"]);

export const paymentStatusEnum = pgEnum("payment_status", ["pending", "paid", "failed", "refunded"]);


export const memberClubTable = pgTable(
    "member_club",
    {
        id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
        userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade"}),
        clubId: text("club_id").notNull().references(() => clubTable.id, { onDelete: "cascade"}),
        seasonId: text("season_id").notNull().references(() => clubSeason.id, { onDelete: "cascade"}),

        status: memberClubStatusEnum("status").notNull().default("pending"),
        role: memberClubRoleEnum("role").notNull().default("member"),

        ...timestamps
    },
    (table) => [
        index("membership_userId_idx").on(table.userId),
        index("membership_clubId_idx").on(table.clubId),
        index("membership_seasonId_idx").on(table.seasonId),
    ]
)

export const memberDocumentTable = pgTable(
    "member_document",
    {
      id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
      memberClubId: text("member_club_id").notNull().references(() => memberClubTable.id, { onDelete: "cascade" }),
      
      name: text("name").notNull(),
      url: text("url").notNull(),
      type: text("type").notNull(),
      status: documentStatusEnum("status").notNull().default("pending"),
      
      expiryDate: timestamp("expiry_date"),
      ...timestamps
    }
);


export const memberPaymentTable = pgTable(
    "member_payment",
    {
      id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
      membershipId: text("membership_id").notNull().references(() => memberClubTable.id, { onDelete: "cascade" }),
      
      amount: integer("amount").notNull(),
      currency: text("currency").notNull().default("EUR"),
      status: paymentStatusEnum("status").notNull().default("pending"),
      method: text("method"),
      
      stripePaymentId: text("stripe_payment_id"),
      ...timestamps
    }
);
  
export const memberCustomValueTable = pgTable(
    "member_custom_value",
    {
      id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
      membershipId: text("membership_id").notNull().references(() => memberClubTable.id, { onDelete: "cascade" }),
      customFieldId: text("custom_field_id").notNull().references(() => customFieldClub.id, { onDelete: "cascade" }),
      
      value: text("value").notNull(),
      ...timestamps
    }
);