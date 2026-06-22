'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { FormSection } from '@/components/ui/FormSection';
import { Plus, Edit, Trash2, Search, FileText, Download, File, FileSpreadsheet, FileCheck, Upload } from 'lucide-react';

interface Document {
  id: number; titre: string; type: string; statut: string; fichier: string; createdAt: string;
}

const getIconByType = (type: string) => {
  switch (type) {
    case 'FACTURE':
      return <FileSpreadsheet size={24} color="#EF4444" />;
    case 'CONTRAT':
    case 'CERTIFICAT':
      return <FileCheck size={24} color="#10B981" />;
    case 'FICHE_TECHNIQUE':
    case 'BORDEREAU':
    default:
      return <FileText size={24} color="#0077B6" />;
  }
};

const getColorByType = (type: string) => {
  switch (type) {
    case 'FACTURE':
      return { bg: '#FEF2F2', border: '#FECACA', text: '#DC2626' };
    case 'CONTRAT':
    case 'CERTIFICAT':
      return { bg: '#D1FAE5', border: '#6EE7B7', text: '#059669' };
    case 'FICHE_TECHNIQUE':
    case 'BORDEREAU':
    default:
      return { bg: '#E0E7FF', border: '#A5B4FC', text: '#4338CA' };
  }
};

export default function DocumentsPage() {
  const [items, setItems] = useState<Document[]>([]);
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editItem, setEditItem] = useState<Document | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState({ titre: '', type: 'FICHE_TECHNIQUE', statut: 'BROUILLON', fichier: '' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => { fetch('/api/documents').then(r => r.ok && r.json()).then(d => { if (d) setItems(d.data || d); }).catch(() => {}); };
  useEffect(() => { load(); }, []);

  const resetForm = () => { setForm({ titre: '', type: 'FICHE_TECHNIQUE', statut: 'BROUILLON', fichier: '' }); setEditItem(null); setSelectedFile(null); };
  const openCreate = () => { resetForm(); setIsOpen(true); };
  const openEdit = (d: Document) => { setForm({ titre: d.titre, type: d.type, statut: d.statut, fichier: d.fichier || '' }); setEditItem(d); setIsOpen(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      // For now, just simulate saving - in real app you'd upload file first
      const url = editItem ? `/api/documents/${editItem.id}` : '/api/documents';
      const r = await fetch(url, { method: editItem ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (r.ok) { setIsOpen(false); resetForm(); load(); }
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { const r = await fetch(`/api/documents/${deleteId}`, { method: 'DELETE' }); if (r.ok) { setDeleteId(null); load(); } } catch {}
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setForm(prev => ({ ...prev, fichier: file.name }));
    }
  };

  const filtered = items.filter(d => !search || d.titre.toLowerCase().includes(search.toLowerCase()) || d.type.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><h1 className="page-title">Documents</h1><p className="page-subtitle" style={{ marginTop: '0.25rem' }}>{items.length} documents enregistrés.</p></div>
        <Button onClick={openCreate}><Plus size={18} /> Nouveau Document</Button>
      </div>

      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--slate-100)' }}>
          <form autoComplete="off" onSubmit={e => e.preventDefault()} className="input-group" style={{ flex: 1, maxWidth: 400 }}><Search size={18} color="var(--slate-400)" />
            <input className="input" placeholder="Rechercher par titre, type..." autoComplete="off" name="table-search" value={search} onChange={e => setSearch(e.target.value)} />
          </form>
        </div>
        
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--slate-400)' }}>
            <File size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>Aucun document trouvé</p>
            <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Commencez par ajouter votre premier document.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {filtered.map(d => {
              const colors = getColorByType(d.type);
              return (
                <div key={d.id} className="card" style={{ 
                  padding: '1.25rem', 
                  border: `1.5px solid ${colors.border}`, 
                  backgroundColor: colors.bg, 
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-premium)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '12px', backgroundColor: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
                      {getIconByType(d.type)}
                    </div>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button className="btn btn-ghost btn-icon" onClick={(e) => { e.stopPropagation(); openEdit(d); }}><Edit size={14} /></button>
                      <button className="btn btn-ghost btn-icon" style={{ color: 'var(--danger)' }} onClick={(e) => { e.stopPropagation(); setDeleteId(d.id); }}><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--slate-800)', marginBottom: '0.25rem' }}>{d.titre}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                      {d.createdAt ? new Date(d.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : '-'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
                    <Badge variant="info">{d.type.replace('_', ' ')}</Badge>
                    <Badge variant={d.statut === 'PUBLIE' ? 'success' : d.statut === 'ARCHIVE' ? 'default' : 'warning'}>{d.statut}</Badge>
                  </div>
                  {d.fichier && (
                    <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px dashed var(--slate-200)' }}>
                      <a href="#" style={{ fontSize: '0.8rem', color: 'var(--fleet-blue)', display: 'flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none', fontWeight: 600 }}>
                        <Download size={14} /> Télécharger le fichier
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title={editItem ? 'Modifier le Document' : 'Nouveau Document'}
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Enregistrement...' : editItem ? 'Mettre à jour' : 'Créer'}</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <FormSection title="Informations" pastilleColor="#0077B6" textColor="#0077B6" icon={<FileText size={16} color="#0077B6" />} iconBg="rgba(0,119,182,0.1)">
            <Input 
              label="Titre du document" 
              value={form.titre} 
              onChange={e => setForm({ ...form, titre: e.target.value })}
              placeholder="ex: Facture EXP-2026-001"
            />
          </FormSection>
          
          <FormSection title="Classification" pastilleColor="#F59E0B" textColor="#F59E0B" icon={<File size={16} color="#F59E0B" />} iconBg="rgba(245,158,11,0.1)">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Type de document</label>
                <select className="form-select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                  <option value="FICHE_TECHNIQUE">Fiche Technique</option>
                  <option value="CERTIFICAT">Certificat</option>
                  <option value="FACTURE">Facture</option>
                  <option value="BORDEREAU">Bordereau</option>
                  <option value="CONTRAT">Contrat</option>
                  <option value="AUTRE">Autre</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Statut</label>
                <select className="form-select" value={form.statut} onChange={e => setForm({ ...form, statut: e.target.value })}>
                  <option value="BROUILLON">Brouillon</option>
                  <option value="PUBLIE">Publié</option>
                  <option value="ARCHIVE">Archivé</option>
                </select>
              </div>
            </div>
          </FormSection>
          
          <FormSection title="Fichier" pastilleColor="#10B981" textColor="#10B981" icon={<Upload size={16} color="#10B981" />} iconBg="rgba(16,185,129,0.1)">
            <div className="form-group">
              <label className="form-label">Télécharger un fichier</label>
              <div style={{
                border: '2px dashed var(--slate-300)',
                borderRadius: '14px',
                padding: '1.5rem',
                textAlign: 'center',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--fleet-blue)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--slate-300)'}>
                <input 
                  type="file" 
                  style={{ display: 'none' }} 
                  id="file-upload" 
                  onChange={handleFileChange}
                />
                <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <Upload size={32} color="var(--slate-400)" />
                  <span style={{ fontSize: '0.9rem', color: 'var(--slate-700)', fontWeight: 500 }}>
                    {selectedFile ? selectedFile.name : 'Cliquez pour sélectionner ou glissez-déposez'}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>PDF, DOC, DOCX, XLS, XLSX (max 10MB)</span>
                </label>
              </div>
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
        <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', marginBottom: '1rem' }}>Êtes-vous sûr de vouloir supprimer ce document ? Cette action est irréversible.</p>
      </Modal>
    </div>
  );
}
