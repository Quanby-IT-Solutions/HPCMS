-- audit_logs: add updated_at to match project-wide timestamp convention (Tech Plan §2.1)
-- Rows remain append-only by behavior; column exists for schema consistency.
ALTER TABLE "audit_logs" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;
