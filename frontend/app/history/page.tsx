'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';

export default function HistoryPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await api.get('/posts');
      setPosts(response.data.posts);
    } catch (error) {
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Historique</h1>
        </div>

        {posts.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-slate-400">Aucun post pour le moment</p>
            <button
              onClick={() => router.push('/create-post')}
              className="mt-4 btn-primary"
            >
              Créer mon premier post
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                onClick={() => router.push(`/preview/${post.id}`)}
                className="card hover:bg-slate-700 cursor-pointer transition-colors"
              >
                <div className="flex gap-4">
                  {post.images && post.images.length > 0 && (
                    <img
                      src={post.images[0].startsWith('http') ? post.images[0] : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${post.images[0]}`}
                      alt="Preview"
                      className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-lg capitalize">
                        {post.job_type.replace(/_/g, ' ')}
                      </h3>
                      {post.sent_to_automation && (
                        <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-slate-400 text-sm line-clamp-2 mb-2">
                      {post.post_text}
                    </p>
                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                      <Calendar size={14} />
                      {formatDate(post.created_at)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
