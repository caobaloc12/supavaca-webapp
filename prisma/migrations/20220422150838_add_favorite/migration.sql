/*
  Warnings:

  - Added the required column `favoredById` to the `Home` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Home" ADD COLUMN     "favoredById" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Home" ADD CONSTRAINT "Home_favoredById_fkey" FOREIGN KEY ("favoredById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
