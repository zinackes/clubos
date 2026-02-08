ALTER TABLE "club_invitation_link" RENAME COLUMN "is_deleted" TO "is_archived";--> statement-breakpoint
ALTER TABLE "club_invitation_link" DROP COLUMN "is_expired";--> statement-breakpoint
ALTER TABLE "club_invitation_link" DROP COLUMN "is_used";--> statement-breakpoint
CREATE VIEW "public"."club_invitation_link_view" AS (select "id", "label", "code", "expiry_date", "max_uses", "uses", "is_active", "is_archived", "club_id", 
        ("expiry_date" IS NOT NULL AND "expiry_date" < NOW())
       as "is_expired", 
        ("expiry_date" IS NOT NULL 
         AND "expiry_date" BETWEEN NOW() AND (NOW() + INTERVAL '3 days'))
       as "is_nearly_expired", 
        ("max_uses" > 0 AND "uses" >= "max_uses")
       as "is_full" from "club_invitation_link");