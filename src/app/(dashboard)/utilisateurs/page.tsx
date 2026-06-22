'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { FormSection } from '@/components/ui/FormSection';
import { Plus, Edit, Trash2, Search, UserCog, Shield, User as UserIcon, Mail, Lock } from 'lucide-react';

interface Utilisateur {
  id: number; nom: string; email: string; role: string; actif: boolean; createdAt: string;
}

export default function UtilisateursPage() {
  const [items, setItems] = useState<Utilisateur[]>([]);
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editItem, setEditItem] = useState<Utilisateur | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState({ nom: '', email: '', password: '', role: 'AGENT' });
  const [saving, setSaving] = useState(false);

  const load = () => { fetch('/api/utilisateurs').then(r => r.ok && r.json()).then(d => { if (d) setItems(d.data || d); }).catch(() => {}); };
  useEffect(() => { load(); }, []);

  const resetForm = () => { setForm({ nom: '', email: '', password: '', role: 'AGENT' }); setEditItem(null); };
  const openCreate = () => { resetForm(); setIsOpen(true); };
  const openEdit = (u: Utilisateur) => { setForm({ nom: u.nom, email: u.email, password: '', role: u.role }); setEditItem(u); setIsOpen(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = editItem ? `/api/utilisateurs/${editItem.id}` : '/api/utilisateurs';
      const body: any = { nom: form.nom, email: form.email, role: form.role };
      if (form.password) body.password = form.password;
      const r = await fetch(url, { method: editItem ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (r.ok) { setIsOpen(false); resetForm(); load(); }
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { const r = await fetch(`/api/utilisateurs/${deleteId}`, { method: 'DELETE' }); if (r.ok) { setDeleteId(null); load(); } } catch {}
  };

  const filtered = items.filter(u => !search || u.nom.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()) || u.role.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><h1 className="page-title">Utilisateurs</h1><p className="page-subtitle" style={{ marginTop: '0.25rem' }}>{items.length} utilisateurs enregistrés.</p></div>
        <Button onClick={openCreate}><Plus size={18} /> Nouvel Utilisateur</Button>
      </div>

      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '1rem', borderBottom: '1px solid var(--slate-100)' }}>
          <form autoComplete="off" onSubmit={e => e.preventDefault()} className="input-group"><Search size={18} color="var(--slate-400)" />
            <input className="input" placeholder="Rechercher par nom, email, rôle..." autoComplete="off" name="table-search" value={search} onChange={e => setSearch(e.target.value)} />
          </form>
        </div>
        <table className="table">
          <thead><tr><th>Utilisateur</th><th>Email</th><th>Rôle</th><th>Statut</th><th>Inscription</th><th style={{ width: 80 }}>Actions</th></tr></thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--slate-400)' }}>Aucun utilisateur trouvé</td></tr>
            ) : filtered.map(u => (
              <tr key={u.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div className="icon-box" style={{ width: 34, height: 34, backgroundColor: 'var(--fleet-light)' }}>
                      {u.role === 'ADMIN' ? <Shield size={16} color="var(--fleet-blue)" /> : <UserIcon size={16} color="var(--fleet-blue)" />}
                    </div>
                    <span style={{ fontWeight: 600 }}>{u.nom}</span>
                  </div>
                </td>
                <td style={{ fontSize: '0.85rem' }}>{u.email}</td>
                <td><Badge variant={u.role === 'ADMIN' ? 'danger' : u.role === 'SUPERVISEUR' ? 'warning' : 'info'}>{u.role}</Badge></td>
                <td><Badge variant={u.actif ? 'success' : 'default'}>{u.actif ? 'Actif' : 'Inactif'}</Badge></td>
                <td style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString('fr-FR') : '-'}</td>
                <td><div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                  <button className="btn btn-ghost btn-icon" onClick={() => openEdit(u)}><Edit size={16} /></button>
                  <button className="btn btn-ghost btn-icon" style={{ color: 'var(--danger)' }} onClick={() => setDeleteId(u.id)}><Trash2 size={16} /></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title={editItem ? "Modifier l'Utilisateur" : "Nouvel Utilisateur"}
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Enregistrement...' : editItem ? 'Mettre à jour' : 'Créer'}</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <FormSection title="Identité" pastilleColor="#0077B6" textColor="#0077B6" icon={<UserCog size={16} color="#0077B6" />} iconBg="rgba(0,119,182,0.1)">
            <Input 
              label="Nom complet" 
              value={form.nom} 
              onChange={e => setForm({ ...form, nom: e.target.value })}
              placeholder="Nom de l'utilisateur"
            />
            <Input 
              label="Email" 
              type="email" 
              value={form.email} 
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="email@exemple.com"
            />
            <Input 
              label={editItem ? "Nouveau mot de passe (vide = inchangé)" : "Mot de passe"}
              type="password" 
              value={form.password} 
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
            />
          </FormSection>
          
          <FormSection title="Rôle" pastilleColor="#F59E0B" textColor="#F59E0B" icon={<Shield size={16} color="#F59E0B" />} iconBg="rgba(245,158,11,0.1)">
            <div className="form-group">
              <label className="form-label">Rôle</label>
              <select 
                className="form-select" 
                value={form.role} 
                onChange={e => setForm({ ...form, role: e.target.value })}
              >
                <option value="ADMIN">Administrateur</option>
                <option value="SUPERVISEUR">Superviseur</option>
                <option value="AGENT">Agent</option>
                <option value="LECTEUR">Lecteur</option>
              </select>
            </div>
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
        <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', marginBottom: '1rem' }}>Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.</p>
      </Modal>
    </div>
  );
}
