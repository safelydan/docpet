"use client"
import AuthPage from "../components/AuthPage"
import AuthInput from "../components/AuthInput"
import {useState } from "react"
import Link from "next/link"
import axios from "axios"




function Register(){

    const[username, setUserName] = useState('')
    const[email, setEmail] = useState('')
    const[password, setPassword ] =useState('')
    const[confirmPassword, setConfirmPassword ] =useState('')


    const handleRegister = (e:any)=>{
        e.preventDefault()
        axios.post("http://localhost:8001/api/auth/register", {username, email, password, confirmPassword}).then((res)=>{
            console.log(res.data)
        }).catch((err)=>{
            console.log(err)
        })
    }

    return(
        <AuthPage>
        <h1 className="font-bold text-2xl">Registrar</h1>
        <AuthInput label="nome" newState={setUserName}/>
        <AuthInput label="email" newState={setEmail}/>
        <AuthInput label="senha" newState={setPassword} isPassword/>
        <AuthInput label="confirme sua senha" newState={setConfirmPassword}isPassword/>
        <button className="bg-blue-400 py-3 font-bold text-white rounded-lg hover:bg-blue-600" 
                onClick={(e)=>handleRegister(e)}>cadastrar</button>
                <Link href='/register' className="text-center underline">logar</Link>
        </AuthPage>
        )
    }

export default Register