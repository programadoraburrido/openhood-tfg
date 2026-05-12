-- DropForeignKey
ALTER TABLE `Presupuesto` DROP FOREIGN KEY `Presupuesto_reparacionId_fkey`;

-- AddForeignKey
ALTER TABLE `Presupuesto` ADD CONSTRAINT `Presupuesto_reparacionId_fkey` FOREIGN KEY (`reparacionId`) REFERENCES `Reparacion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
