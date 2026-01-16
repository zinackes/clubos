ALTER TABLE "custom_field_club" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."field_type_enum";--> statement-breakpoint
CREATE TYPE "public"."field_type_enum" AS ENUM('text', 'email', 'boolean', 'phone_number', 'date', 'integer', 'file');--> statement-breakpoint
ALTER TABLE "custom_field_club" ALTER COLUMN "type" SET DATA TYPE "public"."field_type_enum" USING "type"::"public"."field_type_enum";--> statement-breakpoint
ALTER TABLE "custom_field_club" ALTER COLUMN "type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "custom_field_club" ADD COLUMN "required" boolean DEFAULT false NOT NULL;