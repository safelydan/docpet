"use client"
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import AuthPage from "../components/AuthPage";
import AuthInput from "../components/AuthInput";

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
        <AuthPage> 
                <h1 className="font-bold text-2lx">login</h1>
                <AuthInput label="Email: " newState={setEmail}/>
                <AuthInput label="Password: " newState={setPassword} isPassword/>
                <button className="bg-blue-400 py-3 font-bold text-white rounded-lg hover:bg-blue-600" 
                onClick={(e)=>handleLogin(e)}>entrar</button>
                <Link href='/register' className="text-center underline"  >cadastrar</Link>
        </AuthPage>
    )
}

export default Login;