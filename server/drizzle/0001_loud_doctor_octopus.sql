CREATE TABLE "club"."club_season" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"club_id" text NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "club"."club" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"director_id" text NOT NULL,
	"category" text NOT NULL,
	"federation" text,
	"description" text,
	"public_email" text NOT NULL,
	"private_email" text NOT NULL,
	"city" text NOT NULL,
	"phone_number" text NOT NULL,
	"website" text,
	"headquarters_address" text,
	"logo_url" text,
	"main_color" text,
	"secondary_color" text,
	"typography" text,
	"button_radius" text,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "club_slug_unique" UNIQUE("slug"),
	CONSTRAINT "club_public_email_unique" UNIQUE("public_email"),
	CONSTRAINT "club_private_email_unique" UNIQUE("private_email")
);
--> statement-breakpoint
CREATE TABLE "club"."custom_field_club" (
	"id" text PRIMARY KEY NOT NULL,
	"field" text NOT NULL,
	"type" "field_type_enum",
	"club_id" text NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "club"."club_season" ADD CONSTRAINT "club_season_club_id_club_id_fk" FOREIGN KEY ("club_id") REFERENCES "club"."club"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "club"."club" ADD CONSTRAINT "club_director_id_user_id_fk" FOREIGN KEY ("director_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "club"."custom_field_club" ADD CONSTRAINT "custom_field_club_club_id_club_id_fk" FOREIGN KEY ("club_id") REFERENCES "club"."club"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "clubSeason_clubId_idx" ON "club"."club_season" USING btree ("club_id");--> statement-breakpoint
CREATE INDEX "club_directorId_idx" ON "club"."club" USING btree ("director_id");--> statement-breakpoint
CREATE INDEX "customFieldClub_clubId_idx" ON "club"."custom_field_club" USING btree ("club_id");