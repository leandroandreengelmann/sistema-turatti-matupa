'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import AdminPageLayout from '@/components/AdminPageLayout';
import { toast } from 'react-hot-toast';

// Em vez de tentar usar React.use (que está causando problemas de tipagem),
// manteremos o acesso direto ao params.id por enquanto com um comentário claro

interface ColorCollection {
  id: string;
  name: string;
  active: boolean;
}

interface Color {
  id: string;
  name: string;
  hexcode: string;
  collectionid: string;
  active: boolean;
  createdat: string;
}

interface FormData {
  name: string;
  hexcode: string;
  collectionid: string;
  active: boolean;
  rgb?: string;
  red?: number;
  green?: number;
  blue?: number;
  ncs?: string;
}

interface FormErrors {
  name?: string;
  hexcode?: string;
  collectionid?: string;
}

export default function EditarCorPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  
  // TODO: Futuro - Em Next.js 15+ 'params' será uma Promise.
  // Manter o acesso direto por enquanto, até que haja documentação oficial sobre como lidar com isso.
  const colorId = params.id;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [collections, setCollections] = useState<ColorCollection[]>([]);
  
  // Estado do formulário
  const [formData, setFormData] = useState<FormData>({
    name: '',
    hexcode: '#000000',
    collectionid: '',
    active: true, // Garantir que a cor é ativa por padrão
    rgb: undefined,
    red: undefined,
    green: undefined,
    blue: undefined,
    ncs: undefined
  });
  
  // Estado dos erros
  const [errors, setErrors] = useState<FormErrors>({});
  
  // Carregar os dados da cor e as coleções
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Carregar a cor específica
        const { data: colorData, error: colorError } = await supabase
          .from('colors')
          .select('*')
          .eq('id', colorId)
          .single();
        
        if (colorError) {
          if (colorError.code === 'PGRST116') {
            setNotFound(true);
          }
          throw colorError;
        }
        
        // Carregar as coleções
        const { data: collectionsData, error: collectionsError } = await supabase
          .from('color_collections')
          .select('id, name, active')
          .order('name');
        
        if (collectionsError) throw collectionsError;
        
        // Atualizar estados
        setFormData({
          name: colorData.name,
          hexcode: colorData.hexcode,
          collectionid: colorData.collectionid,
          active: colorData.active ?? true, // Usar active em vez de ativo
          rgb: colorData.rgb,
          red: colorData.red,
          green: colorData.green,
          blue: colorData.blue,
          ncs: colorData.ncs || null
        });
        
        setCollections(collectionsData || []);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        if (!notFound) {
          toast.error('Erro ao carregar os dados da cor');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    if (colorId) {
      loadData();
    }
  }, [colorId]);
  
  // Validar o formulário
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'O nome da cor é obrigatório';
    }
    
    if (!formData.hexcode.trim()) {
      newErrors.hexcode = 'O código hexadecimal é obrigatório';
    } else if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(formData.hexcode)) {
      newErrors.hexcode = 'Formato de cor hexadecimal inválido (ex: #FF0000)';
    }
    
    if (!formData.collectionid) {
      newErrors.collectionid = 'Selecione uma coleção';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Atualizar dados do formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checkbox.checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Limpar erro do campo ao digitar
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  // Salvar cor
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSaving(true);
    try {
      // Extrair componentes RGB do hexcode, se não estiverem definidos
      let redValue = formData.red;
      let greenValue = formData.green;
      let blueValue = formData.blue;
      let rgbValue = formData.rgb;
      
      if (!redValue || !greenValue || !blueValue || !rgbValue) {
        // Extrai valores RGB do hexcode
        const hex = formData.hexcode.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        redValue = r;
        greenValue = g;
        blueValue = b;
        rgbValue = `rgb(${r}, ${g}, ${b})`;
      }
      
      // Atualizar a cor no banco de dados
      const { data, error } = await supabase
        .from('colors')
        .update({
          name: formData.name,
          hexcode: formData.hexcode,
          collectionid: formData.collectionid,
          active: formData.active,
          rgb: rgbValue,
          red: redValue,
          green: greenValue,
          blue: blueValue,
          ncs: formData.ncs || null
        })
        .eq('id', colorId)
        .select();
      
      if (error) throw error;
      
      toast.success('Cor atualizada com sucesso!');
      router.push('/admin/cores');
    } catch (error) {
      console.error('Erro ao atualizar cor:', error);
      toast.error('Ocorreu um erro ao atualizar a cor');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Se a cor não foi encontrada
  if (notFound && !isLoading) {
    return (
      <AdminPageLayout title="Cor não encontrada">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Cor não encontrada</h2>
          <p className="text-gray-600 mb-6">
            A cor que você está tentando editar não existe ou foi removida.
          </p>
          <Link 
            href="/admin/cores" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Voltar para a lista de cores
          </Link>
        </div>
      </AdminPageLayout>
    );
  }
  
  return (
    <AdminPageLayout title="Editar Cor">
      <div className="mb-6 flex items-center">
        <Link
          href="/admin/cores"
          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={16} className="mr-1" />
          Voltar para Cores
        </Link>
      </div>
      
      {isLoading ? (
        <div className="bg-white rounded-lg shadow-md p-8 flex justify-center">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span>Carregando dados da cor...</span>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSave}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Coluna de informações */}
              <div className="space-y-6">
                {/* Nome da cor */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome da Cor <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                  )}
                </div>
                
                {/* Coleção */}
                <div>
                  <label htmlFor="collectionid" className="block text-sm font-medium text-gray-700 mb-1">
                    Coleção <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="collectionid"
                    name="collectionid"
                    value={formData.collectionid}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md ${
                      errors.collectionid ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Selecione uma coleção</option>
                    {collections.map(collection => (
                      <option key={collection.id} value={collection.id}>
                        {collection.name}
                      </option>
                    ))}
                  </select>
                  {errors.collectionid && (
                    <p className="mt-1 text-xs text-red-600">{errors.collectionid}</p>
                  )}
                </div>
                
                {/* Status */}
                <div className="mt-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="active"
                      name="active"
                      checked={formData.active}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                      Cor ativa
                    </label>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Cores inativas não são exibidas no site.
                  </p>
                </div>
              </div>
              
              {/* Coluna de cor */}
              <div>
                <div className="space-y-6">
                  {/* Cor hexadecimal */}
                  <div>
                    <label htmlFor="hexcode" className="block text-sm font-medium text-gray-700 mb-1">
                      Código Hexadecimal <span className="text-red-600">*</span>
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        id="hexcode-picker"
                        value={formData.hexcode}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, hexcode: e.target.value }));
                          if (errors.hexcode) {
                            setErrors(prev => ({ ...prev, hexcode: undefined }));
                          }
                        }}
                        className="h-10 w-10 border-0 p-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        id="hexcode"
                        name="hexcode"
                        value={formData.hexcode}
                        onChange={handleInputChange}
                        placeholder="#000000"
                        className={`flex-1 px-4 py-2 border rounded-md ${
                          errors.hexcode ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {errors.hexcode && (
                      <p className="mt-1 text-xs text-red-600">{errors.hexcode}</p>
                    )}
                  </div>
                  
                  {/* Código NCS */}
                  <div className="mt-4">
                    <label htmlFor="ncs" className="block text-sm font-medium text-gray-700 mb-1">
                      Código NCS (Opcional)
                    </label>
                    <input
                      type="text"
                      id="ncs"
                      name="ncs"
                      value={formData.ncs || ''}
                      onChange={handleInputChange}
                      placeholder="Ex: S 1050-B80G"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Insira o código NCS (Natural Color System) desta cor, se disponível.
                    </p>
                  </div>
                  
                  {/* Preview da cor */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Preview da Cor
                    </label>
                    <div className="flex flex-col items-center space-y-3 p-6 border-2 border-dashed border-gray-300 rounded-lg">
                      <div
                        className="w-32 h-32 rounded-md shadow-lg"
                        style={{ backgroundColor: formData.hexcode }}
                      />
                      <div className="text-sm text-gray-700 text-center">
                        <p className="font-semibold mt-2">{formData.name || 'Cor'}</p>
                        <p className="text-gray-500">{formData.hexcode}</p>
                        {formData.ncs && <p className="text-gray-500">NCS: {formData.ncs}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <Link
                href="/admin/cores"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mr-2"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium flex items-center"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save size={16} className="mr-1" />
                    Salvar Alterações
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminPageLayout>
  );
} 