-- CreateEnum
CREATE TYPE "ClientType" AS ENUM ('PARTICULIER', 'ENTREPRISE');

-- CreateEnum
CREATE TYPE "ClientStatut" AS ENUM ('ACTIF', 'INACTIF');

-- CreateEnum
CREATE TYPE "TypeCommande" AS ENUM ('TRANSIT', 'COMPLETE');

-- CreateEnum
CREATE TYPE "TypeTransport" AS ENUM ('MARITIME', 'AERIEN', 'ROUTIER', 'FERROVIAIRE');

-- CreateEnum
CREATE TYPE "ExpeditionStatut" AS ENUM ('EN_ATTENTE', 'EN_PREPARATION', 'EN_TRANSIT', 'ARRIVE', 'DOUANE', 'EN_STOCK', 'LIVRE', 'PARTIELLEMENT_LIVRE');

-- CreateEnum
CREATE TYPE "ConteneurType" AS ENUM ('DC20', 'DC40', 'HC40', 'AERIEN', 'ROUTIER');

-- CreateEnum
CREATE TYPE "ConteneurStatut" AS ENUM ('EN_PREPARATION', 'CHARGE', 'EN_TRANSIT', 'ARRIVE', 'DOUANE', 'FERME', 'VIDE');

-- CreateEnum
CREATE TYPE "StockStatut" AS ENUM ('EN_STOCK', 'PARTIELLEMENT_RETIRE', 'RETIRE');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('FACTURE', 'PACKING_LIST', 'CONNAISSEMENT', 'BON_COMMANDE', 'DEVIS', 'PREUVE_LIVRAISON', 'AUTRE');

-- CreateEnum
CREATE TYPE "DepenseType" AS ENUM ('FRET', 'DOUANE', 'CAMIONNAGE', 'MANUTENTION', 'STOCKAGE', 'ASSURANCE', 'SURCHARGE', 'DIVERSE');

-- CreateEnum
CREATE TYPE "DepenseLiaison" AS ENUM ('CONTENEUR', 'COMMANDE', 'GENERAL');

-- CreateEnum
CREATE TYPE "JustificatifType" AS ENUM ('PDF', 'PHOTO', 'FACTURE', 'RECU');

-- CreateEnum
CREATE TYPE "PaiementType" AS ENUM ('ACOMPTE', 'SOLDE');

-- CreateEnum
CREATE TYPE "ModePaiement" AS ENUM ('ESPECES', 'ORANGE_MONEY', 'MOOV_MONEY', 'VIREMENT', 'CHEQUE');

-- CreateEnum
CREATE TYPE "FactureStatut" AS ENUM ('EMISE', 'PAYEE', 'EN_RETARD', 'ANNULEE');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'AGENT', 'COMMERCIAL', 'COMPTABLE', 'LECTEUR', 'CLIENT');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('INFO', 'SUCCESS', 'WARNING', 'DANGER');

-- CreateEnum
CREATE TYPE "DemandeAchatStatut" AS ENUM ('NOUVELLE', 'RECHERCHE_FOURNISSEUR', 'DEVIS_RECU', 'VALIDEE', 'REFUSEE');

-- CreateEnum
CREATE TYPE "ProductionEtape" AS ENUM ('COMMANDEE', 'ACOMPTE_VRESE', 'LANCEE', 'CONTROLE_QUALITE', 'TERMINEE', 'ENTREPOT', 'CHARGEE', 'EXPEDIEE');

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "reference" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "typeClient" "ClientType" DEFAULT 'ENTREPRISE',
    "telephone" TEXT,
    "telephoneSecondaire" TEXT,
    "email" TEXT,
    "adresse" TEXT,
    "ville" TEXT,
    "pays" TEXT,
    "numeroCNIB" TEXT,
    "photoCNIB" TEXT,
    "numeroIFU" TEXT,
    "registreCommerce" TEXT,
    "photoRCCM" TEXT,
    "plafondCredit" DECIMAL(14,2),
    "conditionsPaiement" TEXT,
    "notes" TEXT,
    "statut" "ClientStatut" NOT NULL DEFAULT 'ACTIF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fournisseur" (
    "id" SERIAL NOT NULL,
    "reference" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "contact" TEXT,
    "contactPrincipal" TEXT,
    "telephone" TEXT,
    "email" TEXT,
    "adresse" TEXT,
    "ville" TEXT,
    "pays" TEXT,
    "lienAlibaba" TEXT,
    "lien1688" TEXT,
    "wechat" TEXT,
    "whatsApp" TEXT,
    "siteWeb" TEXT,
    "conditionsPaiement" TEXT,
    "delaiProductionMoyen" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fournisseur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expedition" (
    "id" SERIAL NOT NULL,
    "reference" TEXT NOT NULL,
    "clientId" INTEGER NOT NULL,
    "fournisseurId" INTEGER,
    "typeCommande" "TypeCommande" NOT NULL DEFAULT 'TRANSIT',
    "portOrigine" TEXT,
    "paysOrigine" TEXT,
    "portDestination" TEXT,
    "paysDestination" TEXT,
    "typeTransport" "TypeTransport" NOT NULL DEFAULT 'MARITIME',
    "statut" "ExpeditionStatut" NOT NULL DEFAULT 'EN_ATTENTE',
    "incoterm" TEXT,
    "devise" TEXT DEFAULT 'USD',
    "coutExpedition" DECIMAL(14,2),
    "argentRecu" DECIMAL(14,2),
    "poidsTotalKg" DECIMAL(10,2),
    "cbmTotal" DECIMAL(10,3),
    "nombreColis" INTEGER,
    "dateDepartPrevue" TIMESTAMP(3),
    "dateArriveePrevue" TIMESTAMP(3),
    "descriptionGenerale" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expedition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Marchandise" (
    "id" SERIAL NOT NULL,
    "expeditionId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "categorie" TEXT,
    "marque" TEXT,
    "modele" TEXT,
    "referenceFournisseur" TEXT,
    "quantite" INTEGER NOT NULL,
    "unite" TEXT DEFAULT 'pcs',
    "poidsUnitaire" DECIMAL(10,2),
    "poidsTotalKg" DECIMAL(10,2),
    "longueurCm" DECIMAL(8,2),
    "largeurCm" DECIMAL(8,2),
    "hauteurCm" DECIMAL(8,2),
    "cbm" DECIMAL(10,4),
    "prixUnitaireAchat" DECIMAL(12,2),
    "prixUnitaireVente" DECIMAL(12,2),
    "valeurUnitaire" DECIMAL(12,2),
    "valeurTotale" DECIMAL(12,2),
    "nombreColis" INTEGER,
    "photoProduit" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Marchandise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DemandeAchat" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "reference" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "produitRecherche" TEXT NOT NULL,
    "categorieProduit" TEXT,
    "quantiteDemandee" INTEGER NOT NULL,
    "budgetEstime" DECIMAL(14,2),
    "photoReference" TEXT,
    "description" TEXT,
    "dateSouhaitee" TIMESTAMP(3),
    "statut" "DemandeAchatStatut" NOT NULL DEFAULT 'NOUVELLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DemandeAchat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AchatFournisseur" (
    "id" SERIAL NOT NULL,
    "expeditionId" INTEGER NOT NULL,
    "fournisseurId" INTEGER NOT NULL,
    "dateCommande" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "montantAchat" DECIMAL(14,2),
    "devise" TEXT NOT NULL DEFAULT 'CNY',
    "tauxConversion" DECIMAL(8,4),
    "montantFcfa" DECIMAL(14,2),
    "acompte" DECIMAL(14,2),
    "dateAcompte" TIMESTAMP(3),
    "solde" DECIMAL(14,2),
    "dateDebutProduction" TIMESTAMP(3),
    "dateFinPrevue" TIMESTAMP(3),
    "dateFinReelle" TIMESTAMP(3),
    "bl" TEXT,
    "factureFournisseur" TEXT,
    "photo" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AchatFournisseur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SuiviProductionEtape" (
    "id" SERIAL NOT NULL,
    "expeditionId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "etape" "ProductionEtape" NOT NULL,
    "commentaire" TEXT,
    "photos" TEXT,
    "documents" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SuiviProductionEtape_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conteneur" (
    "id" SERIAL NOT NULL,
    "numero" TEXT NOT NULL,
    "type" "ConteneurType" NOT NULL DEFAULT 'DC20',
    "capaciteMaxCbm" DECIMAL(8,2),
    "capaciteMaxKg" DECIMAL(10,2),
    "transporteur" TEXT,
    "nomNavire" TEXT,
    "numeroVoyage" TEXT,
    "statut" "ConteneurStatut" NOT NULL DEFAULT 'EN_PREPARATION',
    "paysDepart" TEXT,
    "villeDepart" TEXT,
    "portDepart" TEXT,
    "paysDestination" TEXT,
    "villeDestination" TEXT,
    "portArrivee" TEXT,
    "dateChargement" TIMESTAMP(3),
    "dateDepart" TIMESTAMP(3),
    "dateArriveeEstimee" TIMESTAMP(3),
    "dateArriveeReelle" TIMESTAMP(3),
    "notes" TEXT,
    "clotureProfit" DECIMAL(14,2),
    "clotureLe" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conteneur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExpeditionConteneur" (
    "id" SERIAL NOT NULL,
    "expeditionId" INTEGER NOT NULL,
    "conteneurId" INTEGER NOT NULL,
    "cbmEmbarque" DECIMAL(10,3),
    "poidsEmbarque" DECIMAL(10,2),
    "colisEmbarques" INTEGER,
    "valeurEmbarquee" DECIMAL(14,2),
    "notes" TEXT,
    "dateChargement" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExpeditionConteneur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stock" (
    "id" SERIAL NOT NULL,
    "expeditionId" INTEGER NOT NULL,
    "clientId" INTEGER NOT NULL,
    "marchandiseId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "quantiteInitiale" INTEGER NOT NULL,
    "quantiteRestante" INTEGER NOT NULL,
    "poidsInitialKg" DECIMAL(10,2),
    "poidsRestantKg" DECIMAL(10,2),
    "dateMiseEnStock" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statut" "StockStatut" NOT NULL DEFAULT 'EN_STOCK',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Livraison" (
    "id" SERIAL NOT NULL,
    "stockId" INTEGER NOT NULL,
    "expeditionId" INTEGER NOT NULL,
    "clientId" INTEGER NOT NULL,
    "quantiteRetiree" INTEGER NOT NULL,
    "poidsRetireKg" DECIMAL(10,2),
    "retraitPar" TEXT,
    "telephoneRetrait" TEXT,
    "cnibRetrait" TEXT,
    "photoCNIB" TEXT,
    "photoMarchandise" TEXT,
    "signature" TEXT,
    "dateLivraison" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Livraison_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" SERIAL NOT NULL,
    "expeditionId" INTEGER NOT NULL,
    "nom" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL,
    "cheminFichier" TEXT NOT NULL,
    "taille" INTEGER,
    "mimeType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Depense" (
    "id" SERIAL NOT NULL,
    "conteneurId" INTEGER,
    "expeditionId" INTEGER,
    "commandeId" INTEGER,
    "titre" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "DepenseType" NOT NULL,
    "categoriePersonnalisee" TEXT,
    "montant" DECIMAL(14,2) NOT NULL,
    "devise" TEXT NOT NULL DEFAULT 'XAF',
    "tauxChange" DECIMAL(8,4),
    "montantXaf" DECIMAL(14,2),
    "liaison" "DepenseLiaison" NOT NULL DEFAULT 'CONTENEUR',
    "description" TEXT,
    "fournisseur" TEXT,
    "justificatifType" "JustificatifType",
    "justificatifPath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Depense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paiement" (
    "id" SERIAL NOT NULL,
    "expeditionId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "montant" DECIMAL(14,2) NOT NULL,
    "devise" TEXT NOT NULL DEFAULT 'XAF',
    "tauxChange" DECIMAL(8,4),
    "montantXaf" DECIMAL(14,2),
    "type" "PaiementType" NOT NULL DEFAULT 'ACOMPTE',
    "modePaiement" "ModePaiement",
    "reference" TEXT,
    "referenceTransaction" TEXT,
    "montantFacture" DECIMAL(14,2),
    "resteAPayer" DECIMAL(14,2),
    "pieceJointe" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Paiement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Facture" (
    "id" SERIAL NOT NULL,
    "numero" TEXT NOT NULL,
    "clientId" INTEGER NOT NULL,
    "expeditionId" INTEGER NOT NULL,
    "conteneurId" INTEGER,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "montantHt" DECIMAL(14,2) NOT NULL,
    "tauxTva" DECIMAL(5,2) DEFAULT 18.00,
    "montantTva" DECIMAL(14,2),
    "montantTtc" DECIMAL(14,2) NOT NULL,
    "devise" TEXT NOT NULL DEFAULT 'XAF',
    "statut" "FactureStatut" NOT NULL DEFAULT 'EMISE',
    "dateEcheance" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Facture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "motDePasse" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'AGENT',
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "dernierConnexion" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "titre" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL DEFAULT 'INFO',
    "lue" BOOLEAN NOT NULL DEFAULT false,
    "lien" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "entite" TEXT NOT NULL,
    "entiteId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "ancienneValeur" JSONB,
    "nouvelleValeur" JSONB,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_reference_key" ON "Client"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "Fournisseur_reference_key" ON "Fournisseur"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "Expedition_reference_key" ON "Expedition"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "DemandeAchat_reference_key" ON "DemandeAchat"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "Conteneur_numero_key" ON "Conteneur"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "ExpeditionConteneur_expeditionId_conteneurId_key" ON "ExpeditionConteneur"("expeditionId", "conteneurId");

-- CreateIndex
CREATE UNIQUE INDEX "Facture_numero_key" ON "Facture"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Expedition" ADD CONSTRAINT "Expedition_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expedition" ADD CONSTRAINT "Expedition_fournisseurId_fkey" FOREIGN KEY ("fournisseurId") REFERENCES "Fournisseur"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Marchandise" ADD CONSTRAINT "Marchandise_expeditionId_fkey" FOREIGN KEY ("expeditionId") REFERENCES "Expedition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemandeAchat" ADD CONSTRAINT "DemandeAchat_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AchatFournisseur" ADD CONSTRAINT "AchatFournisseur_expeditionId_fkey" FOREIGN KEY ("expeditionId") REFERENCES "Expedition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AchatFournisseur" ADD CONSTRAINT "AchatFournisseur_fournisseurId_fkey" FOREIGN KEY ("fournisseurId") REFERENCES "Fournisseur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuiviProductionEtape" ADD CONSTRAINT "SuiviProductionEtape_expeditionId_fkey" FOREIGN KEY ("expeditionId") REFERENCES "Expedition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpeditionConteneur" ADD CONSTRAINT "ExpeditionConteneur_expeditionId_fkey" FOREIGN KEY ("expeditionId") REFERENCES "Expedition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpeditionConteneur" ADD CONSTRAINT "ExpeditionConteneur_conteneurId_fkey" FOREIGN KEY ("conteneurId") REFERENCES "Conteneur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_expeditionId_fkey" FOREIGN KEY ("expeditionId") REFERENCES "Expedition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_marchandiseId_fkey" FOREIGN KEY ("marchandiseId") REFERENCES "Marchandise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Livraison" ADD CONSTRAINT "Livraison_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Livraison" ADD CONSTRAINT "Livraison_expeditionId_fkey" FOREIGN KEY ("expeditionId") REFERENCES "Expedition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Livraison" ADD CONSTRAINT "Livraison_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_expeditionId_fkey" FOREIGN KEY ("expeditionId") REFERENCES "Expedition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Depense" ADD CONSTRAINT "Depense_conteneurId_fkey" FOREIGN KEY ("conteneurId") REFERENCES "Conteneur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Depense" ADD CONSTRAINT "Depense_expeditionId_fkey" FOREIGN KEY ("expeditionId") REFERENCES "Expedition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paiement" ADD CONSTRAINT "Paiement_expeditionId_fkey" FOREIGN KEY ("expeditionId") REFERENCES "Expedition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facture" ADD CONSTRAINT "Facture_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facture" ADD CONSTRAINT "Facture_expeditionId_fkey" FOREIGN KEY ("expeditionId") REFERENCES "Expedition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facture" ADD CONSTRAINT "Facture_conteneurId_fkey" FOREIGN KEY ("conteneurId") REFERENCES "Conteneur"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
