'use client';

import { useState, useEffect } from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { Package, TrendingUp, DollarSign, Ship, Users, Wallet, CheckCircle, TrendingDown } from 'lucide-react';
import { formatNumber } from '@/lib/format';
import { formatMontant, formatMontantCourt } from '@/lib/finance';
import dynamic from 'next/dynamic';

const ChartSection = dynamic(() => import('./charts'), { ssr: false });

interface DashboardData {
  stats: {
    conteneursEnCours: number;
    conteneursArrives: number;
    conteneursClotures: number;
    clientsActifs: number;
    recettesPrevues: number;
    recettesEncaissees: number;
    depensesTotal: number;
    beneficeEstime: number;
  };
  depensesParCategorie: any[];
  conteneursOccupation: any[];
  activityByMonth: any[];
  clientsDebiteurs: any[];
}

const defaultStats = {
  conteneursEnCours: 0,
  conteneursArrives: 0,
  conteneursClotures: 0,
  clientsActifs: 0,
  recettesPrevues: 0,
  recettesEncaissees: 0,
  depensesTotal: 0,
  beneficeEstime: 0,
};

function abbreviateNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1).replace('.', ',') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1).replace('.', ',') + 'k';
  return String(n);
}



export default function DashboardPage() {
  const [dashData, setDashData] = useState<DashboardData>({ 
    stats: defaultStats, 
    depensesParCategorie: [],
    conteneursOccupation: [],
    activityByMonth: [],
    clientsDebiteurs: []
  });

  useEffect(() => {
    (async () => {
      try { 
        const r = await fetch('/api/dashboard'); 
        if (r.ok) {
          const data = await r.json();
          setDashData(prev => ({ ...prev, ...data }));
        } 
      } catch {}
    })();
  }, []);

  const { stats = defaultStats, depensesParCategorie = [], conteneursOccupation = [], activityByMonth = [], clientsDebiteurs = [] } = dashData;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <h1 className="page-title">Tableau de Bord</h1>
        <p className="page-subtitle" style={{ marginTop: '0.25rem' }}>Aperçu de vos opérations de transit et logistiques.</p>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <StatCard title="Conteneurs en cours" value={formatNumber(stats.conteneursEnCours)} icon={<Package size={22} />} index={0} />
        <StatCard title="Conteneurs arrivés" value={formatNumber(stats.conteneursArrives)} icon={<CheckCircle size={22} />} index={1} />
        <StatCard title="Conteneurs clôturés" value={formatNumber(stats.conteneursClotures)} icon={<Ship size={22} />} index={2} />
        <StatCard title="Clients actifs" value={formatNumber(stats.clientsActifs)} icon={<Users size={22} />} index={3} />
        <StatCard title="Recettes prévues" value={formatMontantCourt(stats.recettesPrevues)} icon={<TrendingUp size={22} />} index={4} />
        <StatCard title="Recettes encaissées" value={formatMontantCourt(stats.recettesEncaissees)} icon={<DollarSign size={22} />} index={5} />
        <StatCard title="Dépenses" value={formatMontantCourt(stats.depensesTotal)} icon={<Wallet size={22} />} index={6} />
        <StatCard title="Bénéfice estimé" value={formatMontantCourt(stats.beneficeEstime)} icon={<TrendingDown size={22} />} index={7} />
      </div>

      <ChartSection conteneursOccupation={conteneursOccupation} activityByMonth={activityByMonth} depensesParCategorie={depensesParCategorie} clientsDebiteurs={clientsDebiteurs} />
    </div>
  );
}
