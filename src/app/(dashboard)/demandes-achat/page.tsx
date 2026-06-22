'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { FormSection } from '@/components/ui/FormSection';
import { Plus, Edit, Trash2, Search, Eye, ShoppingCart, DollarSign, Calendar, FileText } from 'lucide-react';
import { formatMontant } from '@/lib/finance';

interface DemandeAchat {
  id: number; reference: string; clientId: number; article: string;
  description: string; quantiteDemandee: number; unite: string;
  budgetEstime: number | null; devise: string;
  statut: string; dateSouhaitee: string | null; notes: string | null;
  createdAt: string;
  client: { nom: string };
}

const statutLabels: Record<string, string> = {
  EN_ATTENTE: 'En attente', VALIDEE: 'Validée', ANNULEE: 'Annulée',
};
const statutVariants: Record<string, 'warning' | 'success' | 'danger'> = {
  EN_ATTENTE: 'warning', VALIDEE: 'success', ANNULEE: 'danger',
};

export default function DemandesAchatPage() {
  const [items, setItems] = useState<DemandeAchat[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editItem, setEditItem] = useState<DemandeAchat | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [detailItem, setDetailItem] = useState<DemandeAchat | null>(null);
  const [form, setForm] = useState({ clientId: 0, article: '', description: '', quantiteDemandee: '', unite: 'PIÈCE', budgetEstime: '', devise: 'XAF', statut: 'EN_ATTENTE', dateSouhaitee: '', notes: '' });
  const [saving, setSaving] = useState(false);

  const load = () => { fetch('/api/demandes-achat').then(r => r.ok && r.json()).then(d => { if (d) setItems(d); }).catch(() => {}); };
  const loadClients = () => { fetch('/api/clients').then(r => r.ok && r.json()).then(d => { if (d) setClients(d); }).catch(() => {}); };
  useEffect(() => { load(); loadClients(); }, []);

  const resetForm = () => { setForm({ clientId: 0, article: '', description: '', quantiteDemandee: '', unite: 'PIÈCE', budgetEstime: '', devise: 'XAF', statut: 'EN_ATTENTE', dateSouhaitee: '', notes: '' }); setEditItem(null); };
  const openCreate = () => { resetForm(); setIsOpen(true); };
  const openEdit = (d: DemandeAchat) => { setForm({ clientId: d.clientId, article: d.article, description: d.description || '', quantiteDemandee: String(d.quantiteDemandee), unite: d.unite, budgetEstime: d.budgetEstime ? String(d.budgetEstime) : '', devise: d.devise, statut: d.statut, dateSouhaitee: d.dateSouhaitee ? d.dateSouhaitee.slice(0, 10) : '', notes: d.notes || '' }); setEditItem(d); setIsOpen(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = editItem ? `/api/demandes-achat/${editItem.id}` : '/api/demandes-achat';
      const r = await fetch(url, { method: editItem ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, clientId: Number(form.clientId), quantiteDemandee: Number(form.quantiteDemandee), budgetEstime: form.budgetEstime ? Number(form.budgetEstime) : null, dateSouhaitee: form.dateSouhaitee || null }) });
      if (r.ok) { setIsOpen(false); resetForm(); load(); }
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { const r = await fetch(`/api/demandes-achat/${deleteId}`, { method: 'DELETE' }); if (r.ok) { setDeleteId(null); load(); } } catch {}
  };

  const filtered = items.filter(d => !search || d.reference?.toLowerCase().includes(search.toLowerCase()) || d.article?.toLowerCase().includes(search.toLowerCase()) || d.client?.nom?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><h1 className="page-title">Demandes d'achat</h1><p className="page-subtitle" style={{ marginTop: '0.25rem' }}>{items.length} demandes</p></div>
        <Button onClick={openCreate}><Plus size={18} /> Nouvelle Demande</Button>
      </div>

      <div className="table-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '1rem', borderBottom: '1px solid var(--slate-100)' }}>
          <form autoComplete="off" onSubmit={e => e.preventDefault()} className="input-group"><Search size={18} color="var(--slate-400)" />
            <input className="input" placeholder="Rechercher par référence, article, client..." autoComplete="off" name="table-search" value={search} onChange={e => setSearch(e.target.value)} />
          </form>
        </div>
        <table className="table">
          <thead><tr><th>Réf.</th><th>Client</th><th>Article</th><th>Qté</th><th>Budjet</th><th>Statut</th><th>Date souh.</th><th style={{ width: 100 }}>Actions</th></tr></thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: 'var(--slate-400)' }}>Aucune demande trouvée</td></tr>
            ) : filtered.map(d => (
              <tr key={d.id}>
                <td style={{ fontWeight: 600, fontSize: '0.85rem' }}>{d.reference}</td>
                <td>{d.client?.nom || '-'}</td>
                <td>{d.article}</td>
                <td>{d.quantiteDemandee} {d.unite}</td>
                <td style={{ fontWeight: 600 }}>{d.budgetEstime ? formatMontant(d.budgetEstime) : '-'}</td>
                <td><Badge variant={statutVariants[d.statut as keyof typeof statutVariants] || 'warning'}>{statutLabels[d.statut as keyof typeof statutLabels] || d.statut}</Badge></td>
                <td style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>{d.dateSouhaitee ? new Date(d.dateSouhaitee).toLocaleDateString('fr-FR') : '-'}</td>
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
        title={`Demande ${detailItem?.reference}`}
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDetailItem(null)}>Fermer</Button>
            <Button onClick={() => { const item = detailItem; setDetailItem(null); if(item) openEdit(item); }}>Modifier</Button>
          </>
        }
      >
        {detailItem && (
          <div className="modal-layout">
            <div className="modal-section">
              <div className="modal-section-title">Informations générales</div>
              <div className="modal-grid-2">
                <div><span className="form-label">Client</span><p style={{ fontWeight: 600 }}>{detailItem.client?.nom}</p></div>
                <div><span className="form-label">Statut</span><p><Badge variant={statutVariants[detailItem.statut as keyof typeof statutVariants] || 'warning'}>{statutLabels[detailItem.statut as keyof typeof statutLabels] || detailItem.statut}</Badge></p></div>
                <div><span className="form-label">Article</span><p style={{ fontWeight: 600 }}>{detailItem.article}</p></div>
                <div><span className="form-label">Quantité</span><p style={{ fontWeight: 600 }}>{detailItem.quantiteDemandee} {detailItem.unite}</p></div>
                <div><span className="form-label">Budjet estimé</span><p style={{ fontWeight: 600 }}>{detailItem.budgetEstime ? formatMontant(detailItem.budgetEstime) : '-'}</p></div>
                <div><span className="form-label">Date souhaitée</span><p>{detailItem.dateSouhaitee ? new Date(detailItem.dateSouhaitee).toLocaleDateString('fr-FR') : '-'}</p></div>
              </div>
            </div>
            {detailItem.description && (
              <div className="modal-section">
                <div className="modal-section-title">Description</div>
                <p style={{ color: 'var(--slate-600)', lineHeight: '1.6' }}>{detailItem.description}</p>
              </div>
            )}
            {detailItem.notes && (
              <div className="modal-section">
                <div className="modal-section-title">Notes</div>
                <p style={{ color: 'var(--slate-600)', lineHeight: '1.6' }}>{detailItem.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title={editItem ? 'Modifier la Demande' : 'Nouvelle Demande d\'Achat'}
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Enregistrement...' : editItem ? 'Mettre à jour' : 'Créer'}</Button>
          </>
        }
      >
        <div className="modal-layout-grid">
          <div className="modal-layout">
            <FormSection title="Détails" pastilleColor="#0077B6" textColor="#0077B6" icon={<ShoppingCart size={16} color="#0077B6" />} iconBg="rgba(0,119,182,0.1)">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group col-span-2">
                  <label className="form-label">Client</label>
                  <select className="form-select" value={form.clientId} onChange={e => setForm({ ...form, clientId: Number(e.target.value) })}>
                    <option value={0}>Sélectionner un client</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                  </select>
                </div>
                <div className="form-group col-span-2">
                  <label className="form-label">Statut</label>
                  <select className="form-select" value={form.statut} onChange={e => setForm({ ...form, statut: e.target.value })}>
                    {Object.entries(statutLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                <Input label="Article" value={form.article} onChange={e => setForm({ ...form, article: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Unité</label>
                  <select className="form-select" value={form.unite} onChange={e => setForm({ ...form, unite: e.target.value })}>
                    <option value="PIÈCE">Pièce</option><option value="KG">Kg</option><option value="MÈTRE">Mètre</option><option value="LITRE">Litre</option><option value="CARTON">Carton</option><option value="PALETTE">Palette</option>
                  </select>
                </div>
                <Input label="Quantité demandée" type="number" value={form.quantiteDemandee} onChange={e => setForm({ ...form, quantiteDemandee: e.target.value })} />
              </div>
            </FormSection>
          </div>

          <div className="modal-layout">
            <FormSection title="Budget" pastilleColor="#F59E0B" textColor="#F59E0B" icon={<DollarSign size={16} color="#F59E0B" />} iconBg="rgba(245,158,11,0.1)">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Input label="Budget estimé" type="number" value={form.budgetEstime} onChange={e => setForm({ ...form, budgetEstime: e.target.value })} />
                <div className="form-group">
                  <label className="form-label">Devise</label>
                  <select className="form-select" value={form.devise} onChange={e => setForm({ ...form, devise: e.target.value })}>
                    <option value="XAF">FCFA (XAF)</option><option value="EUR">Euro</option><option value="USD">USD</option><option value="CNY">CNY</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <Input label="Date souhaitée" type="date" value={form.dateSouhaitee} onChange={e => setForm({ ...form, dateSouhaitee: e.target.value })} />
                </div>
              </div>
            </FormSection>

            <FormSection title="Informations complémentaires" pastilleColor="#10B981" textColor="#10B981" icon={<FileText size={16} color="#10B981" />} iconBg="rgba(16,185,129,0.1)">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <textarea className="input" placeholder="Description de la demande..." style={{ minHeight: '80px', resize: 'vertical', width: '100%' }} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                <textarea className="input" placeholder="Notes internes (facultatif)..." style={{ minHeight: '60px', resize: 'vertical', width: '100%' }} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
              </div>
            </FormSection>
          </div>
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
        <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', marginBottom: '1rem' }}>Supprimer cette demande d'achat ?</p>
      </Modal>
    </div>
  );
}
