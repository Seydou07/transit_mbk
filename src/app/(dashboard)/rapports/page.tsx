'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { BarChart3, FileDown, Calendar, Package, TrendingUp, DollarSign, Ship } from 'lucide-react';
import dynamic from 'next/dynamic';
import { StatCard } from '@/components/dashboard/StatCard';

const RapportsCharts = dynamic(() => import('./charts'), { ssr: false });

const chartData = [
  { name: 'Jan', expéditions: 4, tonnage: 1200, clients: 3, revenus: 25000000 },
  { name: 'Fév', expéditions: 6, tonnage: 1800, clients: 5, revenus: 35000000 },
  { name: 'Mar', expéditions: 9, tonnage: 2800, clients: 7, revenus: 48000000 },
  { name: 'Avr', expéditions: 7, tonnage: 2200, clients: 6, revenus: 42000000 },
  { name: 'Mai', expéditions: 11, tonnage: 3400, clients: 9, revenus: 55000000 },
  { name: 'Juin', expéditions: 8, tonnage: 2600, clients: 8, revenus: 39000000 },
];

const pieData = [
  { name: 'Maritime', value: 45, color: '#0077B6' },
  { name: 'Aérien', value: 25, color: '#00B4D8' },
  { name: 'Routier', value: 30, color: '#48CAE4' },
];

export default function RapportsPage() {
  const [period, setPeriod] = useState('mensuel');
  const [type, setType] = useState('expeditions');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div><h1 className="page-title">Rapports & Analyses</h1><p className="page-subtitle" style={{ marginTop: '0.25rem' }}>Visualisez les données clés de votre activité.</p></div>

      <div className="kpi-grid">
        <StatCard title="Expéditions" value="84" change={12} icon={<Package size={22} />} />
        <StatCard title="Clients" value="18" change={8} icon={<TrendingUp size={22} />} />
        <StatCard title="En Transit" value="6" change={2} icon={<Ship size={22} />} />
        <StatCard title="Volume Total" value="12,400 kg" change={18} icon={<DollarSign size={22} />} />
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--slate-800)', marginBottom: '1.25rem' }}>Générer un Rapport</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <div>
            <label className="form-label">Période</label>
            <div className="input-group">
              <Calendar size={18} color="var(--slate-400)" />
              <select className="form-select" value={period} onChange={e => setPeriod(e.target.value)}>
                <option value="hebdomadaire">Hebdomadaire</option>
                <option value="mensuel">Mensuel</option>
                <option value="trimestriel">Trimestriel</option>
                <option value="annuel">Annuel</option>
              </select>
            </div>
          </div>
          <div>
            <label className="form-label">Type de Rapport</label>
            <div className="input-group">
              <BarChart3 size={18} color="var(--slate-400)" />
              <select className="form-select" value={type} onChange={e => setType(e.target.value)}>
                <option value="expeditions">Expéditions</option>
                <option value="clients">Clients</option>
                <option value="stock">Stock</option>
                <option value="financier">Financier</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <Button><FileDown size={18} /> Générer & Exporter</Button>
          </div>
        </div>
      </div>

      <RapportsCharts chartData={chartData} pieData={pieData} />

      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--slate-800)', marginBottom: '1rem' }}>Rapports Récents</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { name: 'Rapport Expéditions — Juin 2026', date: '15/06/2026', size: '2.4 MB' },
            { name: 'Rapport Clients — Juin 2026', date: '14/06/2026', size: '1.1 MB' },
            { name: 'Rapport Stock — Mai 2026', date: '01/06/2026', size: '3.7 MB' },
          ].map((r, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0.75rem 1rem', backgroundColor: 'var(--slate-50)',
              borderRadius: 'var(--radius-lg)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div className="icon-box" style={{ width: 34, height: 34, backgroundColor: '#EFF6FF' }}>
                  <BarChart3 size={16} color="var(--fleet-blue)" />
                </div>
                <div>
                  <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--slate-800)' }}>{r.name}</span>
                  <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--slate-500)' }}>{r.date} · {r.size}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm"><FileDown size={16} /></Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
