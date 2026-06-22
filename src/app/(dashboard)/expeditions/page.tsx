'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Plus, Edit, Trash2, Search, Package, Ship, Plane, Truck } from 'lucide-react';

interface Marchandise {
  id: number;
  expeditionId: number;
  description: string;
  categorie?: string;
  quantite: number;
  unite?: string;
  poidsUnitaire?: number;
  poidsTotalKg?: number;
  longueurCm?: number;
  largeurCm?: number;
  hauteurCm?: number;
  cbm?: number;
  valeurTotale?: number;
  nombreColis?: number;
  notes?: string;
}

interface Expedition {
  id: number; reference: string; clientId: number; typeTransport: string;
  statut: string; portOrigine: string; paysOrigine: string;
  portDestination: string; paysDestination: string;
  incoterm: string; devise: string;
  coutExpedition: number; argentRecu: number; poidsTotalKg: number; nombreColis: number;
  dateDepartPrevue: string; dateArriveePrevue: string; notes: string;
  client: { nom: string };
  _count?: { marchandises: number; conteneurs: number };
}

const typeTransportMeta: Record<string, { icon: any; color: string }> = {
  MARITIME: { icon: Ship, color: '#0077B6' },
  AERIEN: { icon: Plane, color: '#00B4D8' },
  ROUTIER: { icon: Truck, color: '#006A4E' },
};

const statusMeta: Record<string, { variant: 'success' | 'warning' | 'info' | 'default'; label: string }> = {
  EN_ATTENTE: { variant: 'default', label: 'En Attente' },
  EN_PREPARATION: { variant: 'info', label: 'En Préparation' },
  EN_TRANSIT: { variant: 'warning', label: 'En Transit' },
  ARRIVE: { variant: 'success', label: 'Arrivé' },
  EN_STOCK: { variant: 'success', label: 'En Stock' },
  LIVRE: { variant: 'success', label: 'Livré' },
  PARTIELLEMENT_LIVRE: { variant: 'info', label: 'Partiellement Livré' },
};

export default function ExpeditionsPage() {
  const [items, setItems] = useState<Expedition[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [fournisseurs, setFournisseurs] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editItem, setEditItem] = useState<Expedition | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [detailItem, setDetailItem] = useState<Expedition | null>(null);
  const [marchandises, setMarchandises] = useState<Marchandise[]>([]);
  const [isMarchandiseModalOpen, setIsMarchandiseModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editMarchandise, setEditMarchandise] = useState<Marchandise | null>(null);
  const [form, setForm] = useState({ 
    clientId: '', fournisseurId: '', typeCommande: 'TRANSIT', typeTransport: 'MARITIME', statut: 'EN_ATTENTE', 
    portOrigine: '', paysOrigine: '', portDestination: '', paysDestination: '',
    incoterm: 'FOB', devise: 'USD', coutExpedition: '', argentRecu: '', poidsTotalKg: '', nombreColis: '',
    dateDepartPrevue: '', dateArriveePrevue: '', notes: ''
  });
  const [marchandiseForm, setMarchandiseForm] = useState({
    description: '', categorie: '', quantite: '', unite: 'pcs',
    poidsUnitaire: '', poidsTotalKg: '', longueurCm: '', largeurCm: '', hauteurCm: '', cbm: '',
    valeurTotale: '', nombreColis: '', notes: ''
  });
  const [saving, setSaving] = useState(false);
  const [savingMarchandise, setSavingMarchandise] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const load = () => { 
    console.log('Loading expeditions...');
    fetch('/api/expeditions', { cache: 'no-store' })
      .then(r => {
        console.log('Expeditions fetch response status:', r.status);
        return r.json();
      })
      .then(d => { 
        console.log('Expeditions received:', d);
        if (d) setItems(d); 
      })
      .catch(err => console.error('Error loading expeditions:', err)); 
  };
  const loadOne = async (id: number) => {
    try {
      const r = await fetch(`/api/expeditions/${id}`, { cache: 'no-store' });
      if (r.ok) { const d = await r.json(); setDetailItem(d); return d; }
    } catch {}
    return null;
  };
  const loadClients = () => { fetch('/api/clients', { cache: 'no-store' }).then(r => r.ok && r.json()).then(d => { if (d) setClients(d); }).catch(() => {}); };
  const loadFournisseurs = () => { fetch('/api/fournisseurs', { cache: 'no-store' }).then(r => r.ok && r.json()).then(d => { if (d) setFournisseurs(d); }).catch(() => {}); };
  const loadMarchandises = (expeditionId: number) => { 
    fetch(`/api/marchandises?expeditionId=${expeditionId}`, { cache: 'no-store' })
      .then(r => r.ok && r.json())
      .then(d => { if (d) setMarchandises(d); })
      .catch(() => {}); 
  };
  useEffect(() => { load(); loadClients(); loadFournisseurs(); }, []);

  const resetForm = () => { 
    setForm({ 
      clientId: '', fournisseurId: '', typeCommande: 'TRANSIT', typeTransport: 'MARITIME', statut: 'EN_ATTENTE', 
      portOrigine: '', paysOrigine: '', portDestination: '', paysDestination: '',
      incoterm: 'FOB', devise: 'USD', coutExpedition: '', argentRecu: '', poidsTotalKg: '', nombreColis: '',
      dateDepartPrevue: '', dateArriveePrevue: '', notes: ''
    }); 
    setEditItem(null); 
  };
  const resetMarchandiseForm = () => {
    setMarchandiseForm({
      description: '', categorie: '', quantite: '', unite: 'pcs',
      poidsUnitaire: '', poidsTotalKg: '', longueurCm: '', largeurCm: '', hauteurCm: '', cbm: '',
      valeurTotale: '', nombreColis: '', notes: ''
    });
    setEditMarchandise(null);
  };

  const openCreate = () => { resetForm(); setIsOpen(true); };
  const openEdit = (e: any) => { 
    setForm({ 
      clientId: e.clientId?.toString() || '', 
      fournisseurId: e.fournisseurId?.toString() || '', 
      typeCommande: e.typeCommande || 'TRANSIT',
      typeTransport: e.typeTransport, statut: e.statut, 
      portOrigine: e.portOrigine || '', paysOrigine: e.paysOrigine || '', 
      portDestination: e.portDestination || '', paysDestination: e.paysDestination || '',
      incoterm: e.incoterm || 'FOB', devise: e.devise || 'USD',
      coutExpedition: e.coutExpedition?.toString() || '', argentRecu: e.argentRecu?.toString() || '', poidsTotalKg: e.poidsTotalKg?.toString() || '', 
      nombreColis: e.nombreColis?.toString() || '',
      dateDepartPrevue: e.dateDepartPrevue?.split('T')[0] || '', 
      dateArriveePrevue: e.dateArriveePrevue?.split('T')[0] || '',
      notes: e.notes || ''
    }); 
    setEditItem(e); 
    setIsOpen(true); 
  };
  const openDetail = async (e: Expedition) => { 
    setDetailItem(e);
    loadOne(e.id);
    loadMarchandises(e.id); 
    setDetailOpen(true);
  };
  const openAddMarchandise = () => { resetMarchandiseForm(); setIsMarchandiseModalOpen(true); };
  const openEditMarchandise = (m: Marchandise) => {
    setMarchandiseForm({
      description: m.description,
      categorie: m.categorie || '',
      quantite: m.quantite.toString(),
      unite: m.unite || 'pcs',
      poidsUnitaire: m.poidsUnitaire?.toString() || '',
      poidsTotalKg: m.poidsTotalKg?.toString() || '',
      longueurCm: m.longueurCm?.toString() || '',
      largeurCm: m.largeurCm?.toString() || '',
      hauteurCm: m.hauteurCm?.toString() || '',
      cbm: m.cbm?.toString() || '',
      valeurTotale: m.valeurTotale?.toString() || '',
      nombreColis: m.nombreColis?.toString() || '',
      notes: m.notes || ''
    });
    setEditMarchandise(m);
    setIsMarchandiseModalOpen(true);
  };


  const handleSave = async () => {
    if (!form.clientId) {
      setErrorMessage('Veuillez sélectionner un client !');
      return;
    }
    setErrorMessage('');
    setSaving(true);
    try {
      const url = editItem ? `/api/expeditions/${editItem.id}` : '/api/expeditions';
      const data = {
        ...form,
        clientId: Number(form.clientId),
        fournisseurId: form.fournisseurId ? Number(form.fournisseurId) : null,
        coutExpedition: form.coutExpedition ? Number(form.coutExpedition) : null,
        argentRecu: form.argentRecu ? Number(form.argentRecu) : null,
        poidsTotalKg: form.poidsTotalKg ? Number(form.poidsTotalKg) : null,
        nombreColis: form.nombreColis ? Number(form.nombreColis) : null
      };
      console.log('Sending data to API:', data);
      const r = await fetch(url, { 
        method: editItem ? 'PUT' : 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(data) 
      });
      console.log('API response status:', r.status);
      const responseData = await r.json();
      console.log('API response data:', responseData);
      if (r.ok) { 
        console.log('API call successful!');
        setIsOpen(false); 
        resetForm(); 
        load(); 
      } else {
        setErrorMessage(responseData.error || 'Erreur lors de l\'enregistrement');
      }
    } catch (err) {
      console.error('Error in handleSave:', err);
      setErrorMessage('Erreur réseau : ' + (err as any).message);
    } finally { setSaving(false); }
  };

  const handleSaveMarchandise = async () => {
    if (!marchandiseForm.description || !marchandiseForm.quantite) return;
    if (!detailItem) return;
    
    setSavingMarchandise(true);
    try {
      const data = {
        ...marchandiseForm,
        expeditionId: detailItem.id,
        quantite: Number(marchandiseForm.quantite),
        poidsUnitaire: marchandiseForm.poidsUnitaire ? Number(marchandiseForm.poidsUnitaire) : null,
        poidsTotalKg: marchandiseForm.poidsTotalKg ? Number(marchandiseForm.poidsTotalKg) : null,
        longueurCm: marchandiseForm.longueurCm ? Number(marchandiseForm.longueurCm) : null,
        largeurCm: marchandiseForm.largeurCm ? Number(marchandiseForm.largeurCm) : null,
        hauteurCm: marchandiseForm.hauteurCm ? Number(marchandiseForm.hauteurCm) : null,
        cbm: marchandiseForm.cbm ? Number(marchandiseForm.cbm) : null,
        valeurTotale: marchandiseForm.valeurTotale ? Number(marchandiseForm.valeurTotale) : null,
        nombreColis: marchandiseForm.nombreColis ? Number(marchandiseForm.nombreColis) : null
      };
      
      const url = editMarchandise ? `/api/marchandises` : '/api/marchandises';
      const method = editMarchandise ? 'PUT' : 'POST';
      
      const r = await fetch(url, { 
        method, 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(editMarchandise ? { ...data, id: editMarchandise.id } : data) 
      });
      
      if (r.ok) { 
        setIsMarchandiseModalOpen(false); 
        resetMarchandiseForm(); 
        loadMarchandises(detailItem.id); 
        load(); 
      }
    } catch (err) {
      console.error('Error in handleSaveMarchandise:', err);
    } finally { setSavingMarchandise(false); }
  };

  const handleDeleteMarchandise = async (id: number) => {
    try {
      const r = await fetch(`/api/marchandises?id=${id}`, { method: 'DELETE' });
      if (r.ok && detailItem) { 
        loadMarchandises(detailItem.id); 
        load(); 
      }
    } catch {}
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { const r = await fetch(`/api/expeditions/${deleteId}`, { method: 'DELETE' }); if (r.ok) { setDeleteId(null); load(); } } catch {}
  };

  const filtered = items.filter(e => !search || e.reference.toLowerCase().includes(search.toLowerCase()) || (e.client?.nom || '').toLowerCase().includes(search.toLowerCase()));
  
  console.log('Expeditions items:', items);
  console.log('Filtered expeditions:', filtered);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><h1 className="page-title">Expéditions</h1><p className="page-subtitle" style={{ marginTop: '0.25rem' }}>{items.length} expéditions enregistrées.</p></div>
        <Button onClick={openCreate}><Plus size={18} /> Nouvelle Expédition</Button>
      </div>

      <div className="table-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '1rem', borderBottom: '1px solid var(--slate-100)' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} color="var(--slate-400)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              className="form-input" 
              placeholder="Rechercher par référence, client..." 
              autoComplete="off" 
              style={{ paddingLeft: '2.75rem' }}
              value={search} 
              onChange={e => setSearch(e.target.value)} 
            />
          </div>
        </div>
        <table className="table">
          <thead><tr><th>Réf.</th><th>Client</th><th>Transport</th><th>Statut</th><th>Trajet</th><th>Marchandises</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--slate-400)' }}>Aucune expédition trouvée</td></tr>
            ) : filtered.map(e => {
              const st = statusMeta[e.statut] || { variant: 'default' as const, label: e.statut };
              const tt = typeTransportMeta[e.typeTransport];
              const TransportIcon = tt ? tt.icon : Package;
              return (
                <tr key={e.id} style={{ cursor: 'pointer' }} onClick={() => openDetail(e)}>
                  <td style={{ fontWeight: 600, color: 'var(--fleet-blue)' }}>
                    {e.reference}
                  </td>
                  <td style={{ fontSize: '0.9rem', color: 'var(--slate-700)' }}>{e.client?.nom || 'N/A'}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <TransportIcon size={14} color={tt?.color} />
                      <Badge variant="info">{e.typeTransport}</Badge>
                    </div>
                  </td>
                  <td><Badge variant={st.variant}>{st.label}</Badge></td>
                  <td>
                    <div style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>
                      {e.paysOrigine || e.portOrigine || '-'} → {e.paysDestination || e.portDestination || '-'}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 600 }}>{e._count?.marchandises || '-'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button className="btn btn-ghost btn-icon" onClick={(ev) => { ev.stopPropagation(); openEdit(e); }} title="Modifier"><Edit size={16} /></button>
                      <button className="btn btn-ghost btn-icon" style={{ color: 'var(--danger)' }} onClick={(ev) => { ev.stopPropagation(); setDeleteId(e.id); }} title="Supprimer"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal
        open={detailItem !== null}
        onClose={() => setDetailItem(null)}
        title={detailItem?.reference || "Détails Expédition"}
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDetailItem(null)}>Fermer</Button>
            <Button onClick={() => { const e = detailItem; setDetailItem(null); if(e) openEdit(e); }}>Modifier</Button>
          </>
        }
      >
        {detailItem && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ padding: '1rem 1.25rem', border: '1px solid var(--slate-200)', borderRadius: '10px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Client</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>{detailItem.client?.nom || 'N/A'}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--fleet-blue)', fontWeight: 600 }}>{detailItem.reference}</div>
                </div>
                <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                  <Badge variant="info">{detailItem.typeTransport}</Badge>
                  <Badge variant={(statusMeta[detailItem.statut]?.variant || 'default') as any}>{statusMeta[detailItem.statut]?.label || detailItem.statut}</Badge>
                </div>
              </div>
            </div>
            <div style={{ padding: '1rem 1.25rem', border: '1px solid var(--slate-200)', borderRadius: '10px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '0.75rem', fontSize: '0.88rem' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Trajet</div>
                  <div>{detailItem.paysOrigine || detailItem.portOrigine || '-'} → {detailItem.paysDestination || detailItem.portDestination || '-'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Incoterm</div>
                  <div>{detailItem.incoterm}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Devise</div>
                  <div>{detailItem.devise}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Dates</div>
                  <div style={{ fontSize: '0.8rem' }}>{detailItem.dateDepartPrevue?.split('T')[0] || '-'} → {detailItem.dateArriveePrevue?.split('T')[0] || '-'}</div>
                </div>
              </div>
            </div>
            <div style={{ padding: '1rem 1.25rem', border: '1px solid var(--slate-200)', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Résumé financier</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>Coût</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--danger)' }}>{detailItem.coutExpedition || 0} {detailItem.devise}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>Reçu</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--success)' }}>{detailItem.argentRecu || 0} {detailItem.devise}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>Reste</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{Math.max(0, (detailItem.coutExpedition || 0) - (detailItem.argentRecu || 0))} {detailItem.devise}</div>
                </div>
              </div>
            </div>
            <div style={{ padding: '1rem 1.25rem', border: '1px solid var(--slate-200)', borderRadius: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Marchandises ({marchandises.length})</span>
                <Button size="sm" onClick={openAddMarchandise}><Plus size={14} /> Ajouter</Button>
              </div>
              {marchandises.length === 0 ? (
                <p style={{ color: 'var(--slate-400)', fontSize: '0.85rem', textAlign: 'center', padding: '1rem' }}>Aucune marchandise</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--slate-200)' }}>
                      <th style={{ textAlign: 'left', padding: '0.5rem 0', fontWeight: 600, color: 'var(--slate-500)' }}>Description</th>
                      <th style={{ textAlign: 'center', padding: '0.5rem 0', fontWeight: 600, color: 'var(--slate-500)' }}>Qté</th>
                      <th style={{ textAlign: 'center', padding: '0.5rem 0', fontWeight: 600, color: 'var(--slate-500)' }}>Poids</th>
                      <th style={{ textAlign: 'center', padding: '0.5rem 0', fontWeight: 600, color: 'var(--slate-500)' }}>CBM</th>
                      <th style={{ textAlign: 'right', padding: '0.5rem 0', fontWeight: 600, color: 'var(--slate-500)' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marchandises.map(m => (
                      <tr key={m.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                        <td style={{ padding: '0.5rem 0' }}>
                          <div style={{ fontWeight: 500 }}>{m.description}</div>
                          {m.categorie && <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>{m.categorie}</div>}
                        </td>
                        <td style={{ textAlign: 'center', padding: '0.5rem 0' }}>{m.quantite} {m.unite}</td>
                        <td style={{ textAlign: 'center', padding: '0.5rem 0' }}>{m.poidsTotalKg || '-'}</td>
                        <td style={{ textAlign: 'center', padding: '0.5rem 0' }}>{m.cbm || '-'}</td>
                        <td style={{ textAlign: 'right', padding: '0.5rem 0' }}>
                          <button className="btn btn-ghost btn-icon" onClick={() => openEditMarchandise(m)}><Edit size={13} /></button>
                          <button className="btn btn-ghost btn-icon" style={{ color: 'var(--danger)' }} onClick={() => handleDeleteMarchandise(m.id)}><Trash2 size={13} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            {detailItem.notes && (
              <div style={{ padding: '1rem 1.25rem', border: '1px solid var(--slate-200)', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>Notes</div>
                <div style={{ fontSize: '0.88rem', color: 'var(--slate-600)' }}>{detailItem.notes}</div>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal
        open={isMarchandiseModalOpen}
        onClose={() => setIsMarchandiseModalOpen(false)}
        title={editMarchandise ? "Modifier la marchandise" : "Ajouter une marchandise"}
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsMarchandiseModalOpen(false)}>Annuler</Button>
            <Button onClick={handleSaveMarchandise} disabled={savingMarchandise}>
              {savingMarchandise ? 'Enregistrement...' : editMarchandise ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Input label="Description *" value={marchandiseForm.description} onChange={e => setMarchandiseForm({ ...marchandiseForm, description: e.target.value })} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <Input label="Quantité *" type="number" value={marchandiseForm.quantite} onChange={e => setMarchandiseForm({ ...marchandiseForm, quantite: e.target.value })} />
            <div className="form-group">
              <label className="form-label">Unité</label>
              <select className="form-select" value={marchandiseForm.unite} onChange={e => setMarchandiseForm({ ...marchandiseForm, unite: e.target.value })}>
                <option value="pcs">Pièces</option>
                <option value="kg">Kg</option>
                <option value="m">Mètres</option>
                <option value="m²">M²</option>
                <option value="set">Ensemble</option>
              </select>
            </div>
            <Input label="Catégorie" value={marchandiseForm.categorie} onChange={e => setMarchandiseForm({ ...marchandiseForm, categorie: e.target.value })} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <Input label="Poids total (kg)" type="number" value={marchandiseForm.poidsTotalKg} onChange={e => setMarchandiseForm({ ...marchandiseForm, poidsTotalKg: e.target.value })} />
            <Input label="CBM (m³)" type="number" step="0.0001" value={marchandiseForm.cbm} onChange={e => setMarchandiseForm({ ...marchandiseForm, cbm: e.target.value })} />
            <Input label="Valeur totale" type="number" value={marchandiseForm.valeurTotale} onChange={e => setMarchandiseForm({ ...marchandiseForm, valeurTotale: e.target.value })} />
          </div>
          <textarea className="form-input" placeholder="Notes..." style={{ minHeight: '60px', resize: 'vertical', width: '100%' }} value={marchandiseForm.notes} onChange={e => setMarchandiseForm({ ...marchandiseForm, notes: e.target.value })} />
        </div>
      </Modal>

      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title={editItem ? 'Modifier l\'Expédition' : 'Nouvelle Expédition'}
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Enregistrement...' : editItem ? 'Mettre à jour' : 'Créer'}</Button>
          </>
        }
      >
        {errorMessage && (
          <div style={{ backgroundColor: 'rgba(220,38,38,0.1)', color: '#dc2626', padding: '10px 14px', borderRadius: '6px', marginBottom: '12px', fontWeight: 500, fontSize: '0.85rem' }}>
            {errorMessage}
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ padding: '1rem', border: '1px solid var(--slate-200)', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Client & Transport</div>
              <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                <label className="form-label">Client</label>
                <select className="form-select" value={form.clientId} onChange={e => setForm({ ...form, clientId: e.target.value })}>
                  <option value="">Sélectionner</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                <label className="form-label">Fournisseur</label>
                <select className="form-select" value={form.fournisseurId} onChange={e => setForm({ ...form, fournisseurId: e.target.value })}>
                  <option value="">Aucun</option>
                  {fournisseurs.map(f => <option key={f.id} value={f.id}>{f.nom}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Transport</label>
                  <select className="form-select" value={form.typeTransport} onChange={e => setForm({ ...form, typeTransport: e.target.value })}>
                    <option value="MARITIME">Maritime</option>
                    <option value="AERIEN">Aérien</option>
                    <option value="ROUTIER">Routier</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Statut</label>
                  <select className="form-select" value={form.statut} onChange={e => setForm({ ...form, statut: e.target.value })}>
                    <option value="EN_ATTENTE">Attente</option>
                    <option value="EN_PREPARATION">Préparation</option>
                    <option value="EN_TRANSIT">Transit</option>
                    <option value="ARRIVE">Arrivé</option>
                    <option value="EN_STOCK">Stock</option>
                    <option value="LIVRE">Livré</option>
                    <option value="PARTIELLEMENT_LIVRE">Partiel</option>
                  </select>
                </div>
              </div>
            </div>
            <div style={{ padding: '1rem', border: '1px solid var(--slate-200)', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Coût & Revenu</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <Input label="Coût expédition" type="number" value={form.coutExpedition} onChange={e => setForm({ ...form, coutExpedition: e.target.value })} />
                <Input label="Argent reçu" type="number" value={form.argentRecu} onChange={e => setForm({ ...form, argentRecu: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Incoterm</label>
                  <select className="form-select" value={form.incoterm} onChange={e => setForm({ ...form, incoterm: e.target.value })}>
                    <option value="FOB">FOB</option>
                    <option value="CIF">CIF</option>
                    <option value="EXW">EXW</option>
                    <option value="CFR">CFR</option>
                    <option value="DAP">DAP</option>
                    <option value="DDP">DDP</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Devise</label>
                  <select className="form-select" value={form.devise} onChange={e => setForm({ ...form, devise: e.target.value })}>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="XAF">XAF</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ padding: '1rem', border: '1px solid var(--slate-200)', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Trajet</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <Input label="Pays origine" value={form.paysOrigine} onChange={e => setForm({ ...form, paysOrigine: e.target.value })} />
                <Input label="Port origine" value={form.portOrigine} onChange={e => setForm({ ...form, portOrigine: e.target.value })} />
                <Input label="Pays destination" value={form.paysDestination} onChange={e => setForm({ ...form, paysDestination: e.target.value })} />
                <Input label="Port destination" value={form.portDestination} onChange={e => setForm({ ...form, portDestination: e.target.value })} />
                <Input label="Départ prévu" type="date" value={form.dateDepartPrevue} onChange={e => setForm({ ...form, dateDepartPrevue: e.target.value })} />
                <Input label="Arrivée prévue" type="date" value={form.dateArriveePrevue} onChange={e => setForm({ ...form, dateArriveePrevue: e.target.value })} />
              </div>
            </div>
            <div style={{ padding: '1rem', border: '1px solid var(--slate-200)', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Détails</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <Input label="Poids total (kg)" type="number" value={form.poidsTotalKg} onChange={e => setForm({ ...form, poidsTotalKg: e.target.value })} />
                <Input label="Nb colis" type="number" value={form.nombreColis} onChange={e => setForm({ ...form, nombreColis: e.target.value })} />
              </div>
              <textarea className="form-input" placeholder="Notes..." style={{ minHeight: '60px', resize: 'vertical', width: '100%', marginTop: '0.5rem' }} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
            </div>
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
        <p style={{ fontSize: '0.9rem', color: 'var(--slate-700)', marginBottom: '1rem' }}>Êtes-vous sûr de vouloir supprimer cette expédition ?</p>
      </Modal>
    </div>
  );
}
