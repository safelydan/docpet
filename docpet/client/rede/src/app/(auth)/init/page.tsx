import Link from "next/link";
import Image from "next/image";

const Page = () => {
  return (
<div className="note text-center">
  <Image
    src="/cat.svg" // Substitua pelo caminho da sua imagem
    alt="Descrição da imagem"
    width={800} // Largura da imagem
    height={600} // Altura da imagem
  />

  <h1 className="text m-2" style={{ color: "#21344d", fontSize: "20px", fontWeight: "bold", fontStyle: "italic", alignItems: 'center' }}>Seja bem-vindo ao CodPet</h1>
  <p className="teste" style={{ color: "#21344d", fontSize: "16px", fontStyle: "italic", alignItems: 'center' }}>Seja bem-vindo ao CodPet, sua plataforma online onde oferecemos suporte para a divulgação de animais perdidos ou para adoção</p>

  <div className="flex justify-center flex-wrap">
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold m-2 px-4 py-2 rounded-md transition duration-300 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
      style={{ fontSize: '1.5rem', width: '160px', fontFamily: 'Arial' }}>
      <Link href="/login">Entrar</Link>
    </button>

    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold m-2 px-4 py-2 rounded-md transition duration-300 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
      style={{ fontSize: '1.5rem', width: '160px', fontFamily: 'Arial' }}>
      <Link href="/register">Cadastrar-se</Link>
    </button>
  </div>
</div>

  );
};

export default Page;