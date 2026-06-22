'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { FormSection } from '@/components/ui/FormSection';
import { Plus, Edit, Trash2, Search, Eye, ShoppingBag, DollarSign, Calendar, FileText, FileSpreadsheet } from 'lucide-react';
import { formatMontant } from '@/lib/finance';

interface AchatFournisseur {
  id: number; expeditionId: number; fournisseurId: number;
  dateCommande: string; montantAchat: number | null; devise: string;
  tauxConversion: number | null; montantFcfa: number | null;
  acompte: number | null; dateAcompte: string | null;
  solde: number | null;
  dateDebutProduction: string | null; dateFinPrevue: string | null; dateFinReelle: string | null;
  bl: string | null; factureFournisseur: string | null;
  photo: string | null; notes: string | null;
  expedition: { reference: string; client: { nom: string } };
  fournisseur: { nom: string };
}

export default function AchatsFournisseurPage() {
  const [items, setItems] = useState<AchatFournisseur[]>([]);
  const [expeditions, setExpeditions] = useState<any[]>([]);
  const [fournisseurs, setFournisseurs] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editItem, setEditItem] = useState<AchatFournisseur | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [detailItem, setDetailItem] = useState<AchatFournisseur | null>(null);
  const [form, setForm] = useState({
    expeditionId: 0, fournisseurId: 0, dateCommande: '', montantAchat: '', devise: 'CNY', tauxConversion: '', montantFcfa: '',
    acompte: '', dateAcompte: '', solde: '', dateDebutProduction: '', dateFinPrevue: '', dateFinReelle: '',
    bl: '', factureFournisseur: '', notes: '',
  });
  const [saving, setSaving] = useState(false);

  const load = () => { fetch('/api/achats-fournisseur').then(r => r.ok && r.json()).then(d => { if (d) setItems(d); }).catch(() => {}); };
  const loadRefs = () => { Promise.all([ fetch('/api/expeditions').then(r => r.ok && r.json()), fetch('/api/fournisseurs').then(r => r.ok && r.json()) ]).then(([exp, four]) => { if (exp) setExpeditions(exp); if (four) setFournisseurs(four); }).catch(() => {}); };
  useEffect(() => { load(); loadRefs(); }, []);

  const resetForm = () => { setForm({ expeditionId: 0, fournisseurId: 0, dateCommande: '', montantAchat: '', devise: 'CNY', tauxConversion: '', montantFcfa: '', acompte: '', dateAcompte: '', solde: '', dateDebutProduction: '', dateFinPrevue: '', dateFinReelle: '', bl: '', factureFournisseur: '', notes: '' }); setEditItem(null); };
  const openCreate = () => { resetForm(); setIsOpen(true); };
  const openEdit = (d: AchatFournisseur) => {
    setForm({
      expeditionId: d.expeditionId, fournisseurId: d.fournisseurId, dateCommande: d.dateCommande?.slice(0, 10) || '', montantAchat: d.montantAchat ? String(d.montantAchat) : '', devise: d.devise, tauxConversion: d.tauxConversion ? String(d.tauxConversion) : '', montantFcfa: d.montantFcfa ? String(d.montantFcfa) : '', acompte: d.acompte ? String(d.acompte) : '', dateAcompte: d.dateAcompte?.slice(0, 10) || '', solde: d.solde ? String(d.solde) : '', dateDebutProduction: d.dateDebutProduction?.slice(0, 10) || '', dateFinPrevue: d.dateFinPrevue?.slice(0, 10) || '', dateFinReelle: d.dateFinReelle?.slice(0, 10) || '', bl: d.bl || '', factureFournisseur: d.factureFournisseur || '', notes: d.notes || '',
    }); setEditItem(d); setIsOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = editItem ? `/api/achats-fournisseur/${editItem.id}` : '/api/achats-fournisseur';
      const r = await fetch(url, { method: editItem ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
        ...form,
        expeditionId: Number(form.expeditionId), fournisseurId: Number(form.fournisseurId),
        montantAchat: form.montantAchat ? Number(form.montantAchat) : null,
        tauxConversion: form.tauxConversion ? Number(form.tauxConversion) : null,
        montantFcfa: form.montantFcfa ? Number(form.montantFcfa) : null,
        acompte: form.acompte ? Number(form.acompte) : null,
        solde: form.solde ? Number(form.solde) : null,
        dateCommande: form.dateCommande || null,
        dateAcompte: form.dateAcompte || null,
        dateDebutProduction: form.dateDebutProduction || null,
        dateFinPrevue: form.dateFinPrevue || null,
        dateFinReelle: form.dateFinReelle || null,
      }) });
      if (r.ok) { setIsOpen(false); resetForm(); load(); }
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { const r = await fetch(`/api/achats-fournisseur/${deleteId}`, { method: 'DELETE' }); if (r.ok) { setDeleteId(null); load(); } } catch {}
  };

  const formatDate = (d: string | null) => d ? new Date(d).toLocaleDateString('fr-FR') : '-';
  const filtered = items.filter(d => !search || d.expedition?.reference?.toLowerCase().includes(search.toLowerCase()) || d.fournisseur?.nom?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><h1 className="page-title">Achats fournisseur</h1><p className="page-subtitle" style={{ marginTop: '0.25rem' }}>{items.length} achats</p></div>
        <Button onClick={openCreate}><Plus size={18} /> Nouvel Achat</Button>
      </div>

      <div className="table-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '1rem', borderBottom: '1px solid var(--slate-100)' }}>
          <form autoComplete="off" onSubmit={e => e.preventDefault()} className="input-group"><Search size={18} color="var(--slate-400)" />
            <input className="input" placeholder="Rechercher par expédition, fournisseur..." autoComplete="off" name="table-search" value={search} onChange={e => setSearch(e.target.value)} />
          </form>
        </div>
        <table className="table">
          <thead><tr><th>Expédition</th><th>Fournisseur</th><th>Date cmd.</th><th>Montant</th><th>Devise</th><th>Production</th><th>Statut</th><th style={{ width: 100 }}>Actions</th></tr></thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: 'var(--slate-400)' }}>Aucun achat trouvé</td></tr>
            ) : filtered.map(d => {
              const soldeRestant = (d.montantAchat || 0) - (d.acompte || 0);
              const statut = d.dateFinReelle ? 'Terminée' : d.dateDebutProduction ? 'En production' : 'Commandée';
              const variant: 'success' | 'warning' | 'info' = d.dateFinReelle ? 'success' : d.dateDebutProduction ? 'warning' : 'info';
              return (
              <tr key={d.id}>
                <td style={{ fontWeight: 600, fontSize: '0.85rem' }}>{d.expedition?.reference || '-'}</td>
                <td>{d.fournisseur?.nom || '-'}</td>
                <td style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>{formatDate(d.dateCommande)}</td>
                <td style={{ fontWeight: 600 }}>{d.montantAchat ? formatMontant(d.montantAchat) : '-'}</td>
                <td style={{ fontSize: '0.85rem' }}>{d.devise}</td>
                <td style={{ fontSize: '0.85rem' }}>{d.dateDebutProduction ? new Date(d.dateDebutProduction).toLocaleDateString('fr-FR') : '-'}</td>
                <td><Badge variant={variant}>{statut}</Badge></td>
                <td><div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                  <button className="btn btn-ghost btn-icon" onClick={() => setDetailItem(d)}><Eye size={16} /></button>
                  <button className="btn btn-ghost btn-icon" onClick={() => openEdit(d)}><Edit size={16} /></button>
                  <button className="btn btn-ghost btn-icon" style={{ color: 'var(--danger)' }} onClick={() => setDeleteId(d.id)}><Trash2 size={16} /></button>
                </div></td>
              </tr>
            );})}
          </tbody>
        </table>
      </div>

      <Modal
        open={detailItem !== null}
        onClose={() => setDetailItem(null)}
        title="Détail Achat Fournisseur"
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
                <div><span className="form-label">Expédition</span><p style={{ fontWeight: 600 }}>{detailItem.expedition?.reference}</p></div>
                <div><span className="form-label">Fournisseur</span><p style={{ fontWeight: 600 }}>{detailItem.fournisseur?.nom}</p></div>
                <div><span className="form-label">Date commande</span><p>{formatDate(detailItem.dateCommande)}</p></div>
              </div>
            </div>

            <div className="modal-section">
              <div className="modal-section-title">Finances</div>
              <div className="modal-grid-2">
                <div><span className="form-label">Montant</span><p style={{ fontWeight: 600 }}>{detailItem.montantAchat ? formatMontant(detailItem.montantAchat) : '-'} {detailItem.devise}</p></div>
                <div><span className="form-label">Taux conversion</span><p>{detailItem.tauxConversion || '-'}</p></div>
                <div><span className="form-label">Montant FCFA</span><p style={{ fontWeight: 600 }}>{detailItem.montantFcfa ? formatMontant(detailItem.montantFcfa) : '-'}</p></div>
                <div><span className="form-label">Acompte</span><p>{detailItem.acompte ? formatMontant(detailItem.acompte) : '-'}</p></div>
                <div><span className="form-label">Solde restant</span><p style={{ color: 'var(--danger)', fontWeight: 600 }}>{detailItem.montantAchat ? formatMontant((detailItem.montantAchat) - (detailItem.acompte || 0)) : '-'}</p></div>
              </div>
            </div>

            <div className="modal-section">
              <div className="modal-section-title">Production</div>
              <div className="modal-grid-2">
                <div><span className="form-label">Début production</span><p>{formatDate(detailItem.dateDebutProduction)}</p></div>
                <div><span className="form-label">Fin prévue</span><p>{formatDate(detailItem.dateFinPrevue)}</p></div>
                <div><span className="form-label">Fin réelle</span><p>{formatDate(detailItem.dateFinReelle)}</p></div>
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
        title={editItem ? 'Modifier l\'Achat' : 'Nouvel Achat Fournisseur'}
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
            <FormSection title="Références" pastilleColor="#0077B6" textColor="#0077B6" icon={<ShoppingBag size={16} color="#0077B6" />} iconBg="rgba(0,119,182,0.1)">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group col-span-2">
                  <label className="form-label">Expédition</label>
                  <select className="form-select" value={form.expeditionId} onChange={e => setForm({ ...form, expeditionId: Number(e.target.value) })}>
                    <option value={0}>Sélectionner</option>
                    {expeditions.map(e => <option key={e.id} value={e.id}>{e.reference}</option>)}
                  </select>
                </div>
                <div className="form-group col-span-2">
                  <label className="form-label">Fournisseur</label>
                  <select className="form-select" value={form.fournisseurId} onChange={e => setForm({ ...form, fournisseurId: Number(e.target.value) })}>
                    <option value={0}>Sélectionner</option>
                    {fournisseurs.map(f => <option key={f.id} value={f.id}>{f.nom}</option>)}
                  </select>
                </div>
              </div>
            </FormSection>

            <FormSection title="Montant" pastilleColor="#F59E0B" textColor="#F59E0B" icon={<DollarSign size={16} color="#F59E0B" />} iconBg="rgba(245,158,11,0.1)">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Input label="Montant achat" type="number" value={form.montantAchat} onChange={e => setForm({ ...form, montantAchat: e.target.value })} />
                <div className="form-group">
                  <label className="form-label">Devise</label>
                  <select className="form-select" value={form.devise} onChange={e => setForm({ ...form, devise: e.target.value })}>
                    <option value="CNY">CNY</option><option value="USD">USD</option><option value="EUR">Euro</option><option value="XAF">FCFA</option>
                  </select>
                </div>
                <Input label="Taux conversion" type="number" value={form.tauxConversion} onChange={e => setForm({ ...form, tauxConversion: e.target.value })} placeholder="Ex: 85" />
                <Input label="Montant FCFA" type="number" value={form.montantFcfa} onChange={e => setForm({ ...form, montantFcfa: e.target.value })} />
                <Input label="Acompte" type="number" value={form.acompte} onChange={e => setForm({ ...form, acompte: e.target.value })} />
                <Input label="Date acompte" type="date" value={form.dateAcompte} onChange={e => setForm({ ...form, dateAcompte: e.target.value })} />
                <div className="col-span-2">
                  <Input label="Solde restant" type="number" value={form.solde} onChange={e => setForm({ ...form, solde: e.target.value })} />
                </div>
              </div>
            </FormSection>
          </div>

          <div className="modal-layout">
            <FormSection title="Dates" pastilleColor="#10B981" textColor="#10B981" icon={<Calendar size={16} color="#10B981" />} iconBg="rgba(16,185,129,0.1)">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Input label="Date commande" type="date" value={form.dateCommande} onChange={e => setForm({ ...form, dateCommande: e.target.value })} />
                <Input label="Début production" type="date" value={form.dateDebutProduction} onChange={e => setForm({ ...form, dateDebutProduction: e.target.value })} />
                <Input label="Fin prévue" type="date" value={form.dateFinPrevue} onChange={e => setForm({ ...form, dateFinPrevue: e.target.value })} />
                <Input label="Fin réelle" type="date" value={form.dateFinReelle} onChange={e => setForm({ ...form, dateFinReelle: e.target.value })} />
              </div>
            </FormSection>

            <FormSection title="Documents" pastilleColor="#64748B" textColor="#64748B" icon={<FileSpreadsheet size={16} color="#64748B" />} iconBg="rgba(100,116,139,0.1)">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="col-span-2">
                  <Input label="BL / Connaissement" value={form.bl} onChange={e => setForm({ ...form, bl: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <Input label="Facture fournisseur" value={form.factureFournisseur} onChange={e => setForm({ ...form, factureFournisseur: e.target.value })} />
                </div>
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
        <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', marginBottom: '1rem' }}>Supprimer cet achat ?</p>
      </Modal>
    </div>
  );
}
