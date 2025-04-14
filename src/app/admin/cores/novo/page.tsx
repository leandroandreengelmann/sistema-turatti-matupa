'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import AdminPageLayout from '@/components/AdminPageLayout';
import { toast } from 'react-hot-toast';

interface ColorCollection {
  id: string;
  name: string;
  active: boolean;
}

interface FormData {
  name: string;
  hexcode: string;
  rgb: string;
  red: number;
  green: number;
  blue: number;
  collectionid: string;
  active: boolean;
  ncs: string;
}

interface FormErrors {
  name?: string;
  hexcode?: string;
  rgb?: string;
  red?: string;
  green?: string;
  blue?: string;
  collectionid?: string;
  ncs?: string;
}

// Função para converter cor hexadecimal para RGB
const hexToRgb = (hex: string): string => {
  // Remover o # se existir
  const cleanHex = hex.replace('#', '');
  
  // Converter para RGB
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  
  return `rgb(${r}, ${g}, ${b})`;
};

export default function NovaCorPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [collections, setCollections] = useState<ColorCollection[]>([]);
  
  // Estado do formulário
  const [formData, setFormData] = useState<FormData>({
    name: '',
    hexcode: '#000000',
    rgb: 'rgb(0, 0, 0)',
    red: 0,
    green: 0,
    blue: 0,
    collectionid: '',
    active: true,
    ncs: ''
  });
  
  // Estado dos erros
  const [errors, setErrors] = useState<FormErrors>({});
  
  // Atualizar RGB quando os componentes individuais mudarem
  useEffect(() => {
    const { red, green, blue } = formData;
    const rgb = `rgb(${red}, ${green}, ${blue})`;
    
    // Converter para hexadecimal
    const redHex = red.toString(16).padStart(2, '0');
    const greenHex = green.toString(16).padStart(2, '0');
    const blueHex = blue.toString(16).padStart(2, '0');
    const hexcode = `#${redHex}${greenHex}${blueHex}`;
    
    setFormData(prev => ({ 
      ...prev, 
      rgb,
      hexcode
    }));
  }, [formData.red, formData.green, formData.blue]);
  
  // Carregar coleções de cores
  useEffect(() => {
    const loadCollections = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('color_collections')
          .select('id, name, active')
          .eq('active', true)
          .order('name');
        
        if (error) throw error;
        
        setCollections(data || []);
      } catch (error) {
        console.error('Erro ao carregar coleções:', error);
        toast.error('Não foi possível carregar as coleções de cores');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCollections();
  }, []);
  
  // Validar o formulário
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'O nome da cor é obrigatório';
    }
    
    if (formData.red < 0 || formData.red > 255) {
      newErrors.red = 'O valor deve estar entre 0 e 255';
    }
    
    if (formData.green < 0 || formData.green > 255) {
      newErrors.green = 'O valor deve estar entre 0 e 255';
    }
    
    if (formData.blue < 0 || formData.blue > 255) {
      newErrors.blue = 'O valor deve estar entre 0 e 255';
    }
    
    if (!formData.collectionid) {
      newErrors.collectionid = 'Selecione uma coleção';
    }
    
    // NCS é opcional, mas se for fornecido, deve ser válido
    if (formData.ncs && !/^[A-Za-z0-9\-\s]{1,20}$/.test(formData.ncs)) {
      newErrors.ncs = 'Formato de código NCS inválido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Atualizar dados do formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Remover erro quando o usuário começa a digitar no campo
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
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
      // Inserir a cor no banco de dados com todos os campos
      const { data, error } = await supabase
        .from('colors')
        .insert([
          {
            name: formData.name,
            hexcode: formData.hexcode,
            collectionid: formData.collectionid,
            active: formData.active,
            // Campos reativados após a migração do banco
            rgb: formData.rgb,
            red: formData.red,
            green: formData.green,
            blue: formData.blue,
            ncs: formData.ncs || null
          }
        ])
        .select();
      
      if (error) {
        console.error('Erro detalhado ao salvar cor:', error);
        throw error;
      }
      
      toast.success('Cor criada com sucesso!');
      router.push('/admin/cores');
    } catch (error) {
      console.error('Erro ao salvar cor:', error);
      toast.error('Ocorreu um erro ao salvar a cor. Verifique o console para mais detalhes.');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <AdminPageLayout title="Nova Cor">
      <div className="mb-6 flex items-center">
        <Link
          href="/admin/cores"
          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={16} className="mr-1" />
          Voltar para Cores
        </Link>
      </div>
      
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
                {collections.length === 0 && !isLoading && (
                  <p className="mt-1 text-xs text-orange-600">
                    Nenhuma coleção encontrada. <Link href="/admin/colecoes-cores/novo" className="text-blue-600 hover:underline">Criar uma coleção</Link>
                  </p>
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
                        setFormData(prev => ({ 
                          ...prev, 
                          hexcode: e.target.value,
                          // Atualizar valores RGB com base na cor selecionada
                          rgb: hexToRgb(e.target.value),
                          red: parseInt(e.target.value.slice(1, 3), 16),
                          green: parseInt(e.target.value.slice(3, 5), 16),
                          blue: parseInt(e.target.value.slice(5, 7), 16)
                        }));
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
                
                {/* Componentes RGB */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Componentes RGB <span className="text-red-600">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {/* Vermelho */}
                    <div>
                      <label htmlFor="red" className="block text-xs text-gray-500 mb-1">
                        Vermelho (0-255)
                      </label>
                      <input
                        type="number"
                        id="red"
                        name="red"
                        min="0"
                        max="255"
                        value={formData.red}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          setFormData(prev => ({
                            ...prev,
                            red: isNaN(value) ? 0 : Math.max(0, Math.min(255, value))
                          }));
                        }}
                        className={`w-full px-4 py-2 border rounded-md ${
                          errors.red ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.red && (
                        <p className="mt-1 text-xs text-red-600">{errors.red}</p>
                      )}
                    </div>
                    
                    {/* Verde */}
                    <div>
                      <label htmlFor="green" className="block text-xs text-gray-500 mb-1">
                        Verde (0-255)
                      </label>
                      <input
                        type="number"
                        id="green"
                        name="green"
                        min="0"
                        max="255"
                        value={formData.green}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          setFormData(prev => ({
                            ...prev,
                            green: isNaN(value) ? 0 : Math.max(0, Math.min(255, value))
                          }));
                        }}
                        className={`w-full px-4 py-2 border rounded-md ${
                          errors.green ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.green && (
                        <p className="mt-1 text-xs text-red-600">{errors.green}</p>
                      )}
                    </div>
                    
                    {/* Azul */}
                    <div>
                      <label htmlFor="blue" className="block text-xs text-gray-500 mb-1">
                        Azul (0-255)
                      </label>
                      <input
                        type="number"
                        id="blue"
                        name="blue"
                        min="0"
                        max="255"
                        value={formData.blue}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          setFormData(prev => ({
                            ...prev,
                            blue: isNaN(value) ? 0 : Math.max(0, Math.min(255, value))
                          }));
                        }}
                        className={`w-full px-4 py-2 border rounded-md ${
                          errors.blue ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                      {errors.blue && (
                        <p className="mt-1 text-xs text-red-600">{errors.blue}</p>
                      )}
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Valor RGB: {formData.rgb}
                  </p>
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
                      <p className="font-semibold mt-2">{formData.name || 'Nova Cor'}</p>
                      <p className="text-gray-500">{formData.hexcode}</p>
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
              disabled={isSaving || collections.length === 0}
              className={`px-4 py-2 ${
                collections.length === 0 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white rounded-md text-sm font-medium flex items-center`}
            >
              {isSaving ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-1" />
                  Salvar Cor
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminPageLayout>
  );
} 