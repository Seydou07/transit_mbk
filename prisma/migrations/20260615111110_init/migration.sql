-- CreateTable
CREATE TABLE `Client` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reference` VARCHAR(191) NOT NULL,
    `nom` VARCHAR(191) NOT NULL,
    `telephone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `adresse` VARCHAR(191) NULL,
    `ville` VARCHAR(191) NULL,
    `pays` VARCHAR(191) NULL,
    `typePieceId` VARCHAR(191) NULL,
    `numeroPiece` VARCHAR(191) NULL,
    `notes` TEXT NULL,
    `statut` ENUM('ACTIF', 'INACTIF') NOT NULL DEFAULT 'ACTIF',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Client_reference_key`(`reference`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Expedition` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reference` VARCHAR(191) NOT NULL,
    `clientId` INTEGER NOT NULL,
    `portOrigine` VARCHAR(191) NULL,
    `paysOrigine` VARCHAR(191) NULL,
    `portDestination` VARCHAR(191) NULL,
    `paysDestination` VARCHAR(191) NULL,
    `typeTransport` ENUM('MARITIME', 'AERIEN', 'ROUTIER') NOT NULL DEFAULT 'MARITIME',
    `statut` ENUM('EN_ATTENTE', 'EN_PREPARATION', 'EN_TRANSIT', 'ARRIVE', 'EN_STOCK', 'LIVRE', 'PARTIELLEMENT_LIVRE') NOT NULL DEFAULT 'EN_ATTENTE',
    `incoterm` VARCHAR(191) NULL,
    `devise` VARCHAR(191) NULL DEFAULT 'USD',
    `valeurTotale` DECIMAL(12, 2) NULL,
    `poidsTotalKg` DECIMAL(10, 2) NULL,
    `nombreColis` INTEGER NULL,
    `dateDepartPrevue` DATETIME(3) NULL,
    `dateArriveePrevue` DATETIME(3) NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Expedition_reference_key`(`reference`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Marchandise` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `expeditionId` INTEGER NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `categorie` VARCHAR(191) NULL,
    `quantite` INTEGER NOT NULL,
    `unite` VARCHAR(191) NULL DEFAULT 'pcs',
    `poidsUnitaire` DECIMAL(10, 2) NULL,
    `poidsTotalKg` DECIMAL(10, 2) NULL,
    `valeurUnitaire` DECIMAL(12, 2) NULL,
    `valeurTotale` DECIMAL(12, 2) NULL,
    `nombreColis` INTEGER NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Conteneur` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numero` VARCHAR(191) NOT NULL,
    `type` ENUM('DC20', 'DC40', 'HC40', 'AERIEN', 'ROUTIER') NOT NULL DEFAULT 'DC20',
    `transporteur` VARCHAR(191) NULL,
    `nomNavire` VARCHAR(191) NULL,
    `numeroVoyage` VARCHAR(191) NULL,
    `statut` ENUM('EN_PREPARATION', 'CHARGE', 'EN_TRANSIT', 'ARRIVE', 'VIDE') NOT NULL DEFAULT 'EN_PREPARATION',
    `portDepart` VARCHAR(191) NULL,
    `portArrivee` VARCHAR(191) NULL,
    `dateEmbarquement` DATETIME(3) NULL,
    `dateDepart` DATETIME(3) NULL,
    `dateArriveeEstimee` DATETIME(3) NULL,
    `dateArriveeReelle` DATETIME(3) NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Conteneur_numero_key`(`numero`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExpeditionConteneur` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `expeditionId` INTEGER NOT NULL,
    `conteneurId` INTEGER NOT NULL,
    `poidsEmbarque` DECIMAL(10, 2) NULL,
    `colisEmbarques` INTEGER NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ExpeditionConteneur_expeditionId_conteneurId_key`(`expeditionId`, `conteneurId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Stock` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `expeditionId` INTEGER NOT NULL,
    `clientId` INTEGER NOT NULL,
    `marchandiseId` INTEGER NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `quantiteInitiale` INTEGER NOT NULL,
    `quantiteRestante` INTEGER NOT NULL,
    `poidsInitialKg` DECIMAL(10, 2) NULL,
    `poidsRestantKg` DECIMAL(10, 2) NULL,
    `dateMiseEnStock` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `statut` ENUM('EN_STOCK', 'PARTIELLEMENT_RETIRE', 'RETIRE') NOT NULL DEFAULT 'EN_STOCK',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Livraison` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `stockId` INTEGER NOT NULL,
    `expeditionId` INTEGER NOT NULL,
    `clientId` INTEGER NOT NULL,
    `quantiteRetiree` INTEGER NOT NULL,
    `poidsRetireKg` DECIMAL(10, 2) NULL,
    `retraitPar` VARCHAR(191) NULL,
    `notes` TEXT NULL,
    `dateLivraison` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Document` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `expeditionId` INTEGER NOT NULL,
    `nom` VARCHAR(191) NOT NULL,
    `type` ENUM('FACTURE', 'PACKING_LIST', 'CONNAISSEMENT', 'BON_COMMANDE', 'DEVIS', 'PREUVE_LIVRAISON', 'AUTRE') NOT NULL,
    `cheminFichier` VARCHAR(191) NOT NULL,
    `taille` INTEGER NULL,
    `mimeType` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `motDePasse` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'AGENT', 'COMMERCIAL', 'CLIENT') NOT NULL DEFAULT 'AGENT',
    `actif` BOOLEAN NOT NULL DEFAULT true,
    `dernierConnexion` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `titre` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `type` ENUM('INFO', 'SUCCESS', 'WARNING', 'DANGER') NOT NULL DEFAULT 'INFO',
    `lue` BOOLEAN NOT NULL DEFAULT false,
    `lien` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AuditLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `entite` VARCHAR(191) NOT NULL,
    `entiteId` INTEGER NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `ancienneValeur` JSON NULL,
    `nouvelleValeur` JSON NULL,
    `ipAddress` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Expedition` ADD CONSTRAINT `Expedition_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Marchandise` ADD CONSTRAINT `Marchandise_expeditionId_fkey` FOREIGN KEY (`expeditionId`) REFERENCES `Expedition`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExpeditionConteneur` ADD CONSTRAINT `ExpeditionConteneur_expeditionId_fkey` FOREIGN KEY (`expeditionId`) REFERENCES `Expedition`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExpeditionConteneur` ADD CONSTRAINT `ExpeditionConteneur_conteneurId_fkey` FOREIGN KEY (`conteneurId`) REFERENCES `Conteneur`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Stock` ADD CONSTRAINT `Stock_expeditionId_fkey` FOREIGN KEY (`expeditionId`) REFERENCES `Expedition`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Stock` ADD CONSTRAINT `Stock_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Stock` ADD CONSTRAINT `Stock_marchandiseId_fkey` FOREIGN KEY (`marchandiseId`) REFERENCES `Marchandise`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Livraison` ADD CONSTRAINT `Livraison_stockId_fkey` FOREIGN KEY (`stockId`) REFERENCES `Stock`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Livraison` ADD CONSTRAINT `Livraison_expeditionId_fkey` FOREIGN KEY (`expeditionId`) REFERENCES `Expedition`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Livraison` ADD CONSTRAINT `Livraison_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Document` ADD CONSTRAINT `Document_expeditionId_fkey` FOREIGN KEY (`expeditionId`) REFERENCES `Expedition`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuditLog` ADD CONSTRAINT `AuditLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
