-- DropForeignKey
ALTER TABLE "Home" DROP CONSTRAINT "Home_favoredById_fkey";

-- AlterTable
ALTER TABLE "Home" ALTER COLUMN "favoredById" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Home" ADD CONSTRAINT "Home_favoredById_fkey" FOREIGN KEY ("favoredById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
