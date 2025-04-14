'use client';

import { useState, useEffect } from 'react';
import { Store } from '@/data/types';
import { useToast } from '@/components/ToastProvider';
import { storeService } from '@/services/localDataService';
import AdminPageLayout from '@/components/AdminPageLayout';
import AdminFormContainer from '@/components/AdminFormContainer';
import FormField from '@/components/FormField';
import AdminItemCard from '@/components/AdminItemCard';
import AdminTable from '@/components/AdminTable';

export default function AdminStoresPage() {
  const { showToast } = useToast();
  const [storesList, setStoresList] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStore, setCurrentStore] = useState<Store | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Dados do formulário
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [hours, setHours] = useState('');
  const [isActive, setIsActive] = useState(true);
  
  useEffect(() => {
    async function init() {
      try {
        // Carregar lojas
        const stores = await storeService.getAll();
        setStoresList(stores);
      } catch (error) {
        console.error('Erro ao inicializar a página de lojas:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    init();
  }, []);

  // Adicionar nova loja
  const handleAddNew = () => {
    setIsEditing(true);
    setCurrentStore(null);
    resetForm();
  };

  // Editar loja existente
  const handleEdit = (store: Store) => {
    setCurrentStore(store);
    setName(store.name);
    setCity(store.city);
    setPhone(store.phone || '');
    setHours(store.hours || '');
    setIsActive(store.isActive !== false);
    setIsEditing(true);
  };

  // Excluir loja
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta loja?')) {
      try {
        const success = await storeService.delete(id);
        
        if (success) {
          setStoresList(storesList.filter(s => s.id !== id));
          showToast('Loja excluída com sucesso!', 'success');
        } else {
          showToast('Erro ao excluir loja. Tente novamente.', 'error');
        }
      } catch (error) {
        console.error('Erro ao excluir loja:', error);
        showToast('Ocorreu um erro inesperado. Tente novamente.', 'error');
      }
    }
  };

  // Resetar formulário
  const resetForm = () => {
    setName('');
    setCity('');
    setPhone('');
    setHours('');
    setIsActive(true);
  };

  // Cancelar edição
  const handleCancel = () => {
    setIsEditing(false);
    setCurrentStore(null);
    resetForm();
  };

  // Submeter formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      const storeData = {
        name,
        city,
        phone,
        hours,
        isActive
      };
      
      if (currentStore) {
        // Atualizar loja existente
        const updatedStore = await storeService.update(currentStore.id, storeData);
        
        if (updatedStore) {
          // Atualizar a lista local
          setStoresList(storesList.map(s => 
            s.id === currentStore.id ? { ...s, ...storeData } : s
          ));
          
          showToast(`Loja "${name}" atualizada com sucesso!`, 'success');
        } else {
          showToast('Erro ao atualizar loja. Tente novamente.', 'error');
        }
      } else {
        // Adicionar nova loja
        const newStore = await storeService.add(storeData);
        
        if (newStore) {
          setStoresList([...storesList, newStore]);
          showToast(`Loja "${name}" adicionada com sucesso!`, 'success');
        } else {
          showToast('Erro ao adicionar loja. Tente novamente.', 'error');
        }
      }
      
      setIsEditing(false);
      setCurrentStore(null);
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar loja:', error);
      showToast('Ocorreu um erro inesperado. Tente novamente.', 'error');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Configuração das colunas da tabela
  const columns = [
    {
      header: 'Nome',
      key: 'name'
    },
    {
      header: 'Cidade',
      key: 'city'
    },
    {
      header: 'Telefone',
      key: 'phone'
    },
    {
      header: 'Horário',
      key: 'hours'
    },
    {
      header: 'Status',
      key: 'isActive',
      render: (value: boolean) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value !== false ? 'Ativa' : 'Inativa'}
        </span>
      )
    }
  ];
  
  // Renderização da página
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }
  
  return (
    <AdminPageLayout 
      title="Gerenciar Lojas"
      actionButton={{
        label: "Adicionar Nova Loja",
        onClick: handleAddNew,
        show: !isEditing
      }}
    >
      {isEditing ? (
        <AdminFormContainer
          title={currentStore ? 'Editar Loja' : 'Nova Loja'}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          submitLabel={currentStore ? 'Atualizar' : 'Salvar'}
          isSubmitting={submitting}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <FormField
              type="text"
              id="name"
              label="Nome da Loja"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            
            <FormField
              type="tel"
              id="phone"
              label="Telefone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            
            <FormField
              type="text"
              id="city"
              label="Cidade"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
            
            <FormField
              type="text"
              id="hours"
              label="Horário de Funcionamento"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="Segunda a Sábado: 8h às 18h"
            />
            
            <FormField
              type="checkbox"
              id="isActive"
              label="Loja em funcionamento"
              checked={isActive}
              onChange={() => setIsActive(!isActive)}
              gridSpan="full"
            />
          </div>
        </AdminFormContainer>
      ) : (
        <>
          {/* Exibição em tabela para desktop */}
          <AdminTable
            columns={columns}
            data={storesList}
            actions={{
              onEdit: handleEdit,
              onDelete: (store) => handleDelete(store.id)
            }}
            emptyText="Nenhuma loja cadastrada."
          />
          
          {/* Exibição em cards para mobile */}
          <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-6">
            {storesList.map((store) => (
              <AdminItemCard
                key={store.id}
                title={store.name}
                subtitle={`Cidade: ${store.city}`}
                content={
                  <>
                    <p className="text-lg text-gray-600 mb-1">
                      <span className="font-medium">Telefone:</span> {store.phone}
                    </p>
                    {store.hours && (
                      <p className="text-lg text-gray-600">
                        <span className="font-medium">Horário:</span> {store.hours}
                      </p>
                    )}
                  </>
                }
                status={{
                  label: store.isActive !== false ? 'Ativa' : 'Inativa',
                  isActive: store.isActive !== false
                }}
                onEdit={() => handleEdit(store)}
                onDelete={() => handleDelete(store.id)}
              />
            ))}
            
            {storesList.length === 0 && (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">Nenhuma loja cadastrada.</p>
              </div>
            )}
          </div>
        </>
      )}
    </AdminPageLayout>
  );
}
