CREATE TABLE "club_invitation_link" (
	"id" text PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"preassigned_team_id" text,
	"expiry_date" timestamp,
	"max_uses" integer,
	"uses" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"is_expired" boolean DEFAULT false NOT NULL,
	"is_used" boolean DEFAULT false NOT NULL,
	"code" text,
	"club_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "club_invitation_link" ADD CONSTRAINT "club_invitation_link_club_id_club_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."club"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "clubInvitationLink_clubId_idx" ON "club_invitation_link" USING btree ("club_id");