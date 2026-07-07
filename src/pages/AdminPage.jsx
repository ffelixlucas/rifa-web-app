import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderAdmin from "../components/HeaderAdmin.jsx";
import RifaCard from "../components/RifaCard";
import { listarRifasAdmin } from "../services/rifaApi";
import { authService } from "../services/authService";

function AdminPage() {
  const [rifas, setRifas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleDelete = (idRifaExcluida) => {
    setRifas((rifasAtuais) => rifasAtuais.filter((r) => r.id !== idRifaExcluida));
  };
  

  useEffect(() => {
    async function carregarRifas() {
      try {
        setLoading(true);
        setErro("");
        const dados = await listarRifasAdmin();
        setRifas(dados);
      } catch (err) {
        if (err.status === 401) {
          authService.removeToken();
          navigate("/admin/login");
          return;
        }
        setErro(err.message || "Erro ao carregar rifas.");
      } finally {
        setLoading(false);
      }
    }

    carregarRifas();
  }, [navigate]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <HeaderAdmin />

      <div className="max-w-5xl mx-auto p-4">
        <h1 className="text-xl font-bold mb-4 text-center text-gray-800">
          Minhas Rifas
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Carregando suas rifas...</p>
        ) : erro ? (
          <p className="text-center text-red-600">{erro}</p>
        ) : rifas.length === 0 ? (
          <p className="text-center text-gray-500">Nenhuma rifa encontrada.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rifas.map((rifa) => (
              <RifaCard key={rifa.id} rifa={rifa} onDelete={handleDelete} />
            ))}
          </div>
        )}
        {/* 🔥 Botão flutuante de criar */}
        <button
          onClick={() => navigate("/admin/criar-rifa")}
          className="fixed bottom-5 right-5 z-50 rounded-full bg-green-600 p-4 shadow-lg hover:bg-green-700 transition"
          title="Criar nova rifa"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="white"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default AdminPage;
