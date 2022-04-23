/*
  Warnings:

  - You are about to drop the column `userId` on the `Home` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `Home` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Home" DROP CONSTRAINT "Home_userId_fkey";

-- AlterTable
ALTER TABLE "Home" DROP COLUMN "userId",
ADD COLUMN     "ownerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Home" ADD CONSTRAINT "Home_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
