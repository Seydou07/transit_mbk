'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Package, TrendingDown, TrendingUp, Scale, Box, Truck, Search, Eye } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';

interface StockItem {
  id: number; description: string; quantiteInitiale: number; quantiteRestante: number;
  poidsInitialKg?: number; poidsRestantKg?: number;
  statut: string; dateMiseEnStock: string;
  client: { nom: string }; expedition: { reference: string };
  marchandise: { description: string };
}

export default function StockPage() {
  const [items, setItems] = useState<StockItem[]>([]);
  const [totals, setTotals] = useState({ totalPoids: 0, totalQuantite: 0, totalLignes: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<StockItem | null>(null);
  const [detailItem, setDetailItem] = useState<StockItem | null>(null);
  const [livraisonForm, setLivraisonForm] = useState({ quantite: '', destinataire: '', contactDestinataire: '', adresseLivraison: '', dateLivraison: new Date().toISOString().slice(0, 10), notes: '' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/stock');
      if (r.ok) {
        const data = await r.json();
        setItems(data.stock);
        setTotals(data.totals);
      }
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openLivraison = (item: StockItem) => {
    setSelectedStock(item);
    setLivraisonForm({ quantite: String(item.quantiteRestante), destinataire: item.client?.nom || '', contactDestinataire: '', adresseLivraison: '', dateLivraison: new Date().toISOString().slice(0, 10), notes: '' });
    setIsOpen(true);
  };

  const handleLivrer = async () => {
    if (!selectedStock) return;
    setSaving(true);
    try {
      const r = await fetch('/api/livraisons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stockId: selectedStock.id, ...livraisonForm, quantite: Number(livraisonForm.quantite) }),
      });
      if (r.ok) { setIsOpen(false); load(); }
    } finally { setSaving(false); }
  };

  const filtered = items.filter(item => !search || item.description?.toLowerCase().includes(search.toLowerCase()) || item.client?.nom?.toLowerCase().includes(search.toLowerCase()) || item.expedition?.reference?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div><h1 className="page-title">Stock</h1><p className="page-subtitle" style={{ marginTop: '0.25rem' }}>Gestion du stock</p></div>

      <div className="kpi-grid">
        <StatCard title="Articles en stock" value={totals.totalQuantite} icon={<Box size={22} />} />
        <StatCard title="Poids total (kg)" value={totals.totalPoids.toLocaleString()} icon={<Scale size={22} />} />
        <StatCard title="Lignes de stock" value={totals.totalLignes} icon={<Package size={22} />} />
      </div>

      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '1rem', borderBottom: '1px solid var(--slate-100)' }}>
          <form autoComplete="off" onSubmit={e => e.preventDefault()} className="input-group"><Search size={18} color="var(--slate-400)" />
            <input className="input" placeholder="Rechercher par article, client, expédition..." autoComplete="off" name="table-search" value={search} onChange={e => setSearch(e.target.value)} />
          </form>
        </div>
        <table className="table">
          <thead><tr><th>Article</th><th>Client</th><th>Expédition</th><th>Quantité</th><th>Poids (kg)</th><th>Statut</th><th>Mise en stock</th><th style={{ width: 100 }}>Actions</th></tr></thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: 'var(--slate-400)' }}>Chargement...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: 'var(--slate-400)' }}>Aucun article en stock</td></tr>
            ) : filtered.map(item => {
              const statusVariant = item.statut === 'EN_STOCK' ? 'success' : item.statut === 'PARTIELLEMENT_RETIRE' ? 'info' : 'default';
              const qtyTrend = item.quantiteInitiale === item.quantiteRestante ? null : item.quantiteRestante < item.quantiteInitiale ? <TrendingDown size={12} color="var(--danger)" /> : <TrendingUp size={12} color="var(--success)" />;
              const canDeliver = item.quantiteRestante > 0;
              return (
                <tr key={item.id}>
                  <td style={{ fontWeight: 500 }}>{item.description}</td>
                  <td style={{ fontSize: '0.85rem' }}>{item.client.nom}</td>
                  <td style={{ fontSize: '0.85rem' }}>{item.expedition.reference}</td>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 600 }}>{item.quantiteRestante}</span>
                    <span style={{ color: 'var(--slate-500)', fontSize: '0.85rem' }}>/ {item.quantiteInitiale}</span>
                    {qtyTrend}
                  </td>
                  <td>{item.poidsRestantKg?.toLocaleString() || 0}</td>
                  <td><Badge variant={statusVariant}>{item.statut}</Badge></td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>{new Date(item.dateMiseEnStock).toLocaleDateString('fr-FR')}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                      <button className="btn btn-ghost btn-icon" onClick={() => setDetailItem(item)} title="Détails"><Eye size={16} /></button>
                      {canDeliver && (
                        <button className="btn btn-ghost btn-icon" style={{ color: 'var(--fleet-blue)' }} onClick={() => openLivraison(item)} title="Remettre au client"><Truck size={16} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal
        open={detailItem !== null}
        onClose={() => setDetailItem(null)}
        title={`Détails Article en Stock`}
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDetailItem(null)}>Fermer</Button>
            {detailItem && detailItem.quantiteRestante > 0 && (
              <Button onClick={() => { const item = detailItem; setDetailItem(null); openLivraison(item); }}><Truck size={16} style={{ marginRight: '0.5rem' }} /> Remettre au client</Button>
            )}
          </>
        }
      >
        {detailItem && (
          <div className="modal-layout">
            <div className="modal-section">
              <div className="modal-section-title">Informations Générales</div>
              <div className="modal-grid-2">
                <div><span className="form-label">Article</span><p style={{ fontWeight: 600 }}>{detailItem.description}</p></div>
                <div><span className="form-label">Client</span><p>{detailItem.client?.nom || '-'}</p></div>
                <div><span className="form-label">Expédition</span><p>{detailItem.expedition?.reference || '-'}</p></div>
                <div><span className="form-label">Statut</span><p><Badge variant={detailItem.statut === 'EN_STOCK' ? 'success' : detailItem.statut === 'PARTIELLEMENT_RETIRE' ? 'info' : 'default'}>{detailItem.statut}</Badge></p></div>
                <div><span className="form-label">Mise en stock</span><p>{new Date(detailItem.dateMiseEnStock).toLocaleDateString('fr-FR')}</p></div>
              </div>
            </div>

            <div className="modal-section">
              <div className="modal-section-title">Quantités & Poids</div>
              <div className="modal-grid-2">
                <div><span className="form-label">Quantité Restante</span><p style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{detailItem.quantiteRestante} / {detailItem.quantiteInitiale}</p></div>
                <div><span className="form-label">Poids Restant</span><p>{detailItem.poidsRestantKg?.toLocaleString() || 0} kg / {detailItem.poidsInitialKg?.toLocaleString() || 0} kg</p></div>
              </div>
            </div>

            {detailItem.marchandise && (
              <div className="modal-section">
                <div className="modal-section-title">Détails Marchandise</div>
                <p style={{ color: 'var(--slate-600)' }}>{detailItem.marchandise.description}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title="Remettre au client (Livraison)"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>Annuler</Button>
            <Button onClick={handleLivrer} disabled={saving}>{saving ? 'Enregistrement...' : 'Confirmer la remise'}</Button>
          </>
        }
      >
        <div className="modal-layout-grid">
          <div className="modal-layout">
            {selectedStock && (
              <div className="modal-section">
                <div className="modal-section-title">Article</div>
                <div className="modal-grid-2">
                  <div><span className="form-label">Description</span><p style={{ fontWeight: 600 }}>{selectedStock.description}</p></div>
                  <div><span className="form-label">Quantité disponible</span><p style={{ fontWeight: 600 }}>{selectedStock.quantiteRestante}</p></div>
                </div>
              </div>
            )}
            <div className="modal-section">
              <div className="modal-section-title">Détails de la livraison</div>
              <div className="modal-grid-2">
                <Input label="Quantité à remettre" type="number" value={livraisonForm.quantite} onChange={e => setLivraisonForm({ ...livraisonForm, quantite: e.target.value })} />
                <Input label="Date de livraison" type="date" value={livraisonForm.dateLivraison} onChange={e => setLivraisonForm({ ...livraisonForm, dateLivraison: e.target.value })} />
                <div className="col-span-2">
                  <Input label="Destinataire" value={livraisonForm.destinataire} onChange={e => setLivraisonForm({ ...livraisonForm, destinataire: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <Input label="Contact destinataire" value={livraisonForm.contactDestinataire} onChange={e => setLivraisonForm({ ...livraisonForm, contactDestinataire: e.target.value })} placeholder="Téléphone" />
                </div>
              </div>
            </div>
          </div>
          <div className="modal-layout">
            <div className="modal-section">
              <div className="modal-section-title">Localisation & Notes</div>
              <div style={{ marginBottom: '1rem' }}>
                <Input label="Adresse de livraison" value={livraisonForm.adresseLivraison} onChange={e => setLivraisonForm({ ...livraisonForm, adresseLivraison: e.target.value })} placeholder="Adresse complète" />
              </div>
              <textarea className="input" placeholder="Notes de livraison..." style={{ minHeight: '90px', resize: 'vertical', width: '100%' }} value={livraisonForm.notes} onChange={e => setLivraisonForm({ ...livraisonForm, notes: e.target.value })} />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
