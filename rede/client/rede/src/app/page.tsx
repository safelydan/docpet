"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // executa a navegação quando o componente é montado
    router.push('/main');
  }, [router]); //inclui 'router' no array de dependências para corrigir possíveis avisos de dependência ausente

  return (
    <>
      <p>redirecionando</p>
    </>
  );
}
