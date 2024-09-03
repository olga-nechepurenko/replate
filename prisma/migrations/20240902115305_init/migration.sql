/*
  Warnings:

  - You are about to drop the column `fridgeId` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `FoodItem` table. All the data in the column will be lost.
  - You are about to drop the column `fridgetitle` on the `Fridge` table. All the data in the column will be lost.
  - You are about to drop the column `fridgeId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `fridgeId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `fridgeId` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `fridgeId` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `fridgeTitle` to the `Fridge` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_fridgeId_fkey";

-- DropForeignKey
ALTER TABLE "FoodItem" DROP CONSTRAINT "FoodItem_userId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_fridgeId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_fridgeId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_fridgeId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_fridgeId_fkey";

-- AlterTable
ALTER TABLE "Favorite" DROP COLUMN "fridgeId";

-- AlterTable
ALTER TABLE "FoodItem" DROP COLUMN "userId",
ADD COLUMN     "fridgeId" INTEGER;

-- AlterTable
ALTER TABLE "Fridge" DROP COLUMN "fridgetitle",
ADD COLUMN     "fridgeTitle" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "fridgeId";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "fridgeId";

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "fridgeId";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "fridgeId";

-- AddForeignKey
ALTER TABLE "FoodItem" ADD CONSTRAINT "FoodItem_fridgeId_fkey" FOREIGN KEY ("fridgeId") REFERENCES "Fridge"("id") ON DELETE SET NULL ON UPDATE CASCADE;
