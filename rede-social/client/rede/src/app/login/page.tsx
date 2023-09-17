"use client"
import axios from "axios";
import Link from "next/link";
import { useState } from "react";

function Login() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin= (e:any)=>{
        e.preventDefault()
        axios.post("http://localhost:8001/api/auth/login", {email, password}).then((res)=>{
            console.log(res.data)
        }).catch((err)=>{
            console.log(err)
        })
    }

    return (
        <main className="bg-[url('https://img.freepik.com/fotos-gratis/fundo-azul-do-gradiente-de-luxo-abstrato-liso-azul-escuro-com-vinheta-preta-studio-banner_1258-52379.jpg?w=996&t=st=1694711816~exp=1694712416~hmac=6798a3edc00a928449db3af875eae73980cab873a28b80c3fd708b7362f41148')] bg-no-repeat bg-cover flex min-h-screen flex-col items-center justify-center">
            <form className="flex flex-col bg-white px-6 py-14 rounded-2xl gap-11">
                <h1 className="font-bold text-2lx">login</h1>
                <div className="flex flex-col justify-between items-start">
                    <label htmlFor="email" >email</label>
                    <input type="text" 
                    id= 'email' 
                    onChange={(e)=>setEmail(e.currentTarget.value)}
                    className="border-gray-6400 border-b w-full focus-visible:border-gray-700 focus-visible:border-b focus-visible:outline-none" />
                </div>
                <div className="flex flex-col justify-between items-start">
        	        <label htmlFor="password" >password</label>
                    <input type="password" 
                    id= 'password' 
                    onChange={(e)=>setPassword(e.currentTarget.value)}
                    className="border-gray-6400 border-b w-full focus-visible:border-gray-700 focus-visible:border-b focus-visible:outline-none" />
                </div>
                <button className="bg-blue-400 py-3 font-bold text-white rounded-lg hover:bg-blue-600" onClick={(e)=>handleLogin(e)}>entrar</button>
                <Link href='/register' className="text-center underline"  >cadastrar</Link>

            </form>
        </main>
    )
}

export default Login;