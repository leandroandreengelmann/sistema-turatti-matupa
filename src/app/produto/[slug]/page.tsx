import { Metadata } from 'next';
import { getProductBySlug } from '@/data/products';
import { notFound } from 'next/navigation';
import ProductImageGallery from '@/components/ProductImageGallery';
import ProductDetails from '@/components/ProductDetails';
import Breadcrumb from '@/components/Breadcrumb';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  
  if (!product) {
    return {
      title: 'Produto não encontrado',
    };
  }
  
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);
  
  if (!product) {
    notFound();
  }
  
  // Informações para o breadcrumb
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Produtos', href: '/produtos' },
    { label: product.name, href: `/produto/${params.slug}`, isCurrent: true }
  ];
  
  return (
    <main className="container mx-auto px-4">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
        <div className="md:col-span-7">
          <ProductImageGallery 
            images={product.images} 
            productName={product.name}
            discount={product.discountPercentage} 
          />
        </div>
        
        <div className="md:col-span-5">
          <ProductDetails product={product} />
        </div>
      </div>
    </main>
  );
} 