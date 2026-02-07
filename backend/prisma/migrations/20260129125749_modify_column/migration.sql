/*
  Warnings:

  - You are about to drop the column `DeleteAt` on the `Movie` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "DeleteAt",
ADD COLUMN     "deleteAt" TIMESTAMP(3);
