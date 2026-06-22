'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { FormSection } from '@/components/ui/FormSection';
import { Plus, Edit, Trash2, Search, User, Building2, MapPin, Phone, Mail, CreditCard, FileText } from 'lucide-react';

interface Client {
  id: number; reference: string; nom: string; email: string; telephone: string;
  telephoneSecondaire: string | null; adresse: string; ville: string; pays: string;
  typeClient: string | null; statut: string; createdAt: string;
  numeroCNIB: string | null; numeroIFU: string | null; registreCommerce: string | null;
  plafondCredit: number | null; conditionsPaiement: string | null;
  _count?: { expeditions: number };
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editItem, setEditItem] = useState<Client | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [detailItem, setDetailItem] = useState<Client | null>(null);
  const [form, setForm] = useState({ 
    nom: '', email: '', telephone: '', telephoneSecondaire: '', adresse: '', ville: '', pays: '',
    typeClient: 'PARTICULIER', statut: 'ACTIF', numeroCNIB: '', numeroIFU: '',
    registreCommerce: '', plafondCredit: '', conditionsPaiement: '',
  });
  const [saving, setSaving] = useState(false);

  const load = () => { fetch('/api/clients', { cache: 'no-store' }).then(r => r.ok && r.json()).then(d => { if (d) setClients(d); }).catch(() => {}); };
  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setForm({ nom: '', email: '', telephone: '', telephoneSecondaire: '', adresse: '', ville: '', pays: '', typeClient: 'PARTICULIER', statut: 'ACTIF', numeroCNIB: '', numeroIFU: '', registreCommerce: '', plafondCredit: '', conditionsPaiement: '' });
    setEditItem(null);
  };

  const openCreate = () => { resetForm(); setIsOpen(true); };
  const openEdit = (c: Client) => {
    setForm({
      nom: c.nom, email: c.email || '', telephone: c.telephone || '', telephoneSecondaire: c.telephoneSecondaire || '',
      adresse: c.adresse || '', ville: c.ville || '', pays: c.pays || '', typeClient: c.typeClient || 'PARTICULIER',
      statut: c.statut, numeroCNIB: c.numeroCNIB || '', numeroIFU: c.numeroIFU || '',
      registreCommerce: c.registreCommerce || '', plafondCredit: c.plafondCredit ? String(c.plafondCredit) : '',
      conditionsPaiement: c.conditionsPaiement || '',
    });
    setEditItem(c);
    setIsOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = editItem ? `/api/clients/${editItem.id}` : '/api/clients';
      const r = await fetch(url, { 
        method: editItem ? 'PUT' : 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(form) 
      });
      if (r.ok) { setIsOpen(false); resetForm(); load(); }
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const r = await fetch(`/api/clients/${deleteId}`, { method: 'DELETE' });
      if (r.ok) { setDeleteId(null); load(); }
    } catch {}
  };

  const filtered = clients.filter(c => 
    !search || 
    c.nom.toLowerCase().includes(search.toLowerCase()) || 
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.reference.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><h1 className="page-title">Clients</h1><p className="page-subtitle" style={{ marginTop: '0.25rem' }}>{clients.length} clients enregistrés.</p></div>
        <Button onClick={openCreate}><Plus size={18} /> Nouveau Client</Button>
      </div>

      <div className="table-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '1rem', borderBottom: '1px solid var(--slate-100)' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} color="var(--slate-400)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              className="form-input" 
              placeholder="Rechercher par nom ou téléphone..." 
              autoComplete="off" 
              style={{ paddingLeft: '2.75rem' }}
              value={search} 
              onChange={e => setSearch(e.target.value)} 
            />
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Téléphone</th>
              <th>Ville</th>
              <th>Expéditions</th>
              <th>Statut</th>
              <th style={{ width: 100 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--slate-400)' }}>Aucun client trouvé</td></tr>
            ) : filtered.map(c => (
              <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => setDetailItem(c)}>
                <td><div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="icon-box" style={{ width: 40, height: 40, backgroundColor: 'var(--fleet-light)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={18} color="var(--fleet-blue)" /></div>
                  <div>
                    <div style={{ color: 'var(--slate-900)', fontWeight: 700, fontSize: '0.95rem' }}>
                      {c.nom}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{c.reference}</div>
                  </div>
                </div></td>
                <td><div style={{ fontSize: '0.9rem', color: 'var(--slate-700)' }}>{c.telephone || '-'}</div></td>
                <td><div style={{ fontSize: '0.9rem', color: 'var(--slate-700)' }}>{c.ville || '-'}</div></td>
                <td><Badge variant="info">{c._count?.expeditions || 0}</Badge></td>
                <td><Badge variant={c.statut === 'ACTIF' ? 'success' : 'default'}>{c.statut}</Badge></td>
                <td><div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button className="btn btn-ghost btn-icon" onClick={(ev) => { ev.stopPropagation(); openEdit(c); }} title="Modifier"><Edit size={16} /></button>
                  <button className="btn btn-ghost btn-icon" style={{ color: 'var(--danger)' }} onClick={(ev) => { ev.stopPropagation(); setDeleteId(c.id); }} title="Supprimer"><Trash2 size={16} /></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={detailItem !== null}
        onClose={() => setDetailItem(null)}
        title="Détails du Client"
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
                <div><span className="form-label">Nom complet</span><p style={{ fontWeight: 600 }}>{detailItem.nom}</p></div>
                <div><span className="form-label">Type de client</span><p>{detailItem.typeClient}</p></div>
                <div><span className="form-label">Statut</span><p><Badge variant={detailItem.statut === 'ACTIF' ? 'success' : 'default'}>{detailItem.statut}</Badge></p></div>
              </div>
            </div>
            
            <div className="modal-section">
              <div className="modal-section-title">Contact & Localisation</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div><span className="form-label">Email</span><p>{detailItem.email || '-'}</p></div>
                <div><span className="form-label">Téléphone</span><p>{detailItem.telephone || '-'}</p></div>
                {detailItem.telephoneSecondaire && <div><span className="form-label">Tél. secondaire</span><p>{detailItem.telephoneSecondaire}</p></div>}
                <div style={{ gridColumn: 'span 2' }}><span className="form-label">Adresse complète</span><p>{detailItem.adresse || '-'}</p></div>
                <div><span className="form-label">Ville</span><p>{detailItem.ville || '-'}</p></div>
                <div><span className="form-label">Pays</span><p>{detailItem.pays || '-'}</p></div>
              </div>
            </div>
            
            <div className="modal-section">
              <div className="modal-section-title">Informations professionnelles</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div><span className="form-label">N° CNIB</span><p>{detailItem.numeroCNIB || '-'}</p></div>
                <div><span className="form-label">N° IFU</span><p>{detailItem.numeroIFU || '-'}</p></div>
                <div style={{ gridColumn: 'span 2' }}><span className="form-label">Registre de commerce (RCCM)</span><p>{detailItem.registreCommerce || '-'}</p></div>
                <div><span className="form-label">Plafond de crédit</span><p style={{ fontWeight: 600 }}>{detailItem.plafondCredit ? `${detailItem.plafondCredit} FCFA` : '-'}</p></div>
                <div><span className="form-label">Conditions de paiement</span><p>{detailItem.conditionsPaiement || '-'}</p></div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title={editItem ? "Modifier le Client" : "Nouveau Client"}
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
                  <Input label="Nom complet" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} placeholder="Entrez le nom du client" />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <Input label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="exemple@email.com" />
                </div>
                <Input label="Téléphone" value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} placeholder="+225 01 23 45 67" />
                <Input label="Téléphone sec." value={form.telephoneSecondaire} onChange={e => setForm({ ...form, telephoneSecondaire: e.target.value })} placeholder="+225 07 89 01 23" />
                <div className="form-group">
                  <label className="form-label">Type de client</label>
                  <select className="form-select" value={form.typeClient} onChange={e => setForm({ ...form, typeClient: e.target.value })}>
                    <option value="PARTICULIER">Particulier</option><option value="ENTREPRISE">Entreprise</option>
                    <option value="TRANSPORTEUR">Transporteur</option><option value="GROSSISTE">Grossiste</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Statut</label>
                  <select className="form-select" value={form.statut} onChange={e => setForm({ ...form, statut: e.target.value })}>
                    <option value="ACTIF">Actif</option><option value="INACTIF">Inactif</option>
                  </select>
                </div>
              </div>
            </FormSection>
            
            <FormSection title="Documents" pastilleColor="#10B981" textColor="#10B981" icon={<FileText size={16} color="#10B981" />} iconBg="rgba(16,185,129,0.1)">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Input label="N° CNIB" value={form.numeroCNIB} onChange={e => setForm({ ...form, numeroCNIB: e.target.value })} placeholder="Numéro CNIB" />
                <Input label="N° IFU" value={form.numeroIFU} onChange={e => setForm({ ...form, numeroIFU: e.target.value })} placeholder="Numéro IFU" />
                <div style={{ gridColumn: 'span 2' }}>
                  <Input label="Registre de commerce" value={form.registreCommerce} onChange={e => setForm({ ...form, registreCommerce: e.target.value })} placeholder="N° RCCM" />
                </div>
              </div>
            </FormSection>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <FormSection title="Localisation" pastilleColor="#F59E0B" textColor="#F59E0B" icon={<MapPin size={16} color="#F59E0B" />} iconBg="rgba(245,158,11,0.1)">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <Input label="Adresse" value={form.adresse} onChange={e => setForm({ ...form, adresse: e.target.value })} placeholder="Adresse complète" />
                </div>
                <Input label="Ville" value={form.ville} onChange={e => setForm({ ...form, ville: e.target.value })} placeholder="Ville" />
                <Input label="Pays" value={form.pays} onChange={e => setForm({ ...form, pays: e.target.value })} placeholder="Pays" />
              </div>
            </FormSection>
            
            <FormSection title="Crédit" pastilleColor="#64748B" textColor="#64748B" icon={<CreditCard size={16} color="#64748B" />} iconBg="rgba(100,116,139,0.1)">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                <Input label="Plafond de crédit (FCFA)" type="number" value={form.plafondCredit} onChange={e => setForm({ ...form, plafondCredit: e.target.value })} placeholder="0" />
                <Input label="Conditions de paiement" value={form.conditionsPaiement} onChange={e => setForm({ ...form, conditionsPaiement: e.target.value })} placeholder="Ex: 30 jours fin de mois" />
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
        <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', marginBottom: '1rem' }}>Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible.</p>
      </Modal>
    </div>
  );
}
