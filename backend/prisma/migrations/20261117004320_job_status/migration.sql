/*
  Warnings:

  - Drops the `Application` table. No code ever wrote to it, so it is empty.
  - Existing `Job` rows are kept; new columns are filled from defaults.

*/
-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('SAVED', 'APPLIED', 'INTERVIEWING', 'OFFER', 'REJECTED', 'ARCHIVED');

-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_userId_fkey";

-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_createdBy_fkey";

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "appliedAt" DATE,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "status" "JobStatus" NOT NULL DEFAULT 'SAVED',
ADD COLUMN     "statusChangedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Existing jobs: date both new timestamps from when the job was created,
-- not from when this migration happened to run.
UPDATE "Job" SET "updatedAt" = "createdAt", "statusChangedAt" = "createdAt";

-- DropTable
DROP TABLE "Application";

-- CreateIndex
CREATE INDEX "Job_createdBy_status_idx" ON "Job"("createdBy", "status");

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
