"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/router'; // Use 'next/router' em vez de 'next/navigation'

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Realiza a navegação quando o componente é montado
    router.push('/main');
  }, [router]); // Inclua 'router' no array de dependências para corrigir quaisquer avisos de dependência ausente

  return (
    <>
      <p>Redirecionando...</p>
      {/* Você pode incluir outros conteúdos aqui */}
    </>
  );
}
