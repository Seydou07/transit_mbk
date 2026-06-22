'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Search, Eye, TrendingUp, TrendingDown, DollarSign, Receipt, Wallet, BarChart3 } from 'lucide-react';
import { formatMontant } from '@/lib/finance';

interface ConteneurFinance {
  id: number; numero: string; statut: string;
  dateArrivee: string | null;
  expedition: { id: number; reference: string; client: { nom: string } };
}

interface RapportFinance {
  conteneur: any; depenses: any[]; factures: any[];
  expeditions: any[]; finance: {
    totalDepenses: number; recettesPrevues: number;
    recettesEncaissees: number; restesAEncaisser: number;
    profitActuel: number; profitEstime: number; marge: number;
    depensesParType: Record<string, number>;
  };
}

const statutLabels: Record<string, string> = {
  EN_PREPARATION: 'En préparation', CHARGE: 'Chargé', EN_TRANSIT: 'En transit',
  ARRIVE: 'Arrivé', DOUANE: 'Douane', FERME: 'Fermé',
};

export default function FinanceConteneurPage() {
  const [conteneurs, setConteneurs] = useState<any[]>([]);
  const [rapports, setRapports] = useState<Record<number, RapportFinance>>({});
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loadingRapports, setLoadingRapports] = useState(false);

  const loadConteneurs = () => { fetch('/api/conteneurs').then(r => r.ok && r.json()).then(d => { if (d) setConteneurs(d); }).catch(() => {}); };
  useEffect(() => { loadConteneurs(); }, []);

  const loadRapport = async (id: number) => {
    if (rapports[id]) { setSelectedId(id); return; }
    setLoadingRapports(true);
    try {
      const r = await fetch(`/api/conteneurs/${id}/rapports`);
      if (r.ok) { const data = await r.json(); setRapports(prev => ({ ...prev, [id]: data })); setSelectedId(id); }
    } finally { setLoadingRapports(false); }
  };

  useEffect(() => {
    if (conteneurs.length > 0 && Object.keys(rapports).length === 0) {
      conteneurs.slice(0, 10).forEach(c => {
        fetch(`/api/conteneurs/${c.id}/rapports`).then(r => r.ok && r.json()).then(data => { if (data) setRapports(prev => ({ ...prev, [c.id]: data })); }).catch(() => {});
      });
    }
  }, [conteneurs]);

  const selected = selectedId !== null ? rapports[selectedId] : null;
  const filtered = conteneurs.filter(c => !search || c.numero?.toLowerCase().includes(search.toLowerCase()));
  const totalRecettes = Object.values(rapports).reduce((s, r) => s + r.finance.recettesPrevues, 0);
  const totalDepenses = Object.values(rapports).reduce((s, r) => s + r.finance.totalDepenses, 0);
  const totalProfit = Object.values(rapports).reduce((s, r) => s + r.finance.profitEstime, 0);
  const profitPercent = totalRecettes > 0 ? ((totalProfit / totalRecettes) * 100).toFixed(1) : '0';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><h1 className="page-title">Finance Conteneur</h1><p className="page-subtitle" style={{ marginTop: '0.25rem' }}>Analyse financière par conteneur</p></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div className="icon-box" style={{ background: 'rgba(0, 119, 182, 0.1)', color: 'var(--fleet-blue)' }}><DollarSign size={20} /></div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-500)' }}>Recettes totales</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--fleet-blue)' }}>{formatMontant(totalRecettes)}</div>
        </div>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div className="icon-box" style={{ background: 'rgba(225, 29, 72, 0.1)', color: '#E11D48' }}><Wallet size={20} /></div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-500)' }}>Dépenses totales</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#E11D48' }}>{formatMontant(totalDepenses)}</div>
        </div>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div className="icon-box" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}><TrendingUp size={20} /></div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-500)' }}>Profit estimé</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10B981' }}>{formatMontant(totalProfit)} <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-400)' }}>({profitPercent}%)</span></div>
        </div>
      </div>

      <div className="table-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '1rem', borderBottom: '1px solid var(--slate-100)' }}>
          <form autoComplete="off" onSubmit={e => e.preventDefault()} className="input-group"><Search size={18} color="var(--slate-400)" />
            <input className="input" placeholder="Rechercher un conteneur..." autoComplete="off" name="table-search" value={search} onChange={e => setSearch(e.target.value)} />
          </form>
        </div>
        <table className="table">
          <thead><tr><th>Conteneur</th><th>Statut</th><th>Recettes</th><th>Dépenses</th><th>Profit</th><th>Marge</th><th style={{ width: 80 }}>Actions</th></tr></thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--slate-400)' }}>Aucun conteneur trouvé</td></tr>
            ) : filtered.map(c => {
              const r = rapports[c.id];
              const profit = r ? r.finance.profitEstime : 0;
              const recettes = r ? r.finance.recettesPrevues : 0;
              const depenses = r ? r.finance.totalDepenses : 0;
              const marge = r ? r.finance.marge : 0;
              return (
              <tr key={c.id}>
                <td style={{ fontWeight: 600 }}>{c.numero}</td>
                <td><Badge variant={c.statut === 'FERME' ? 'success' : c.statut === 'EN_TRANSIT' ? 'info' : 'warning'}>{statutLabels[c.statut as keyof typeof statutLabels] || c.statut}</Badge></td>
                <td style={{ fontWeight: 600, color: recettes > 0 ? 'var(--fleet-blue)' : 'var(--slate-400)' }}>{r ? formatMontant(recettes) : '-'}</td>
                <td style={{ fontWeight: 600, color: depenses > 0 ? '#E11D48' : 'var(--slate-400)' }}>{r ? formatMontant(depenses) : '-'}</td>
                <td style={{ fontWeight: 700, color: profit >= 0 ? '#10B981' : '#E11D48' }}>{r ? formatMontant(profit) : '-'}</td>
                <td><span style={{ fontWeight: 600, color: marge >= 15 ? '#10B981' : marge >= 5 ? 'var(--fleet-blue)' : '#E11D48' }}>{r ? `${marge}%` : '-'}</span></td>
                <td><button className="btn btn-ghost btn-icon" onClick={() => loadRapport(c.id)} disabled={loadingRapports}><BarChart3 size={16} /></button></td>
              </tr>
            );})}
          </tbody>
        </table>
      </div>

      <Modal
        open={selected !== null}
        onClose={() => setSelectedId(null)}
        title={`Rapport financier — ${selected?.conteneur?.numero || ''}`}
        footer={<Button variant="ghost" onClick={() => setSelectedId(null)}>Fermer</Button>}
      >
        {selected && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div className="card" style={{ padding: '1rem', background: '#fff' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', marginBottom: '0.35rem' }}>RECETTES</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0077B6' }}>{formatMontant(selected.finance.recettesPrevues)}</div>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Encaissé: {formatMontant(selected.finance.recettesEncaissees)}</div>
              </div>
              <div className="card" style={{ padding: '1rem', background: '#fff' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', marginBottom: '0.35rem' }}>DÉPENSES</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#E11D48' }}>{formatMontant(selected.finance.totalDepenses)}</div>
              </div>
              <div className="card" style={{ padding: '1rem', background: '#fff' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', marginBottom: '0.35rem' }}>PROFIT ESTIMÉ</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: selected.finance.profitEstime >= 0 ? '#10B981' : '#E11D48' }}>{formatMontant(selected.finance.profitEstime)}</div>
              </div>
              <div className="card" style={{ padding: '1rem', background: '#fff' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', marginBottom: '0.35rem' }}>MARGE</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: selected.finance.marge >= 15 ? '#10B981' : '#E11D48' }}>{selected.finance.marge}%</div>
              </div>
            </div>

            <div className="modal-section">
              <div className="modal-section-title">Dépenses par type</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {Object.entries(selected.finance.depensesParType).length === 0 ? (
                  <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Aucune dépense</p>
                ) : Object.entries(selected.finance.depensesParType).map(([type, montant]) => (
                  <div key={type} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #F1F5F9' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{type}</span>
                    <span style={{ fontWeight: 700 }}>{formatMontant(montant)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-section">
              <div className="modal-section-title">Factures liées</div>
              <table className="table">
                <thead><tr><th>Client</th><th>Montant TTC</th><th>Statut</th></tr></thead>
                <tbody>
                  {selected.factures.length === 0 ? (
                    <tr><td colSpan={3} style={{ textAlign: 'center', color: '#94A3B8', padding: '1rem' }}>Aucune facture</td></tr>
                  ) : selected.factures.map((f: any) => (
                    <tr key={f.id}>
                      <td>{f.client?.nom || '-'}</td>
                      <td style={{ fontWeight: 600 }}>{formatMontant(f.montantTtc)}</td>
                      <td><Badge variant={f.statut === 'PAYEE' ? 'success' : f.statut === 'ENVOYEE' ? 'info' : 'warning'}>{f.statut}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
