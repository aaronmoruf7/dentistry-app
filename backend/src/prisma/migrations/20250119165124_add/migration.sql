/*
  Warnings:

  - Made the column `description` on table `Service` required. This step will fail if there are existing NULL values in that column.
  - Made the column `price` on table `Service` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "paymentType" TEXT NOT NULL DEFAULT 'Cash';

-- AlterTable
ALTER TABLE "Service" ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "price" SET NOT NULL;
