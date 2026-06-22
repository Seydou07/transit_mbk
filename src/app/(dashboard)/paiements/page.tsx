'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { FormSection } from '@/components/ui/FormSection';
import { Plus, Edit, Trash2, Search, CreditCard, Building2, Smartphone, Banknote, DollarSign, FileText, Eye } from 'lucide-react';
import { formatMontant } from '@/lib/finance';

interface Paiement {
  id: number; expeditionId: number; date: string; montant: number;
  devise: string; montantXaf: number | null; type: string;
  reference: string | null; notes: string | null;
  modePaiement: string | null; referenceTransaction: string | null;
  pieceJointe: string | null; montantFacture: number | null; resteAPayer: number | null;
  expedition: { reference: string };
}

const modePaiementLabels: Record<string, string> = {
  VIREMENT: 'Virement', CHEQUE: 'Chèque', ESPECES: 'Espèces',
  MOBILE_MONEY: 'Mobile Money', CARTE_BANCAIRE: 'Carte bancaire',
};

export default function PaiementsPage() {
  const [items, setItems] = useState<Paiement[]>([]);
  const [expeditions, setExpeditions] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editItem, setEditItem] = useState<Paiement | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [detailItem, setDetailItem] = useState<Paiement | null>(null);
  const [form, setForm] = useState({ expeditionId: 0, montant: '', devise: 'XAF', type: 'ACOMPTE', reference: '', notes: '', modePaiement: 'VIREMENT', referenceTransaction: '', pieceJointe: '', montantFacture: '', resteAPayer: '' });
  const [saving, setSaving] = useState(false);

  const load = () => { fetch('/api/paiements').then(r => r.ok && r.json()).then(d => { if (d) setItems(d); }).catch(() => {}); };
  const loadExp = () => { fetch('/api/expeditions').then(r => r.ok && r.json()).then(d => { if (d) setExpeditions(d); }).catch(() => {}); };
  useEffect(() => { load(); loadExp(); }, []);

  const resetForm = () => { setForm({ expeditionId: 0, montant: '', devise: 'XAF', type: 'ACOMPTE', reference: '', notes: '', modePaiement: 'VIREMENT', referenceTransaction: '', pieceJointe: '', montantFacture: '', resteAPayer: '' }); setEditItem(null); };
  const openCreate = () => { resetForm(); setIsOpen(true); };
  const openEdit = (p: Paiement) => { setForm({ expeditionId: p.expeditionId, montant: String(p.montant), devise: p.devise, type: p.type, reference: p.reference || '', notes: p.notes || '', modePaiement: p.modePaiement || 'VIREMENT', referenceTransaction: p.referenceTransaction || '', pieceJointe: p.pieceJointe || '', montantFacture: p.montantFacture ? String(p.montantFacture) : '', resteAPayer: p.resteAPayer ? String(p.resteAPayer) : '' }); setEditItem(p); setIsOpen(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = editItem ? `/api/paiements/${editItem.id}` : '/api/paiements';
      const r = await fetch(url, { method: editItem ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, expeditionId: Number(form.expeditionId), montant: Number(form.montant) }) });
      if (r.ok) { setIsOpen(false); resetForm(); load(); }
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { const r = await fetch(`/api/paiements/${deleteId}`, { method: 'DELETE' }); if (r.ok) { setDeleteId(null); load(); } } catch {}
  };

  const totalXaf = items.reduce((s, p) => s + (p.montantXaf || (p.devise === 'XAF' ? Number(p.montant) : 0)), 0);
  const filtered = items.filter(p => !search || p.expedition?.reference?.toLowerCase().includes(search.toLowerCase()) || p.type?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><h1 className="page-title">Paiements</h1><p className="page-subtitle" style={{ marginTop: '0.25rem' }}>{items.length} paiements — Total: {formatMontant(totalXaf)}</p></div>
        <Button onClick={openCreate}><Plus size={18} /> Nouveau Paiement</Button>
      </div>

      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '1rem', borderBottom: '1px solid var(--slate-100)' }}>
          <form autoComplete="off" onSubmit={e => e.preventDefault()} className="input-group"><Search size={18} color="var(--slate-400)" />
            <input className="input" placeholder="Rechercher par expédition, type..." autoComplete="off" name="table-search" value={search} onChange={e => setSearch(e.target.value)} />
          </form>
        </div>
        <table className="table">
          <thead><tr><th>Expédition</th><th>Date</th><th>Type</th><th>Montant</th><th>Devise</th><th>Montant XAF</th><th>Référence</th><th style={{ width: 80 }}>Actions</th></tr></thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: 'var(--slate-400)' }}>Aucun paiement trouvé</td></tr>
            ) : filtered.map(p => (
              <tr key={p.id}>
                <td style={{ fontWeight: 600 }}>{p.expedition?.reference || '-'}</td>
                <td style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>{p.date ? new Date(p.date).toLocaleDateString('fr-FR') : '-'}</td>
                <td><Badge variant={p.type === 'SOLDE' ? 'success' : 'info'}>{p.type === 'ACOMPTE' ? 'Acompte' : 'Solde'}</Badge></td>
                <td style={{ fontWeight: 600 }}>{formatMontant(p.montant)}</td>
                <td style={{ fontSize: '0.85rem' }}>{p.devise}</td>
                <td style={{ fontWeight: 600 }}>{p.montantXaf ? formatMontant(p.montantXaf) : '-'}</td>
                <td style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>{p.reference || '-'}</td>
                <td><div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                  <button className="btn btn-ghost btn-icon" onClick={() => setDetailItem(p)} title="Détails"><Eye size={16} /></button>
                  <button className="btn btn-ghost btn-icon" onClick={() => openEdit(p)} title="Modifier"><Edit size={16} /></button>
                  <button className="btn btn-ghost btn-icon" style={{ color: 'var(--danger)' }} onClick={() => setDeleteId(p.id)} title="Supprimer"><Trash2 size={16} /></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={detailItem !== null}
        onClose={() => setDetailItem(null)}
        title={`Détails Paiement ${detailItem?.reference || ''}`}
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
              <div className="modal-section-title">Informations Générales</div>
              <div className="modal-grid-2">
                <div><span className="form-label">Expédition</span><p style={{ fontWeight: 600 }}>{detailItem.expedition?.reference || '-'}</p></div>
                <div><span className="form-label">Type</span><p><Badge variant={detailItem.type === 'SOLDE' ? 'success' : 'info'}>{detailItem.type === 'ACOMPTE' ? 'Acompte' : 'Solde'}</Badge></p></div>
                <div><span className="form-label">Date</span><p>{detailItem.date ? new Date(detailItem.date).toLocaleDateString('fr-FR') : '-'}</p></div>
                <div><span className="form-label">Référence</span><p>{detailItem.reference || '-'}</p></div>
              </div>
            </div>

            <div className="modal-section">
              <div className="modal-section-title">Finances</div>
              <div className="modal-grid-2">
                <div><span className="form-label">Montant</span><p style={{ fontWeight: 600 }}>{formatMontant(detailItem.montant)}</p></div>
                <div><span className="form-label">Devise</span><p>{detailItem.devise}</p></div>
                <div><span className="form-label">Montant XAF</span><p style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{detailItem.montantXaf ? formatMontant(detailItem.montantXaf) : '-'}</p></div>
              </div>
            </div>

            <div className="modal-section">
              <div className="modal-section-title">Paiement</div>
              <div className="modal-grid-2">
                <div><span className="form-label">Mode paiement</span><p>{detailItem.modePaiement ? modePaiementLabels[detailItem.modePaiement] || detailItem.modePaiement : '-'}</p></div>
                <div><span className="form-label">Réf. transaction</span><p>{detailItem.referenceTransaction || '-'}</p></div>
                <div><span className="form-label">Montant facture</span><p>{detailItem.montantFacture ? formatMontant(detailItem.montantFacture) : '-'}</p></div>
                <div><span className="form-label">Reste à payer</span><p>{detailItem.resteAPayer ? formatMontant(detailItem.resteAPayer) : '-'}</p></div>
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
        title={editItem ? 'Modifier le Paiement' : 'Nouveau Paiement'}
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
            <FormSection title="Détails" pastilleColor="#0077B6" textColor="#0077B6" icon={<DollarSign size={16} color="#0077B6" />} iconBg="rgba(0,119,182,0.1)">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group col-span-2">
                  <label className="form-label">Expédition</label>
                  <select className="form-select" value={form.expeditionId} onChange={e => setForm({ ...form, expeditionId: Number(e.target.value) })}>
                    <option value={0}>Sélectionner une expédition</option>
                    {expeditions.map(e => <option key={e.id} value={e.id}>{e.reference}</option>)}
                  </select>
                </div>
                <div className="form-group col-span-2">
                  <label className="form-label">Type</label>
                  <select className="form-select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                    <option value="ACOMPTE">Acompte</option><option value="SOLDE">Solde</option>
                  </select>
                </div>
                <Input label="Montant" type="number" value={form.montant} onChange={e => setForm({ ...form, montant: e.target.value })} />
                <div className="form-group">
                  <label className="form-label">Devise</label>
                  <select className="form-select" value={form.devise} onChange={e => setForm({ ...form, devise: e.target.value })}>
                    <option value="XAF">FCFA (XAF)</option><option value="EUR">Euro</option><option value="USD">USD</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <Input label="Référence" value={form.reference} onChange={e => setForm({ ...form, reference: e.target.value })} />
                </div>
              </div>
            </FormSection>
          </div>

          <div className="modal-layout">
            <FormSection title="Paiement" pastilleColor="#F59E0B" textColor="#F59E0B" icon={<CreditCard size={16} color="#F59E0B" />} iconBg="rgba(245,158,11,0.1)">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group col-span-2">
                  <label className="form-label">Mode de paiement</label>
                  <select className="form-select" value={form.modePaiement} onChange={e => setForm({ ...form, modePaiement: e.target.value })}>
                    {Object.entries(modePaiementLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <Input label="Réf. transaction" value={form.referenceTransaction} onChange={e => setForm({ ...form, referenceTransaction: e.target.value })} />
                </div>
                <Input label="Montant facture" type="number" value={form.montantFacture} onChange={e => setForm({ ...form, montantFacture: e.target.value })} />
                <Input label="Reste à payer" type="number" value={form.resteAPayer} onChange={e => setForm({ ...form, resteAPayer: e.target.value })} />
              </div>
            </FormSection>

            <FormSection title="Notes" pastilleColor="#8B5CF6" textColor="#8B5CF6" icon={<FileText size={16} color="#8B5CF6" />} iconBg="rgba(139,92,246,0.1)">
              <textarea className="input" placeholder="Notes..." style={{ minHeight: '90px', resize: 'vertical', width: '100%' }} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
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
        <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', marginBottom: '1rem' }}>Supprimer ce paiement ?</p>
      </Modal>
    </div>
  );
}
