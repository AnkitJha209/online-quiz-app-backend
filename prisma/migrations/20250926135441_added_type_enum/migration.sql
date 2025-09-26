-- CreateEnum
CREATE TYPE "public"."TYPE" AS ENUM ('SINGLE', 'MULTIPLE');

-- AlterTable
ALTER TABLE "public"."Question" ADD COLUMN     "type" "public"."TYPE" NOT NULL DEFAULT 'SINGLE';
