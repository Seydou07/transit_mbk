'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { FormSection } from '@/components/ui/FormSection';
import { Plus, Edit, Trash2, Search, Eye, ClipboardList, Calendar, MessageSquare } from 'lucide-react';

interface SuiviProduction {
  id: number; expeditionId: number; date: string;
  etape: string; commentaire: string | null;
  photos: string | null; documents: string | null;
  expedition: { reference: string; client: { nom: string } };
}

const etapeLabels: Record<string, string> = {
  EN_ATTENTE: 'En attente', DECOUPE: 'Découpe', CONFECTION: 'Confection',
  EMBALLAGE: 'Emballage', CONTROLE_QUALITE: 'Contrôle qualité',
  EXPEDITION: 'Expédié', TERMINEE: 'Terminée',
};
const etapeVariants: Record<string, 'warning' | 'info' | 'default' | 'danger' | 'success'> = {
  EN_ATTENTE: 'warning', DECOUPE: 'info', CONFECTION: 'info',
  EMBALLAGE: 'default', CONTROLE_QUALITE: 'warning',
  EXPEDITION: 'danger', TERMINEE: 'success',
};

export default function SuiviProductionPage() {
  const [items, setItems] = useState<SuiviProduction[]>([]);
  const [expeditions, setExpeditions] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editItem, setEditItem] = useState<SuiviProduction | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [detailItem, setDetailItem] = useState<SuiviProduction | null>(null);
  const [form, setForm] = useState({ expeditionId: 0, date: new Date().toISOString().slice(0, 10), etape: 'EN_ATTENTE', commentaire: '', photos: '', documents: '' });
  const [saving, setSaving] = useState(false);

  const load = () => { fetch('/api/suivi-production').then(r => r.ok && r.json()).then(d => { if (d) setItems(d); }).catch(() => {}); };
  const loadRefs = () => { fetch('/api/expeditions').then(r => r.ok && r.json()).then(d => { if (d) setExpeditions(d); }).catch(() => {}); };
  useEffect(() => { load(); loadRefs(); }, []);

  const resetForm = () => { setForm({ expeditionId: 0, date: new Date().toISOString().slice(0, 10), etape: 'EN_ATTENTE', commentaire: '', photos: '', documents: '' }); setEditItem(null); };
  const openCreate = () => { resetForm(); setIsOpen(true); };
  const openEdit = (d: SuiviProduction) => { setForm({ expeditionId: d.expeditionId, date: d.date?.slice(0, 10) || '', etape: d.etape, commentaire: d.commentaire || '', photos: d.photos || '', documents: d.documents || '' }); setEditItem(d); setIsOpen(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = editItem ? `/api/suivi-production/${editItem.id}` : '/api/suivi-production';
      const r = await fetch(url, { method: editItem ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, expeditionId: Number(form.expeditionId), date: form.date || null }) });
      if (r.ok) { setIsOpen(false); resetForm(); load(); }
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { const r = await fetch(`/api/suivi-production/${deleteId}`, { method: 'DELETE' }); if (r.ok) { setDeleteId(null); load(); } } catch {}
  };

  const filtered = items.filter(d => !search || d.expedition?.reference?.toLowerCase().includes(search.toLowerCase()) || d.etape?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><h1 className="page-title">Suivi production</h1><p className="page-subtitle" style={{ marginTop: '0.25rem' }}>{items.length} étapes de production</p></div>
        <Button onClick={openCreate}><Plus size={18} /> Nouvelle Étape</Button>
      </div>

      <div className="table-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '1rem', borderBottom: '1px solid var(--slate-100)' }}>
          <form autoComplete="off" onSubmit={e => e.preventDefault()} className="input-group"><Search size={18} color="var(--slate-400)" />
            <input className="input" placeholder="Rechercher par expédition, étape..." autoComplete="off" name="table-search" value={search} onChange={e => setSearch(e.target.value)} />
          </form>
        </div>
        <table className="table">
          <thead><tr><th>Expédition</th><th>Date</th><th>Étape</th><th>Commentaire</th><th style={{ width: 100 }}>Actions</th></tr></thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--slate-400)' }}>Aucune étape trouvée</td></tr>
            ) : filtered.map(d => (
              <tr key={d.id}>
                <td style={{ fontWeight: 600, fontSize: '0.85rem' }}>{d.expedition?.reference || '-'}</td>
                <td style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>{d.date ? new Date(d.date).toLocaleDateString('fr-FR') : '-'}</td>
                <td><Badge variant={etapeVariants[d.etape as keyof typeof etapeVariants] || 'default'}>{etapeLabels[d.etape as keyof typeof etapeLabels] || d.etape}</Badge></td>
                <td style={{ fontSize: '0.85rem', color: 'var(--slate-500)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.commentaire || '-'}</td>
                <td><div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                  <button className="btn btn-ghost btn-icon" onClick={() => setDetailItem(d)}><Eye size={16} /></button>
                  <button className="btn btn-ghost btn-icon" onClick={() => openEdit(d)}><Edit size={16} /></button>
                  <button className="btn btn-ghost btn-icon" style={{ color: 'var(--danger)' }} onClick={() => setDeleteId(d.id)}><Trash2 size={16} /></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={detailItem !== null}
        onClose={() => setDetailItem(null)}
        title="Détail Étape de Production"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDetailItem(null)}>Fermer</Button>
          </>
        }
      >
        {detailItem && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="modal-section">
              <div className="modal-section-title">Informations</div>
              <div className="modal-grid-2">
                <div><span className="form-label">Expédition</span><p style={{ fontWeight: 600 }}>{detailItem.expedition?.reference}</p></div>
                <div><span className="form-label">Client</span><p style={{ fontWeight: 600 }}>{detailItem.expedition?.client?.nom}</p></div>
                <div><span className="form-label">Date</span><p>{detailItem.date ? new Date(detailItem.date).toLocaleDateString('fr-FR') : '-'}</p></div>
                <div><span className="form-label">Étape</span><p><Badge variant={etapeVariants[detailItem.etape as keyof typeof etapeVariants] || 'default'}>{etapeLabels[detailItem.etape as keyof typeof etapeLabels] || detailItem.etape}</Badge></p></div>
              </div>
            </div>
            {detailItem.commentaire && (
              <div className="modal-section">
                <div className="modal-section-title">Commentaire</div>
                <p style={{ color: 'var(--slate-600)', lineHeight: '1.6' }}>{detailItem.commentaire}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title={editItem ? 'Modifier l\'Étape' : 'Nouvelle Étape de Production'}
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Enregistrement...' : editItem ? 'Mettre à jour' : 'Créer'}</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <FormSection title="Détails" pastilleColor="#0077B6" textColor="#0077B6" icon={<ClipboardList size={16} color="#0077B6" />} iconBg="rgba(0,119,182,0.1)">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Expédition</label>
                <select className="form-select" value={form.expeditionId} onChange={e => setForm({ ...form, expeditionId: Number(e.target.value) })}>
                  <option value={0}>Sélectionner</option>
                  {expeditions.map(e => <option key={e.id} value={e.id}>{e.reference}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Étape</label>
                <select className="form-select" value={form.etape} onChange={e => setForm({ ...form, etape: e.target.value })}>
                  {Object.entries(etapeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <Input label="Date" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            </div>
          </FormSection>
          <FormSection title="Commentaire" pastilleColor="#10B981" textColor="#10B981" icon={<MessageSquare size={16} color="#10B981" />} iconBg="rgba(16,185,129,0.1)">
            <textarea className="input" placeholder="Commentaire..." style={{ minHeight: 80, resize: 'vertical', width: '100%' }} value={form.commentaire} onChange={e => setForm({ ...form, commentaire: e.target.value })} />
          </FormSection>
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
        <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', marginBottom: '1rem' }}>Supprimer cette étape ?</p>
      </Modal>
    </div>
  );
}
