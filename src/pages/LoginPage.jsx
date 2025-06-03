import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      const token = await login(email, senha);
      localStorage.setItem("token", token);
      navigate("/admin"); // redireciona para a próxima tela (em breve)
    } catch (err) {
      setErro("Credenciais inválidas. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Login Admin</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {erro && <p className="text-red-600 text-sm">{erro}</p>}

          <button
            type="submit"
            className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
