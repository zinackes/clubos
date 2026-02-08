DROP VIEW "public"."club_invitation_link_view";--> statement-breakpoint
CREATE VIEW "public"."club_invitation_link_view" AS (select "id", "label", "code", "expiry_date", "max_uses", "uses", "is_archived", "club_id", 
        ("expiry_date" IS NOT NULL AND "expiry_date" < NOW())
       as "is_active", 
        ("expiry_date" IS NOT NULL AND "expiry_date" > NOW())
       as "is_expired", 
      ("expiry_date" IS NOT NULL 
       AND "expiry_date" > NOW() 
       AND "expiry_date" <= NOW() + INTERVAL '3 days')
     as "is_nearly_expired", 
        ("max_uses" > 0 AND "uses" >= "max_uses")
       as "is_full" from "club_invitation_link");