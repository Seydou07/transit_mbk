'use client';

import { AreaChart, Area, PieChart, Pie, BarChart, Bar, Legend, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatMontant } from '@/lib/finance';

const chartColors = ['#0077B6', '#00B4D8', '#6DA87E', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1'];

function abbreviateNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1).replace('.', ',') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1).replace('.', ',') + 'k';
  return String(n);
}

const demoConteursOccupation = [
  { name: 'CONT-001', usedCBM: 32, remainingCBM: 3 },
  { name: 'CONT-002', usedCBM: 28, remainingCBM: 7 },
  { name: 'CONT-003', usedCBM: 35, remainingCBM: 0 },
];

const demoActivityByMonth = [
  { name: 'Jan', recettes: 12000000, depenses: 8000000 },
  { name: 'Fév', recettes: 15000000, depenses: 9000000 },
  { name: 'Mar', recettes: 20000000, depenses: 13000000 },
  { name: 'Avr', recettes: 18000000, depenses: 11000000 },
  { name: 'Mai', recettes: 25000000, depenses: 15000000 },
  { name: 'Juin', recettes: 22000000, depenses: 14000000 },
];

const demoDepensesParCategorie = [
  { name: 'Booking', value: 3000000 },
  { name: 'Douane', value: 2500000 },
  { name: 'Transport', value: 4000000 },
  { name: 'Déchargement', value: 800000 },
  { name: 'Carburant', value: 1200000 },
  { name: 'Autres', value: 500000 },
];

const demoClientsDebiteurs = [
  { name: 'Client A', value: 2500000 },
  { name: 'Client B', value: 1800000 },
  { name: 'Client C', value: 1200000 },
  { name: 'Client D', value: 800000 },
];

interface ChartSectionProps {
  conteneursOccupation: any[];
  activityByMonth: any[];
  depensesParCategorie: any[];
  clientsDebiteurs: any[];
}

export default function ChartSection({ conteneursOccupation, activityByMonth, depensesParCategorie, clientsDebiteurs }: ChartSectionProps) {
  return (
    <>
      <div className="chart-grid">
        <div className="chart-card">
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>Occupation des Conteneurs (CBM)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={conteneursOccupation.length > 0 ? conteneursOccupation : demoConteursOccupation}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(value: any) => formatMontant(Number(value) || 0)} />
              <Bar dataKey="usedCBM" name="CBM Utilisé" fill="#0077B6" radius={[8, 8, 0, 0]} barSize={20} isAnimationActive={false} />
              <Bar dataKey="remainingCBM" name="CBM Restant" fill="#E2E8F0" radius={[8, 8, 0, 0]} barSize={20} isAnimationActive={false} />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>Recettes vs Dépenses par Mois</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={activityByMonth}>
              <defs>
                <linearGradient id="colorRecettes" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0077B6" stopOpacity={0.3}/><stop offset="95%" stopColor="#0077B6" stopOpacity={0}/></linearGradient>
                <linearGradient id="colorDepenses" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/><stop offset="95%" stopColor="#EF4444" stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={abbreviateNumber} width={50} />
              <Tooltip formatter={(value: any) => formatMontant(Number(value) || 0)} />
              <Area type="monotone" dataKey="recettes" name="Recettes" stroke="#0077B6" strokeWidth={2.5} fill="url(#colorRecettes)" isAnimationActive={false} />
              <Area type="monotone" dataKey="depenses" name="Dépenses" stroke="#EF4444" strokeWidth={2.5} fill="url(#colorDepenses)" isAnimationActive={false} />
              <Legend />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="chart-grid">
        <div className="chart-card">
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>Montants à Recouvrer par Client</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={clientsDebiteurs.length > 0 ? clientsDebiteurs : demoClientsDebiteurs}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={abbreviateNumber} width={32} />
              <Tooltip formatter={(value: any) => formatMontant(Number(value) || 0)} />
              <Bar dataKey="value" name="Montant" fill="#F59E0B" radius={[8, 8, 0, 0]} barSize={24} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>Répartition des Dépenses</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={depensesParCategorie.length > 0 ? depensesParCategorie : demoDepensesParCategorie} cx="50%" cy="50%" innerRadius={50} outerRadius={95} dataKey="value" strokeWidth={2} stroke="#fff" paddingAngle={4} labelLine={false} isAnimationActive={false}>
                {(depensesParCategorie.length > 0 ? depensesParCategorie : demoDepensesParCategorie).map((entry: any, index: number) => <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />)}
              </Pie>
              <Tooltip formatter={(value: any) => formatMontant(Number(value) || 0)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
