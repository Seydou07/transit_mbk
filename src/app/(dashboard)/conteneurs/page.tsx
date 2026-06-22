'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { FormSection } from '@/components/ui/FormSection';
import { Plus, Edit, Trash2, Search, Box, CheckCircle2, Package, Lock, Weight, Plane, Ship, Truck, MapPin, Calendar, User, FileText, X, Eye, Loader2, ArrowRight, Undo2, Send } from 'lucide-react';

interface Conteneur {
  id: number; numero: string; type: string; statut: string; transporteur?: string; nomNavire?: string;
  capaciteMaxCbm?: number; capaciteMaxKg?: number; clotureProfit?: number | null;
  dateDepart?: string; dateArriveeEstimee?: string; dateArriveeReelle?: string;
  paysDepart?: string; villeDepart?: string; paysDestination?: string; villeDestination?: string;
  expeditions?: Array<{
    id: number; expeditionId: number; cbmEmbarque?: number; poidsEmbarque?: number; colisEmbarques?: number;
    expedition?: { reference: string; client?: { nom: string }; coutExpedition?: number; argentRecu?: number }
  }>;
  depenses?: Array<{ id: number; titre?: string; type: string; montant: number; devise: string; date: string; fournisseur?: string }>;
}

const statusMeta: Record<string, { variant: 'success' | 'warning' | 'info' | 'default'; label: string }> = {
  EN_PREPARATION: { variant: 'default', label: 'En préparation' },
  CHARGE: { variant: 'info', label: 'Chargé' },
  EN_TRANSIT: { variant: 'warning', label: 'En transit' },
  ARRIVE: { variant: 'success', label: 'Arrivé' },
  DOUANE: { variant: 'warning', label: 'En douane' },
  FERME: { variant: 'default', label: 'Fermé' },
  VIDE: { variant: 'default', label: 'Vide' },
};

const typeMeta: Record<string, { label: string; icon: any; color: string }> = {
  DC20: { label: '20 pieds', icon: Box, color: '#0077B6' },
  DC40: { label: '40 pieds', icon: Box, color: '#10B981' },
  HC40: { label: '40 HQ', icon: Box, color: '#F59E0B' },
  AERIEN: { label: 'Aérien', icon: Plane, color: '#8B5CF6' },
  ROUTIER: { label: 'Routier', icon: Truck, color: '#EC4899' },
};

interface Expedition {
  id: number; reference: string; client?: { nom: string }; coutExpedition?: number; argentRecu?: number; devise?: string;
  marchandises?: Array<{
    id: number; description: string; quantite: number; unite?: string; cbm?: number; poidsTotalKg?: number; nombreColis?: number;
  }>;
}

interface ChargeItem {
  expeditionId: number; cbmEmbarque: string; poidsEmbarque: string; colisEmbarques: string; description: string;
}

export default function ConteneursPage() {
  const [items, setItems] = useState<Conteneur[]>([]);
  const [expeditions, setExpeditions] = useState<Expedition[]>([]);
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editItem, setEditItem] = useState<Conteneur | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [confirmArriveId, setConfirmArriveId] = useState<number | null>(null);
  const [confirmFermeId, setConfirmFermeId] = useState<number | null>(null);
  const [chargeContainerId, setChargeContainerId] = useState<number | null>(null);
  const [chargeItems, setChargeItems] = useState<ChargeItem[]>([]);
  const [chargeSearch, setChargeSearch] = useState('');
  const [chargeOpen, setChargeOpen] = useState(false);
  const [selectedContainer, setSelectedContainer] = useState<Conteneur | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [containerLoadedExpIds, setContainerLoadedExpIds] = useState<number[]>([]);
  const [departOpen, setDepartOpen] = useState(false);
  const [departContainerId, setDepartContainerId] = useState<number | null>(null);
  const [departForm, setDepartForm] = useState({ dateDepart: '', dateArriveeEstimee: '' });
  const [depenseOpen, setDepenseOpen] = useState(false);
  const [depenseLiee, setDepenseLiee] = useState(true);
  const [depenseForm, setDepenseForm] = useState({ titre: '', montant: '', devise: 'XAF', date: new Date().toISOString().slice(0, 10), fournisseur: '', description: '' });

  const formDefault = { numero: '', type: 'DC20', statut: 'EN_PREPARATION', transporteur: '', nomNavire: '', capaciteMaxCbm: '', capaciteMaxKg: '', paysDepart: '', villeDepart: '', paysDestination: '', villeDestination: '', dateDepart: '', dateArriveeEstimee: '' };
  const [form, setForm] = useState(formDefault);

  const load = () => { fetch('/api/conteneurs', { cache: 'no-store' }).then(r => r.ok && r.json()).then(d => { if (d) setItems(d); }).catch(() => {}); };
  const loadExps = () => { fetch('/api/expeditions', { cache: 'no-store' }).then(r => r.ok && r.json()).then(d => { if (d) setExpeditions(d); }).catch(() => {}); };
  useEffect(() => { load(); loadExps(); }, []);

  const resetForm = () => { setForm(formDefault); setEditItem(null); };
  const openCreate = () => { resetForm(); setIsOpen(true); };
  const openEdit = (c: Conteneur) => { 
    setForm({ 
      numero: c.numero, 
      type: c.type, 
      statut: c.statut, 
      transporteur: c.transporteur || '', 
      nomNavire: c.nomNavire || '', 
      capaciteMaxCbm: c.capaciteMaxCbm?.toString() || '', 
      capaciteMaxKg: c.capaciteMaxKg?.toString() || '', 
      paysDepart: c.paysDepart || '', 
      villeDepart: c.villeDepart || '', 
      paysDestination: c.paysDestination || '', 
      villeDestination: c.villeDestination || '', 
      dateDepart: c.dateDepart?.split('T')[0] || '', 
      dateArriveeEstimee: c.dateArriveeEstimee?.split('T')[0] || '' 
    }); 
    setEditItem(c); 
    setIsOpen(true); 
  };

  const openDetail = async (c: Conteneur) => {
    setLoadingDetail(true);
    try {
      const r = await fetch(`/api/conteneurs/${c.id}?include=expeditions,depenses`); 
      if (r.ok) setSelectedContainer(await r.json()); 
      else setSelectedContainer(c);
    } catch { setSelectedContainer(c); } finally { setLoadingDetail(false); }
    setDetailOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = editItem ? `/api/conteneurs/${editItem.id}` : '/api/conteneurs';
      const body = { 
        ...form, 
        capaciteMaxCbm: form.capaciteMaxCbm ? Number(form.capaciteMaxCbm) : null, 
        capaciteMaxKg: form.capaciteMaxKg ? Number(form.capaciteMaxKg) : null, 
        dateDepart: form.dateDepart ? new Date(form.dateDepart) : null, 
        dateArriveeEstimee: form.dateArriveeEstimee ? new Date(form.dateArriveeEstimee) : null 
      };
      const r = await fetch(url, { method: editItem ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (r.ok) { setIsOpen(false); resetForm(); load(); }
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { const r = await fetch(`/api/conteneurs/${deleteId}`, { method: 'DELETE' }); if (r.ok) { setDeleteId(null); load(); } } catch {}
  };

  const handleArrive = async () => {
    if (!confirmArriveId) return;
    try { const r = await fetch(`/api/conteneurs/${confirmArriveId}/arrive`, { method: 'POST' }); if (r.ok) { setConfirmArriveId(null); setDetailOpen(false); load(); } } catch {}
  };

  const openCharge = async (id: number) => {
    setChargeContainerId(id);
    setChargeSearch('');
    setChargeOpen(false);
    const updatedExps = await Promise.all(expeditions.map(async (exp) => {
      try {
        const r = await fetch(`/api/marchandises?expeditionId=${exp.id}`, { cache: 'no-store' });
        if (r.ok) {
          const marchandises = await r.json();
          return { ...exp, marchandises };
        }
        return exp;
      } catch {
        return exp;
      }
    }));
    setExpeditions(updatedExps);
    setChargeItems([]);
    try {
      const containerResp = await fetch(`/api/conteneurs/${id}?include=expeditions`, { cache: 'no-store' });
      if (containerResp.ok) {
        const containerData = await containerResp.json();
        setContainerLoadedExpIds(containerData.expeditions?.map((ec: any) => ec.expeditionId) || []);
      }
    } catch {}
  };

  const selectExpedition = (expId: number) => {
    if (chargeItems.some(i => i.expeditionId === expId)) { setChargeOpen(false); setChargeSearch(''); return; }
    const exp = expeditions.find(e => e.id === expId);
    if (!exp) return;
    const totalCbm = exp.marchandises ? exp.marchandises.reduce((sum, m) => sum + (Number(m.cbm) || 0), 0) : 0;
    const totalKg = exp.marchandises ? exp.marchandises.reduce((sum, m) => sum + (Number(m.poidsTotalKg) || 0), 0) : 0;
    const totalColis = exp.marchandises ? exp.marchandises.reduce((sum, m) => sum + (Number(m.nombreColis) || 0), 0) : 0;
    setChargeItems([...chargeItems, {
      expeditionId: expId,
      cbmEmbarque: totalCbm.toString(),
      poidsEmbarque: totalKg.toString(),
      colisEmbarques: totalColis.toString(),
      description: ''
    }]);
    setChargeOpen(false);
    setChargeSearch('');
  };
  const removeChargeRow = (i: number) => setChargeItems(chargeItems.filter((_, idx) => idx !== i));

  const handleCharge = async () => {
    setSaving(true);
    try {
      for (const item of chargeItems) {
        await fetch(`/api/conteneurs/${chargeContainerId}/charger`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            expeditionId: item.expeditionId,
            cbmEmbarque: item.cbmEmbarque ? Number(item.cbmEmbarque) : null, 
            poidsEmbarque: item.poidsEmbarque ? Number(item.poidsEmbarque) : null, 
            colisEmbarques: item.colisEmbarques ? Number(item.colisEmbarques) : null 
          })
        });
      }
      setChargeContainerId(null); 
      load();
    } finally { setSaving(false); }
  };

  const handleFerme = async () => {
    if (!confirmFermeId) return;
    try { const r = await fetch(`/api/conteneurs/${confirmFermeId}/fermer`, { method: 'POST' }); if (r.ok) { setConfirmFermeId(null); setDetailOpen(false); load(); } } catch {}
  };

  const handleDepart = async () => {
    if (departContainerId && departForm.dateArriveeEstimee) {
      try {
        await fetch(`/api/conteneurs/${departContainerId}/depart`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dateDepart: departForm.dateDepart || new Date().toISOString(), dateArriveeEstimee: departForm.dateArriveeEstimee })
        });
        setDepartOpen(false);
        setDetailOpen(false);
        load();
      } catch {}
    }
  };
  const handleDecharger = async (id: number) => {
    try { const r = await fetch(`/api/conteneurs/${id}/decharger`, { method: 'POST' }); if (r.ok) { setDetailOpen(false); load(); } } catch {}
  };
  const handleAnnulerChargement = async (id: number) => {
    try { const r = await fetch(`/api/conteneurs/${id}/annuler-chargement`, { method: 'POST' }); if (r.ok) { setDetailOpen(false); load(); } } catch {}
  };
  const handleAnnulerDepart = async (id: number) => {
    try { const r = await fetch(`/api/conteneurs/${id}/annuler-depart`, { method: 'POST' }); if (r.ok) { setDetailOpen(false); load(); } } catch {}
  };
  const handleAnnulerArrivee = async (id: number) => {
    try { const r = await fetch(`/api/conteneurs/${id}/annuler-arrivee`, { method: 'POST' }); if (r.ok) { setDetailOpen(false); load(); } } catch {}
  };
  const handleDouane = async (id: number) => {
    try { const r = await fetch(`/api/conteneurs/${id}/douane`, { method: 'POST' }); if (r.ok) { setDetailOpen(false); load(); } } catch {}
  };
  const handleRouvrir = async (id: number) => {
    try { const r = await fetch(`/api/conteneurs/${id}/rouvrir`, { method: 'POST' }); if (r.ok) { setDetailOpen(false); load(); } } catch {}
  };
  const resetDepenseForm = () => { setDepenseForm({ titre: '', montant: '', devise: 'XAF', date: new Date().toISOString().slice(0, 10), fournisseur: '', description: '' }); setDepenseLiee(true); };
  const handleAddDepense = async () => {
    if (!selectedContainer || !depenseForm.montant) return;
    try {
      await fetch('/api/depenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conteneurId: depenseLiee ? selectedContainer.id : null,
          titre: depenseForm.titre,
          montant: Number(depenseForm.montant),
          devise: depenseForm.devise,
          date: depenseForm.date,
          fournisseur: depenseForm.fournisseur || undefined,
          description: depenseForm.description || undefined,
          type: 'DIVERSE',
          liaison: depenseLiee ? 'CONTENEUR' : 'GENERAL',
        })
      });
      setDepenseOpen(false);
      resetDepenseForm();
      const resp = await fetch(`/api/conteneurs/${selectedContainer.id}?include=expeditions,depenses`, { cache: 'no-store' });
      if (resp.ok) setSelectedContainer(await resp.json());
    } catch {}
  };
  const handleDeleteDepense = async (depenseId: number) => {
    if (!selectedContainer) return;
    try {
      await fetch(`/api/depenses/${depenseId}`, { method: 'DELETE' });
      const resp = await fetch(`/api/conteneurs/${selectedContainer.id}?include=expeditions,depenses`, { cache: 'no-store' });
      if (resp.ok) setSelectedContainer(await resp.json());
    } catch {}
  };
  const handleRetirerExpedition = async (conteneurId: number, expeditionId: number) => {
    try {
      const r = await fetch(`/api/conteneurs/${conteneurId}/retirer-expedition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expeditionId })
      });
      if (r.ok) {
        const resp = await fetch(`/api/conteneurs/${conteneurId}?include=expeditions,depenses`, { cache: 'no-store' });
        if (resp.ok) {
          const data = await resp.json();
          setSelectedContainer(data);
        }
      }
    } catch {}
  };

  const getTotalUsedCbm = () => {
    if (!selectedContainer?.expeditions) return 0;
    return selectedContainer.expeditions.reduce((sum: number, exp: any) => sum + Number(exp.cbmEmbarque || 0), 0);
  };
  const getTotalUsedKg = () => {
    if (!selectedContainer?.expeditions) return 0;
    return selectedContainer.expeditions.reduce((sum: number, exp: any) => sum + Number(exp.poidsEmbarque || 0), 0);
  };
  const getTotalDepenses = () => {
    if (!selectedContainer?.depenses) return 0;
    return selectedContainer.depenses.reduce((sum: number, dep: any) => sum + (Number(dep.montant) || 0), 0);
  };
  const getTotalCout = () => {
    if (!selectedContainer?.expeditions) return 0;
    return selectedContainer.expeditions.reduce((sum: number, exp: any) => sum + (Number(exp.expedition?.coutExpedition) || 0), 0);
  };
  const getTotalRecu = () => {
    if (!selectedContainer?.expeditions) return 0;
    return selectedContainer.expeditions.reduce((sum: number, exp: any) => sum + (Number(exp.expedition?.argentRecu) || 0), 0);
  };
  const getResteAPercevoir = () => {
    const cout = getTotalCout();
    const recu = getTotalRecu();
    return Math.max(0, cout - recu);
  };
  const getProfit = () => {
    const cout = getTotalCout();
    const depenses = getTotalDepenses();
    return cout - depenses;
  };

  const filtered = items.filter(c => !search || c.numero.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Conteneurs</h1>
          <p className="page-subtitle" style={{ marginTop: '0.25rem' }}>{items.length} conteneurs</p>
        </div>
        <Button onClick={openCreate}><Plus size={18} /> Nouveau conteneur</Button>
      </div>

      {/* Table */}
      <div className="table-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '1rem', borderBottom: '1px solid var(--slate-100)' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} color="var(--slate-400)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input className="form-input" placeholder="Rechercher par numéro..." autoComplete="off" style={{ paddingLeft: '2.75rem' }} value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <table className="table">
          <thead><tr><th>Numéro</th><th>Type</th><th>Statut</th><th>Trajet</th><th>Date départ</th><th>Capacité</th><th style={{ width: 140 }}>Actions</th></tr></thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--slate-400)' }}>Aucun conteneur trouvé</td></tr>
            ) : filtered.map(c => {
              const st = statusMeta[c.statut] || { variant: 'default' as const, label: c.statut };
              const type = typeMeta[c.type] || { label: c.type, icon: Box, color: '#64748B' };
              const canCharge = c.statut === 'EN_PREPARATION';
              const canFerme = c.statut === 'ARRIVE' || c.statut === 'DOUANE';
              const canArrive = c.statut === 'EN_TRANSIT' || c.statut === 'CHARGE';
              const TypeIcon = type.icon;
              
              return (
                <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => openDetail(c)}>
                  <td style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="icon-box" style={{ width: 40, height: 40, backgroundColor: 'var(--slate-100)', borderRadius: '12px' }}>
                      <TypeIcon size={18} color={type.color} />
                    </div>
                    {c.numero}
                  </td>
                  <td><Badge variant="info">{type.label}</Badge></td>
                  <td><Badge variant={st.variant}>{st.label}</Badge></td>
                  <td style={{ fontSize: '0.9rem', color: 'var(--slate-700)' }}>
                    {c.paysDepart || '-'} → {c.paysDestination || '-'}
                  </td>
                  <td style={{ fontSize: '0.9rem', color: 'var(--slate-700)' }}>
                    {c.dateDepart ? new Date(c.dateDepart).toLocaleDateString('fr-FR') : '-'}
                  </td>
                  <td style={{ fontSize: '0.9rem', color: 'var(--slate-700)' }}>
                    {c.capaciteMaxCbm ? `${c.capaciteMaxCbm} CBM` : '-'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                      <button className="btn btn-ghost btn-icon" onClick={(e) => { e.stopPropagation(); openEdit(c); }} title="Modifier">
                        <Edit size={16} />
                      </button>
                      {canCharge && (
                        <button className="btn btn-ghost btn-icon" onClick={(e) => { e.stopPropagation(); openCharge(c.id); }} title="Charger">
                          <Package size={16} />
                        </button>
                      )}
                      {canArrive && (
                        <button className="btn btn-ghost btn-icon" onClick={(e) => { e.stopPropagation(); setConfirmArriveId(c.id); }} title="Marquer arrivé">
                          <CheckCircle2 size={16} />
                        </button>
                      )}
                      {canFerme && (
                        <button className="btn btn-ghost btn-icon" onClick={(e) => { e.stopPropagation(); setConfirmFermeId(c.id); }} title="Clôturer">
                          <Lock size={16} />
                        </button>
                      )}
                      <button className="btn btn-ghost btn-icon" style={{ color: 'var(--danger)' }} onClick={(e) => { e.stopPropagation(); setDeleteId(c.id); }} title="Supprimer">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      <Modal open={detailOpen} onClose={() => setDetailOpen(false)} title={selectedContainer?.numero || 'Conteneur'} size="lg">
        {loadingDetail ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem' }}>
            <Loader2 size={32} style={{ color: 'var(--slate-400)', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : selectedContainer && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ padding: '1rem 1.25rem', border: '1px solid var(--slate-200)', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Informations générales</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.88rem' }}>
                  <div><span style={{ color: 'var(--slate-500)' }}>Type :</span> {(typeMeta[selectedContainer.type]?.label || selectedContainer.type)}</div>
                  <div><span style={{ color: 'var(--slate-500)' }}>Statut :</span> <Badge variant={(statusMeta[selectedContainer.statut]?.variant || 'default') as any}>{statusMeta[selectedContainer.statut]?.label || selectedContainer.statut}</Badge></div>
                  <div><span style={{ color: 'var(--slate-500)' }}>Transporteur :</span> {selectedContainer.transporteur || '-'}</div>
                  <div><span style={{ color: 'var(--slate-500)' }}>Navire :</span> {selectedContainer.nomNavire || '-'}</div>
                </div>
              </div>
              <div style={{ padding: '1rem 1.25rem', border: '1px solid var(--slate-200)', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Itinéraire</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.88rem' }}>
                  <div><span style={{ color: 'var(--slate-500)' }}>Origine :</span> {selectedContainer.villeDepart ? `${selectedContainer.villeDepart}, ` : ''}{selectedContainer.paysDepart || '-'}</div>
                  <div><span style={{ color: 'var(--slate-500)' }}>Destination :</span> {selectedContainer.villeDestination ? `${selectedContainer.villeDestination}, ` : ''}{selectedContainer.paysDestination || '-'}</div>
                  <div><span style={{ color: 'var(--slate-500)' }}>Départ :</span> {selectedContainer.dateDepart ? new Date(selectedContainer.dateDepart).toLocaleDateString('fr-FR') : '-'}</div>
                  <div><span style={{ color: 'var(--slate-500)' }}>Arrivée :</span> {selectedContainer.dateArriveeEstimee ? new Date(selectedContainer.dateArriveeEstimee).toLocaleDateString('fr-FR') : '-'}</div>
                </div>
              </div>
            </div>

            <div style={{ padding: '1rem 1.25rem', border: '1px solid var(--slate-200)', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Capacité & utilisation</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[
                  { label: 'CBM', max: selectedContainer.capaciteMaxCbm || 0, used: getTotalUsedCbm(), color: 'var(--fleet-blue)' },
                  { label: 'Kg', max: selectedContainer.capaciteMaxKg || 0, used: getTotalUsedKg(), color: 'var(--success)' }
                ].map(cap => {
                  const pct = cap.max > 0 ? Math.min(100, (cap.used / cap.max) * 100) : 0;
                  return (
                    <div key={cap.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)' }}>Capacité {cap.label}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--slate-400)' }}>{cap.used.toFixed(1)} / {cap.max} {cap.label}</span>
                      </div>
                      <div style={{ height: 8, backgroundColor: 'var(--slate-200)', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, backgroundColor: cap.color, borderRadius: '9999px', transition: 'width 0.3s' }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>
                        <span>Utilisé: {cap.used.toFixed(1)} {cap.label}</span>
                        <span>Restant: {Math.max(0, cap.max - cap.used).toFixed(1)} {cap.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {selectedContainer.expeditions && selectedContainer.expeditions.length > 0 && (
              <div style={{ padding: '1rem 1.25rem', border: '1px solid var(--slate-200)', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Marchandises ({selectedContainer.expeditions.length})</div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--slate-200)' }}>
                      <th style={{ textAlign: 'left', padding: '0.5rem 0', fontWeight: 600, color: 'var(--slate-500)' }}>Client</th>
                      <th style={{ textAlign: 'left', padding: '0.5rem 0', fontWeight: 600, color: 'var(--slate-500)' }}>Réf.</th>
                      <th style={{ textAlign: 'center', padding: '0.5rem 0', fontWeight: 600, color: 'var(--slate-500)' }}>CBM</th>
                      <th style={{ textAlign: 'center', padding: '0.5rem 0', fontWeight: 600, color: 'var(--slate-500)' }}>Poids</th>
                      <th style={{ textAlign: 'center', padding: '0.5rem 0', fontWeight: 600, color: 'var(--slate-500)' }}>Colis</th>
                      <th style={{ textAlign: 'right', padding: '0.5rem 0', fontWeight: 600, color: 'var(--slate-500)' }}>Coût</th>
                      <th style={{ textAlign: 'right', padding: '0.5rem 0', fontWeight: 600, color: 'var(--slate-500)' }}>Reçu</th>
                      <th style={{ textAlign: 'right', padding: '0.5rem 0', fontWeight: 600, color: 'var(--slate-500)' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedContainer.expeditions.map((exp, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                        <td style={{ padding: '0.5rem 0', fontWeight: 500 }}>{exp.expedition?.client?.nom || '-'}</td>
                        <td style={{ padding: '0.5rem 0', color: 'var(--fleet-blue)', fontWeight: 600 }}>{exp.expedition?.reference || '-'}</td>
                        <td style={{ textAlign: 'center', padding: '0.5rem 0' }}>{exp.cbmEmbarque || 0}</td>
                        <td style={{ textAlign: 'center', padding: '0.5rem 0' }}>{exp.poidsEmbarque || 0} kg</td>
                        <td style={{ textAlign: 'center', padding: '0.5rem 0' }}>{exp.colisEmbarques || 0}</td>
                        <td style={{ textAlign: 'right', padding: '0.5rem 0', color: 'var(--danger)', fontWeight: 600 }}>
                          {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(exp.expedition?.coutExpedition || 0)}
                        </td>
                        <td style={{ textAlign: 'right', padding: '0.5rem 0', color: 'var(--success)', fontWeight: 600 }}>
                          {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(exp.expedition?.argentRecu || 0)}
                        </td>
                        <td style={{ textAlign: 'right', padding: '0.5rem 0' }}>
                          {(selectedContainer.statut === 'EN_PREPARATION' || selectedContainer.statut === 'CHARGE') && (
                            <button className="btn btn-ghost btn-icon" style={{ color: 'var(--danger)' }}
                              onClick={() => handleRetirerExpedition(selectedContainer.id, exp.expeditionId)}
                              title="Retirer du conteneur">
                              <X size={14} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div style={{ padding: '1rem 1.25rem', border: '1px solid var(--slate-200)', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Résumé financier</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ padding: '1rem', backgroundColor: 'var(--fleet-light)', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginBottom: '0.25rem' }}>Total facturé</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--danger)' }}>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(getTotalCout())}</div>
                </div>
                <div style={{ padding: '1rem', backgroundColor: 'rgba(16,185,129,0.1)', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginBottom: '0.25rem' }}>Total reçu</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--success)' }}>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(getTotalRecu())}</div>
                </div>
                <div style={{ padding: '1rem', backgroundColor: 'rgba(245,158,11,0.1)', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginBottom: '0.25rem' }}>Reste à percevoir</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#D97706' }}>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(getResteAPercevoir())}</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', backgroundColor: getProfit() >= 0 ? 'rgba(16,185,129,0.08)' : 'rgba(220,38,38,0.08)', borderRadius: '8px', border: `1px solid ${getProfit() >= 0 ? 'var(--success)' : 'var(--danger)'}` }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Profit estimé</span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Coût − Dépenses</div>
                </div>
                <span style={{ fontWeight: 800, fontSize: '1.25rem', color: getProfit() >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(getProfit())}
                </span>
              </div>
            </div>

            <div style={{ padding: '1rem 1.25rem', border: '1px solid var(--slate-200)', borderRadius: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dépenses ({selectedContainer.depenses?.length || 0})</div>
                <button className="btn btn-ghost btn-sm" onClick={() => setDepenseOpen(true)} style={{ fontSize: '0.8rem', color: 'var(--fleet-blue)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  + Ajouter
                </button>
              </div>
              {selectedContainer.depenses && selectedContainer.depenses.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {selectedContainer.depenses.map((dep, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.85rem', backgroundColor: 'var(--slate-50)', borderRadius: '8px', border: '1px solid var(--slate-100)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0, flex: 1 }}>
                        <div style={{ width: '2px', height: '2rem', borderRadius: '2px', backgroundColor: 'var(--danger)', opacity: 0.4, flexShrink: 0 }} />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.88rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{dep.titre || dep.type}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <span>{new Date(dep.date).toLocaleDateString('fr-FR')}</span>
                            {dep.fournisseur && <><span style={{ color: 'var(--slate-300)' }}>|</span><span>{dep.fournisseur}</span></>}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--danger)' }}>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: dep.devise || 'XAF' }).format(dep.montant)}</span>
                        <button className="btn btn-ghost btn-icon" style={{ color: 'var(--danger)', opacity: 0.5 }} onClick={() => handleDeleteDepense(dep.id)} title="Supprimer">
                          <X size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div style={{ marginTop: '0.25rem', paddingTop: '0.65rem', borderTop: '1px solid var(--slate-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--slate-600)' }}>Total dépenses</span>
                    <span style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--danger)' }}>
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(getTotalDepenses())}
                    </span>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--slate-400)', fontSize: '0.85rem' }}>Aucune dépense pour ce conteneur</div>
              )}
            </div>

            {/* Actions footer */}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem', borderTop: '1px solid var(--slate-100)' }}>
              <Button variant="ghost" onClick={() => setDetailOpen(false)}>Fermer</Button>
              {selectedContainer.statut === 'EN_PREPARATION' && (
                <Button onClick={() => { setDetailOpen(false); openCharge(selectedContainer.id); }}>
                  <Package size={16} /> Charger
                </Button>
              )}
              {selectedContainer.statut === 'CHARGE' && (
                <>
                  <Button variant="ghost" style={{ color: 'var(--warning)' }} onClick={() => handleAnnulerChargement(selectedContainer.id)}>
                    <Undo2 size={16} /> Annuler chargement
                  </Button>
                  <Button onClick={() => { setDepartContainerId(selectedContainer.id); setDepartForm({ ...departForm, dateDepart: new Date().toISOString().slice(0, 10) }); setDepartOpen(true); }}>
                    <Send size={16} /> Démarrer le transit
                  </Button>
                </>
              )}
              {selectedContainer.statut === 'EN_TRANSIT' && (
                <>
                  <Button variant="ghost" style={{ color: 'var(--warning)' }} onClick={() => handleAnnulerDepart(selectedContainer.id)}>
                    <Undo2 size={16} /> Annuler départ
                  </Button>
                  <Button onClick={() => setConfirmArriveId(selectedContainer.id)}>
                    <CheckCircle2 size={16} /> Marquer arrivé
                  </Button>
                </>
              )}
              {selectedContainer.statut === 'ARRIVE' && (
                <>
                  <Button variant="ghost" style={{ color: 'var(--warning)' }} onClick={() => handleAnnulerArrivee(selectedContainer.id)}>
                    <Undo2 size={16} /> Annuler arrivée
                  </Button>
                  <Button variant="ghost" onClick={() => handleDouane(selectedContainer.id)}>
                    <Lock size={16} /> Douane
                  </Button>
                  <Button onClick={() => handleDecharger(selectedContainer.id)}>
                    <Package size={16} /> Décharger
                  </Button>
                </>
              )}
              {selectedContainer.statut === 'DOUANE' && (
                <>
                  <Button variant="ghost" style={{ color: 'var(--warning)' }} onClick={() => handleAnnulerArrivee(selectedContainer.id)}>
                    <Undo2 size={16} /> Annuler douane
                  </Button>
                  <Button onClick={() => setConfirmFermeId(selectedContainer.id)}>
                    <CheckCircle2 size={16} /> Valider douane
                  </Button>
                </>
              )}
              {(selectedContainer.statut === 'FERME' || selectedContainer.statut === 'VIDE') && (
                <Button onClick={() => handleRouvrir(selectedContainer.id)}>
                  <Undo2 size={16} /> Rouvrir
                </Button>
              )}
              <Button onClick={() => { setDetailOpen(false); openEdit(selectedContainer); }}>
                <Edit size={16} /> Modifier
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create/Edit Modal */}
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title={editItem ? 'Modifier le conteneur' : 'Nouveau conteneur'}
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
            <FormSection title="Identité" pastilleColor="#0077B6" textColor="#0077B6" icon={<Box size={16} color="#0077B6" />} iconBg="rgba(0,119,182,0.1)">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <Input label="Numéro du conteneur" value={form.numero} onChange={e => setForm({ ...form, numero: e.target.value })} placeholder="Ex: MSCU1234567" />
                </div>
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select className="form-select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                    <option value="DC20">20 pieds</option>
                    <option value="DC40">40 pieds</option>
                    <option value="HC40">40 HQ</option>
                    <option value="AERIEN">Aérien</option>
                    <option value="ROUTIER">Routier</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Statut</label>
                  <select className="form-select" value={form.statut} onChange={e => setForm({ ...form, statut: e.target.value })}>
                    <option value="EN_PREPARATION">En préparation</option>
                    <option value="CHARGE">Chargé</option>
                    <option value="EN_TRANSIT">En transit</option>
                    <option value="ARRIVE">Arrivé</option>
                    <option value="DOUANE">En douane</option>
                    <option value="FERME">Fermé</option>
                    <option value="VIDE">Vide</option>
                  </select>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <Input label="Transporteur" value={form.transporteur} onChange={e => setForm({ ...form, transporteur: e.target.value })} placeholder="Nom du transporteur" />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <Input label="Nom du navire" value={form.nomNavire} onChange={e => setForm({ ...form, nomNavire: e.target.value })} placeholder="Ex: MSC ALICANTE" />
                </div>
              </div>
            </FormSection>

            <FormSection title="Capacité" pastilleColor="#10B981" textColor="#10B981" icon={<Weight size={16} color="#10B981" />} iconBg="rgba(16,185,129,0.1)">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Input label="Capacité CBM" type="number" value={form.capaciteMaxCbm} onChange={e => setForm({ ...form, capaciteMaxCbm: e.target.value })} />
                <Input label="Capacité kg" type="number" value={form.capaciteMaxKg} onChange={e => setForm({ ...form, capaciteMaxKg: e.target.value })} />
              </div>
            </FormSection>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <FormSection title="Itinéraire" pastilleColor="#F59E0B" textColor="#D97706" icon={<MapPin size={16} color="#D97706" />} iconBg="rgba(245,158,11,0.1)">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Input label="Pays de départ" value={form.paysDepart} onChange={e => setForm({ ...form, paysDepart: e.target.value })} placeholder="Chine" />
                <Input label="Ville de départ" value={form.villeDepart} onChange={e => setForm({ ...form, villeDepart: e.target.value })} placeholder="Shanghai" />
                <Input label="Pays de destination" value={form.paysDestination} onChange={e => setForm({ ...form, paysDestination: e.target.value })} placeholder="Côte d'Ivoire" />
                <Input label="Ville de destination" value={form.villeDestination} onChange={e => setForm({ ...form, villeDestination: e.target.value })} placeholder="Abidjan" />
                <Input label="Date de départ" type="date" value={form.dateDepart} onChange={e => setForm({ ...form, dateDepart: e.target.value })} />
                <Input label="Arrivée estimée" type="date" value={form.dateArriveeEstimee} onChange={e => setForm({ ...form, dateArriveeEstimee: e.target.value })} />
              </div>
            </FormSection>
          </div>
        </div>
      </Modal>

      {/* Charge Modal */}
      <Modal
        open={chargeContainerId !== null}
        onClose={() => setChargeContainerId(null)}
        title="Charger le conteneur"
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setChargeContainerId(null)}>Annuler</Button>
            <Button onClick={handleCharge} disabled={saving || chargeItems.length === 0}>
              {saving ? 'Chargement...' : 'Valider le chargement'}
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minHeight: '340px' }}>
          <div style={{ position: 'relative' }}>
            <div
              style={{ width: '100%', padding: '0.65rem 1rem', border: '1px solid var(--slate-300)', borderRadius: '10px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff' }}
              onClick={() => setChargeOpen(!chargeOpen)}
            >
              <span style={{ color: chargeSearch ? 'var(--slate-900)' : 'var(--slate-400)', fontSize: '0.9rem' }}>
                {chargeSearch || 'Sélectionner une expédition'}
              </span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: chargeOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: 'var(--slate-400)' }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
            {chargeOpen && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50, marginTop: '4px', border: '1px solid var(--slate-200)', borderRadius: '10px', backgroundColor: '#fff', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', overflow: 'hidden' }}>
                <div style={{ position: 'relative', borderBottom: '1px solid var(--slate-200)' }}>
                  <Search size={15} color="var(--slate-400)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    className="form-input"
                    placeholder="Rechercher..."
                    autoComplete="off"
                    autoFocus
                    style={{ border: 'none', borderRadius: 0, paddingLeft: '2.25rem' }}
                    value={chargeSearch}
                    onChange={e => setChargeSearch(e.target.value)}
                  />
                </div>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {expeditions.filter(e => !chargeItems.some(ci => ci.expeditionId === e.id) && !containerLoadedExpIds.includes(e.id) && (!chargeSearch || e.reference.toLowerCase().includes(chargeSearch.toLowerCase()) || (e.client?.nom || '').toLowerCase().includes(chargeSearch.toLowerCase()))).length === 0 ? (
                    <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--slate-400)', fontSize: '0.85rem' }}>Aucun résultat</div>
                  ) : expeditions.filter(e => !chargeItems.some(ci => ci.expeditionId === e.id) && !containerLoadedExpIds.includes(e.id) && (!chargeSearch || e.reference.toLowerCase().includes(chargeSearch.toLowerCase()) || (e.client?.nom || '').toLowerCase().includes(chargeSearch.toLowerCase()))).map(exp => (
                    <div key={exp.id} style={{ padding: '0.65rem 1rem', cursor: 'pointer', borderBottom: '1px solid var(--slate-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                      onClick={() => selectExpedition(exp.id)}
                      onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--slate-50)'}
                      onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{exp.reference}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>{exp.client?.nom || '-'}</div>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>Coût: {exp.coutExpedition || 0}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Expéditions chargées</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--slate-200)' }}>
                <th style={{ textAlign: 'left', padding: '0.5rem 0', fontWeight: 600, color: 'var(--slate-500)' }}>Réf.</th>
                <th style={{ textAlign: 'left', padding: '0.5rem 0', fontWeight: 600, color: 'var(--slate-500)' }}>Client</th>
                <th style={{ textAlign: 'center', padding: '0.5rem 0', fontWeight: 600, color: 'var(--slate-500)' }}>Coût</th>
                <th style={{ textAlign: 'center', padding: '0.5rem 0', fontWeight: 600, color: 'var(--slate-500)' }}>Poids</th>
                <th style={{ textAlign: 'center', padding: '0.5rem 0', fontWeight: 600, color: 'var(--slate-500)' }}>CBM</th>
                <th style={{ textAlign: 'center', padding: '0.5rem 0', fontWeight: 600, color: 'var(--slate-500)' }}>Colis</th>
                <th style={{ textAlign: 'right', padding: '0.5rem 0', fontWeight: 600, color: 'var(--slate-500)' }}></th>
              </tr>
            </thead>
            <tbody>
              {chargeItems.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--slate-400)', fontSize: '0.85rem' }}>Aucune expédition chargée</td></tr>
              ) : chargeItems.map((item, i) => {
                const exp = expeditions.find(e => e.id === item.expeditionId);
                if (!exp) return null;
                return (
                  <tr key={i} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                    <td style={{ padding: '0.5rem 0', fontWeight: 600 }}>{exp.reference}</td>
                    <td style={{ padding: '0.5rem 0' }}>{exp.client?.nom || '-'}</td>
                    <td style={{ textAlign: 'center', padding: '0.5rem 0' }}>{exp.coutExpedition || 0}</td>
                    <td style={{ textAlign: 'center', padding: '0.5rem 0' }}>{item.poidsEmbarque || 0} kg</td>
                    <td style={{ textAlign: 'center', padding: '0.5rem 0' }}>{item.cbmEmbarque || 0}</td>
                    <td style={{ textAlign: 'center', padding: '0.5rem 0' }}>{item.colisEmbarques || 0}</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem 0' }}>
                      <button className="btn btn-ghost btn-icon" style={{ color: 'var(--danger)' }} onClick={() => removeChargeRow(i)}>
                        <X size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Modal>

      {/* Depense Modal */}
      <Modal open={depenseOpen} onClose={() => { setDepenseOpen(false); resetDepenseForm(); }} title="Nouvelle dépense" size="sm" footer={
        <>
          <Button variant="ghost" onClick={() => { setDepenseOpen(false); resetDepenseForm(); }}>Annuler</Button>
          <Button onClick={handleAddDepense} disabled={!depenseForm.montant}>Ajouter</Button>
        </>
      }>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', backgroundColor: 'var(--slate-50)', borderRadius: '8px', border: '1px solid var(--slate-200)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--slate-600)', fontWeight: 500 }}>Liée au conteneur</span>
            <button onClick={() => setDepenseLiee(!depenseLiee)}
              style={{ width: '2.5rem', height: '1.25rem', borderRadius: '9999px', border: 'none', padding: 0, cursor: 'pointer', backgroundColor: depenseLiee ? 'var(--fleet-blue)' : 'var(--slate-300)', transition: 'background 0.2s', position: 'relative', flexShrink: 0 }}>
              <span style={{ display: 'block', width: '1rem', height: '1rem', borderRadius: '50%', backgroundColor: '#fff', position: 'absolute', top: '0.125rem', left: depenseLiee ? '1.375rem' : '0.125rem', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
            </button>
            <span style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>{depenseLiee ? `Concerne ${selectedContainer?.numero || ''}` : 'Dépense générale'}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <Input label="Titre" value={depenseForm.titre} onChange={e => setDepenseForm({ ...depenseForm, titre: e.target.value })} placeholder="Ex: Fret maritime" />
            <Input label="Fournisseur" value={depenseForm.fournisseur} onChange={e => setDepenseForm({ ...depenseForm, fournisseur: e.target.value })} placeholder="Ex: CMA-CGM" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <Input label="Montant *" type="number" value={depenseForm.montant} onChange={e => setDepenseForm({ ...depenseForm, montant: e.target.value })} placeholder="Ex: 150000" />
            <Input label="Devise" value={depenseForm.devise} onChange={e => setDepenseForm({ ...depenseForm, devise: e.target.value })} placeholder="XAF" />
          </div>
          <Input label="Date" type="date" value={depenseForm.date} onChange={e => setDepenseForm({ ...depenseForm, date: e.target.value })} />
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" rows={3} value={depenseForm.description} onChange={e => setDepenseForm({ ...depenseForm, description: e.target.value })} placeholder="Description libre..." style={{ width: '100%' }} />
          </div>
        </div>
      </Modal>

      {/* Depart Modal */}
      <Modal open={departOpen} onClose={() => setDepartOpen(false)} title="Démarrer le transit" size="sm" footer={
        <>
          <Button variant="ghost" onClick={() => setDepartOpen(false)}>Annuler</Button>
          <Button onClick={handleDepart} disabled={!departForm.dateArriveeEstimee}>Confirmer le départ</Button>
        </>
      }>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input label="Date de départ" type="date" value={departForm.dateDepart} onChange={e => setDepartForm({ ...departForm, dateDepart: e.target.value })} />
          <Input label="Date d'arrivée estimée *" type="date" value={departForm.dateArriveeEstimee} onChange={e => setDepartForm({ ...departForm, dateArriveeEstimee: e.target.value })} />
        </div>
      </Modal>

      {/* Arrive Modal */}
      <Modal open={confirmArriveId !== null} onClose={() => setConfirmArriveId(null)} title="Confirmer l'arrivée" size="sm" footer={
        <>
          <Button variant="ghost" onClick={() => setConfirmArriveId(null)}>Annuler</Button>
          <Button onClick={handleArrive}>Confirmer</Button>
        </>
      }>
        <p style={{ fontSize: '0.95rem', color: 'var(--slate-700)' }}>Confirmer l'arrivée du conteneur ? Le stock sera créé automatiquement.</p>
      </Modal>

      {/* Ferme Modal */}
      <Modal open={confirmFermeId !== null} onClose={() => setConfirmFermeId(null)} title="Clôturer le conteneur" size="sm" footer={
        <>
          <Button variant="ghost" onClick={() => setConfirmFermeId(null)}>Annuler</Button>
          <Button onClick={handleFerme}>Clôturer</Button>
        </>
      }>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '0.95rem', color: 'var(--slate-700)' }}>Clôturer ce conteneur ? Le profit final sera calculé.</p>
          {selectedContainer?.expeditions && selectedContainer.expeditions.filter(e => e.expedition && Number(e.expedition.coutExpedition || 0) > Number(e.expedition.argentRecu || 0)).length > 0 && (
            <div style={{ padding: '0.75rem', backgroundColor: 'rgba(245,158,11,0.1)', borderRadius: '8px', border: '1px solid #F59E0B' }}>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#D97706', marginBottom: '0.5rem' }}>Clients avec solde restant</div>
              {selectedContainer.expeditions.filter(e => e.expedition && Number(e.expedition.coutExpedition || 0) > Number(e.expedition.argentRecu || 0)).map((exp, idx) => {
                const reste = Number(exp.expedition?.coutExpedition || 0) - Number(exp.expedition?.argentRecu || 0);
                return (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '0.25rem 0' }}>
                    <span>{exp.expedition?.client?.nom || exp.expedition?.reference}</span>
                    <span style={{ fontWeight: 600, color: 'var(--danger)' }}>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(reste)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal open={deleteId !== null} onClose={() => setDeleteId(null)} title="Confirmer la suppression" size="sm" footer={
        <>
          <Button variant="ghost" onClick={() => setDeleteId(null)}>Annuler</Button>
          <Button variant="danger" onClick={handleDelete}>Supprimer</Button>
        </>
      }>
        <p style={{ fontSize: '0.95rem', color: 'var(--slate-700)' }}>Supprimer ce conteneur ? Cette action est irréversible.</p>
      </Modal>
    </div>
  );
}
