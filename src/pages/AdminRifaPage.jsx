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
          `${import.meta.env.VITE_API_URL}/rifas/${id}`
        );
        const dadosRifa = await resRifa.json();
        setRifa(dadosRifa);

        const resNumeros = await fetch(
          `${import.meta.env.VITE_API_URL}/rifas/${id}/numeros`
        );
        const dadosNumeros = await resNumeros.json();
        setNumeros(dadosNumeros);
      } catch (error) {
        console.error("Erro ao carregar dados da rifa:", error);
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
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {rifa.titulo}
          </h1>
          <p className="mt-1 text-sm text-gray-500 sm:text-base">
            Total de Números:{" "}
            <span className="font-medium">{rifa.totalNumeros}</span>
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFiltroStatus("todos")}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              filtroStatus === "todos"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFiltroStatus("disponivel")}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              filtroStatus === "disponivel"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Disponível
          </button>
          <button
            onClick={() => setFiltroStatus("reservado")}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              filtroStatus === "reservado"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Reservado
          </button>
          <button
            onClick={() => setFiltroStatus("pago")}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              filtroStatus === "pago"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Pago
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 pb-6 sm:px-6">
        <div className="grid grid-cols-8 gap-2 sm:grid-cols-10">
          {numerosFiltrados.map((num) => (
            <div className="relative" key={num.id}>
              <div
                onClick={() => {
                  setNumeroSelecionado(num);
                  setModalAberto(true);
                }}
                className={`cursor-pointer w-10 h-10 sm:w-11 sm:h-11 rounded-md p-1 text-center shadow-sm transition-all duration-200 hover:shadow-md flex flex-col items-center justify-center
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
