'use client';

import { useState, useEffect } from 'react';
import { Seller, Store } from '@/data/types';
import { useToast } from '@/components/ToastProvider';
import { sellerService, storeService } from '@/services/localDataService';
import AdminPageLayout from '@/components/AdminPageLayout';
import AdminFormContainer from '@/components/AdminFormContainer';
import FormField from '@/components/FormField';
import AdminItemCard from '@/components/AdminItemCard';
import AdminTable from '@/components/AdminTable';

export default function AdminSellersPage() {
  const { showToast } = useToast();
  const [sellersList, setSellersList] = useState<Seller[]>([]);
  const [storesList, setStoresList] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSeller, setCurrentSeller] = useState<Seller | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Dados do formulário
  const [name, setName] = useState('');
  const [storeId, setStoreId] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isActive, setIsActive] = useState(true);
  
  useEffect(() => {
    async function init() {
      try {
        // Carregar vendedores e lojas
        const sellers = await sellerService.getAll();
        setSellersList(sellers);
        
        const stores = await storeService.getAll();
        setStoresList(stores);
      } catch (error) {
        console.error('Erro ao inicializar a página de vendedores:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    init();
  }, []);

  // Adicionar novo vendedor
  const handleAddNew = () => {
    setIsEditing(true);
    setCurrentSeller(null);
    resetForm();
  };

  // Editar vendedor existente
  const handleEdit = (seller: Seller) => {
    setCurrentSeller(seller);
    setName(seller.name);
    setStoreId(seller.storeId);
    setWhatsapp(seller.whatsapp);
    setIsActive(seller.isActive !== false);
    setIsEditing(true);
  };

  // Excluir vendedor
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este vendedor?')) {
      try {
        const success = await sellerService.delete(id);
        
        if (success) {
          setSellersList(sellersList.filter(s => s.id !== id));
          showToast('Vendedor excluído com sucesso!', 'success');
        } else {
          showToast('Erro ao excluir vendedor. Tente novamente.', 'error');
        }
      } catch (error) {
        console.error('Erro ao excluir vendedor:', error);
        showToast('Ocorreu um erro inesperado. Tente novamente.', 'error');
      }
    }
  };

  // Resetar formulário
  const resetForm = () => {
    setName('');
    setStoreId('');
    setWhatsapp('');
    setIsActive(true);
  };

  // Cancelar edição
  const handleCancel = () => {
    setIsEditing(false);
    setCurrentSeller(null);
    resetForm();
  };

  // Submeter formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      const sellerData = {
        name,
        storeId,
        whatsapp,
        isActive
      };
      
      if (currentSeller) {
        // Atualizar vendedor existente
        const updatedSeller = await sellerService.update(currentSeller.id, sellerData);
        
        if (updatedSeller) {
          // Atualizar a lista local
          setSellersList(sellersList.map(s => 
            s.id === currentSeller.id ? { ...s, ...sellerData } : s
          ));
          
          showToast(`Vendedor "${name}" atualizado com sucesso!`, 'success');
        } else {
          showToast('Erro ao atualizar vendedor. Tente novamente.', 'error');
        }
      } else {
        // Adicionar novo vendedor
        const newSeller = await sellerService.add(sellerData);
        
        if (newSeller) {
          setSellersList([...sellersList, newSeller]);
          showToast(`Vendedor "${name}" adicionado com sucesso!`, 'success');
        } else {
          showToast('Erro ao adicionar vendedor. Tente novamente.', 'error');
        }
      }
      
      setIsEditing(false);
      setCurrentSeller(null);
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar vendedor:', error);
      showToast('Ocorreu um erro inesperado. Tente novamente.', 'error');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Obter nome da loja pelo ID
  const getStoreName = (id: string) => {
    const store = storesList.find(store => store.id === id);
    return store ? store.name : 'Loja não encontrada';
  };

  // Preparar opções de lojas para o select
  const storeOptions = storesList.map(store => ({
    value: store.id,
    label: `${store.name} - ${store.city}`
  }));
  
  // Configuração das colunas da tabela
  const columns = [
    {
      header: 'Nome',
      key: 'name'
    },
    {
      header: 'Loja',
      key: 'storeId',
      render: (value: string) => getStoreName(value)
    },
    {
      header: 'WhatsApp',
      key: 'whatsapp'
    },
    {
      header: 'Status',
      key: 'isActive',
      render: (value: boolean) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value !== false ? 'Ativo' : 'Inativo'}
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
      title="Gerenciar Vendedores"
      actionButton={{
        label: "Adicionar Novo Vendedor",
        onClick: handleAddNew,
        show: !isEditing
      }}
    >
      {isEditing ? (
        <AdminFormContainer
          title={currentSeller ? 'Editar Vendedor' : 'Novo Vendedor'}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          submitLabel={currentSeller ? 'Atualizar' : 'Salvar'}
          isSubmitting={submitting}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <FormField
              type="text"
              id="name"
              label="Nome do Vendedor"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            
            <FormField
              type="select"
              id="storeId"
              label="Loja"
              value={storeId}
              onChange={(e) => setStoreId(e.target.value)}
              options={storeOptions}
              emptyOption="Selecione uma loja"
              required
            />
            
            <FormField
              type="tel"
              id="whatsapp"
              label="WhatsApp"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="+5511999999999"
              required
            />
            
            <FormField
              type="checkbox"
              id="isActive"
              label="Vendedor Ativo"
              checked={isActive}
              onChange={() => setIsActive(!isActive)}
            />
          </div>
        </AdminFormContainer>
      ) : (
        <>
          {/* Exibição em tabela para desktop */}
          <AdminTable
            columns={columns}
            data={sellersList}
            actions={{
              onEdit: handleEdit,
              onDelete: (seller) => handleDelete(seller.id)
            }}
            emptyText="Nenhum vendedor cadastrado."
          />
          
          {/* Exibição em cards para mobile */}
          <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-6">
            {sellersList.map((seller) => (
              <AdminItemCard
                key={seller.id}
                title={seller.name}
                subtitle={`Loja: ${getStoreName(seller.storeId)}`}
                content={
                  <p className="text-lg text-gray-600">
                    <span className="font-medium">WhatsApp:</span> {seller.whatsapp}
                  </p>
                }
                status={{
                  label: seller.isActive !== false ? 'Ativo' : 'Inativo',
                  isActive: seller.isActive !== false
                }}
                onEdit={() => handleEdit(seller)}
                onDelete={() => handleDelete(seller.id)}
              />
            ))}
            
            {sellersList.length === 0 && (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">Nenhum vendedor cadastrado.</p>
              </div>
            )}
          </div>
        </>
      )}
    </AdminPageLayout>
  );
} 