/*
  Warnings:

  - You are about to drop the column `idempotencyKeyId` on the `Booking` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[bookindId]` on the table `IdempotencyKey` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bookindId` to the `IdempotencyKey` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Booking` DROP FOREIGN KEY `Booking_idempotencyKeyId_fkey`;

-- DropIndex
DROP INDEX `Booking_idempotencyKeyId_key` ON `Booking`;

-- AlterTable
ALTER TABLE `Booking` DROP COLUMN `idempotencyKeyId`;

-- AlterTable
ALTER TABLE `IdempotencyKey` ADD COLUMN `bookindId` INTEGER NOT NULL,
    ADD COLUMN `finalized` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX `IdempotencyKey_bookindId_key` ON `IdempotencyKey`(`bookindId`);

-- AddForeignKey
ALTER TABLE `IdempotencyKey` ADD CONSTRAINT `IdempotencyKey_bookindId_fkey` FOREIGN KEY (`bookindId`) REFERENCES `Booking`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
