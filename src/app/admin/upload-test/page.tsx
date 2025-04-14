'use client';

import { useState } from 'react';
import AdminPageLayout from '@/components/AdminPageLayout';
import { createClient } from '@supabase/supabase-js';

export default function UploadTestPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [directUploadMethod, setDirectUploadMethod] = useState<'api' | 'client'>('api');

  // Upload via nossa API
  const handleApiUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setError(null);
    setUrl(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setUrl(data.url);
      } else {
        setError(data.error || 'Erro no upload');
      }
    } catch (err: any) {
      setError(err.message || 'Erro desconhecido');
    } finally {
      setUploading(false);
    }
  };
  
  // Upload direto via cliente Supabase
  const handleDirectUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setError(null);
    setUrl(null);
    
    try {
      // Criar cliente Supabase
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      
      // Upload do arquivo
      const filename = `test-uploads/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      
      const { data, error } = await supabase.storage
        .from('images')
        .upload(filename, file, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (error) {
        throw error;
      }
      
      // Obter URL pública
      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(filename);
        
      if (urlData) {
        setUrl(urlData.publicUrl);
      }
    } catch (err: any) {
      console.error('Erro no upload direto:', err);
      setError(err.message || 'Erro durante o upload direto');
    } finally {
      setUploading(false);
    }
  };
  
  const handleUpload = () => {
    if (directUploadMethod === 'api') {
      handleApiUpload();
    } else {
      handleDirectUpload();
    }
  };

  return (
    <AdminPageLayout title="Teste de Upload">
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-xl font-bold mb-4">Teste de Upload de Arquivos</h1>
        
        <div className="mb-4">
          <p className="text-gray-700 text-sm mb-2">
            Esta página testa o upload de imagens diretamente para o Supabase Storage.
          </p>
          
          <div className="flex gap-4 mb-4">
            <label className="flex items-center">
              <input
                type="radio"
                checked={directUploadMethod === 'api'}
                onChange={() => setDirectUploadMethod('api')}
                className="mr-2"
              />
              <span>Via API Route</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="radio"
                checked={directUploadMethod === 'client'}
                onChange={() => setDirectUploadMethod('client')}
                className="mr-2"
              />
              <span>Direto do Cliente</span>
            </label>
          </div>
        </div>
        
        <div className="mb-4">
          <input
            type="file"
            onChange={(e) => e.target.files && setFile(e.target.files[0])}
            className="mb-4"
          />
          
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className={`px-4 py-2 rounded ${
              !file || uploading
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {uploading ? 'Enviando...' : 'Enviar Arquivo'}
          </button>
        </div>
        
        {url && (
          <div className="mt-4 p-4 border border-green-200 bg-green-50 rounded">
            <p className="text-green-700 font-medium">Upload concluído com sucesso!</p>
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-1">URL da imagem:</p>
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {url}
              </a>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-1">Prévia:</p>
              <img src={url} alt="Preview" className="w-64 h-auto border border-gray-200 rounded" />
            </div>
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-4 border border-red-200 bg-red-50 rounded">
            <p className="text-red-700 font-medium">Erro no upload:</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}
      </div>
    </AdminPageLayout>
  );
} 