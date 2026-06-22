'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { FormSection } from '@/components/ui/FormSection';
import { Plus, Edit, Trash2, Search, Receipt, DollarSign, Calendar, FileText, User, Package, Eye } from 'lucide-react';
import { formatMontant } from '@/lib/finance';

interface Facture {
  id: number; numero: string; clientId: number; expeditionId: number;
  conteneurId: number | null; date: string; montantHt: number;
  montantTva: number | null; montantTtc: number; devise: string; statut: string;
  dateEcheance: string | null; notes: string | null;
  client: { nom: string }; expedition: { reference: string }; conteneur: { numero: string } | null;
}

const statusMeta: Record<string, { variant: 'success' | 'warning' | 'default' | 'danger'; label: string }> = {
  EMISE: { variant: 'default', label: 'Émise' },
  PAYEE: { variant: 'success', label: 'Payée' },
  EN_RETARD: { variant: 'danger', label: 'En Retard' },
  ANNULEE: { variant: 'warning', label: 'Annulée' },
};

export default function FacturesPage() {
  const [items, setItems] = useState<Facture[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [expeditions, setExpeditions] = useState<any[]>([]);
  const [conteneurs, setConteneurs] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editItem, setEditItem] = useState<Facture | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [detailItem, setDetailItem] = useState<Facture | null>(null);
  const [form, setForm] = useState({ clientId: 0, expeditionId: 0, conteneurId: 0, montantHt: '', devise: 'XAF', statut: 'EMISE', dateEcheance: '', notes: '' });
  const [saving, setSaving] = useState(false);

  const load = () => { fetch('/api/factures').then(r => r.ok && r.json()).then(d => { if (d) setItems(d); }).catch(() => {}); };
  const loadRefs = () => {
    fetch('/api/clients').then(r => r.ok && r.json()).then(d => { if (d) setClients(d); }).catch(() => {});
    fetch('/api/expeditions').then(r => r.ok && r.json()).then(d => { if (d) setExpeditions(d); }).catch(() => {});
    fetch('/api/conteneurs').then(r => r.ok && r.json()).then(d => { if (d) setConteneurs(d); }).catch(() => {});
  };
  useEffect(() => { load(); loadRefs(); }, []);

  const resetForm = () => { setForm({ clientId: 0, expeditionId: 0, conteneurId: 0, montantHt: '', devise: 'XAF', statut: 'EMISE', dateEcheance: '', notes: '' }); setEditItem(null); };
  const openCreate = () => { resetForm(); setIsOpen(true); };
  const openEdit = (f: Facture) => { setForm({ clientId: f.clientId, expeditionId: f.expeditionId, conteneurId: f.conteneurId || 0, montantHt: String(f.montantHt), devise: f.devise, statut: f.statut, dateEcheance: f.dateEcheance || '', notes: f.notes || '' }); setEditItem(f); setIsOpen(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const body = { ...form, clientId: Number(form.clientId), expeditionId: Number(form.expeditionId), conteneurId: form.conteneurId ? Number(form.conteneurId) : null, montantHt: Number(form.montantHt) };
      const url = editItem ? `/api/factures/${editItem.id}` : '/api/factures';
      const r = await fetch(url, { method: editItem ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (r.ok) { setIsOpen(false); resetForm(); load(); }
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { const r = await fetch(`/api/factures/${deleteId}`, { method: 'DELETE' }); if (r.ok) { setDeleteId(null); load(); } } catch {}
  };

  const totalTtc = items.reduce((s, f) => s + Number(f.montantTtc), 0);
  const filtered = items.filter(f => !search || f.numero.toLowerCase().includes(search.toLowerCase()) || f.client?.nom?.toLowerCase().includes(search.toLowerCase()) || f.expedition?.reference?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><h1 className="page-title">Factures</h1><p className="page-subtitle" style={{ marginTop: '0.25rem' }}>{items.length} factures — Total TTC: {formatMontant(totalTtc)}</p></div>
        <Button onClick={openCreate}><Plus size={18} /> Nouvelle Facture</Button>
      </div>

      <div className="table-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '1rem', borderBottom: '1px solid var(--slate-100)' }}>
          <form autoComplete="off" onSubmit={e => e.preventDefault()} className="input-group"><Search size={18} color="var(--slate-400)" />
            <input className="input" placeholder="Rechercher facture..." autoComplete="off" name="table-search" value={search} onChange={e => setSearch(e.target.value)} />
          </form>
        </div>
        <table className="table">
          <thead><tr><th>N° Facture</th><th>Client</th><th>Expédition</th><th>Date</th><th>Montant TTC</th><th>Statut</th><th style={{ width: 100 }}>Actions</th></tr></thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--slate-400)' }}>Aucune facture trouvée</td></tr>
            ) : filtered.map(f => {
              const st = statusMeta[f.statut] || { variant: 'default' as const, label: f.statut };
              return (
                <tr key={f.id}>
                  <td style={{ fontWeight: 600, fontFamily: 'monospace' }}>{f.numero}</td>
                  <td style={{ fontSize: '0.85rem' }}>{f.client?.nom || '-'}</td>
                  <td style={{ fontSize: '0.85rem' }}>{f.expedition?.reference || '-'}</td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>{f.date ? new Date(f.date).toLocaleDateString('fr-FR') : '-'}</td>
                  <td style={{ fontWeight: 800, color: 'var(--slate-900)' }}>{formatMontant(f.montantTtc)} <span style={{fontSize: '0.75rem', fontWeight: 500, color: 'var(--slate-500)'}}>{f.devise}</span></td>
                  <td><Badge variant={st.variant}>{st.label}</Badge></td>
                  <td><div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                    <button className="btn btn-ghost btn-icon" onClick={() => setDetailItem(f)} title="Détails"><Eye size={16} /></button>
                    <button className="btn btn-ghost btn-icon" onClick={() => openEdit(f)} title="Modifier"><Edit size={16} /></button>
                    <button className="btn btn-ghost btn-icon" style={{ color: 'var(--danger)' }} onClick={() => setDeleteId(f.id)} title="Supprimer"><Trash2 size={16} /></button>
                  </div></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal
        open={detailItem !== null}
        onClose={() => setDetailItem(null)}
        title={`Facture ${detailItem?.numero}`}
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
              <div className="modal-section-title">Informations Principales</div>
              <div className="modal-grid-2">
                <div><span className="form-label">Statut</span><p><Badge variant={statusMeta[detailItem.statut]?.variant || 'default'}>{statusMeta[detailItem.statut]?.label || detailItem.statut}</Badge></p></div>
                <div><span className="form-label">Date d'émission</span><p style={{ fontWeight: 600 }}>{detailItem.date ? new Date(detailItem.date).toLocaleDateString('fr-FR') : '-'}</p></div>
                <div><span className="form-label">Client</span><p>{detailItem.client?.nom || '-'}</p></div>
                <div><span className="form-label">Expédition</span><p>{detailItem.expedition?.reference || '-'}</p></div>
                <div><span className="form-label">Conteneur</span><p>{detailItem.conteneur?.numero || '-'}</p></div>
                <div><span className="form-label">Date d'échéance</span><p>{detailItem.dateEcheance ? new Date(detailItem.dateEcheance).toLocaleDateString('fr-FR') : '-'}</p></div>
              </div>
            </div>

            <div className="modal-section">
              <div className="modal-section-title">Montants</div>
              <div className="modal-grid-2">
                <div><span className="form-label">Montant HT</span><p style={{ fontWeight: 500 }}>{formatMontant(detailItem.montantHt)} {detailItem.devise}</p></div>
                <div><span className="form-label">TVA</span><p style={{ fontWeight: 500 }}>{detailItem.montantTva ? formatMontant(detailItem.montantTva) : '-'} {detailItem.devise}</p></div>
                <div className="col-span-2"><span className="form-label">Montant TTC</span><p style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--slate-900)' }}>{formatMontant(detailItem.montantTtc)} <span style={{fontSize: '0.8rem', color: 'var(--slate-500)'}}>{detailItem.devise}</span></p></div>
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

      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title={editItem ? 'Modifier la Facture' : 'Nouvelle Facture'}
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
            <FormSection title="Détails" pastilleColor="#0077B6" textColor="#0077B6" icon={<Receipt size={16} color="#0077B6" />} iconBg="rgba(0,119,182,0.1)">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group col-span-2">
                  <label className="form-label">Client</label>
                  <select className="form-select" value={form.clientId} onChange={e => setForm({ ...form, clientId: Number(e.target.value) })}>
                    <option value={0}>Sélectionner</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Expédition</label>
                  <select className="form-select" value={form.expeditionId} onChange={e => setForm({ ...form, expeditionId: Number(e.target.value) })}>
                    <option value={0}>Sélectionner</option>
                    {expeditions.map(e => <option key={e.id} value={e.id}>{e.reference}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Conteneur (optionnel)</label>
                  <select className="form-select" value={form.conteneurId} onChange={e => setForm({ ...form, conteneurId: Number(e.target.value) })}>
                    <option value={0}>Aucun</option>
                    {conteneurs.map(c => <option key={c.id} value={c.id}>{c.numero}</option>)}
                  </select>
                </div>
                <div className="form-group col-span-2">
                  <label className="form-label">Statut</label>
                  <select className="form-select" value={form.statut} onChange={e => setForm({ ...form, statut: e.target.value })}>
                    <option value="EMISE">Émise</option><option value="PAYEE">Payée</option><option value="EN_RETARD">En Retard</option><option value="ANNULEE">Annulée</option>
                  </select>
                </div>
              </div>
            </FormSection>
          </div>

          <div className="modal-layout">
            <FormSection title="Finances & Échéance" pastilleColor="#10B981" textColor="#10B981" icon={<DollarSign size={16} color="#10B981" />} iconBg="rgba(16,185,129,0.1)">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Input label="Montant HT" type="number" value={form.montantHt} onChange={e => setForm({ ...form, montantHt: e.target.value })} />
                <div className="form-group">
                  <label className="form-label">Devise</label>
                  <select className="form-select" value={form.devise} onChange={e => setForm({ ...form, devise: e.target.value })}>
                    <option value="XAF">FCFA (XAF)</option><option value="EUR">Euro</option><option value="USD">USD</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <Input label="Date d'échéance" type="date" value={form.dateEcheance} onChange={e => setForm({ ...form, dateEcheance: e.target.value })} />
                </div>
              </div>
            </FormSection>

            <FormSection title="Notes" pastilleColor="#8B5CF6" textColor="#8B5CF6" icon={<FileText size={16} color="#8B5CF6" />} iconBg="rgba(139,92,246,0.1)">
              <textarea className="input" placeholder="Notes additionnelles..." style={{ minHeight: 60, resize: 'vertical', width: '100%' }} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
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
        <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', marginBottom: '1rem' }}>Supprimer cette facture ?</p>
      </Modal>
    </div>
  );
}
