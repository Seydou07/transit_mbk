'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Search, Scale, Package, User, Calendar, Truck, MapPin, FileText } from 'lucide-react';

interface Livraison {
  id: number;
  quantiteRetiree: number;
  poidsRetireKg?: number;
  retraitPar?: string;
  notes?: string;
  dateLivraison: string;
  client: { nom: string };
  expedition: { reference: string };
  stock: { description: string };
}

export default function LivraisonsPage() {
  const [items, setItems] = useState<Livraison[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [detailItem, setDetailItem] = useState<Livraison | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/livraisons', { cache: 'no-store' });
      if (r.ok) { setItems(await r.json()); }
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const filtered = items.filter(item => !search || item.client.nom.toLowerCase().includes(search.toLowerCase()) || item.expedition.reference.toLowerCase().includes(search.toLowerCase()) || item.stock.description.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><h1 className="page-title">Livraisons</h1><p className="page-subtitle" style={{ marginTop: '0.25rem' }}>Historique des livraisons</p></div>
      </div>

      <div className="table-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '1rem', borderBottom: '1px solid var(--slate-100)' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} color="var(--slate-400)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input className="form-input" placeholder="Rechercher par client, expédition, article..." autoComplete="off" style={{ paddingLeft: '2.75rem' }} value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <table className="table">
          <thead><tr><th>Client</th><th>Expédition</th><th>Article</th><th>Quantité</th><th>Poids (kg)</th><th>Retiré par</th><th>Date</th></tr></thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--slate-400)' }}>Chargement...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--slate-400)' }}>Aucune livraison trouvée</td></tr>
            ) : filtered.map(item => (
              <tr key={item.id} style={{ cursor: 'pointer' }} onClick={() => setDetailItem(item)}>
                <td style={{ fontWeight: 500 }}>{item.client.nom}</td>
                <td style={{ fontSize: '0.9rem', color: 'var(--slate-700)' }}>{item.expedition.reference}</td>
                <td style={{ fontSize: '0.9rem', color: 'var(--slate-700)' }}>{item.stock.description}</td>
                <td><Badge variant="info">{item.quantiteRetiree}</Badge></td>
                <td style={{ fontSize: '0.9rem', color: 'var(--slate-700)' }}>{item.poidsRetireKg?.toLocaleString() || 0}</td>
                <td style={{ fontSize: '0.9rem', color: 'var(--slate-700)' }}>{item.retraitPar || '-'}</td>
                <td style={{ fontSize: '0.9rem', color: 'var(--slate-700)' }}>{new Date(item.dateLivraison).toLocaleDateString('fr-FR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={detailItem !== null}
        onClose={() => setDetailItem(null)}
        title={`Détails Livraison`}
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDetailItem(null)}>Fermer</Button>
          </>
        }
      >
        {detailItem && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="modal-section">
              <div className="modal-section-title">Informations Générales</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div><span className="form-label">Client</span><p style={{ fontWeight: 600 }}>{detailItem.client?.nom || '-'}</p></div>
                <div><span className="form-label">Expédition</span><p style={{ fontWeight: 500 }}>{detailItem.expedition?.reference || '-'}</p></div>
                <div><span className="form-label">Article</span><p style={{ fontWeight: 500 }}>{detailItem.stock?.description || '-'}</p></div>
                <div><span className="form-label">Date Livraison</span><p style={{ fontWeight: 500 }}>{new Date(detailItem.dateLivraison).toLocaleDateString('fr-FR')}</p></div>
              </div>
            </div>

            <div className="modal-section">
              <div className="modal-section-title">Quantités & Poids Retirés</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div><span className="form-label">Quantité</span><p style={{ fontWeight: 700, color: 'var(--info)' }}><Badge variant="info">{detailItem.quantiteRetiree}</Badge></p></div>
                <div><span className="form-label">Poids</span><p style={{ fontWeight: 600 }}>{detailItem.poidsRetireKg?.toLocaleString() || 0} kg</p></div>
              </div>
            </div>

            <div className="modal-section">
              <div className="modal-section-title">Informations Retrait</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div><span className="form-label">Retiré par</span><p style={{ fontWeight: 500 }}>{detailItem.retraitPar || '-'}</p></div>
              </div>
            </div>

            {detailItem.notes && (
              <div className="modal-section">
                <div className="modal-section-title">Notes</div>
                <p style={{ color: 'var(--slate-600)' }}>{detailItem.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
