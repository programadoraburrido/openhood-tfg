/*
  Warnings:

  - Added the required column `password` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Usuario` ADD COLUMN `password` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Vehiculo` ADD COLUMN `fotoUrl` VARCHAR(191) NULL;
