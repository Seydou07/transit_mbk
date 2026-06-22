'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { FormSection } from '@/components/ui/FormSection';
import { Plus, Edit, Trash2, Search, Building2, Globe, MessageCircle, Phone, ShoppingBag, User, AtSign, FileText } from 'lucide-react';

interface Fournisseur {
  id: number; reference: string; nom: string; contact: string;
  telephone: string; email: string; adresse: string; pays: string; notes: string;
  lienAlibaba: string | null; lien1688: string | null; wechat: string | null;
  whatsApp: string | null; siteWeb: string | null; conditionsPaiement: string | null;
  delaiProductionMoyen: number | null; contactPrincipal: string | null;
}

export default function FournisseursPage() {
  const [items, setItems] = useState<Fournisseur[]>([]);
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editItem, setEditItem] = useState<Fournisseur | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [detailItem, setDetailItem] = useState<Fournisseur | null>(null);
  const [form, setForm] = useState({ nom: '', contact: '', telephone: '', email: '', adresse: '', pays: '', notes: '',
    lienAlibaba: '', lien1688: '', wechat: '', whatsApp: '', siteWeb: '', conditionsPaiement: '',
    delaiProductionMoyen: '', contactPrincipal: '',
  });
  const [saving, setSaving] = useState(false);

  const load = () => { fetch('/api/fournisseurs', { cache: 'no-store' }).then(r => r.ok && r.json()).then(d => { if (d) setItems(d); }).catch(() => {}); };
  useEffect(() => { load(); }, []);

  const resetForm = () => { setForm({ nom: '', contact: '', telephone: '', email: '', adresse: '', pays: '', notes: '',
    lienAlibaba: '', lien1688: '', wechat: '', whatsApp: '', siteWeb: '', conditionsPaiement: '', delaiProductionMoyen: '', contactPrincipal: '',
  }); setEditItem(null); };
  const openCreate = () => { resetForm(); setIsOpen(true); };
  const openEdit = (f: Fournisseur) => {
    setForm({
      nom: f.nom, contact: f.contact || '', telephone: f.telephone || '', email: f.email || '',
      adresse: f.adresse || '', pays: f.pays || '', notes: f.notes || '',
      lienAlibaba: f.lienAlibaba || '', lien1688: f.lien1688 || '', wechat: f.wechat || '',
      whatsApp: f.whatsApp || '', siteWeb: f.siteWeb || '', conditionsPaiement: f.conditionsPaiement || '',
      delaiProductionMoyen: f.delaiProductionMoyen ? String(f.delaiProductionMoyen) : '', contactPrincipal: f.contactPrincipal || '',
    }); setEditItem(f); setIsOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = editItem ? `/api/fournisseurs/${editItem.id}` : '/api/fournisseurs';
      const r = await fetch(url, { method: editItem ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (r.ok) { setIsOpen(false); resetForm(); load(); }
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { const r = await fetch(`/api/fournisseurs/${deleteId}`, { method: 'DELETE' }); if (r.ok) { setDeleteId(null); load(); } } catch {}
  };

  const filtered = items.filter(f => !search || f.nom.toLowerCase().includes(search.toLowerCase()) || f.email?.toLowerCase().includes(search.toLowerCase()) || f.pays?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><h1 className="page-title">Fournisseurs</h1><p className="page-subtitle" style={{ marginTop: '0.25rem' }}>{items.length} fournisseurs enregistrés.</p></div>
        <Button onClick={openCreate}><Plus size={18} /> Nouveau Fournisseur</Button>
      </div>

      <div className="table-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '1rem', borderBottom: '1px solid var(--slate-100)' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} color="var(--slate-400)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              className="form-input" 
              placeholder="Rechercher fournisseur..." 
              autoComplete="off" 
              style={{ paddingLeft: '2.75rem' }}
              value={search} 
              onChange={e => setSearch(e.target.value)} 
            />
          </div>
        </div>
        <table className="table">
          <thead><tr><th>Fournisseur</th><th>Contact</th><th>Téléphone</th><th>Email</th><th>Pays</th><th>Réf.</th><th style={{ width: 100 }}>Actions</th></tr></thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--slate-400)' }}>Aucun fournisseur trouvé</td></tr>
            ) : filtered.map(f => (
              <tr key={f.id} style={{ cursor: 'pointer' }} onClick={() => setDetailItem(f)}>
                <td><div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="icon-box" style={{ width: 40, height: 40, backgroundColor: '#F0FDF4', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Building2 size={18} color="#16A34A" /></div>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{f.nom}</span>
                </div></td>
                <td style={{ fontSize: '0.9rem', color: 'var(--slate-700)' }}>{f.contactPrincipal || f.contact || '-'}</td>
                <td style={{ fontSize: '0.9rem', color: 'var(--slate-700)' }}>{f.telephone || '-'}</td>
                <td style={{ fontSize: '0.9rem', color: 'var(--slate-700)' }}>{f.email || '-'}</td>
                <td style={{ fontSize: '0.9rem', color: 'var(--slate-700)' }}>{f.pays || '-'}</td>
                <td style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>{f.reference}</td>
                <td><div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button className="btn btn-ghost btn-icon" onClick={(ev) => { ev.stopPropagation(); openEdit(f); }} title="Modifier"><Edit size={16} /></button>
                  <button className="btn btn-ghost btn-icon" style={{ color: 'var(--danger)' }} onClick={(ev) => { ev.stopPropagation(); setDeleteId(f.id); }} title="Supprimer"><Trash2 size={16} /></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={detailItem !== null}
        onClose={() => setDetailItem(null)}
        title="Détails du Fournisseur"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDetailItem(null)}>Fermer</Button>
            <Button onClick={() => { const item = detailItem; setDetailItem(null); if(item) openEdit(item); }}>Modifier</Button>
          </>
        }
      >
        {detailItem && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="modal-section">
              <div className="modal-section-title">Identité</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div><span className="form-label">Référence</span><p style={{ fontWeight: 600 }}>{detailItem.reference}</p></div>
                <div><span className="form-label">Nom</span><p style={{ fontWeight: 600 }}>{detailItem.nom}</p></div>
                <div><span className="form-label">Contact principal</span><p>{detailItem.contactPrincipal || detailItem.contact || '-'}</p></div>
                <div><span className="form-label">Téléphone</span><p>{detailItem.telephone || '-'}</p></div>
                <div style={{ gridColumn: 'span 2' }}><span className="form-label">Email</span><p>{detailItem.email || '-'}</p></div>
                <div style={{ gridColumn: 'span 2' }}><span className="form-label">Adresse</span><p>{detailItem.adresse || '-'}</p></div>
                <div><span className="form-label">Pays</span><p>{detailItem.pays || '-'}</p></div>
              </div>
            </div>
            
            <div className="modal-section">
              <div className="modal-section-title">Réseaux & Plateformes</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {detailItem.lienAlibaba && <div style={{ gridColumn: 'span 2' }}><span className="form-label">Alibaba</span><p><a href={detailItem.lienAlibaba} target="_blank" rel="noreferrer" style={{color: 'var(--info)'}}>{detailItem.lienAlibaba}</a></p></div>}
                {detailItem.lien1688 && <div style={{ gridColumn: 'span 2' }}><span className="form-label">1688</span><p><a href={detailItem.lien1688} target="_blank" rel="noreferrer" style={{color: 'var(--info)'}}>{detailItem.lien1688}</a></p></div>}
                {detailItem.siteWeb && <div style={{ gridColumn: 'span 2' }}><span className="form-label">Site Web</span><p><a href={detailItem.siteWeb} target="_blank" rel="noreferrer" style={{color: 'var(--info)'}}>{detailItem.siteWeb}</a></p></div>}
                {detailItem.wechat && <div><span className="form-label">WeChat</span><p>{detailItem.wechat}</p></div>}
                {detailItem.whatsApp && <div><span className="form-label">WhatsApp</span><p>{detailItem.whatsApp}</p></div>}
              </div>
            </div>
            
            <div className="modal-section">
              <div className="modal-section-title">Production & Paiement</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div><span className="form-label">Délai prod. moyen</span><p>{detailItem.delaiProductionMoyen ? `${detailItem.delaiProductionMoyen} jours` : '-'}</p></div>
                <div style={{ gridColumn: 'span 2' }}><span className="form-label">Conditions de paiement</span><p>{detailItem.conditionsPaiement || '-'}</p></div>
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
        title={editItem ? "Modifier le Fournisseur" : "Nouveau Fournisseur"}
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Enregistrement...' : editItem ? 'Mettre à jour' : 'Créer'}</Button>
          </>
        }
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <FormSection title="Identité" pastilleColor="#0077B6" textColor="#0077B6" icon={<User size={16} color="#0077B6" />} iconBg="rgba(0,119,182,0.1)">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <Input label="Nom du fournisseur" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <Input label="Contact principal" value={form.contactPrincipal} onChange={e => setForm({ ...form, contactPrincipal: e.target.value })} placeholder="Nom du contact" />
                </div>
                <Input label="Téléphone" value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} />
                <Input label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                <div style={{ gridColumn: 'span 2' }}>
                  <Input label="Adresse" value={form.adresse} onChange={e => setForm({ ...form, adresse: e.target.value })} />
                </div>
                <Input label="Pays" value={form.pays} onChange={e => setForm({ ...form, pays: e.target.value })} />
              </div>
            </FormSection>
            
            <FormSection title="Production" pastilleColor="#10B981" textColor="#10B981" icon={<ShoppingBag size={16} color="#10B981" />} iconBg="rgba(16,185,129,0.1)">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <Input label="Délai production moyen (jours)" type="number" value={form.delaiProductionMoyen} onChange={e => setForm({ ...form, delaiProductionMoyen: e.target.value })} />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <Input label="Conditions de paiement" value={form.conditionsPaiement} onChange={e => setForm({ ...form, conditionsPaiement: e.target.value })} placeholder="Ex: 30% acompte, 70% avant expédition" />
                </div>
              </div>
            </FormSection>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <FormSection title="Plateformes & Réseaux" pastilleColor="#F59E0B" textColor="#F59E0B" icon={<Globe size={16} color="#F59E0B" />} iconBg="rgba(245,158,11,0.1)">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <Input label="Lien Alibaba" value={form.lienAlibaba} onChange={e => setForm({ ...form, lienAlibaba: e.target.value })} placeholder="https://alibaba.com/..." />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <Input label="Lien 1688" value={form.lien1688} onChange={e => setForm({ ...form, lien1688: e.target.value })} placeholder="https://1688.com/..." />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <Input label="Site web" value={form.siteWeb} onChange={e => setForm({ ...form, siteWeb: e.target.value })} placeholder="https://..." />
                </div>
                <Input label="WeChat" value={form.wechat} onChange={e => setForm({ ...form, wechat: e.target.value })} placeholder="ID WeChat" />
                <Input label="WhatsApp" value={form.whatsApp} onChange={e => setForm({ ...form, whatsApp: e.target.value })} placeholder="+86..." />
              </div>
            </FormSection>
            
            <FormSection title="Notes" pastilleColor="#8B5CF6" textColor="#8B5CF6" icon={<FileText size={16} color="#8B5CF6" />} iconBg="rgba(139,92,246,0.1)">
              <textarea className="form-input" placeholder="Notes additionnelles..." style={{ minHeight: 60, resize: 'vertical', width: '100%' }} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
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
        <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', marginBottom: '1rem' }}>Êtes-vous sûr de vouloir supprimer ce fournisseur ?</p>
      </Modal>
    </div>
  );
}
