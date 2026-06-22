'use client';

import { useState, useEffect, use } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { ArrowLeft, Package, Ship, Plane, Truck, FileText, DollarSign, Weight, Calendar, Plus, Edit, Trash2 } from 'lucide-react';

const statusMeta = {
  EN_ATTENTE: { variant: 'default' as const, label: 'En Attente' },
  EN_PREPARATION: { variant: 'info' as const, label: 'En Préparation' },
  EN_TRANSIT: { variant: 'warning' as const, label: 'En Transit' },
  ARRIVE: { variant: 'success' as const, label: 'Arrivé' },
  EN_STOCK: { variant: 'success' as const, label: 'En Stock' },
  LIVRE: { variant: 'success' as const, label: 'Livré' },
  PARTIELLEMENT_LIVRE: { variant: 'info' as const, label: 'Partiellement Livré' },
};

const typeTransportMeta = {
  MARITIME: { icon: Ship, color: '#0077B6' },
  AERIEN: { icon: Plane, color: '#00B4D8' },
  ROUTIER: { icon: Truck, color: '#006A4E' },
};

export default function ExpeditionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [expedition, setExpedition] = useState<any>(null);
  const [marchandises, setMarchandises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMarchandiseModalOpen, setIsMarchandiseModalOpen] = useState(false);
  const [editMarchandise, setEditMarchandise] = useState<any>(null);
  const [deleteMarchandiseId, setDeleteMarchandiseId] = useState<number | null>(null);
  const [marchandiseForm, setMarchandiseForm] = useState({
    description: '', categorie: '', quantite: 1, unite: 'pcs',
    longueurCm: '', largeurCm: '', hauteurCm: '', cbm: '',
    poidsUnitaire: '', poidsTotalKg: '', valeurUnitaire: '', valeurTotale: '', nombreColis: '', notes: ''
  });

  const updateDimensions = (field: string, value: string) => {
    const upd = { ...marchandiseForm, [field]: value };
    const l = Number(upd.longueurCm), w = Number(upd.largeurCm), h = Number(upd.hauteurCm), q = Number(upd.quantite);
    if (l > 0 && w > 0 && h > 0 && q > 0) {
      const cbm = (l * w * h * q) / 1_000_000;
      upd.cbm = cbm.toFixed(4);
    }
    setMarchandiseForm(upd);
  };
  const [savingMarchandise, setSavingMarchandise] = useState(false);

  const load = async () => {
    try {
      const res = await fetch(`/api/expeditions/${id}`);
      if (res.ok) setExpedition(await res.json());
      const marchRes = await fetch(`/api/expeditions/${id}/marchandises`);
      if (marchRes.ok) setMarchandises(await marchRes.json());
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [id]);

  const resetMarchandiseForm = () => {
    setMarchandiseForm({
      description: '', categorie: '', quantite: 1, unite: 'pcs',
      longueurCm: '', largeurCm: '', hauteurCm: '', cbm: '',
      poidsUnitaire: '', poidsTotalKg: '', valeurUnitaire: '', valeurTotale: '', nombreColis: '', notes: ''
    });
    setEditMarchandise(null);
  };

  const openAddMarchandise = () => { resetMarchandiseForm(); setIsMarchandiseModalOpen(true); };
  const openEditMarchandise = (m: any) => {
    setMarchandiseForm({
      description: m.description || '', categorie: m.categorie || '', quantite: m.quantite || 1, unite: m.unite || 'pcs',
      longueurCm: m.longueurCm?.toString() || '', largeurCm: m.largeurCm?.toString() || '',
      hauteurCm: m.hauteurCm?.toString() || '', cbm: m.cbm?.toString() || '',
      poidsUnitaire: m.poidsUnitaire?.toString() || '', poidsTotalKg: m.poidsTotalKg?.toString() || '',
      valeurUnitaire: m.valeurUnitaire?.toString() || '', valeurTotale: m.valeurTotale?.toString() || '',
      nombreColis: m.nombreColis?.toString() || '', notes: m.notes || ''
    });
    setEditMarchandise(m);
    setIsMarchandiseModalOpen(true);
  };

  const handleSaveMarchandise = async () => {
    setSavingMarchandise(true);
    try {
      let url = `/api/expeditions/${id}/marchandises`;
      let method = 'POST';
      if (editMarchandise) {
        url += `/${editMarchandise.id}`;
        method = 'PUT';
      }
      const r = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...marchandiseForm,
          quantite: Number(marchandiseForm.quantite),
          poidsUnitaire: marchandiseForm.poidsUnitaire ? Number(marchandiseForm.poidsUnitaire) : null,
          poidsTotalKg: marchandiseForm.poidsTotalKg ? Number(marchandiseForm.poidsTotalKg) : null,
          valeurUnitaire: marchandiseForm.valeurUnitaire ? Number(marchandiseForm.valeurUnitaire) : null,
          valeurTotale: marchandiseForm.valeurTotale ? Number(marchandiseForm.valeurTotale) : null,
          nombreColis: marchandiseForm.nombreColis ? Number(marchandiseForm.nombreColis) : null,
          longueurCm: marchandiseForm.longueurCm ? Number(marchandiseForm.longueurCm) : null,
          largeurCm: marchandiseForm.largeurCm ? Number(marchandiseForm.largeurCm) : null,
          hauteurCm: marchandiseForm.hauteurCm ? Number(marchandiseForm.hauteurCm) : null,
          cbm: marchandiseForm.cbm ? Number(marchandiseForm.cbm) : null
        })
      });
      if (r.ok) { setIsMarchandiseModalOpen(false); resetMarchandiseForm(); load(); }
    } finally { setSavingMarchandise(false); }
  };

  const handleDeleteMarchandise = async () => {
    if (!deleteMarchandiseId) return;
    try {
      const r = await fetch(`/api/expeditions/${id}/marchandises/${deleteMarchandiseId}`, { method: 'DELETE' });
      if (r.ok) { setDeleteMarchandiseId(null); load(); }
    } catch {}
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem' }}>
        <h1 className="page-title">Chargement...</h1>
      </div>
    );
  }

  if (!expedition) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem' }}>
        <h1 className="page-title">Expédition non trouvée</h1>
        <Button onClick={() => window.history.back()}>
          <ArrowLeft size={16} /> Retour
        </Button>
      </div>
    );
  }

  const TransportIcon = typeTransportMeta[expedition.typeTransport as keyof typeof typeTransportMeta]?.icon || Package;
  const status = statusMeta[expedition.statut as keyof typeof statusMeta] || { variant: 'default', label: expedition.statut };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Button variant="ghost" onClick={() => window.history.back()} style={{ padding: '0.5rem' }}>
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="page-title">{expedition.reference}</h1>
          <p className="page-subtitle" style={{ marginTop: '0.25rem' }}>
            Détails de l'expédition
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="icon-box" style={{ width: 48, height: 48, backgroundColor: 'var(--fleet-light)' }}>
              <TransportIcon size={24} color="var(--fleet-blue)" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--slate-800)' }}>
                {expedition.reference}
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--slate-500)' }}>
                {expedition.client?.nom || 'Client inconnu'}
              </p>
            </div>
          </div>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>

        <div className="modal-section" style={{ marginBottom: '1.5rem' }}>
          <div className="modal-section-title">Trajet</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginBottom: '0.25rem' }}>Origine</p>
              <p style={{ fontWeight: 600, color: 'var(--slate-800)' }}>
                {expedition.paysOrigine || '-'} {expedition.portOrigine ? `(${expedition.portOrigine})` : ''}
              </p>
            </div>
            <div style={{ color: 'var(--slate-300)' }}>
              <Ship size={20} />
            </div>
            <div style={{ flex: 1, textAlign: 'right' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginBottom: '0.25rem' }}>Destination</p>
              <p style={{ fontWeight: 600, color: 'var(--slate-800)' }}>
                {expedition.paysDestination || '-'} {expedition.portDestination ? `(${expedition.portDestination})` : ''}
              </p>
            </div>
          </div>
          <div className="modal-grid-2">
            <div className="form-group">
              <label className="form-label">Date de départ prévue</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={16} color="var(--slate-400)" />
                <span>
                  {expedition.dateDepartPrevue ? new Date(expedition.dateDepartPrevue).toLocaleDateString('fr-FR') : '-'}
                </span>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Date d'arrivée prévue</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={16} color="var(--slate-400)" />
                <span>
                  {expedition.dateArriveePrevue ? new Date(expedition.dateArriveePrevue).toLocaleDateString('fr-FR') : '-'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-section" style={{ marginBottom: '1.5rem' }}>
          <div className="modal-section-title">Marchandises</div>
          <div className="modal-grid-2">
            <div className="form-group">
              <label className="form-label">Incoterm</label>
              <span>{expedition.incoterm || '-'}</span>
            </div>
            <div className="form-group">
              <label className="form-label">Devise</label>
              <span>{expedition.devise || '-'}</span>
            </div>
            <div className="form-group">
              <label className="form-label">Valeur totale</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <DollarSign size={16} color="var(--slate-400)" />
                <span>{expedition.valeurTotale?.toLocaleString('fr-FR') || 0}</span>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Poids total</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Weight size={16} color="var(--slate-400)" />
                <span>{expedition.poidsTotalKg?.toLocaleString('fr-FR') || 0} kg</span>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">CBM total</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Package size={16} color="var(--slate-400)" />
                <span>{expedition.cbmTotal ? `${Number(expedition.cbmTotal).toFixed(3)} m³` : '-'}</span>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Nombre de colis</label>
              <span>{expedition.nombreColis || 0}</span>
            </div>
          </div>
        </div>

        {expedition.marchandises?.length > 0 && (
          <div className="modal-section">
            <div className="modal-section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Liste des marchandises</span>
              <Button variant="ghost" size="sm" onClick={openAddMarchandise}><Plus size={16} /> Ajouter</Button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {marchandises.map((m: any) => (
                <div key={m.id} style={{ 
                  padding: '1rem', 
                  backgroundColor: 'var(--slate-50)', 
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: 'var(--slate-800)', display: 'flex', gap: '0.5rem' }}>
                      {m.description}
                      {m.categorie && <Badge variant="default">{m.categorie}</Badge>}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginTop: '0.25rem', display: 'flex', gap: '1rem' }}>
                      <span>Qté: {m.quantite} {m.unite}</span>
                      {m.cbm && <span>CBM: {Number(m.cbm).toFixed(3)} m³</span>}
                      {m.poidsTotalKg && <span>Poids: {m.poidsTotalKg}kg</span>}
                      {m.valeurTotale && <span>Valeur: {m.valeurTotale}</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button className="btn btn-ghost btn-icon" onClick={() => openEditMarchandise(m)}><Edit size={16} /></button>
                    <button className="btn btn-ghost btn-icon" style={{ color: 'var(--danger)' }} onClick={() => setDeleteMarchandiseId(m.id)}><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {(!expedition.marchandises || expedition.marchandises.length === 0) && (
          <div className="modal-section">
            <div className="modal-section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Liste des marchandises</span>
              <Button variant="ghost" size="sm" onClick={openAddMarchandise}><Plus size={16} /> Ajouter</Button>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--slate-500)', marginTop: '0.5rem' }}>Aucune marchandise ajoutée.</p>
          </div>
        )}

        {expedition.documents?.length > 0 && (
          <div className="modal-section">
            <div className="modal-section-title">Documents</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {expedition.documents.map((d: any) => (
                <div key={d.id} style={{ 
                  padding: '0.75rem', 
                  backgroundColor: 'var(--slate-50)', 
                  borderRadius: 'var(--radius-lg)' 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileText size={16} color="var(--slate-400)" />
                    <span style={{ fontWeight: 500, color: 'var(--slate-700)' }}>{d.nom}</span>
                    <Badge variant="info">{d.type}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {expedition.notes && (
          <div className="modal-section">
            <div className="modal-section-title">Notes</div>
            <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', lineHeight: '1.5' }}>
              {expedition.notes}
            </p>
          </div>
        )}
      </div>

      <Modal
        open={isMarchandiseModalOpen}
        onClose={() => setIsMarchandiseModalOpen(false)}
        title={editMarchandise ? "Modifier la marchandise" : "Ajouter une marchandise"}
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsMarchandiseModalOpen(false)}>Annuler</Button>
            <Button onClick={handleSaveMarchandise} disabled={savingMarchandise}>{savingMarchandise ? 'Enregistrement...' : editMarchandise ? 'Mettre à jour' : 'Ajouter'}</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="modal-section">
            <div className="modal-section-title">Informations</div>
            <div className="modal-grid-2">
              <Input 
                label="Description"
                value={marchandiseForm.description}
                onChange={e => setMarchandiseForm({ ...marchandiseForm, description: e.target.value })}
                placeholder="Description de la marchandise"
              />
              <Input 
                label="Catégorie"
                value={marchandiseForm.categorie}
                onChange={e => setMarchandiseForm({ ...marchandiseForm, categorie: e.target.value })}
                placeholder="Catégorie"
              />
              <Input 
                label="Quantité"
                type="number"
                value={marchandiseForm.quantite}
                onChange={e => setMarchandiseForm({ ...marchandiseForm, quantite: Number(e.target.value) })}
                placeholder="Quantité"
              />
              <Input 
                label="Unité"
                value={marchandiseForm.unite}
                onChange={e => setMarchandiseForm({ ...marchandiseForm, unite: e.target.value })}
                placeholder="pcs"
              />
              <Input 
                label="Longueur (cm)"
                type="number"
                value={marchandiseForm.longueurCm}
                onChange={e => updateDimensions('longueurCm', e.target.value)}
                placeholder="Longueur cm"
              />
              <Input 
                label="Largeur (cm)"
                type="number"
                value={marchandiseForm.largeurCm}
                onChange={e => updateDimensions('largeurCm', e.target.value)}
                placeholder="Largeur cm"
              />
              <Input 
                label="Hauteur (cm)"
                type="number"
                value={marchandiseForm.hauteurCm}
                onChange={e => updateDimensions('hauteurCm', e.target.value)}
                placeholder="Hauteur cm"
              />
              <Input 
                label="CBM (auto)"
                type="number"
                value={marchandiseForm.cbm}
                placeholder="Calculé auto"
                disabled
              />
              <Input 
                label="Poids unitaire (kg)"
                type="number"
                value={marchandiseForm.poidsUnitaire}
                onChange={e => setMarchandiseForm({ ...marchandiseForm, poidsUnitaire: e.target.value })}
                placeholder="Poids unitaire"
              />
              <Input 
                label="Poids total (kg)"
                type="number"
                value={marchandiseForm.poidsTotalKg}
                onChange={e => setMarchandiseForm({ ...marchandiseForm, poidsTotalKg: e.target.value })}
                placeholder="Poids total"
              />
              <Input 
                label="Valeur unitaire"
                type="number"
                value={marchandiseForm.valeurUnitaire}
                onChange={e => setMarchandiseForm({ ...marchandiseForm, valeurUnitaire: e.target.value })}
                placeholder="Valeur unitaire"
              />
              <Input 
                label="Valeur totale"
                type="number"
                value={marchandiseForm.valeurTotale}
                onChange={e => setMarchandiseForm({ ...marchandiseForm, valeurTotale: e.target.value })}
                placeholder="Valeur totale"
              />
              <Input 
                label="Nombre de colis"
                type="number"
                value={marchandiseForm.nombreColis}
                onChange={e => setMarchandiseForm({ ...marchandiseForm, nombreColis: e.target.value })}
                placeholder="Nombre de colis"
              />
            </div>
          </div>
          <div className="modal-section">
            <div className="modal-section-title">Notes</div>
            <div className="form-group">
              <textarea 
                className="form-input" 
                value={marchandiseForm.notes} 
                onChange={e => setMarchandiseForm({ ...marchandiseForm, notes: e.target.value })}
                placeholder="Notes additionnelles..."
                style={{ minHeight: '80px', resize: 'vertical' }}
              />
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        open={deleteMarchandiseId !== null}
        onClose={() => setDeleteMarchandiseId(null)}
        title="Confirmer la suppression"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteMarchandiseId(null)}>Annuler</Button>
            <Button variant="danger" onClick={handleDeleteMarchandise}>Supprimer</Button>
          </>
        }
      >
        <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', marginBottom: '1rem' }}>Êtes-vous sûr de vouloir supprimer cette marchandise?</p>
      </Modal>
    </div>
  );
}