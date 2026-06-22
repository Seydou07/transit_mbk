'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Save, Building, Bell, Shield, Palette } from 'lucide-react';

export default function ParametresPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div><h1 className="page-title">Paramètres</h1><p className="page-subtitle" style={{ marginTop: '0.25rem' }}>Configuration générale de la plateforme MBK Transit.</p></div>

      <div className="settings-grid">
        <Card premium style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
            <Building size={20} color="var(--fleet-blue)" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Informations Société</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div><label className="label">Nom de la Société</label><input className="input" defaultValue="MBK Business International" /></div>
            <div><label className="label">Adresse</label><input className="input" defaultValue="Zone Industrielle, BP 1234, Abidjan" /></div>
            <div><label className="label">Email Contact</label><input className="input" type="email" defaultValue="contact@mbk-transit.ci" /></div>
            <div><label className="label">Téléphone</label><input className="input" defaultValue="+225 01 23 45 67 89" /></div>
          </div>
        </Card>

        <Card premium style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
            <Palette size={20} color="var(--fleet-blue)" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Préférences</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div><label className="label">Langue</label><select className="select" defaultValue="fr"><option value="fr">Français</option><option value="en">English</option></select></div>
            <div><label className="label">Devise</label><select className="select" defaultValue="XAF"><option value="XAF">FCFA (XAF)</option><option value="XOF">FCFA (XOF)</option><option value="EUR">Euro</option><option value="USD">USD</option></select></div>
            <div><label className="label">Fuseau Horaire</label><select className="select" defaultValue="Africa/Abidjan"><option value="Africa/Abidjan">UTC+0 (Abidjan)</option><option value="Africa/Douala">UTC+1 (Douala)</option><option value="Africa/Nairobi">UTC+3 (Nairobi)</option></select></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <label className="label" style={{ marginBottom: 0 }}>Notifications par Email</label>
              <input type="checkbox" defaultChecked style={{ width: 18, height: 18, accentColor: 'var(--fleet-blue)' }} />
            </div>
          </div>
        </Card>

        <Card premium style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
            <Shield size={20} color="var(--fleet-blue)" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Sécurité</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <label className="label" style={{ marginBottom: 0 }}>Authentification à Deux Facteurs</label>
              <input type="checkbox" style={{ width: 18, height: 18, accentColor: 'var(--fleet-blue)' }} />
            </div>
            <div><label className="label">Session Timeout (minutes)</label><input className="input" type="number" defaultValue={30} /></div>
            <div><label className="label">Politique de Mot de Passe</label><select className="select" defaultValue="strong"><option value="basic">Simple</option><option value="medium">Moyenne</option><option value="strong">Forte</option></select></div>
          </div>
        </Card>

        <Card premium style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
            <Bell size={20} color="var(--fleet-blue)" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Notifications</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {['Nouvelle expédition créée', 'Expédition en transit', 'Document ajouté', 'Stock bas'].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--slate-700)' }}>{item}</span>
                <input type="checkbox" defaultChecked style={{ width: 18, height: 18, accentColor: 'var(--fleet-blue)' }} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={handleSave}>
          <Save size={18} /> {saved ? 'Enregistré ✓' : 'Enregistrer'}
        </Button>
      </div>
    </div>
  );
}
