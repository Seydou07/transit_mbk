import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // ─── Clean all tables in dependency order ───
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.livraison.deleteMany();
  await prisma.stock.deleteMany();
  await prisma.expeditionConteneur.deleteMany();
  await prisma.marchandise.deleteMany();
  await prisma.document.deleteMany();
  await prisma.paiement.deleteMany();
  await prisma.facture.deleteMany();
  await prisma.suiviProductionEtape.deleteMany();
  await prisma.achatFournisseur.deleteMany();
  await prisma.demandeAchat.deleteMany();
  await prisma.depense.deleteMany();
  await prisma.conteneur.deleteMany();
  await prisma.expedition.deleteMany();
  await prisma.fournisseur.deleteMany();
  await prisma.client.deleteMany();
  await prisma.user.deleteMany();

  // ─── Users ───
  const pwd = await bcrypt.hash('Admin123!', 10);
  const admin = await prisma.user.create({
    data: { email: 'admin@mbk.com', nom: 'Administrateur', motDePasse: pwd, role: 'ADMIN' },
  });
  const agent = await prisma.user.create({
    data: { email: 'agent@mbk.com', nom: 'Agent Principal', motDePasse: await bcrypt.hash('Agent123!', 10), role: 'AGENT' },
  });
  const comptable = await prisma.user.create({
    data: { email: 'compta@mbk.com', nom: 'Comptable', motDePasse: await bcrypt.hash('Compta123!', 10), role: 'COMPTABLE' },
  });

  // ─── Clients ───
  const c1 = await prisma.client.create({
    data: { reference: 'CLI-001', nom: 'TransGlobal SARL', typeClient: 'ENTREPRISE', telephone: '+225 22 00 12 34', email: 'contact@transglobal.com', adresse: '12 Rue des Déportés, Abidjan', ville: 'Abidjan', pays: 'Côte d\'Ivoire', numeroIFU: 'IFU-123456', registreCommerce: 'RC-ABJ-2024-001', plafondCredit: 50000000, conditionsPaiement: '30 jours net', statut: 'ACTIF' },
  });
  const c2 = await prisma.client.create({
    data: { reference: 'CLI-002', nom: 'Africa Traders Ltd', typeClient: 'ENTREPRISE', telephone: '+225 07 08 90 12', email: 'export@africatraders.com', adresse: '45 Avenue de la République', ville: 'Yamoussoukro', pays: 'Côte d\'Ivoire', numeroCNIB: 'CN-225-987654', plafondCredit: 25000000, conditionsPaiement: '50% acompte, 50% à la livraison', statut: 'ACTIF' },
  });
  const c3 = await prisma.client.create({
    data: { reference: 'CLI-003', nom: 'West Africa Logistics', email: 'info@westafrica-logistics.com', telephone: '+225 21 45 67 89', adresse: 'Zone Industrielle', ville: 'Bouaké', pays: 'Côte d\'Ivoire', statut: 'ACTIF' },
  });
  const c4 = await prisma.client.create({
    data: { reference: 'CLI-004', nom: 'Kouassi Alain', typeClient: 'PARTICULIER', telephone: '+225 01 02 03 04', email: 'alain.k@email.com', ville: 'Abidjan', pays: 'Côte d\'Ivoire', plafondCredit: 5000000, statut: 'ACTIF' },
  });
  const c5 = await prisma.client.create({
    data: { reference: 'CLI-005', nom: 'Société Béninoise Import', typeClient: 'ENTREPRISE', telephone: '+229 61 12 34 56', email: 'info@benin-import.bj', ville: 'Cotonou', pays: 'Bénin', statut: 'INACTIF' },
  });

  // ─── Fournisseurs ───
  const f1 = await prisma.fournisseur.create({
    data: { reference: 'FOUR-001', nom: 'Guangzhou Trading Co.', contact: 'Li Wei', contactPrincipal: 'Li Wei', telephone: '+86 138 0013 8000', email: 'liwei@gztrading.cn', adresse: '168 Huanshi Road', ville: 'Guangzhou', pays: 'Chine', lienAlibaba: 'https://gztrading.1688.com', lien1688: 'https://gztrading.1688.com', wechat: 'liweigz', whatsApp: '+86 138 0013 8000', conditionsPaiement: '30% acompte, 70% avant expédition', delaiProductionMoyen: 25 },
  });
  const f2 = await prisma.fournisseur.create({
    data: { reference: 'FOUR-002', nom: 'Shenzhen Electronics', contact: 'Chen Wang', telephone: '+86 135 0024 6000', email: 'chen.wang@szelitech.cn', ville: 'Shenzhen', pays: 'Chine', conditionsPaiement: '50% acompte, 50% à la fin', delaiProductionMoyen: 20 },
  });
  const f3 = await prisma.fournisseur.create({
    data: { reference: 'FOUR-003', nom: 'Yiwu General Export', contact: 'Zhang Min', telephone: '+86 139 0057 2000', email: 'zhangmin@yiwuexport.cn', ville: 'Yiwu', pays: 'Chine', siteWeb: 'https://yiwuexport.cn', wechat: 'zhangmin_yw', conditionsPaiement: '100% avant expédition', delaiProductionMoyen: 35 },
  });
  const f4 = await prisma.fournisseur.create({
    data: { reference: 'FOUR-004', nom: 'Transporteur Local CI', contact: 'Soro Kader', telephone: '+225 27 30 40 50', email: 'soro@transportci.com', ville: 'Abidjan', pays: 'Côte d\'Ivoire', conditionsPaiement: '30 jours' },
  });

  // ─── Conteneurs ───
  const cnt1 = await prisma.conteneur.create({
    data: { numero: 'MBK-DC20-001', type: 'DC20', capaciteMaxCbm: 33, capaciteMaxKg: 28200, statut: 'EN_PREPARATION', transporteur: 'Maersk', nomNavire: 'MSC ALICANTE', numeroVoyage: 'MAE-2026-01', paysDepart: 'Chine', villeDepart: 'Shanghai', portDepart: 'Port de Shanghai', paysDestination: 'Côte d\'Ivoire', villeDestination: 'Abidjan', portArrivee: 'Port Autonome d\'Abidjan' },
  });
  const cnt2 = await prisma.conteneur.create({
    data: { numero: 'MBK-HC40-002', type: 'HC40', capaciteMaxCbm: 76, capaciteMaxKg: 30400, statut: 'EN_TRANSIT', transporteur: 'CMA CGM', nomNavire: 'CMA CGM TOSCA', numeroVoyage: 'CMA-2026-02', paysDepart: 'Chine', villeDepart: 'Shenzhen', portDepart: 'Port de Shenzhen', paysDestination: 'Côte d\'Ivoire', villeDestination: 'Abidjan', portArrivee: 'Port Autonome d\'Abidjan', dateChargement: new Date('2026-06-01'), dateDepart: new Date('2026-06-05'), dateArriveeEstimee: new Date('2026-07-10') },
  });
  const cnt3 = await prisma.conteneur.create({
    data: { numero: 'MBK-DC20-003', type: 'DC20', statut: 'ARRIVE', transporteur: 'Maersk', nomNavire: 'MSC ALICANTE', paysDepart: 'Chine', portDepart: 'Port de Shanghai', paysDestination: 'Côte d\'Ivoire', portArrivee: 'Port Autonome d\'Abidjan', dateDepart: new Date('2026-05-01'), dateArriveeReelle: new Date('2026-06-08'), clotureProfit: 1500000, clotureLe: new Date('2026-06-15') },
  });
  const cnt4 = await prisma.conteneur.create({
    data: { numero: 'MBK-DC20-004', type: 'DC20', statut: 'VIDE', transporteur: 'CMA CGM' },
  });
  const cnt5 = await prisma.conteneur.create({
    data: { numero: 'MBK-AIR-001', type: 'AERIEN', statut: 'FERME', transporteur: 'Air France Cargo', nomNavire: 'AF 1782', clotureProfit: 890000, clotureLe: new Date('2026-06-05') },
  });

  // ─── Expéditions ───
  const e1 = await prisma.expedition.create({
    data: { reference: 'EXP-2026-001', clientId: c1.id, fournisseurId: f1.id, typeCommande: 'COMPLETE', portOrigine: 'Shanghai', paysOrigine: 'Chine', portDestination: 'Port Autonome d\'Abidjan', paysDestination: 'Côte d\'Ivoire', typeTransport: 'MARITIME', statut: 'EN_TRANSIT', incoterm: 'CIF', devise: 'USD', coutExpedition: 35000000, argentRecu: 28000000, poidsTotalKg: 12500, cbmTotal: 45, nombreColis: 240, dateDepartPrevue: new Date('2026-05-15'), dateArriveePrevue: new Date('2026-06-20'), notes: 'Équipements industriels et machines-outils' },
  });
  const e2 = await prisma.expedition.create({
    data: { reference: 'EXP-2026-002', clientId: c2.id, fournisseurId: f2.id, typeCommande: 'TRANSIT', portOrigine: 'Aéroport Félix Houphouët-Boigny', paysOrigine: 'Côte d\'Ivoire', portDestination: 'Paris Charles de Gaulle', paysDestination: 'France', typeTransport: 'AERIEN', statut: 'LIVRE', incoterm: 'FOB', devise: 'EUR', coutExpedition: 8000000, argentRecu: 6400000, poidsTotalKg: 850, cbmTotal: 2.5, nombreColis: 45, dateDepartPrevue: new Date('2026-06-01'), dateArriveePrevue: new Date('2026-06-04'), notes: 'Café et cacao bio export' },
  });
  const e3 = await prisma.expedition.create({
    data: { reference: 'EXP-2026-003', clientId: c3.id, fournisseurId: f1.id, typeCommande: 'COMPLETE', portOrigine: 'Yiwu', paysOrigine: 'Chine', portDestination: 'Port Autonome d\'Abidjan', paysDestination: 'Côte d\'Ivoire', typeTransport: 'MARITIME', statut: 'EN_PREPARATION', incoterm: 'CIF', devise: 'USD', coutExpedition: 22000000, argentRecu: 14300000, poidsTotalKg: 8000, cbmTotal: 28, nombreColis: 150, dateDepartPrevue: new Date('2026-07-01'), dateArriveePrevue: new Date('2026-08-05'), notes: 'Matériaux de construction' },
  });
  const e4 = await prisma.expedition.create({
    data: { reference: 'EXP-2026-004', clientId: c4.id, fournisseurId: f3.id, typeCommande: 'COMPLETE', portOrigine: 'Guangzhou', paysOrigine: 'Chine', portDestination: 'Port Autonome d\'Abidjan', paysDestination: 'Côte d\'Ivoire', typeTransport: 'MARITIME', statut: 'EN_ATTENTE', incoterm: 'FOB', devise: 'USD', coutExpedition: 2000000, argentRecu: 1400000, poidsTotalKg: 450, cbmTotal: 1.2, nombreColis: 8, notes: 'Effets personnels et meubles' },
  });
  const e5 = await prisma.expedition.create({
    data: { reference: 'EXP-2026-005', clientId: c1.id, fournisseurId: f1.id, typeCommande: 'TRANSIT', portOrigine: 'Shanghai', paysOrigine: 'Chine', portDestination: 'Port Autonome d\'Abidjan', paysDestination: 'Côte d\'Ivoire', typeTransport: 'MARITIME', statut: 'DOUANE', incoterm: 'CIF', devise: 'USD', coutExpedition: 14000000, argentRecu: 9800000, poidsTotalKg: 6200, cbmTotal: 22, nombreColis: 95, dateDepartPrevue: new Date('2026-04-10'), dateArriveePrevue: new Date('2026-05-20'), notes: 'Pièces détachées automobile' },
  });
  const e6 = await prisma.expedition.create({
    data: { reference: 'EXP-2026-006', clientId: c2.id, typeCommande: 'TRANSIT', portOrigine: 'Ouagadougou', paysOrigine: 'Burkina Faso', portDestination: 'Abidjan', paysDestination: 'Côte d\'Ivoire', typeTransport: 'ROUTIER', statut: 'EN_STOCK', incoterm: 'EXW', devise: 'XOF', coutExpedition: 3500000, argentRecu: 2450000, poidsTotalKg: 3200, nombreColis: 60, dateArriveePrevue: new Date('2026-05-30'), notes: 'Coton brut' },
  });

  // ─── Marchandises ───
  const m1 = await prisma.marchandise.create({
    data: { expeditionId: e1.id, description: 'Machine-outil CNC', categorie: 'Machinerie', marque: 'Haas', modele: 'VF-2', referenceFournisseur: 'HS-CNC-001', quantite: 2, unite: 'pcs', poidsUnitaire: 3500, poidsTotalKg: 7000, longueurCm: 300, largeurCm: 200, hauteurCm: 250, cbm: 15, prixUnitaireAchat: 18000000, prixUnitaireVente: 22500000, valeurUnitaire: 22500000, valeurTotale: 45000000, nombreColis: 12 },
  });
  const m2 = await prisma.marchandise.create({
    data: { expeditionId: e1.id, description: 'Moteur électrique 50kW', categorie: 'Électrique', quantite: 5, unite: 'pcs', poidsUnitaire: 800, poidsTotalKg: 4000, cbm: 12.5, prixUnitaireAchat: 2800000, valeurUnitaire: 3500000, valeurTotale: 17500000, nombreColis: 10 },
  });
  const m3 = await prisma.marchandise.create({
    data: { expeditionId: e1.id, description: 'Rouleaux convoyeur acier', categorie: 'Industrie', quantite: 50, unite: 'pcs', poidsUnitaire: 30, poidsTotalKg: 1500, cbm: 8, valeurUnitaire: 75000, valeurTotale: 3750000, nombreColis: 25 },
  });
  const m4 = await prisma.marchandise.create({
    data: { expeditionId: e2.id, description: 'Café bio Arabica 250g', categorie: 'Agriculture', quantite: 300, unite: 'cartons', poidsUnitaire: 2.5, poidsTotalKg: 750, cbm: 1.8, prixUnitaireAchat: 25000, prixUnitaireVente: 40000, valeurUnitaire: 40000, valeurTotale: 12000000, nombreColis: 30 },
  });
  const m5 = await prisma.marchandise.create({
    data: { expeditionId: e2.id, description: 'Cacao bio 500g', categorie: 'Agriculture', quantite: 150, unite: 'cartons', poidsUnitaire: 0.5, poidsTotalKg: 75, cbm: 0.3, valeurUnitaire: 15000, valeurTotale: 2250000, nombreColis: 15 },
  });
  const m6 = await prisma.marchandise.create({
    data: { expeditionId: e3.id, description: 'Tôles ondulées galvanisées', categorie: 'Construction', quantite: 200, unite: 'paquets', poidsUnitaire: 25, poidsTotalKg: 5000, cbm: 16, prixUnitaireAchat: 65000, valeurUnitaire: 140000, valeurTotale: 28000000, nombreColis: 80 },
  });
  const m7 = await prisma.marchandise.create({
    data: { expeditionId: e4.id, description: 'Mobilier salon', categorie: 'Ameublement', quantite: 1, unite: 'lot', poidsUnitaire: 350, poidsTotalKg: 350, cbm: 1, prixUnitaireAchat: 1500000, valeurUnitaire: 2000000, valeurTotale: 2000000, nombreColis: 4 },
  });
  const m8 = await prisma.marchandise.create({
    data: { expeditionId: e4.id, description: 'Appareils électroménagers', categorie: 'Électroménager', quantite: 4, unite: 'pcs', poidsUnitaire: 25, poidsTotalKg: 100, cbm: 0.2, valeurUnitaire: 375000, valeurTotale: 1500000, nombreColis: 4 },
  });
  const m9 = await prisma.marchandise.create({
    data: { expeditionId: e5.id, description: 'Plaquettes de frein', categorie: 'Auto', quantite: 1000, unite: 'pcs', poidsUnitaire: 0.5, poidsTotalKg: 500, cbm: 2, valeurUnitaire: 3500, valeurTotale: 3500000, nombreColis: 10 },
  });
  const m10 = await prisma.marchandise.create({
    data: { expeditionId: e5.id, description: 'Amortisseurs', categorie: 'Auto', quantite: 200, unite: 'pcs', poidsUnitaire: 4, poidsTotalKg: 800, cbm: 3.5, valeurUnitaire: 25000, valeurTotale: 5000000, nombreColis: 8 },
  });

  // ─── ExpeditionConteneur ───
  await prisma.expeditionConteneur.createMany({
    data: [
      { expeditionId: e1.id, conteneurId: cnt2.id, cbmEmbarque: 28, poidsEmbarque: 11000, colisEmbarques: 180, valeurEmbarquee: 35000000, dateChargement: new Date('2026-05-20') },
      { expeditionId: e5.id, conteneurId: cnt3.id, cbmEmbarque: 22, poidsEmbarque: 6200, colisEmbarques: 95, valeurEmbarquee: 18500000, dateChargement: new Date('2026-04-15') },
      { expeditionId: e3.id, conteneurId: cnt1.id, cbmEmbarque: 16, poidsEmbarque: 5000, colisEmbarques: 80, valeurEmbarquee: 28000000 },
      { expeditionId: e4.id, conteneurId: cnt4.id },
    ],
  });

  // ─── Stock ───
  const s1 = await prisma.stock.create({
    data: { expeditionId: e1.id, clientId: c1.id, marchandiseId: m1.id, description: 'Machine-outil CNC Haas VF-2', quantiteInitiale: 2, quantiteRestante: 1, poidsInitialKg: 7000, poidsRestantKg: 3500, statut: 'PARTIELLEMENT_RETIRE' },
  });
  const s2 = await prisma.stock.create({
    data: { expeditionId: e2.id, clientId: c2.id, marchandiseId: m4.id, description: 'Café bio Arabica', quantiteInitiale: 300, quantiteRestante: 0, poidsInitialKg: 750, poidsRestantKg: 0, statut: 'RETIRE' },
  });
  const s3 = await prisma.stock.create({
    data: { expeditionId: e6.id, clientId: c2.id, marchandiseId: m5.id, description: 'Coton brut', quantiteInitiale: 60, quantiteRestante: 45, poidsInitialKg: 3200, poidsRestantKg: 2400, statut: 'EN_STOCK' },
  });
  const s4 = await prisma.stock.create({
    data: { expeditionId: e5.id, clientId: c1.id, marchandiseId: m9.id, description: 'Plaquettes de frein', quantiteInitiale: 1000, quantiteRestante: 850, poidsInitialKg: 500, poidsRestantKg: 425, statut: 'PARTIELLEMENT_RETIRE' },
  });

  // ─── Livraisons ───
  await prisma.livraison.createMany({
    data: [
      { stockId: s1.id, expeditionId: e1.id, clientId: c1.id, quantiteRetiree: 1, poidsRetireKg: 3500, retraitPar: 'Kouassi Jean', telephoneRetrait: '+225 05 55 55 55', dateLivraison: new Date('2026-06-12'), notes: 'Livré sur site industriel' },
      { stockId: s2.id, expeditionId: e2.id, clientId: c2.id, quantiteRetiree: 300, poidsRetireKg: 750, retraitPar: 'Agent Africa Traders', telephoneRetrait: '+225 07 08 90 12', dateLivraison: new Date('2026-06-06'), notes: 'Livraison complète export France' },
      { stockId: s4.id, expeditionId: e5.id, clientId: c1.id, quantiteRetiree: 150, poidsRetireKg: 75, retraitPar: 'Mécanicien garage', dateLivraison: new Date('2026-05-28'), notes: 'Livraison partielle garage AutoPro' },
    ],
  });

  // ─── Demandes d'Achat ───
  await prisma.demandeAchat.createMany({
    data: [
      { clientId: c1.id, reference: 'DA-2026-001', date: new Date('2026-01-10'), produitRecherche: 'Grues mobiles 20T', categorieProduit: 'Machinerie lourde', quantiteDemandee: 3, budgetEstime: 75000000, dateSouhaitee: new Date('2026-03-01'), statut: 'VALIDEE' },
      { clientId: c2.id, reference: 'DA-2026-002', date: new Date('2026-02-15'), produitRecherche: 'Emballages carton', categorieProduit: 'Emballage', quantiteDemandee: 5000, budgetEstime: 2500000, dateSouhaitee: new Date('2026-03-15'), statut: 'DEVIS_RECU' },
      { clientId: c3.id, reference: 'DA-2026-003', date: new Date('2026-03-20'), produitRecherche: 'Tôles galvanisées', categorieProduit: 'Construction', quantiteDemandee: 200, budgetEstime: 35000000, dateSouhaitee: new Date('2026-05-01'), statut: 'NOUVELLE' },
      { clientId: c4.id, reference: 'DA-2026-004', date: new Date('2026-04-05'), produitRecherche: 'Climatiseurs split 12000 BTU', categorieProduit: 'Électroménager', quantiteDemandee: 10, budgetEstime: 4500000, dateSouhaitee: new Date('2026-05-20'), statut: 'RECHERCHE_FOURNISSEUR' },
      { clientId: c1.id, reference: 'DA-2026-005', date: new Date('2026-05-01'), produitRecherche: 'Pneus poids lourds', categorieProduit: 'Auto', quantiteDemandee: 100, budgetEstime: 12000000, dateSouhaitee: new Date('2026-07-01'), statut: 'REFUSEE' },
    ],
  });

  // ─── Achats Fournisseur ───
  await prisma.achatFournisseur.createMany({
    data: [
      { expeditionId: e1.id, fournisseurId: f1.id, dateCommande: new Date('2026-04-10'), montantAchat: 36000000, devise: 'CNY', tauxConversion: 85, montantFcfa: 306000000, acompte: 10800000, dateAcompte: new Date('2026-04-12'), solde: 25200000, dateDebutProduction: new Date('2026-04-15'), dateFinPrevue: new Date('2026-05-10'), dateFinReelle: new Date('2026-05-08'), notes: 'Production terminée dans les délais' },
      { expeditionId: e2.id, fournisseurId: f2.id, dateCommande: new Date('2026-05-10'), montantAchat: 7500000, devise: 'CNY', tauxConversion: 85, montantFcfa: 63750000, acompte: 3750000, dateAcompte: new Date('2026-05-12'), solde: 3750000, dateDebutProduction: new Date('2026-05-15'), dateFinPrevue: new Date('2026-05-28'), dateFinReelle: new Date('2026-05-25'), notes: 'Emballages sous-traités' },
      { expeditionId: e3.id, fournisseurId: f1.id, dateCommande: new Date('2026-06-01'), montantAchat: 13000000, devise: 'CNY', tauxConversion: 85, montantFcfa: 110500000, acompte: 3900000, dateAcompte: new Date('2026-06-03'), solde: 9100000, dateDebutProduction: new Date('2026-06-05'), dateFinPrevue: new Date('2026-06-25'), notes: 'En production' },
      { expeditionId: e5.id, fournisseurId: f1.id, dateCommande: new Date('2026-03-01'), montantAchat: 8000000, devise: 'CNY', tauxConversion: 85, montantFcfa: 68000000, acompte: 2400000, dateAcompte: new Date('2026-03-03'), solde: 5600000, dateDebutProduction: new Date('2026-03-05'), dateFinPrevue: new Date('2026-03-25'), dateFinReelle: new Date('2026-03-22'), notes: '' },
    ],
  });

  // ─── Suivi Production ───
  await prisma.suiviProductionEtape.createMany({
    data: [
      { expeditionId: e1.id, date: new Date('2026-04-15'), etape: 'COMMANDEE', commentaire: 'Commande confirmée avec fournisseur Guangzhou' },
      { expeditionId: e1.id, date: new Date('2026-04-12'), etape: 'ACOMPTE_VRESE', commentaire: 'Acompte 30% viré le 12/04' },
      { expeditionId: e1.id, date: new Date('2026-04-18'), etape: 'LANCEE', commentaire: 'Production lancée' },
      { expeditionId: e1.id, date: new Date('2026-05-05'), etape: 'CONTROLE_QUALITE', commentaire: 'Contrôle qualité passé, conformité OK' },
      { expeditionId: e1.id, date: new Date('2026-05-08'), etape: 'TERMINEE', commentaire: 'Production terminée' },
      { expeditionId: e1.id, date: new Date('2026-05-12'), etape: 'ENTREPOT', commentaire: 'Marchandise à l\'entrepôt portuaire Shanghai' },
      { expeditionId: e1.id, date: new Date('2026-05-20'), etape: 'CHARGEE', commentaire: 'Chargée dans conteneur HC40-002' },
      { expeditionId: e1.id, date: new Date('2026-06-05'), etape: 'EXPEDIEE', commentaire: 'Navire appareillé' },
      { expeditionId: e2.id, date: new Date('2026-05-15'), etape: 'COMMANDEE', commentaire: 'Préparation commande export' },
      { expeditionId: e2.id, date: new Date('2026-05-25'), etape: 'TERMINEE', commentaire: 'Produits prêts pour expédition aérienne' },
      { expeditionId: e5.id, date: new Date('2026-03-10'), etape: 'COMMANDEE' },
      { expeditionId: e5.id, date: new Date('2026-03-12'), etape: 'ACOMPTE_VRESE' },
      { expeditionId: e5.id, date: new Date('2026-03-22'), etape: 'TERMINEE' },
    ],
  });

  // ─── Documents ───
  await prisma.document.createMany({
    data: [
      { expeditionId: e1.id, nom: 'Facture commerciale EXP-001', type: 'FACTURE', cheminFichier: '/uploads/facture-exp-001.pdf', taille: 245000, mimeType: 'application/pdf' },
      { expeditionId: e1.id, nom: 'Packing List EXP-001', type: 'PACKING_LIST', cheminFichier: '/uploads/packing-001.pdf', taille: 180000, mimeType: 'application/pdf' },
      { expeditionId: e1.id, nom: 'Connaissement maritime EXP-001', type: 'CONNAISSEMENT', cheminFichier: '/uploads/bl-exp-001.pdf', taille: 320000, mimeType: 'application/pdf' },
      { expeditionId: e2.id, nom: 'Connaissement aérien EXP-002', type: 'CONNAISSEMENT', cheminFichier: '/uploads/awb-002.pdf', taille: 156000, mimeType: 'application/pdf' },
      { expeditionId: e2.id, nom: 'Bon de commande fournisseur', type: 'BON_COMMANDE', cheminFichier: '/uploads/bc-002.pdf', taille: 92000, mimeType: 'application/pdf' },
      { expeditionId: e3.id, nom: 'Devis fournisseur Yiwu', type: 'DEVIS', cheminFichier: '/uploads/devis-003.pdf', taille: 110000, mimeType: 'application/pdf' },
    ],
  });

  // ─── Dépenses ───
  await prisma.depense.createMany({
    data: [
      { conteneurId: cnt2.id, type: 'FRET', montant: 4500000, devise: 'XAF', montantXaf: 4500000, description: 'Fret maritime Shenzhen→Abidjan HC40', date: new Date('2026-06-01') },
      { conteneurId: cnt2.id, type: 'DOUANE', montant: 1250000, devise: 'XAF', montantXaf: 1250000, description: 'Dédouanement conteneur HC40-002', date: new Date('2026-06-10') },
      { conteneurId: cnt2.id, type: 'CAMIONNAGE', montant: 350000, devise: 'XAF', montantXaf: 350000, description: 'Transport port → entrepôt', date: new Date('2026-06-12') },
      { conteneurId: cnt2.id, type: 'MANUTENTION', montant: 200000, devise: 'XAF', montantXaf: 200000, description: 'Déchargement portuaire', date: new Date('2026-06-11') },
      { conteneurId: cnt2.id, type: 'ASSURANCE', montant: 780000, devise: 'XAF', montantXaf: 780000, description: 'Assurance maritime', date: new Date('2026-05-25') },
      { conteneurId: cnt3.id, type: 'DOUANE', montant: 850000, devise: 'XAF', montantXaf: 850000, description: 'Frais de douane DC20-003', date: new Date('2026-06-08') },
      { conteneurId: cnt3.id, type: 'STOCKAGE', montant: 120000, devise: 'XAF', montantXaf: 120000, description: 'Stockage entrepôt 15 jours', date: new Date('2026-06-15') },
      { conteneurId: cnt5.id, type: 'FRET', montant: 2100000, devise: 'XAF', montantXaf: 2100000, description: 'Fret aérien Abidjan→Paris', date: new Date('2026-06-01') },
      { conteneurId: cnt5.id, type: 'SURCHARGE', montant: 150000, devise: 'XAF', montantXaf: 150000, description: 'Surcharge carburant', date: new Date('2026-06-01') },
      { conteneurId: cnt5.id, type: 'DIVERSE', montant: 85000, devise: 'XAF', montantXaf: 85000, description: 'Frais administratifs', date: new Date('2026-06-02') },
    ],
  });

  // ─── Paiements ───
  await prisma.paiement.createMany({
    data: [
      { expeditionId: e1.id, date: new Date('2026-04-12'), montant: 10800000, devise: 'XAF', montantXaf: 10800000, type: 'ACOMPTE', modePaiement: 'VIREMENT', reference: 'ACOMPTE-001', referenceTransaction: 'TRF-2026-00412', montantFacture: 53100000, resteAPayer: 42300000, notes: 'Acompte 30% prestation transit' },
      { expeditionId: e2.id, date: new Date('2026-05-20'), montant: 7080000, devise: 'XAF', montantXaf: 7080000, type: 'ACOMPTE', modePaiement: 'VIREMENT', reference: 'ACOMPTE-002', montantFacture: 14160000, resteAPayer: 7080000 },
      { expeditionId: e2.id, date: new Date('2026-06-05'), montant: 7080000, devise: 'XAF', montantXaf: 7080000, type: 'SOLDE', modePaiement: 'VIREMENT', reference: 'SOLDE-002', montantFacture: 14160000, resteAPayer: 0, notes: 'Paiement complet' },
      { expeditionId: e5.id, date: new Date('2026-06-01'), montant: 5000000, devise: 'XAF', montantXaf: 5000000, type: 'ACOMPTE', modePaiement: 'ORANGE_MONEY', reference: 'OM-2026-0601', montantFacture: 21830000, resteAPayer: 16830000 },
    ],
  });

  // ─── Factures ───
  await prisma.facture.createMany({
    data: [
      { clientId: c1.id, expeditionId: e1.id, conteneurId: cnt2.id, numero: 'FAC-2026-001', date: new Date('2026-06-10'), montantHt: 45000000, tauxTva: 18, montantTva: 8100000, montantTtc: 53100000, devise: 'XAF', statut: 'EMISE', dateEcheance: new Date('2026-07-20'), notes: 'Prestation transit EXP-001' },
      { clientId: c2.id, expeditionId: e2.id, numero: 'FAC-2026-002', date: new Date('2026-06-05'), montantHt: 12000000, tauxTva: 18, montantTva: 2160000, montantTtc: 14160000, devise: 'XAF', statut: 'PAYEE', dateEcheance: new Date('2026-06-30'), notes: 'Export aérien EXP-002' },
      { clientId: c1.id, expeditionId: e5.id, numero: 'FAC-2026-003', date: new Date('2026-05-25'), montantHt: 18500000, tauxTva: 18, montantTva: 3330000, montantTtc: 21830000, devise: 'XAF', statut: 'EN_RETARD', dateEcheance: new Date('2026-06-15'), notes: 'Pièces auto EXP-005 - En retard' },
      { clientId: c3.id, expeditionId: e3.id, numero: 'FAC-2026-004', date: new Date('2026-06-15'), montantHt: 28000000, tauxTva: 18, montantTva: 5040000, montantTtc: 33040000, devise: 'XAF', statut: 'EMISE', dateEcheance: new Date('2026-07-15') },
    ],
  });

  // ─── Notifications ───
  await prisma.notification.createMany({
    data: [
      { userId: admin.id, titre: 'Bienvenue', message: 'Compte administrateur créé avec succès', type: 'SUCCESS', lue: true },
      { userId: admin.id, titre: 'Expédition en douane', message: 'EXP-2026-005 est bloquée en douane depuis 3 jours', type: 'WARNING', lue: false, lien: '/expeditions/5' },
      { userId: comptable.id, titre: 'Facture en retard', message: 'FAC-2026-003 est impayée et échue depuis 2 jours', type: 'DANGER', lue: false, lien: '/factures/3' },
      { userId: admin.id, titre: 'Nouvelle demande d\'achat', message: 'Nouvelle demande DA-2026-004 en attente de traitement', type: 'INFO', lue: false, lien: '/demandes-achat/4' },
      { userId: agent.id, titre: 'Conteneur arrivé', message: 'Le conteneur MBK-DC20-003 est arrivé au port', type: 'SUCCESS', lue: true, lien: '/conteneurs/3' },
    ],
  });

  // ─── Audit Logs ───
  await prisma.auditLog.createMany({
    data: [
      { userId: admin.id, entite: 'Client', entiteId: c1.id, action: 'CREATE', nouvelleValeur: { nom: 'TransGlobal SARL', reference: 'CLI-001' }, createdAt: new Date('2026-01-01') },
      { userId: admin.id, entite: 'Expedition', entiteId: e1.id, action: 'CREATE', nouvelleValeur: { reference: 'EXP-2026-001', clientId: c1.id }, createdAt: new Date('2026-04-10') },
      { userId: comptable.id, entite: 'Facture', entiteId: 3, action: 'CREATE', nouvelleValeur: { numero: 'FAC-2026-003', montantTtc: 21830000 }, createdAt: new Date('2026-05-25') },
    ],
  });

  console.log('=== Seed complete ===');
  console.log(`Users: ${admin.email}, ${agent.email}, ${comptable.email}`);
  console.log(`Clients: ${c1.nom}, ${c2.nom}, ${c3.nom}, ${c4.nom}, ${c5.nom}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
