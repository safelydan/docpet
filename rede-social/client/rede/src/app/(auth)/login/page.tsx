"use client"

import Link from "next/link";
import { useState } from "react";
import AuthInput from "../../components/AuthInput";
import { makeRequest } from "../../../../axios";
import { useRouter } from "next/navigation";

function Login() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    
    const router = useRouter()
    const handleLogin= (e:any)=>{
        e.preventDefault()
        makeRequest.post("http://localhost:8001/api/auth/login", {email, password})
        .then((res)=>{
            localStorage.setItem('rede: user', JSON.stringify(res.data.user))
            setError('')
            router.push('/')
        }).catch((err)=>{
            console.log(err)
            setError(err.response.msg)
        })
    }

    return (
        <> 
                <h1 className="font-bold text-2lx">login</h1>
                <AuthInput label="email: " newState={setEmail}/>
                <AuthInput label="senha: " newState={setPassword} isPassword/>
                {error.length>0 && <span className="text-red-600">* {error}</span>}
                <button className="bg-blue-400 py-3 font-bold text-white rounded-lg hover:bg-blue-600" 
                onClick={(e)=>handleLogin(e)}>entrar</button>
                <Link href='/register' className="text-center underline">criar uma conta</Link>
        </>
    )
}

export default Login;