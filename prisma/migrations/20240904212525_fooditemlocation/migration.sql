/*
  Warnings:

  - You are about to drop the column `location` on the `FoodItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FoodItem" DROP COLUMN "location",
ADD COLUMN     "locationId" INTEGER;

-- AddForeignKey
ALTER TABLE "FoodItem" ADD CONSTRAINT "FoodItem_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
