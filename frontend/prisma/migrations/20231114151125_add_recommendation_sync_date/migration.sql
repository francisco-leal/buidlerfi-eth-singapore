/*
  Warnings:

  - You are about to drop the column `recommendedUserId` on the `RecommendedUser` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sourceUserId,recommendedUserWallet]` on the table `RecommendedUser` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `recommendedUserWallet` to the `RecommendedUser` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RecommendedUser" DROP CONSTRAINT "RecommendedUser_recommendedUserId_fkey";

-- DropIndex
DROP INDEX "RecommendedUser_sourceUserId_recommendedUserId_key";

-- AlterTable
ALTER TABLE "RecommendedUser" DROP COLUMN "recommendedUserId",
ADD COLUMN     "recommendedUserWallet" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastRecommendationsSyncedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "RecommendedUser_sourceUserId_recommendedUserWallet_key" ON "RecommendedUser"("sourceUserId", "recommendedUserWallet");

-- AddForeignKey
ALTER TABLE "RecommendedUser" ADD CONSTRAINT "RecommendedUser_recommendedUserWallet_fkey" FOREIGN KEY ("recommendedUserWallet") REFERENCES "User"("socialWallet") ON DELETE RESTRICT ON UPDATE CASCADE;
