CREATE TABLE "member_club" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"club_id" text NOT NULL,
	"season_id" text NOT NULL,
	"status" "member_club_status" DEFAULT 'pending' NOT NULL,
	"role" "member_club_role" DEFAULT 'member' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "member_custom_value" (
	"id" text PRIMARY KEY NOT NULL,
	"membership_id" text NOT NULL,
	"custom_field_id" text NOT NULL,
	"value" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "member_document" (
	"id" text PRIMARY KEY NOT NULL,
	"member_club_id" text NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"type" text NOT NULL,
	"status" "document_status" DEFAULT 'pending' NOT NULL,
	"expiry_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "member_payment" (
	"id" text PRIMARY KEY NOT NULL,
	"membership_id" text NOT NULL,
	"amount" integer NOT NULL,
	"currency" text DEFAULT 'EUR' NOT NULL,
	"status" "payment_status" DEFAULT 'pending' NOT NULL,
	"method" text,
	"stripe_payment_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "member_club" ADD CONSTRAINT "member_club_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_club" ADD CONSTRAINT "member_club_club_id_club_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."club"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_club" ADD CONSTRAINT "member_club_season_id_club_season_id_fk" FOREIGN KEY ("season_id") REFERENCES "public"."club_season"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_custom_value" ADD CONSTRAINT "member_custom_value_membership_id_member_club_id_fk" FOREIGN KEY ("membership_id") REFERENCES "public"."member_club"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_custom_value" ADD CONSTRAINT "member_custom_value_custom_field_id_custom_field_club_id_fk" FOREIGN KEY ("custom_field_id") REFERENCES "public"."custom_field_club"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_document" ADD CONSTRAINT "member_document_member_club_id_member_club_id_fk" FOREIGN KEY ("member_club_id") REFERENCES "public"."member_club"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_payment" ADD CONSTRAINT "member_payment_membership_id_member_club_id_fk" FOREIGN KEY ("membership_id") REFERENCES "public"."member_club"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "membership_userId_idx" ON "member_club" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "membership_clubId_idx" ON "member_club" USING btree ("club_id");--> statement-breakpoint
CREATE INDEX "membership_seasonId_idx" ON "member_club" USING btree ("season_id");