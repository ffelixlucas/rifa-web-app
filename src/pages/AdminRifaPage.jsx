import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NumeroModal from "../components/NumeroModal.jsx";

function AdminRifaPage() {
  const { id } = useParams();
  const [rifa, setRifa] = useState(null);
  const [numeros, setNumeros] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [modalAberto, setModalAberto] = useState(false);
  const [numeroSelecionado, setNumeroSelecionado] = useState(null);

  useEffect(() => {
    async function carregarDados() {
      try {
        const resRifa = await fetch(
          `${import.meta.env.VITE_API_URL}/admin/rifas/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!resRifa.ok) {
          const erroTexto = await resRifa.text();
          throw new Error(`Erro ao buscar rifa: ${resRifa.status} - ${erroTexto}`);
        }

        const dadosRifa = await resRifa.json();
        setRifa(dadosRifa);

        const resNumeros = await fetch(
          `${import.meta.env.VITE_API_URL}/rifas/${id}/numeros`
        );
        const dadosNumeros = await resNumeros.json();
        setNumeros(dadosNumeros);
      } catch (error) {
        console.error("Erro ao carregar dados da rifa:", error);

        if (error.message.includes("401") || error.message.includes("403")) {
          localStorage.removeItem("token");
          window.location.href = "/admin/login";
        }
      }
    }

    carregarDados();
  }, [id]);

  const numerosFiltrados =
    filtroStatus === "todos"
      ? numeros
      : numeros.filter((num) => num.status === filtroStatus);

  if (!rifa) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-t-indigo-600 border-gray-300"></div>
          <p className="text-base font-medium text-gray-600">
            Carregando rifa...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                {rifa.titulo}
              </h1>
              <p className="mt-1 text-sm text-gray-500 sm:text-base">
                Total de Números:{" "}
                <span className="font-medium">{rifa.totalnumeros}</span>
              </p>
            </div>
            <a
              href={`/admin/rifa/${id}/sorteio`}
              className="inline-block rounded-md bg-green-600 px-4 py-2 text-white font-medium text-sm hover:bg-green-700 transition"
            >
              🎉 Sortear Ganhador
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {["todos", "disponivel", "reservado", "pago"].map((status) => (
            <button
              key={status}
              onClick={() => setFiltroStatus(status)}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                filtroStatus === status
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {status[0].toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 pb-6 sm:px-6">
        <div className="grid grid-cols-8 gap-2 sm:grid-cols-10 lg:grid-cols-12 lg:gap-4">
          {numerosFiltrados.map((num) => (
            <div className="relative" key={num.id}>
              <div
                onClick={() => {
                  setNumeroSelecionado(num);
                  setModalAberto(true);
                }}
                className={`cursor-pointer w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-md p-1 text-center shadow-sm transition-all duration-200 hover:shadow-md flex flex-col items-center justify-center
                  ${
                    num.status === "disponivel"
                      ? "bg-white border border-gray-200 text-gray-800"
                      : num.status === "reservado"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
              >
                {num.status === "pago" && (
                  <div className="text-[10px] font-medium leading-none">
                    {num.nome}
                  </div>
                )}
                <div className="text-[12px] font-bold leading-tight">
                  {num.numero}
                </div>
              </div>
            </div>
          ))}

          {modalAberto && (
            <NumeroModal
              numero={numeroSelecionado}
              onClose={() => setModalAberto(false)}
              onSalvar={async () => {
                const res = await fetch(
                  `${import.meta.env.VITE_API_URL}/rifas/${id}/numeros`
                );
                const dados = await res.json();
                setNumeros(dados);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminRifaPage;
