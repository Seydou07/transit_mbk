'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { formatMontant } from '@/lib/finance';

interface Depense {
  id: number; conteneurId: number; date: string; type: string;
  montant: number; devise: string; montantXaf: number | null;
  description: string; fournisseur: string | null;
  titre: string | null; categoriePersonnalisee: string | null;
  liaison: string | null; justificatifType: string | null;
  justificatifPath: string | null; tauxChange: number | null;
  conteneur: { numero: string };
}

const typeLabels: Record<string, string> = {
  FRET: 'Fret', DOUANE: 'Douane', CAMIONNAGE: 'Camionnage',
  MANUTENTION: 'Manutention', STOCKAGE: 'Stockage',
  ASSURANCE: 'Assurance', SURCHARGE: 'Surcharge', DIVERSE: 'Diverse'
};

const liaisonLabels: Record<string, string> = {
  EXPEDITION: 'Expédition', CONTENEUR: 'Conteneur', STOCK: 'Stock', AUTRE: 'Autre',
};

const justificatifLabels: Record<string, string> = {
  FACTURE: 'Facture', QUITTUS: 'Quittus', AUTRE: 'Autre',
};

export default function DepensesPage() {
  const [items, setItems] = useState<Depense[]>([]);
  const [conteneurs, setConteneurs] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editItem, setEditItem] = useState<Depense | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [detailItem, setDetailItem] = useState<Depense | null>(null);
  const [form, setForm] = useState({ conteneurId: 0, type: '', montant: '', devise: 'XAF', date: new Date().toISOString().slice(0, 10), description: '', fournisseur: '', titre: '', categoriePersonnalisee: '', liaison: 'CONTENEUR', justificatifType: '', justificatifPath: '', tauxChange: '' });
  const [saving, setSaving] = useState(false);

  const load = () => { fetch('/api/depenses', { cache: 'no-store' }).then(r => r.ok && r.json()).then(d => { if (d) setItems(d); }).catch(() => {}); };
  const loadCont = () => { fetch('/api/conteneurs', { cache: 'no-store' }).then(r => r.ok && r.json()).then(d => { if (d) setConteneurs(d); }).catch(() => {}); };
  useEffect(() => { load(); loadCont(); }, []);

  const resetForm = () => { setForm({ conteneurId: 0, type: '', montant: '', devise: 'XAF', date: new Date().toISOString().slice(0, 10), description: '', fournisseur: '', titre: '', categoriePersonnalisee: '', liaison: 'CONTENEUR', justificatifType: '', justificatifPath: '', tauxChange: '' }); setEditItem(null); };
  const openCreate = () => { resetForm(); setIsOpen(true); };
  const openEdit = (d: Depense) => { setForm({ conteneurId: d.conteneurId, type: d.type, montant: String(d.montant), devise: d.devise, date: d.date?.slice(0, 10) || new Date().toISOString().slice(0, 10), description: d.description || '', fournisseur: d.fournisseur || '', titre: d.titre || '', categoriePersonnalisee: d.categoriePersonnalisee || '', liaison: d.liaison || 'CONTENEUR', justificatifType: d.justificatifType || '', justificatifPath: d.justificatifPath || '', tauxChange: d.tauxChange ? String(d.tauxChange) : '' }); setEditItem(d); setIsOpen(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = editItem ? `/api/depenses/${editItem.id}` : '/api/depenses';
      const r = await fetch(url, { method: editItem ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, conteneurId: Number(form.conteneurId), montant: Number(form.montant), date: form.date ? new Date(form.date) : undefined }) });
      if (r.ok) { setIsOpen(false); resetForm(); load(); }
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { const r = await fetch(`/api/depenses/${deleteId}`, { method: 'DELETE' }); if (r.ok) { setDeleteId(null); load(); } } catch {}
  };

  const totalXaf = items.reduce((s, d) => s + (d.montantXaf || (d.devise === 'XAF' ? Number(d.montant) : 0)), 0);
  const filtered = items.filter(d => !search || d.conteneur?.numero?.toLowerCase().includes(search.toLowerCase()) || d.type?.toLowerCase().includes(search.toLowerCase()) || d.description?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><h1 className="page-title">Dépenses</h1><p className="page-subtitle" style={{ marginTop: '0.25rem' }}>{items.length} dépenses — Total: {formatMontant(totalXaf)}</p></div>
        <Button onClick={openCreate}><Plus size={18} /> Nouvelle Dépense</Button>
      </div>

      <div className="table-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '1rem', borderBottom: '1px solid var(--slate-100)' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} color="var(--slate-400)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input className="form-input" placeholder="Rechercher par conteneur, type..." autoComplete="off" style={{ paddingLeft: '2.75rem' }} value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <table className="table">
          <thead><tr><th>Titre</th><th>Conteneur</th><th>Date</th><th>Type</th><th>Montant</th><th>Devise</th><th>Montant XAF</th><th style={{ width: 100 }}>Actions</th></tr></thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: 'var(--slate-400)' }}>Aucune dépense trouvée</td></tr>
            ) : filtered.map(d => (
              <tr key={d.id} style={{ cursor: 'pointer' }} onClick={() => setDetailItem(d)}>
                <td style={{ fontWeight: 600 }}>{d.titre || '-'}</td>
                <td style={{ fontWeight: 600 }}>{d.conteneur?.numero || '-'}</td>
                <td style={{ fontSize: '0.9rem', color: 'var(--slate-700)' }}>{d.date ? new Date(d.date).toLocaleDateString('fr-FR') : '-'}</td>
                <td><Badge variant="warning">{typeLabels[d.type] || d.type}</Badge></td>
                <td style={{ fontWeight: 600 }}>{formatMontant(d.montant)}</td>
                <td style={{ fontSize: '0.9rem' }}>{d.devise}</td>
                <td style={{ fontWeight: 600 }}>{d.montantXaf ? formatMontant(d.montantXaf) : '-'}</td>
                <td><div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button className="btn btn-ghost btn-icon" onClick={(e) => { e.stopPropagation(); openEdit(d); }} title="Modifier"><Edit size={16} /></button>
                  <button className="btn btn-ghost btn-icon" style={{ color: 'var(--danger)' }} onClick={(e) => { e.stopPropagation(); setDeleteId(d.id); }} title="Supprimer"><Trash2 size={16} /></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

        <Modal
          open={detailItem !== null}
          onClose={() => setDetailItem(null)}
          title={`Détails Dépense ${detailItem?.titre || ''}`}
          size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDetailItem(null)}>Fermer</Button>
            <Button onClick={() => { const item = detailItem; setDetailItem(null); if(item) openEdit(item); }}>Modifier</Button>
          </>
        }
      >
        {detailItem && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ padding: '1rem 1.25rem', border: '1px solid var(--slate-200)', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Informations</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.88rem' }}>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><span style={{ color: 'var(--slate-500)' }}>Titre :</span> {detailItem.titre || '-'}</div>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><span style={{ color: 'var(--slate-500)' }}>Type :</span> <Badge variant="warning">{typeLabels[detailItem.type] || detailItem.type}</Badge></div>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><span style={{ color: 'var(--slate-500)' }}>Conteneur :</span> {detailItem.conteneur?.numero || 'Générale'}</div>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><span style={{ color: 'var(--slate-500)' }}>Date :</span> {detailItem.date ? new Date(detailItem.date).toLocaleDateString('fr-FR') : '-'}</div>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><span style={{ color: 'var(--slate-500)' }}>Fournisseur :</span> {detailItem.fournisseur || '-'}</div>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><span style={{ color: 'var(--slate-500)' }}>Liaison :</span> {detailItem.liaison ? liaisonLabels[detailItem.liaison] || detailItem.liaison : '-'}</div>
                </div>
              </div>
              <div style={{ padding: '1rem 1.25rem', border: '1px solid var(--slate-200)', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Finances</div>
                <div style={{ fontSize: '0.88rem', backgroundColor: 'rgba(220,38,38,0.08)', borderRadius: '8px', padding: '0.65rem', textAlign: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--danger)' }}>{formatMontant(detailItem.montant)}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)', marginTop: '0.1rem' }}>{detailItem.devise}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.88rem' }}>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><span style={{ color: 'var(--slate-500)' }}>Montant XAF :</span> {detailItem.montantXaf ? formatMontant(detailItem.montantXaf) : '-'}</div>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><span style={{ color: 'var(--slate-500)' }}>Taux :</span> {detailItem.tauxChange || '-'}</div>
                </div>
              </div>
            </div>
            {(detailItem.categoriePersonnalisee || detailItem.justificatifType) && (
              <div style={{ padding: '1rem 1.25rem', border: '1px solid var(--slate-200)', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Classification</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.88rem' }}>
                  {detailItem.categoriePersonnalisee && <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><span style={{ color: 'var(--slate-500)' }}>Catégorie :</span> {detailItem.categoriePersonnalisee}</div>}
                  {detailItem.justificatifType && <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><span style={{ color: 'var(--slate-500)' }}>Justificatif :</span> {justificatifLabels[detailItem.justificatifType] || detailItem.justificatifType}</div>}
                </div>
              </div>
            )}
            {detailItem.description && (
              <div style={{ padding: '1rem 1.25rem', border: '1px solid var(--slate-200)', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Description</div>
                <p style={{ color: 'var(--slate-600)', lineHeight: 1.6 }}>{detailItem.description}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title={editItem ? 'Modifier la Dépense' : 'Nouvelle Dépense'}
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Enregistrement...' : editItem ? 'Mettre à jour' : 'Créer'}</Button>
          </>
        }
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ padding: '1rem 1.25rem', border: '1px solid var(--slate-200)', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Informations</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div className="form-group">
                <label className="form-label">Conteneur</label>
                <select className="form-select" value={form.conteneurId} onChange={e => setForm({ ...form, conteneurId: Number(e.target.value) })}>
                  <option value={0}>Dépense générale</option>
                  {conteneurs.map(c => <option key={c.id} value={c.id}>{c.numero}</option>)}
                </select>
              </div>
              <Input label="Type *" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} placeholder="Fret, Douane, Loyer..." />
              <Input label="Titre" value={form.titre} onChange={e => setForm({ ...form, titre: e.target.value })} placeholder="Titre de la dépense" />
              <Input label="Fournisseur" value={form.fournisseur} onChange={e => setForm({ ...form, fournisseur: e.target.value })} />
              <Input label="Date" type="date" value={form.date || new Date().toISOString().slice(0, 10)} onChange={e => setForm({ ...form, date: e.target.value })} />
              <Input label="Catégorie" value={form.categoriePersonnalisee} onChange={e => setForm({ ...form, categoriePersonnalisee: e.target.value })} placeholder="Transport local..." />
            </div>
          </div>
          <div style={{ padding: '1rem 1.25rem', border: '1px solid var(--slate-200)', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Montant & Classification</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <Input label="Montant *" type="number" value={form.montant} onChange={e => setForm({ ...form, montant: e.target.value })} />
                <Input label="Devise" value={form.devise} onChange={e => setForm({ ...form, devise: e.target.value })} placeholder="XAF" />
              </div>
              <Input label="Taux de change" type="number" value={form.tauxChange} onChange={e => setForm({ ...form, tauxChange: e.target.value })} />
              <div className="form-group">
                <label className="form-label">Liaison</label>
                <select className="form-select" value={form.liaison} onChange={e => setForm({ ...form, liaison: e.target.value })}>
                  {Object.entries(liaisonLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <Input label="Type justificatif" value={form.justificatifType} onChange={e => setForm({ ...form, justificatifType: e.target.value })} placeholder="Facture, Reçu..." />
            </div>
          </div>
        </div>
        <div style={{ padding: '1rem 1.25rem', border: '1px solid var(--slate-200)', borderRadius: '10px' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Description</div>
          <textarea className="form-input" placeholder="Description libre..." style={{ minHeight: '80px', resize: 'vertical', width: '100%' }} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        </div>
      </Modal>

      <Modal
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        title="Confirmer la suppression"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteId(null)}>Annuler</Button>
            <Button variant="danger" onClick={handleDelete}>Supprimer</Button>
          </>
        }
      >
        <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', marginBottom: '1rem' }}>Supprimer cette dépense ?</p>
      </Modal>
    </div>
  );
}
