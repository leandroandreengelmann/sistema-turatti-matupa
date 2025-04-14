"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import EditProductPage from "../page";

export default function EditExistingProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    // Carregar dados do produto pelo ID
    // Por enquanto, apenas redireciona para a página de edição
    router.replace(`/admin/products/edit?id=${id}`);
  }, [id, router]);

  return <EditProductPage />;
} 