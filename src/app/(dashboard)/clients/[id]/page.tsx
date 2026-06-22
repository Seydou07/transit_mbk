'use client';

import { useState, useEffect, use } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeft, User, Building2, MapPin, Phone, Mail, Package } from 'lucide-react';
import Link from 'next/link';

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`/api/clients/${id}`);
        if (r.ok) setClient(await r.json());
      } finally { setLoading(false); }
    })();
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem' }}>
        <h1 className="page-title">Chargement...</h1>
      </div>
    );
  }

  if (!client) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem' }}>
        <h1 className="page-title">Client non trouvé</h1>
        <Button onClick={() => window.history.back()}>
          <ArrowLeft size={16} /> Retour
        </Button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Button variant="ghost" onClick={() => window.history.back()} style={{ padding: '0.5rem' }}>
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="page-title">{client.nom}</h1>
          <p className="page-subtitle" style={{ marginTop: '0.25rem' }}>
            {client.reference}
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="icon-box" style={{ width: 56, height: 56, backgroundColor: 'var(--fleet-light)', borderRadius: '18px' }}>
              <User size={28} color="var(--fleet-blue)" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.35rem' }}>
                {client.nom}
              </h2>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Badge variant={client.statut === 'ACTIF' ? 'success' : 'default'}>
                  {client.statut}
                </Badge>
                <Badge variant="info">
                  {client.typeClient}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Coordonnées */}
          <div className="modal-section">
            <div className="modal-section-title">Coordonnées</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {client.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '12px', backgroundColor: 'var(--slate-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Mail size={18} color="var(--slate-500)" />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginBottom: '0.15rem', fontWeight: 500 }}>Email</p>
                    <p style={{ fontWeight: 600, color: 'var(--slate-800)', fontSize: '0.95rem' }}>{client.email}</p>
                  </div>
                </div>
              )}
              {client.telephone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '12px', backgroundColor: 'var(--slate-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Phone size={18} color="var(--slate-500)" />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginBottom: '0.15rem', fontWeight: 500 }}>Téléphone principal</p>
                    <p style={{ fontWeight: 600, color: 'var(--slate-800)', fontSize: '0.95rem' }}>{client.telephone}</p>
                  </div>
                </div>
              )}
              {client.telephoneSecondaire && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '12px', backgroundColor: 'var(--slate-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Phone size={18} color="var(--slate-500)" />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginBottom: '0.15rem', fontWeight: 500 }}>Téléphone secondaire</p>
                    <p style={{ fontWeight: 600, color: 'var(--slate-800)', fontSize: '0.95rem' }}>{client.telephoneSecondaire}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Localisation */}
          <div className="modal-section">
            <div className="modal-section-title">Localisation</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {(client.adresse || client.ville || client.pays) && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '12px', backgroundColor: 'var(--slate-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '0.1rem' }}>
                    <MapPin size={18} color="var(--slate-500)" />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginBottom: '0.15rem', fontWeight: 500 }}>Adresse complète</p>
                    <p style={{ fontWeight: 600, color: 'var(--slate-800)', fontSize: '0.95rem', lineHeight: '1.45' }}>
                      {[client.adresse, client.ville, client.pays].filter(Boolean).join(' • ')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Documents */}
          <div className="modal-section">
            <div className="modal-section-title">Documents</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {client.numeroCNIB && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '12px', backgroundColor: 'var(--slate-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Building2 size={18} color="var(--slate-500)" />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginBottom: '0.15rem', fontWeight: 500 }}>Numéro CNIB</p>
                    <p style={{ fontWeight: 600, color: 'var(--slate-800)', fontSize: '0.95rem' }}>{client.numeroCNIB}</p>
                  </div>
                </div>
              )}
              {client.numeroIFU && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '12px', backgroundColor: 'var(--slate-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Building2 size={18} color="var(--slate-500)" />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginBottom: '0.15rem', fontWeight: 500 }}>Numéro IFU</p>
                    <p style={{ fontWeight: 600, color: 'var(--slate-800)', fontSize: '0.95rem' }}>{client.numeroIFU}</p>
                  </div>
                </div>
              )}
              {client.registreCommerce && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '12px', backgroundColor: 'var(--slate-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Building2 size={18} color="var(--slate-500)" />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginBottom: '0.15rem', fontWeight: 500 }}>Registre de commerce</p>
                    <p style={{ fontWeight: 600, color: 'var(--slate-800)', fontSize: '0.95rem' }}>{client.registreCommerce}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Crédit */}
          <div className="modal-section">
            <div className="modal-section-title">Financier</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {client.plafondCredit && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '12px', backgroundColor: 'var(--slate-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Package size={18} color="var(--slate-500)" />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginBottom: '0.15rem', fontWeight: 500 }}>Plafond de crédit</p>
                    <p style={{ fontWeight: 700, color: 'var(--fleet-blue)', fontSize: '1.05rem' }}>
                      {new Intl.NumberFormat('fr-FR').format(client.plafondCredit)} FCFA
                    </p>
                  </div>
                </div>
              )}
              {client.conditionsPaiement && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '12px', backgroundColor: 'var(--slate-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Package size={18} color="var(--slate-500)" />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginBottom: '0.15rem', fontWeight: 500 }}>Conditions de paiement</p>
                    <p style={{ fontWeight: 600, color: 'var(--slate-800)', fontSize: '0.95rem' }}>{client.conditionsPaiement}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Expéditions associées */}
        <div style={{ marginTop: '1.5rem' }} className="modal-section">
          <div className="modal-section-title">
            Expéditions associées ({client.expeditions?.length || 0})
          </div>
          {client.expeditions?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {client.expeditions.map((expedition: any) => (
                <Link key={expedition.id} href={`/expeditions/${expedition.id}`}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    padding: '1rem 1.25rem', 
                    backgroundColor: 'var(--slate-50)',
                    borderRadius: '16px',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--slate-100)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--slate-50)'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div className="icon-box" style={{ width: 36, height: 36, backgroundColor: 'var(--fleet-light)', borderRadius: '12px' }}>
                      <Package size={18} color="var(--fleet-blue)" />
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, color: 'var(--slate-900)', fontSize: '0.95rem' }}>
                        {expedition.reference}
                      </p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                        {expedition.paysOrigine || '-'} → {expedition.paysDestination || '-'}
                      </p>
                    </div>
                  </div>
                  <Badge variant="info">{expedition.statut}</Badge>
                </Link>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '0.9rem', color: 'var(--slate-500)', padding: '1rem' }}>Aucune expédition pour ce client</p>
          )}
        </div>
      </div>
    </div>
  );
}