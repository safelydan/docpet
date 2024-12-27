// Interface para as propriedades do componente AuthInput
interface AuthInputProps {
  newState: (state: string) => void; // Função para atualizar o estado no componente pai
  label: string; // Rótulo do campo de entrada
  isPassword?: boolean; // Indica se o campo é para senha (opcional, padrão é falso)
}

function AuthInput(props: AuthInputProps) {
  return (
    <div className="flex flex-col justify-between items-start">
      <label className="text-lg font-medium text-gray-700">{props.label}</label>
      <input
        type={props.isPassword ? "password" : "text"}
        onChange={(e) => props.newState(e.currentTarget.value)}
        className="          border border-gray-300 
          focus:ring-2 focus:ring-blue-500 focus:outline-none
          rounded-lg p-3 w-full 
          transition duration-300 ease-in-out 
          hover:border-gray-500"
      />
    </div>
  );
}

export default AuthInput;
