
import Link from "next/link";

function Login() {
    return (
        <main className="bg-[url('https://img.freepik.com/fotos-gratis/fundo-azul-do-gradiente-de-luxo-abstrato-liso-azul-escuro-com-vinheta-preta-studio-banner_1258-52379.jpg?w=996&t=st=1694711816~exp=1694712416~hmac=6798a3edc00a928449db3af875eae73980cab873a28b80c3fd708b7362f41148')] bg-no-repeat bg-cover flex min-h-screen flex-col items-center justify-center">
            <form className="flex flex-col bg-white px-6 py-14 rounded-2xl gap-11 ">
                <h1 className="font-bold text-2lx">login</h1>
                <div className="flex flex-col justify-between items-start">
                    <label htmlFor="email" >email</label>
                    <input type="text" id= 'email' className="border-gray-6400 border-b w-full focus-visible:border-gray-700 focus-visible:border-b focus-visible:outline-none" />
                </div>
                <div className="flex flex-col justify-between items-start">
        	        <label htmlFor="password" ></label>
                    <input type="password" id= 'password' className="border-gray-6400 border-b w-full focus-visible:border-gray-700 focus-visible:border-b focus-visible:outline-none" />
                </div>
                <button>entrar</button>
                <Link href= '/register'>cadastrar</Link>

            </form>
        </main>
    )
}

export default Login;