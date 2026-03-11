'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Copy, Send, Edit2, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';

export default function PreviewPage() {
  const router = useRouter();
  const params = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedText, setEditedText] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadPost();
  }, [params.id]);

  const loadPost = async () => {
    try {
      const response = await api.get(`/posts/${params.id}`);
      setPost(response.data.post);
      setEditedText(response.data.post.post_text);
    } catch (error) {
      toast.error('Erreur lors du chargement');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(post.post_text);
    toast.success('Texte copié !');
  };

  const handleSave = async () => {
    try {
      await api.put(`/posts/${params.id}`, { post_text: editedText });
      setPost({ ...post, post_text: editedText });
      setEditing(false);
      toast.success('Post modifié !');
    } catch (error) {
      toast.error('Erreur lors de la modification');
    }
  };

  const handleSendToAutomation = async () => {
    setSending(true);
    try {
      await api.post(`/posts/${params.id}/send-to-automation`);
      toast.success('Envoyé à l\'automation !');
      setPost({ ...post, sent_to_automation: true });
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erreur lors de l\'envoi');
    } finally {
      setSending(false);
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
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Aperçu du post</h1>
        </div>

        <div className="space-y-6">
          {post.images && post.images.length > 0 && (
            <div className="card">
              <h3 className="font-semibold mb-3">Photos</h3>
              <div className="grid grid-cols-2 gap-3">
                {post.images.map((image: string, index: number) => (
                  <img
                    key={index}
                    src={image.startsWith('http') ? image : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${image}`}
                    alt={`Image ${index + 1}`}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}

          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Texte du post</h3>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600"
                >
                  <Edit2 size={18} />
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  className="p-2 bg-green-600 rounded-lg hover:bg-green-700"
                >
                  <Check size={18} />
                </button>
              )}
            </div>

            {editing ? (
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="input-field resize-none"
                rows={12}
              />
            ) : (
              <div className="whitespace-pre-wrap text-slate-200 bg-slate-900 p-4 rounded-lg">
                {post.post_text}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleCopy}
              className="btn-secondary flex items-center justify-center gap-2"
            >
              <Copy size={20} />
              Copier
            </button>

            <button
              onClick={handleSendToAutomation}
              disabled={sending || post.sent_to_automation}
              className="btn-primary flex items-center justify-center gap-2"
            >
              {sending ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <Send size={20} />
                  {post.sent_to_automation ? 'Envoyé' : 'Envoyer'}
                </>
              )}
            </button>
          </div>

          {post.sent_to_automation && (
            <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 text-center">
              <p className="text-green-400 font-semibold">
                ✓ Post envoyé à l'automation
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
