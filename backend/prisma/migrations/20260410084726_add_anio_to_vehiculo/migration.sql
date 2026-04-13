/*
  Warnings:

  - Added the required column `anio` to the `Vehiculo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Vehiculo` ADD COLUMN `anio` INTEGER NOT NULL;
