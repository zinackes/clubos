CREATE TYPE "public"."document_status" AS ENUM('pending', 'validated', 'rejected', 'expired');--> statement-breakpoint
CREATE TYPE "public"."member_club_role" AS ENUM('member');--> statement-breakpoint
CREATE TYPE "public"."member_club_status" AS ENUM('pending', 'active', 'rejected', 'archived');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'paid', 'failed', 'refunded');