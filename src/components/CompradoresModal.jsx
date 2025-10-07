import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

export default function CompradoresModal({ rifaId, onClose }) {
  const [compradores, setCompradores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState("todos"); // novo filtro

  useEffect(() => {
    async function carregarCompradores() {
      try {
        const resp = await fetch(
          `${import.meta.env.VITE_API_URL}/admin/rifas/${rifaId}/compradores`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!resp.ok) throw new Error("Erro ao buscar compradores");
        const dados = await resp.json();
        setCompradores(dados);
      } catch (err) {
        console.error("Erro ao carregar compradores:", err);
      } finally {
        setCarregando(false);
      }
    }

    carregarCompradores();
  }, [rifaId]);

  // Aplica filtro
  const compradoresFiltrados =
    filtro === "todos"
      ? compradores
      : compradores.filter((c) => c.status === filtro);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative bg-white rounded-xl shadow-2xl w-[95%] max-w-4xl p-6 max-h-[90vh] flex flex-col">
        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-2xl"
        >
          ✕
        </button>

        {/* Título */}
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          👥 Compradores da Rifa #{rifaId}
        </h2>

        {/* Filtros */}
        <div className="flex justify-center gap-3 mb-4">
          {["todos", "reservado", "pago"].map((tipo) => (
            <button
              key={tipo}
              onClick={() => setFiltro(tipo)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filtro === tipo
                  ? "bg-indigo-600 text-white shadow"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
            >
              {tipo[0].toUpperCase() + tipo.slice(1)}
            </button>
          ))}
        </div>

        {/* Conteúdo */}
        <div className="overflow-y-auto flex-1 border rounded-lg divide-y divide-gray-200 shadow-inner">
          {carregando ? (
            <p className="text-center text-gray-500 py-6">Carregando...</p>
          ) : compradoresFiltrados.length === 0 ? (
            <p className="text-center text-gray-500 py-6">
              Nenhum comprador encontrado.
            </p>
          ) : (
            <table className="w-full text-sm text-gray-700">
              <thead className="sticky top-0 bg-gray-100 text-gray-800">
                <tr>
                  <th className="px-3 py-2 text-left w-10">#</th>
                  <th className="px-3 py-2 text-left">Nº</th>
                  <th className="px-3 py-2 text-left">Nome</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-left">Contato</th>
                </tr>
              </thead>
              <tbody>
                {compradoresFiltrados.map((c, i) => (
                  <tr
                    key={i}
                    className={`border-b last:border-none ${
                      c.status === "pago"
                        ? "bg-green-50"
                        : c.status === "reservado"
                        ? "bg-yellow-50"
                        : ""
                    }`}
                  >
                    {/* 🆕 Coluna de contagem sequencial */}
                    <td className="px-3 py-2 font-semibold text-gray-600">
                      {i + 1}
                    </td>

                    {/* Número da rifa */}
                    <td className="px-3 py-2 font-semibold text-gray-800">
                      {c.numero}
                    </td>

                    {/* Nome */}
                    <td className="px-3 py-2">{c.nome}</td>

                    {/* Status */}
                    <td className="px-3 py-2 capitalize">{c.status}</td>

                    {/* Contato */}
                    <td className="px-3 py-2 text-center">
                      {c.telefone ? (
                        <a
                          href={`https://wa.me/55${c.telefone.replace(
                            /\D/g,
                            ""
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-green-600 hover:text-green-700 transition-transform hover:scale-110 inline-flex items-center justify-center"
                          title={`Enviar mensagem para ${c.nome}`}
                        >
                          <FaWhatsapp size={20} />
                        </a>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
