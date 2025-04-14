'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ToastProvider';
import AdminPageLayout from '@/components/AdminPageLayout';
import AdminFormContainer from '@/components/AdminFormContainer';
import FormField from '@/components/FormField';
import AdminTable from '@/components/AdminTable';
import AdminQuickLinks from '@/components/AdminQuickLinks';
import { Palette, Pencil, Trash2 } from 'lucide-react';
import type { Color, ColorCollection } from '@/types/Color';

// Função simulada para buscar cores
const fetchColors = async (): Promise<Color[]> => {
  // Simula atraso na rede
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return []; // TODO: Implementar retorno real
};

// Função simulada para buscar coleções
const fetchCollections = async (): Promise<ColorCollection[]> => {
  // Simula atraso na rede
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return []; // TODO: Implementar retorno real
};

export default function ColorsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [colorsList, setColorsList] = useState<Color[]>([]);
  const [collections, setCollections] = useState<ColorCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentColor, setCurrentColor] = useState<Color | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Dados do formulário
  const [name, setName] = useState('');
  const [ncsCode, setNcsCode] = useState('');
  const [colorCode, setColorCode] = useState('');
  const [rgbCode, setRgbCode] = useState('');
  const [hexColor, setHexColor] = useState('#000000');
  const [collectionId, setCollectionId] = useState('');

  // Carregar dados
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [colorsData, collectionsData] = await Promise.all([
          fetchColors(),
          fetchCollections()
        ]);
        setColorsList(colorsData);
        setCollections(collectionsData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        showToast('Erro ao carregar dados', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [showToast]);

  // Adicionar nova cor
  const handleAddNew = () => {
    setIsEditing(true);
    setCurrentColor(null);
    resetForm();
  };

  // Editar cor existente
  const handleEdit = (color: Color) => {
    setCurrentColor(color);
    setName(color.name);
    setNcsCode(color.ncsCode);
    setColorCode(color.colorCode);
    setRgbCode(color.rgbCode);
    setHexColor(color.hexColor);
    setCollectionId(color.collectionId);
    setIsEditing(true);
  };

  // Excluir cor
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta cor?')) {
      try {
        // TODO: Implementar exclusão real
        await new Promise(resolve => setTimeout(resolve, 1000));
        setColorsList(prev => prev.filter(color => color.id !== id));
        showToast('Cor excluída com sucesso', 'success');
      } catch (error) {
        console.error("Erro ao excluir cor:", error);
        showToast('Erro ao excluir cor', 'error');
      }
    }
  };

  // Resetar formulário
  const resetForm = () => {
    setName('');
    setNcsCode('');
    setColorCode('');
    setRgbCode('');
    setHexColor('#000000');
    setCollectionId('');
  };

  // Cancelar edição
  const handleCancel = () => {
    setIsEditing(false);
    setCurrentColor(null);
    resetForm();
  };

  // Enviar formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const now = new Date();
      const colorData: Color = {
        id: currentColor?.id || Date.now().toString(),
        name,
        ncsCode,
        colorCode,
        rgbCode,
        hexColor,
        collectionId,
        createdAt: currentColor?.createdAt || now,
        updatedAt: now
      };

      // TODO: Implementar salvamento real
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (currentColor) {
        // Atualizar cor existente
        setColorsList(prev => prev.map(color => 
          color.id === currentColor.id ? { ...color, ...colorData } : color
        ));
        showToast('Cor atualizada com sucesso', 'success');
      } else {
        // Adicionar nova cor
        setColorsList(prev => [...prev, colorData]);
        showToast('Cor adicionada com sucesso', 'success');
      }

      handleCancel();
    } catch (error) {
      console.error("Erro ao salvar cor:", error);
      showToast('Erro ao salvar cor', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Links rápidos
  const quickLinks = [
    {
      label: 'Adicionar Cor',
      icon: Palette,
      onClick: handleAddNew,
      disabled: isEditing
    }
  ];

  // Colunas da tabela
  const columns = [
    {
      key: 'color',
      header: 'Cor',
      render: (value: any, color: Color) => (
        <div
          className="h-8 w-8 rounded-full border border-slate-200 shadow-sm"
          style={{ backgroundColor: color.hexColor }}
        />
      )
    },
    {
      key: 'name',
      header: 'Nome',
      render: (value: any, color: Color) => color.name
    },
    {
      key: 'collection',
      header: 'Coleção',
      render: (value: any, color: Color) => {
        const collection = collections.find(c => c.id === color.collectionId);
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800">
            {collection?.name || 'Sem coleção'}
          </span>
        );
      }
    },
    {
      key: 'codes',
      header: 'Códigos',
      render: (value: any, color: Color) => (
        <div className="text-sm text-slate-500 space-y-1">
          <p>NCS: {color.ncsCode}</p>
          <p>RGB: {color.rgbCode}</p>
        </div>
      )
    }
  ];

  return (
    <AdminPageLayout
      title={isEditing ? 'Adicionar Nova Cor' : 'Gerenciar Cores'}
      actionButton={{
        label: isEditing ? 'Voltar' : 'Adicionar Cor',
        onClick: isEditing ? handleCancel : handleAddNew,
        show: true
      }}
    >
      {isEditing ? (
        <AdminFormContainer 
          title={currentColor ? 'Editar Cor' : 'Nova Cor'}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Preview da Cor */}
            <div className="md:col-span-2 flex items-center space-x-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div
                className="w-24 h-24 rounded-xl shadow-lg"
                style={{ backgroundColor: hexColor }}
              />
              <div>
                <h3 className="text-lg font-medium text-slate-900 mb-1">
                  Preview da Cor
                </h3>
                <p className="text-sm text-slate-500">
                  Visualize como a cor ficará no catálogo
                </p>
              </div>
            </div>

            <FormField
              id="name"
              label="Nome da Cor"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <FormField
              id="collection"
              label="Coleção"
              type="select"
              value={collectionId}
              onChange={(e) => setCollectionId(e.target.value)}
              options={collections.map(collection => ({
                value: collection.id,
                label: collection.name
              }))}
              emptyOption="Selecione uma coleção"
              required
            />

            <FormField
              id="ncsCode"
              label="Código NCS"
              type="text"
              value={ncsCode}
              onChange={(e) => setNcsCode(e.target.value)}
              required
            />

            <FormField
              id="rgbCode"
              label="Código RGB"
              type="text"
              value={rgbCode}
              onChange={(e) => setRgbCode(e.target.value)}
              required
            />
          </div>
        </AdminFormContainer>
      ) : (
        <AdminTable
          data={colorsList}
          columns={columns}
          emptyText="Nenhuma cor cadastrada"
          actions={{
            onEdit: handleEdit,
            onDelete: (color: Color) => handleDelete(color.id)
          }}
        />
      )}
    </AdminPageLayout>
  );
} 