/*
  Warnings:

  - Made the column `venueId` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_venueId_fkey";

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "venueId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
