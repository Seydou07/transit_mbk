/*
  Warnings:

  - You are about to drop the column `numeroPiece` on the `client` table. All the data in the column will be lost.
  - You are about to drop the column `typePieceId` on the `client` table. All the data in the column will be lost.
  - You are about to drop the column `dateEmbarquement` on the `conteneur` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `AuditLog_userId_fkey` ON `auditlog`;

-- DropIndex
DROP INDEX `Document_expeditionId_fkey` ON `document`;

-- DropIndex
DROP INDEX `Expedition_clientId_fkey` ON `expedition`;

-- DropIndex
DROP INDEX `ExpeditionConteneur_conteneurId_fkey` ON `expeditionconteneur`;

-- DropIndex
DROP INDEX `Livraison_clientId_fkey` ON `livraison`;

-- DropIndex
DROP INDEX `Livraison_expeditionId_fkey` ON `livraison`;

-- DropIndex
DROP INDEX `Livraison_stockId_fkey` ON `livraison`;

-- DropIndex
DROP INDEX `Marchandise_expeditionId_fkey` ON `marchandise`;

-- DropIndex
DROP INDEX `Notification_userId_fkey` ON `notification`;

-- DropIndex
DROP INDEX `Stock_clientId_fkey` ON `stock`;

-- DropIndex
DROP INDEX `Stock_expeditionId_fkey` ON `stock`;

-- DropIndex
DROP INDEX `Stock_marchandiseId_fkey` ON `stock`;

-- AlterTable
ALTER TABLE `client` DROP COLUMN `numeroPiece`,
    DROP COLUMN `typePieceId`,
    ADD COLUMN `conditionsPaiement` VARCHAR(191) NULL,
    ADD COLUMN `numeroCNIB` VARCHAR(191) NULL,
    ADD COLUMN `numeroIFU` VARCHAR(191) NULL,
    ADD COLUMN `photoCNIB` VARCHAR(191) NULL,
    ADD COLUMN `photoRCCM` VARCHAR(191) NULL,
    ADD COLUMN `plafondCredit` DECIMAL(14, 2) NULL,
    ADD COLUMN `registreCommerce` VARCHAR(191) NULL,
    ADD COLUMN `telephoneSecondaire` VARCHAR(191) NULL,
    ADD COLUMN `typeClient` ENUM('PARTICULIER', 'ENTREPRISE') NULL DEFAULT 'ENTREPRISE';

-- AlterTable
ALTER TABLE `conteneur` DROP COLUMN `dateEmbarquement`,
    ADD COLUMN `capaciteMaxCbm` DECIMAL(8, 2) NULL,
    ADD COLUMN `capaciteMaxKg` DECIMAL(10, 2) NULL,
    ADD COLUMN `clotureLe` DATETIME(3) NULL,
    ADD COLUMN `clotureProfit` DECIMAL(14, 2) NULL,
    ADD COLUMN `dateChargement` DATETIME(3) NULL,
    ADD COLUMN `paysDepart` VARCHAR(191) NULL,
    ADD COLUMN `paysDestination` VARCHAR(191) NULL,
    ADD COLUMN `villeDepart` VARCHAR(191) NULL,
    ADD COLUMN `villeDestination` VARCHAR(191) NULL,
    MODIFY `statut` ENUM('EN_PREPARATION', 'CHARGE', 'EN_TRANSIT', 'ARRIVE', 'DOUANE', 'FERME', 'VIDE') NOT NULL DEFAULT 'EN_PREPARATION';

-- AlterTable
ALTER TABLE `expedition` ADD COLUMN `cbmTotal` DECIMAL(10, 3) NULL,
    ADD COLUMN `descriptionGenerale` TEXT NULL,
    ADD COLUMN `fournisseurId` INTEGER NULL,
    ADD COLUMN `typeCommande` ENUM('TRANSIT', 'COMPLETE') NOT NULL DEFAULT 'TRANSIT',
    MODIFY `typeTransport` ENUM('MARITIME', 'AERIEN', 'ROUTIER', 'FERROVIAIRE') NOT NULL DEFAULT 'MARITIME',
    MODIFY `statut` ENUM('EN_ATTENTE', 'EN_PREPARATION', 'EN_TRANSIT', 'ARRIVE', 'DOUANE', 'EN_STOCK', 'LIVRE', 'PARTIELLEMENT_LIVRE') NOT NULL DEFAULT 'EN_ATTENTE';

-- AlterTable
ALTER TABLE `expeditionconteneur` ADD COLUMN `cbmEmbarque` DECIMAL(10, 3) NULL,
    ADD COLUMN `dateChargement` DATETIME(3) NULL,
    ADD COLUMN `valeurEmbarquee` DECIMAL(14, 2) NULL;

-- AlterTable
ALTER TABLE `livraison` ADD COLUMN `cnibRetrait` VARCHAR(191) NULL,
    ADD COLUMN `photoCNIB` VARCHAR(191) NULL,
    ADD COLUMN `photoMarchandise` VARCHAR(191) NULL,
    ADD COLUMN `signature` VARCHAR(191) NULL,
    ADD COLUMN `telephoneRetrait` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `marchandise` ADD COLUMN `cbm` DECIMAL(10, 4) NULL,
    ADD COLUMN `hauteurCm` DECIMAL(8, 2) NULL,
    ADD COLUMN `largeurCm` DECIMAL(8, 2) NULL,
    ADD COLUMN `longueurCm` DECIMAL(8, 2) NULL,
    ADD COLUMN `marque` VARCHAR(191) NULL,
    ADD COLUMN `modele` VARCHAR(191) NULL,
    ADD COLUMN `photoProduit` VARCHAR(191) NULL,
    ADD COLUMN `prixUnitaireAchat` DECIMAL(12, 2) NULL,
    ADD COLUMN `prixUnitaireVente` DECIMAL(12, 2) NULL,
    ADD COLUMN `referenceFournisseur` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('ADMIN', 'AGENT', 'COMMERCIAL', 'COMPTABLE', 'LECTEUR', 'CLIENT') NOT NULL DEFAULT 'AGENT';

-- CreateTable
CREATE TABLE `Fournisseur` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reference` VARCHAR(191) NOT NULL,
    `nom` VARCHAR(191) NOT NULL,
    `contact` VARCHAR(191) NULL,
    `contactPrincipal` VARCHAR(191) NULL,
    `telephone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `adresse` VARCHAR(191) NULL,
    `ville` VARCHAR(191) NULL,
    `pays` VARCHAR(191) NULL,
    `lienAlibaba` VARCHAR(191) NULL,
    `lien1688` VARCHAR(191) NULL,
    `wechat` VARCHAR(191) NULL,
    `whatsApp` VARCHAR(191) NULL,
    `siteWeb` VARCHAR(191) NULL,
    `conditionsPaiement` VARCHAR(191) NULL,
    `delaiProductionMoyen` INTEGER NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Fournisseur_reference_key`(`reference`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DemandeAchat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clientId` INTEGER NOT NULL,
    `reference` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `produitRecherche` VARCHAR(191) NOT NULL,
    `categorieProduit` VARCHAR(191) NULL,
    `quantiteDemandee` INTEGER NOT NULL,
    `budgetEstime` DECIMAL(14, 2) NULL,
    `photoReference` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `dateSouhaitee` DATETIME(3) NULL,
    `statut` ENUM('NOUVELLE', 'RECHERCHE_FOURNISSEUR', 'DEVIS_RECU', 'VALIDEE', 'REFUSEE') NOT NULL DEFAULT 'NOUVELLE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `DemandeAchat_reference_key`(`reference`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AchatFournisseur` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `expeditionId` INTEGER NOT NULL,
    `fournisseurId` INTEGER NOT NULL,
    `dateCommande` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `montantAchat` DECIMAL(14, 2) NULL,
    `devise` VARCHAR(191) NOT NULL DEFAULT 'CNY',
    `tauxConversion` DECIMAL(8, 4) NULL,
    `montantFcfa` DECIMAL(14, 2) NULL,
    `acompte` DECIMAL(14, 2) NULL,
    `dateAcompte` DATETIME(3) NULL,
    `solde` DECIMAL(14, 2) NULL,
    `dateDebutProduction` DATETIME(3) NULL,
    `dateFinPrevue` DATETIME(3) NULL,
    `dateFinReelle` DATETIME(3) NULL,
    `bl` VARCHAR(191) NULL,
    `factureFournisseur` VARCHAR(191) NULL,
    `photo` VARCHAR(191) NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SuiviProductionEtape` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `expeditionId` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `etape` ENUM('COMMANDEE', 'ACOMPTE_VRESE', 'LANCEE', 'CONTROLE_QUALITE', 'TERMINEE', 'ENTREPOT', 'CHARGEE', 'EXPEDIEE') NOT NULL,
    `commentaire` TEXT NULL,
    `photos` VARCHAR(191) NULL,
    `documents` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Depense` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `conteneurId` INTEGER NOT NULL,
    `commandeId` INTEGER NULL,
    `titre` VARCHAR(191) NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `type` ENUM('FRET', 'DOUANE', 'CAMIONNAGE', 'MANUTENTION', 'STOCKAGE', 'ASSURANCE', 'SURCHARGE', 'DIVERSE') NOT NULL,
    `categoriePersonnalisee` VARCHAR(191) NULL,
    `montant` DECIMAL(14, 2) NOT NULL,
    `devise` VARCHAR(191) NOT NULL DEFAULT 'XAF',
    `tauxChange` DECIMAL(8, 4) NULL,
    `montantXaf` DECIMAL(14, 2) NULL,
    `liaison` ENUM('CONTENEUR', 'COMMANDE', 'GENERAL') NOT NULL DEFAULT 'CONTENEUR',
    `description` TEXT NULL,
    `fournisseur` VARCHAR(191) NULL,
    `justificatifType` ENUM('PDF', 'PHOTO', 'FACTURE', 'RECU') NULL,
    `justificatifPath` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Paiement` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `expeditionId` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `montant` DECIMAL(14, 2) NOT NULL,
    `devise` VARCHAR(191) NOT NULL DEFAULT 'XAF',
    `tauxChange` DECIMAL(8, 4) NULL,
    `montantXaf` DECIMAL(14, 2) NULL,
    `type` ENUM('ACOMPTE', 'SOLDE') NOT NULL DEFAULT 'ACOMPTE',
    `modePaiement` ENUM('ESPECES', 'ORANGE_MONEY', 'MOOV_MONEY', 'VIREMENT', 'CHEQUE') NULL,
    `reference` VARCHAR(191) NULL,
    `referenceTransaction` VARCHAR(191) NULL,
    `montantFacture` DECIMAL(14, 2) NULL,
    `resteAPayer` DECIMAL(14, 2) NULL,
    `pieceJointe` VARCHAR(191) NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Facture` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numero` VARCHAR(191) NOT NULL,
    `clientId` INTEGER NOT NULL,
    `expeditionId` INTEGER NOT NULL,
    `conteneurId` INTEGER NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `montantHt` DECIMAL(14, 2) NOT NULL,
    `tauxTva` DECIMAL(5, 2) NULL DEFAULT 18.00,
    `montantTva` DECIMAL(14, 2) NULL,
    `montantTtc` DECIMAL(14, 2) NOT NULL,
    `devise` VARCHAR(191) NOT NULL DEFAULT 'XAF',
    `statut` ENUM('EMISE', 'PAYEE', 'EN_RETARD', 'ANNULEE') NOT NULL DEFAULT 'EMISE',
    `dateEcheance` DATETIME(3) NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Facture_numero_key`(`numero`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Expedition` ADD CONSTRAINT `Expedition_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Expedition` ADD CONSTRAINT `Expedition_fournisseurId_fkey` FOREIGN KEY (`fournisseurId`) REFERENCES `Fournisseur`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Marchandise` ADD CONSTRAINT `Marchandise_expeditionId_fkey` FOREIGN KEY (`expeditionId`) REFERENCES `Expedition`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DemandeAchat` ADD CONSTRAINT `DemandeAchat_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AchatFournisseur` ADD CONSTRAINT `AchatFournisseur_expeditionId_fkey` FOREIGN KEY (`expeditionId`) REFERENCES `Expedition`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AchatFournisseur` ADD CONSTRAINT `AchatFournisseur_fournisseurId_fkey` FOREIGN KEY (`fournisseurId`) REFERENCES `Fournisseur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SuiviProductionEtape` ADD CONSTRAINT `SuiviProductionEtape_expeditionId_fkey` FOREIGN KEY (`expeditionId`) REFERENCES `Expedition`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE `Depense` ADD CONSTRAINT `Depense_conteneurId_fkey` FOREIGN KEY (`conteneurId`) REFERENCES `Conteneur`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Paiement` ADD CONSTRAINT `Paiement_expeditionId_fkey` FOREIGN KEY (`expeditionId`) REFERENCES `Expedition`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Facture` ADD CONSTRAINT `Facture_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Facture` ADD CONSTRAINT `Facture_expeditionId_fkey` FOREIGN KEY (`expeditionId`) REFERENCES `Expedition`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Facture` ADD CONSTRAINT `Facture_conteneurId_fkey` FOREIGN KEY (`conteneurId`) REFERENCES `Conteneur`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuditLog` ADD CONSTRAINT `AuditLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
