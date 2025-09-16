// src/pages/RifaPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PagamentoModal from "../components/PagamentoModal.jsx";
import PremioModal from "../components/PremioModal.jsx";
import ErrorBoundary from "../components/ErrorBoundary.jsx";

function RifaPage() {
  const { id } = useParams();
  const [rifa, setRifa] = useState(null);
  const [numeros, setNumeros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [numeroSelecionado, setNumeroSelecionado] = useState(null);
  const [modalPremioAberto, setModalPremioAberto] = useState(false);
  const [tooltip, setTooltip] = useState("");

  async function carregarDados() {
    try {
      setLoading(true);
      const resRifa = await fetch(`${import.meta.env.VITE_API_URL}/rifas/${id}`);
      const dadosRifa = await resRifa.json();
      setRifa(dadosRifa);

      const resNumeros = await fetch(
        `${import.meta.env.VITE_API_URL}/rifas/${id}/numeros`
      );
      const dadosNumeros = await resNumeros.json();
      setNumeros(dadosNumeros);
      document.title = dadosRifa.titulo || "Rifa";
    } catch (error) {
      console.error("Erro ao carregar dados da rifa:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let intervalo;
    function iniciarAtualizacao() {
      intervalo = setInterval(() => {
        carregarDados();
      }, 15000);
    }
    function pararAtualizacao() {
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

  return (
    <ErrorBoundary label="RifaPage">
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white relative">
        {/* Overlay de Loading */}
        {loading && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-30">
            <svg
              className="animate-spin h-10 w-10 text-indigo-400 mb-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            <p className="text-lg animate-pulse text-gray-200">
              Carregando rifa...
            </p>
          </div>
        )}

        {/* Cabeçalho fixo */}
        {rifa && (
          <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md border-b border-gray-800">
            <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
              <h1 className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500">
                {rifa.titulo}
              </h1>
              <button
                onClick={() => setModalPremioAberto(true)}
                className="px-4 py-1.5 text-xs font-semibold rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow hover:opacity-90 transition"
              >
                🎁 Ver prêmios
              </button>
            </div>
          </div>
        )}

        {/* Conteúdo */}
        {rifa && (
          <div className="max-w-4xl mx-auto px-4 pb-12">
            {/* Infos */}
            <div className="flex flex-wrap justify-center gap-4 my-6">
              <div className="bg-gray-800/70 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md">
                <span className="text-sm text-gray-400 block">📅 Sorteio</span>
                <span className="text-base font-semibold text-indigo-300">
                  {rifa.datasorteio && rifa.datasorteio !== "indefinido"
                    ? new Date(rifa.datasorteio).toLocaleDateString("pt-BR")
                    : "A definir"}
                </span>
              </div>
              <div className="bg-gray-800/70 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md">
                <span className="text-sm text-gray-400 block">💵 Valor</span>
                <span className="text-base font-semibold text-green-400">
                  R$ {rifa.valornumero}
                </span>
              </div>
            </div>

            {/* Legenda */}
            <div className="flex flex-wrap justify-center gap-4 text-xs sm:text-sm mb-6 text-gray-300">
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 bg-gray-900 border border-gray-600 rounded"></span>
                <span>Disponível</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 bg-yellow-400 rounded"></span>
                <span>Reservado</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 bg-green-400 rounded"></span>
                <span>Pago</span>
              </div>
            </div>

            <div className="grid grid-cols-8 gap-2 sm:grid-cols-10 lg:grid-cols-12 lg:gap-4 animate-fadeIn">
  {numeros.map((num) => (
    <div className="relative" key={`numero-${num.id}`}>
      <div
        onClick={() => {
          if (num.status === "disponivel") {
            setNumeroSelecionado(num);
            setModalAberto(true);
          } else {
            setTooltip(
              num.status === "reservado"
                ? "Número já reservado"
                : "Número já pago"
            );
            setTimeout(() => setTooltip(""), 2000);
          }
        }}
        className={`cursor-pointer w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-md p-1 text-center shadow-sm 
          transition-all duration-300 hover:scale-105 hover:shadow-lg flex flex-col items-center justify-center
          ${
            num.status === "disponivel"
              ? "bg-gray-800 border border-gray-600 text-gray-200 hover:border-indigo-400"
              : num.status === "reservado"
              ? "bg-yellow-500/80 text-white border border-yellow-400 animate-pulse"
              : "bg-green-500/80 text-white border border-green-400 animate-glow"
          }`}
      >
        {num.status !== "disponivel" && num.nome && (
          <div className="text-[10px] font-medium leading-none text-white mb-0.5">
            {num.nome}
          </div>
        )}
        <div className="text-[12px] font-bold leading-tight font-mono tracking-wide">
          {num.numero}
        </div>
      </div>
    </div>
  ))}
</div>


            {/* Tooltip */}
            {tooltip && (
              <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black/80 text-white px-3 py-1 rounded text-sm shadow-lg">
                {tooltip}
              </div>
            )}
          </div>
        )}

        {/* Mensagem final */}
        {rifa?.mensagemfinal && (
          <div className="bg-gradient-to-r from-indigo-600/30 to-pink-600/30 border-t border-indigo-700 py-8 text-center">
            <p className="max-w-2xl mx-auto text-gray-200 text-base sm:text-lg px-4 leading-relaxed">
              ✨ {rifa.mensagemfinal}
            </p>
          </div>
        )}

        {/* Rodapé de confiança */}
        <div className="text-center text-xs text-gray-500 py-4 border-t border-gray-800">
          🔒 Pagamentos seguros via Pix · ✨ Sorteio com transparência garantida
        </div>

        {/* Modais */}
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
    </ErrorBoundary>
  );
}

export default RifaPage;
