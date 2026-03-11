'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle, History, User, LogOut, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Déconnexion réussie');
    router.push('/login');
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 pb-20">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Bonjour, {user.company_name}
            </h1>
            <p className="text-slate-400 text-sm">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>

        <div className="mb-8">
          <button
            onClick={() => router.push('/create-post')}
            className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-6 px-8 rounded-xl shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-3"
          >
            <PlusCircle size={32} />
            <span className="text-xl">Créer un nouveau post</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={() => router.push('/history')}
            className="card hover:bg-slate-700 transition-colors flex items-center gap-4 cursor-pointer"
          >
            <div className="p-3 bg-primary-600 rounded-lg">
              <History size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-lg">Historique</h3>
              <p className="text-slate-400 text-sm">Voir tous mes posts</p>
            </div>
          </button>

          <button
            onClick={() => router.push('/profile')}
            className="card hover:bg-slate-700 transition-colors flex items-center gap-4 cursor-pointer"
          >
            <div className="p-3 bg-green-600 rounded-lg">
              <User size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-lg">Mon profil</h3>
              <p className="text-slate-400 text-sm">Gérer mes informations</p>
            </div>
          </button>

          {user.is_admin && (
            <button
              onClick={() => router.push('/admin')}
              className="card hover:bg-slate-700 transition-colors flex items-center gap-4 cursor-pointer"
            >
              <div className="p-3 bg-red-600 rounded-lg">
                <Shield size={24} />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg">Administration</h3>
                <p className="text-slate-400 text-sm">Panneau admin</p>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
