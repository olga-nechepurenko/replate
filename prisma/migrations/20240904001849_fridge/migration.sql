/*
  Warnings:

  - You are about to drop the column `location` on the `Fridge` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Fridge" DROP COLUMN "location",
ADD COLUMN     "locationId" INTEGER,
ALTER COLUMN "fridgeTitle" SET DEFAULT 'Home';

-- AddForeignKey
ALTER TABLE "Fridge" ADD CONSTRAINT "Fridge_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
