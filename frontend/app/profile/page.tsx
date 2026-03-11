'use client';

import api from '@/lib/api';
import { ArrowLeft, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    phone: '',
    website: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setFormData({
        company_name: user.company_name || '',
        phone: user.phone || '',
        website: user.website || ''
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.put('/users/profile', formData);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      toast.success('Profil mis à jour !');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 pb-20">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700"
            aria-label="Retour au tableau de bord"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Mon profil</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card">
            <label className="block text-sm font-medium mb-2">
              Nom de l'entreprise
            </label>
            <input
              type="text"
              required
              className="input-field"
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              aria-label="Nom de l'entreprise"
            />
          </div>

          <div className="card">
            <label className="block text-sm font-medium mb-2">
              Téléphone
            </label>
            <input
              type="tel"
              className="input-field"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              aria-label="Téléphone"
            />
          </div>

          <div className="card">
            <label className="block text-sm font-medium mb-2">
              Site web
            </label>
            <input
              type="url"
              className="input-field"
              placeholder="https://"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              <>
                <Save size={20} />
                Enregistrer
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
