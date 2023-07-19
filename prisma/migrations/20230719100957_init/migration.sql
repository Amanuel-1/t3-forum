/*
  Warnings:

  - You are about to drop the column `anonymousId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the `Anonymous` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_anonymousId_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "anonymousId";

-- DropTable
DROP TABLE "Anonymous";
