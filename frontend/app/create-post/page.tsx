'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';

const JOB_TYPES = [
  { value: 'climatisation', label: 'Climatisation installation' },
  { value: 'plomberie', label: 'Plomberie installation' },
  { value: 'depannage_plomberie', label: 'Dépannage plomberie' },
  { value: 'chauffe_eau', label: 'Chauffe-eau installation' },
  { value: 'froid_commercial', label: 'Froid commercial' },
  { value: 'autre', label: 'Autre' }
];

export default function CreatePostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [jobType, setJobType] = useState('');
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length + images.length > 5) {
      toast.error('Maximum 5 images');
      return;
    }

    setImages([...images, ...files]);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!jobType) {
      toast.error('Sélectionnez un type de travail');
      return;
    }

    if (images.length === 0) {
      toast.error('Ajoutez au moins une photo');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('job_type', jobType);
      formData.append('user_comment', comment);
      images.forEach(image => {
        formData.append('images', image);
      });

      const response = await api.post('/posts/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Post créé avec succès !');
      router.push(`/preview/${response.data.post.id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erreur lors de la création');
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
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Créer un post</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card">
            <label className="block text-sm font-medium mb-2">
              Type de travail *
            </label>
            <select
              required
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="input-field"
            >
              <option value="">Sélectionnez...</option>
              {JOB_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="card">
            <label className="block text-sm font-medium mb-2">
              Commentaire (optionnel)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="input-field resize-none"
              rows={3}
              placeholder="Ajoutez des détails sur le travail réalisé..."
            />
          </div>

          <div className="card">
            <label className="block text-sm font-medium mb-4">
              Photos * (1-5 images)
            </label>

            {previews.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                {previews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {images.length < 5 && (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-600 rounded-lg p-8 cursor-pointer hover:border-primary-500 transition-colors">
                <Upload size={48} className="text-slate-400 mb-2" />
                <span className="text-slate-400 text-center">
                  Cliquez pour ajouter des photos
                </span>
                <span className="text-slate-500 text-sm mt-1">
                  {images.length}/5 images
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || images.length === 0 || !jobType}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Génération en cours...
              </>
            ) : (
              'Générer le post'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
