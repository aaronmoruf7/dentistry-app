/*
  Warnings:

  - Made the column `quantity` on table `PurchaseItem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "PurchaseItem" ADD COLUMN     "name" TEXT NOT NULL DEFAULT ' ',
ALTER COLUMN "quantity" SET NOT NULL,
ALTER COLUMN "price" DROP NOT NULL;
