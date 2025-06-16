import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PagamentoModal from "../components/PagamentoModal.jsx";
import PremioModal from "../components/PremioModal.jsx";

function RifaPage() {
  const { id } = useParams();
  const [rifa, setRifa] = useState(null);
  const [numeros, setNumeros] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [numeroSelecionado, setNumeroSelecionado] = useState(null);
  const [modalPremioAberto, setModalPremioAberto] = useState(false);

  async function carregarDados() {
    console.log("⏰ Rodando carregarDados()");
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

  useEffect(() => {
    let intervalo;

    function iniciarAtualizacao() {
      intervalo = setInterval(() => {
        console.log("🔁 Atualizando rifa (aba visível)");
        carregarDados();
      }, 15000);
    }

    function pararAtualizacao() {
      console.log("⏸️ Parando atualizações (aba invisível)");
      clearInterval(intervalo);
    }

    function verificarVisibilidade() {
      if (document.visibilityState === "visible") {
        iniciarAtualizacao();
      } else {
        pararAtualizacao();
      }
    }

    carregarDados();
    verificarVisibilidade();
    document.addEventListener("visibilitychange", verificarVisibilidade);

    return () => {
      clearInterval(intervalo);
      document.removeEventListener("visibilitychange", verificarVisibilidade);
    };
  }, [id]);

  if (!rifa) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">Carregando rifa...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
            {rifa.titulo}
          </h1>

          <p className="text-sm sm:text-base text-gray-700 mb-1">
            <span className="font-semibold">📅 Sorteio:</span>{" "}
            {rifa.datasorteio
              ? new Date(rifa.datasorteio).toLocaleDateString("pt-BR")
              : "A definir"}
          </p>

          <p className="text-sm sm:text-base text-gray-700 mb-3">
            <span className="font-semibold">Valor por número: R$</span>{" "}
            <span className="text-green-600 font-bold">{rifa.valornumero}</span>
          </p>

          <button
            onClick={() => setModalPremioAberto(true)}
            className="inline-block mt-2 text-sm font-medium text-blue-600 hover:underline transition"
          >
            🎁 Ver prêmios
          </button>
        </div>

        <div className="grid grid-cols-8 gap-2 sm:grid-cols-10 lg:grid-cols-12 lg:gap-4">
          {numeros.map((num) => (
            <div className="relative" key={num.id}>
              <div
                onClick={() => {
                  if (num.status === "disponivel") {
                    setNumeroSelecionado(num);
                    setModalAberto(true);
                  }
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
                  <div className="text-[10px] font-medium leading-none text-gray-800">
                    {num.nome}
                  </div>
                )}
                <div className="text-[12px] font-bold leading-tight">
                  {num.numero}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modalAberto && (
        <PagamentoModal
          numero={numeroSelecionado}
          rifa={rifa}
          onClose={() => setModalAberto(false)}
        />
      )}
      {modalPremioAberto && (
        <PremioModal
          imagem={rifa.imagemurl}
          descricaoPremio={rifa.descricaopremio}
          onClose={() => setModalPremioAberto(false)}
        />
      )}
    </div>
  );
}

export default RifaPage;
