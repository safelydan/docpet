import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

// Interface para as propriedades do componente AuthInput
interface AuthInputProps {
  newState: (state: string) => void; // Função para atualizar o estado no componente pai
  label: string; // Rótulo do campo de entrada
  isPassword?: boolean; // Indica se o campo é para senha (opcional, padrão é falso)
}

function AuthInput({ newState, label, isPassword = false }: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false); // Controle da visibilidade da senha

  return (
    <div className="flex flex-col justify-between items-start my-4">
      <label className="text-lg font-medium text-gray-700">{label}</label>
      <div className="relative w-full">
        <input
          type={isPassword && !showPassword ? "password" : "text"} // Alterna entre "password" e "text"
          onChange={(e) => newState(e.currentTarget.value)}
          className="border border-gray-300 
            focus:ring-2 focus:ring-blue-500 focus:outline-none
            rounded-lg p-3 w-full 
            transition duration-300 ease-in-out 
            hover:border-gray-500"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)} // Alterna o estado de visibilidade da senha
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
          >
            {showPassword ? <FaEyeSlash className="text-xl" /> : <FaEye />}{" "}
          </button>
        )}
      </div>
    </div>
  );
}

export default AuthInput;
