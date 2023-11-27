import Link from "next/link";
import Image from "next/image";

const Page = () => {
  return (
    <div className="bg-gray-100 p-8 rounded-lg shadow-md text-center">
    <Image
      src="/cat.svg" // Substitua pelo caminho da sua imagem
      alt="Descrição da imagem"
      width={800} // Largura da imagem
      height={600} // Altura da imagem
    />

    <h1 className="text-4xl font-bold italic text-blue-800 mb-2">Seja bem-vindo ao CodPet</h1>
    <p className="text-xl italic text-blue-800 mb-6">Sua rede de amizades para pets</p>

    <div className="flex justify-center gap-4">
      <button className="btn-blue">
        <Link href="/login">Entrar</Link>
      </button>

      <button className="btn-blue">
        <Link href="/register">Cadastrar-se</Link>
      </button>
    </div>
  </div>
);

};

export default Page;
