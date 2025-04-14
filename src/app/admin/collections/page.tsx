'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ColorCollection } from '@/data/types';
import { useToast } from '@/components/ToastProvider';
import { colorCollectionService } from '@/services/localDataService';
import { Plus, Pencil, Trash2, Search, X, FolderOpen } from 'lucide-react';
import AdminPageLayout from '@/components/AdminPageLayout';
import AdminFormContainer from '@/components/AdminFormContainer';
import FormField from '@/components/FormField';
import AdminTable from '@/components/AdminTable';
import AdminItemCard from '@/components/AdminItemCard';

// Função simulada para buscar coleções
const fetchCollections = async (): Promise<ColorCollection[]> => {
  // Simula atraso na rede
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return []; // TODO: Implementar retorno real
};

export default function CollectionsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [collections, setCollections] = useState<ColorCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCollection, setCurrentCollection] = useState<ColorCollection | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  // Dados do formulário
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [representativeColor, setRepresentativeColor] = useState('#3b82f6');

  // Carregar coleções
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchCollections();
        setCollections(data);
      } catch (error) {
        console.error("Erro ao carregar coleções:", error);
        showToast('Erro ao carregar coleções', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [showToast]);

  useEffect(() => {
    if (currentCollection) {
      setName(currentCollection.name);
      setDescription(currentCollection.description || '');
      setRepresentativeColor(currentCollection.representativeColor || '#3b82f6');
    }
  }, [currentCollection]);

  // Adicionar nova coleção
  const handleAddNew = () => {
    setIsEditing(true);
    setCurrentCollection(null);
    resetForm();
  };

  // Editar coleção existente
  const handleEdit = (collection: ColorCollection) => {
    setCurrentCollection(collection);
    setName(collection.name);
    setDescription(collection.description || '');
    setIsEditing(true);
  };

  // Excluir coleção
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta coleção?')) {
      try {
        // TODO: Implementar exclusão real
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCollections(prev => prev.filter(collection => collection.id !== id));
        showToast('Coleção excluída com sucesso', 'success');
      } catch (error) {
        console.error("Erro ao excluir coleção:", error);
        showToast('Erro ao excluir coleção', 'error');
      }
    }
  };

  // Resetar formulário
  const resetForm = () => {
    setName('');
    setDescription('');
    setRepresentativeColor('#3b82f6');
    setCurrentCollection(null);
    setErrors({});
  };

  // Cancelar edição
  const handleCancel = () => {
    setIsEditing(false);
    setCurrentCollection(null);
    resetForm();
  };

  // Enviar formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const collectionData = {
        id: currentCollection?.id || Date.now().toString(),
        name,
        description,
        createdAt: currentCollection?.createdAt || new Date(),
        updatedAt: new Date()
      };

      // TODO: Implementar salvamento real
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (currentCollection) {
        // Atualizar coleção existente
        setCollections(prev => prev.map(collection => 
          collection.id === currentCollection.id ? { ...collection, ...collectionData } : collection
        ));
        showToast('Coleção atualizada com sucesso', 'success');
      } else {
        // Adicionar nova coleção
        setCollections(prev => [...prev, collectionData]);
        showToast('Coleção adicionada com sucesso', 'success');
      }

      handleCancel();
    } catch (error) {
      console.error("Erro ao salvar coleção:", error);
      showToast('Erro ao salvar coleção', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'O nome da coleção é obrigatório';
    }
    
    if (name.trim().length < 3) {
      newErrors.name = 'O nome da coleção deve ter pelo menos 3 caracteres';
    }
    
    if (!representativeColor.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)) {
      newErrors.representativeColor = 'Cor inválida. Use formato hexadecimal (#RRGGBB)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const filteredCollections = collections.filter(collection => 
    collection.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (collection.description && collection.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Colunas da tabela
  const columns = [
    {
      key: 'name',
      header: 'Nome',
      render: (value: any, collection: ColorCollection) => collection.name
    },
    {
      key: 'description',
      header: 'Descrição',
      render: (value: any, collection: ColorCollection) => collection.description || '-'
    },
    {
      key: 'createdAt',
      header: 'Criado em',
      render: (value: any, collection: ColorCollection) => 
        new Date(collection.createdAt).toLocaleDateString('pt-BR')
    }
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }
  
  return (
    <AdminPageLayout
      title={isEditing ? 'Adicionar Nova Coleção' : 'Gerenciar Coleções'}
      actionButton={{
        label: isEditing ? 'Voltar' : 'Adicionar Coleção',
        onClick: isEditing ? handleCancel : handleAddNew,
        show: true
      }}
    >
      {/* Busca */}
      {!isEditing && (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar coleções..."
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-500"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}
      
      {isEditing ? (
        <AdminFormContainer 
          title={currentCollection ? 'Editar Coleção' : 'Nova Coleção'}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        >
          <div className="grid grid-cols-1 gap-6">
            <FormField
              id="name"
              label="Nome da Coleção"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <FormField
              id="description"
              label="Descrição"
              type="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </AdminFormContainer>
      ) : (
        <>
          {/* Exibição em tabela para desktop */}
          <AdminTable
            data={filteredCollections}
            columns={columns}
            emptyText={
              searchTerm
                ? "Nenhuma coleção encontrada para esta busca."
                : "Nenhuma coleção cadastrada."
            }
            actions={{
              onEdit: handleEdit,
              onDelete: (collection: ColorCollection) => handleDelete(collection.id)
            }}
          />
          
          {/* Exibição em cards para mobile */}
          <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredCollections.map((collection) => (
              <AdminItemCard
                key={collection.id}
                title={collection.name}
                content={
                  <div className="flex items-center mt-2">
                    <div 
                      className="h-12 w-12 rounded-lg border border-gray-200 flex-shrink-0 shadow-sm mr-3"
                      style={{ backgroundColor: collection.representativeColor || '#CCCCCC' }}
                    />
                    <div className="text-sm">
                      <div className="font-mono text-slate-500 mb-1">{collection.representativeColor}</div>
                      {collection.description && (
                        <div className="text-gray-600 line-clamp-2">{collection.description}</div>
                      )}
                    </div>
                  </div>
                }
                onEdit={() => handleEdit(collection)}
                onDelete={() => handleDelete(collection.id)}
              />
            ))}
            
            {filteredCollections.length === 0 && (
              <div className="col-span-full text-center py-8">
                <div className="rounded-full bg-slate-100 p-3 mb-4 inline-flex">
                  <FolderOpen className="h-6 w-6 text-slate-400" />
                </div>
                <p className="text-gray-500">
                  {searchTerm
                    ? "Nenhuma coleção encontrada para esta busca."
                    : "Nenhuma coleção cadastrada."}
                </p>
              </div>
            )}
          </div>
        </>
      )}
      
      {/* Contador de resultados */}
      {!isEditing && filteredCollections.length > 0 && (
        <div className="mt-4 text-sm text-gray-500">
          {filteredCollections.length} {filteredCollections.length === 1 ? 'coleção encontrada' : 'coleções encontradas'}
          {searchTerm && ` para "${searchTerm}"`}
        </div>
      )}
    </AdminPageLayout>
  );
}
