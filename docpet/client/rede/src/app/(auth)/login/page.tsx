"use client";

import Link from "next/link";
import { useContext, useState } from "react";
import AuthInput from "../../components/AuthInput";
import { makeRequest } from "../../../../axios";
import { useRouter } from "next/navigation";
import UserContext from "@/context/UserContext";

function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("teste123");
  const [error, setError] = useState("");
  const { setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // função para identificar se é email ou username
  const isEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // regex pra validar email
    return emailRegex.test(value);
  };

  const handleLogin = (e: any) => {
    e.preventDefault();
    setLoading(true);

    // determinar o tipo de dado (email ou username)
    const data = isEmail(identifier)
      ? { email: identifier, password }
      : { username: identifier, password };

    makeRequest
      .post("auth/login", data)
      .then((res) => {
        localStorage.setItem("rede: user", JSON.stringify(res.data.user));
        setUser(res.data.user);
        setError("");
        router.push("/main");
      })
      .catch((err) => {
        console.log(err);
        setError(err.response.data?.msg || "Erro ao fazer login.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <title>Login</title>
      <h1 className="font-bold text-2xl text-center">Login</h1>
      <AuthInput
        label="Email ou Username: "
        newState={setIdentifier} // Um único input para email ou username
      />
      <AuthInput label="Senha: " newState={setPassword} isPassword />
      {error.length > 0 && <span className="text-red-600">* {error}</span>}
      <button
        className="bg-blue-800 py-3 font-bold text-white rounded-lg hover:bg-blue-600"
        onClick={(e) => handleLogin(e)}
        disabled={loading}
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>
      <Link href="/register" className="text-center">
        <p className="text-center color:#0000">Ainda não possui uma conta?</p>
        <strong>Criar uma conta</strong>
      </Link>
    </>
  );
}

export default Login;
