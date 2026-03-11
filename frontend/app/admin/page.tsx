'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Users, FileText, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      toast.error('Accès refusé');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 pb-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Administration</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <Users className="text-primary-500" size={24} />
              <h3 className="font-semibold">Utilisateurs</h3>
            </div>
            <p className="text-3xl font-bold">{stats?.stats.total_users || 0}</p>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="text-green-500" size={24} />
              <h3 className="font-semibold">Posts totaux</h3>
            </div>
            <p className="text-3xl font-bold">{stats?.stats.total_posts || 0}</p>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="text-blue-500" size={24} />
              <h3 className="font-semibold">Automatisés</h3>
            </div>
            <p className="text-3xl font-bold">{stats?.stats.automated_posts || 0}</p>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-4">Posts récents</h2>
          <div className="space-y-3">
            {stats?.recent_posts.map((post: any) => (
              <div key={post.id} className="bg-slate-900 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{post.company_name}</h3>
                  <span className="text-xs text-slate-400">
                    {new Date(post.created_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <p className="text-sm text-slate-400 line-clamp-2">
                  {post.post_text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
