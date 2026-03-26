-- CreateTable
CREATE TABLE `Usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NULL,

    UNIQUE INDEX `Usuario_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vehiculo` (
    `matricula` VARCHAR(191) NOT NULL,
    `marca` VARCHAR(191) NOT NULL,
    `modelo` VARCHAR(191) NOT NULL,
    `kilometraje` INTEGER NOT NULL,
    `usuarioId` INTEGER NOT NULL,

    PRIMARY KEY (`matricula`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Taller` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pieza` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `categoria` VARCHAR(191) NOT NULL,
    `fecha_instalacion` DATETIME(3) NOT NULL,
    `vida_util_estimada` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reparacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha` DATETIME(3) NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `taller_nombre` VARCHAR(191) NOT NULL,
    `kilometraje_momento` INTEGER NOT NULL,
    `vehiculoMatricula` VARCHAR(191) NOT NULL,
    `tallerId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Presupuesto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `importe_total` DOUBLE NOT NULL,
    `base_imponible` DOUBLE NOT NULL,
    `IVA` DOUBLE NOT NULL,
    `url_pdf` VARCHAR(191) NULL,
    `reparacionId` INTEGER NOT NULL,

    UNIQUE INDEX `Presupuesto_reparacionId_key`(`reparacionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PiezaToVehiculo` (
    `A` INTEGER NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_PiezaToVehiculo_AB_unique`(`A`, `B`),
    INDEX `_PiezaToVehiculo_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PiezaToReparacion` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_PiezaToReparacion_AB_unique`(`A`, `B`),
    INDEX `_PiezaToReparacion_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Vehiculo` ADD CONSTRAINT `Vehiculo_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reparacion` ADD CONSTRAINT `Reparacion_vehiculoMatricula_fkey` FOREIGN KEY (`vehiculoMatricula`) REFERENCES `Vehiculo`(`matricula`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reparacion` ADD CONSTRAINT `Reparacion_tallerId_fkey` FOREIGN KEY (`tallerId`) REFERENCES `Taller`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Presupuesto` ADD CONSTRAINT `Presupuesto_reparacionId_fkey` FOREIGN KEY (`reparacionId`) REFERENCES `Reparacion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PiezaToVehiculo` ADD CONSTRAINT `_PiezaToVehiculo_A_fkey` FOREIGN KEY (`A`) REFERENCES `Pieza`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PiezaToVehiculo` ADD CONSTRAINT `_PiezaToVehiculo_B_fkey` FOREIGN KEY (`B`) REFERENCES `Vehiculo`(`matricula`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PiezaToReparacion` ADD CONSTRAINT `_PiezaToReparacion_A_fkey` FOREIGN KEY (`A`) REFERENCES `Pieza`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PiezaToReparacion` ADD CONSTRAINT `_PiezaToReparacion_B_fkey` FOREIGN KEY (`B`) REFERENCES `Reparacion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
