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
    try {
      const resRifa = await fetch(`${import.meta.env.VITE_API_URL}/rifas/${id}`);
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

  if (!rifa) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <p className="text-gray-400 text-lg animate-pulse">
          Carregando rifa...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 pb-12">
        {/* Cabeçalho */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500 drop-shadow-lg">
            {rifa.titulo}
          </h1>

          <div className="flex flex-wrap justify-center gap-4 mb-6">
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

          <button
            onClick={() => setModalPremioAberto(true)}
            className="inline-block mt-2 px-5 py-2 text-sm font-semibold rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-md hover:opacity-90 transition"
          >
            🎁 Ver prêmios
          </button>
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

        {/* Grade (mantida igual à sua) */}
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
                      ? "bg-gray-800 border border-gray-600 text-gray-200 hover:border-indigo-400"
                      : num.status === "reservado"
                      ? "bg-yellow-500/80 text-white border border-yellow-400"
                      : "bg-green-500/80 text-white border border-green-400"
                  }`}
              >
                {num.status === "pago" && num.nome && (
                  <div className="text-[10px] font-medium leading-none text-gray-200">
                    {num.nome}
                  </div>
                )}

                {num.status === "reservado" && num.nome && (
                  <div className="text-[9px] font-medium leading-none text-yellow-100 italic">
                    {num.nome} (reservado)
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

      {/* Mensagem final estilizada */}
      {rifa.mensagemfinal && (
        <div className="bg-gradient-to-r from-indigo-600/30 to-pink-600/30 border-t border-indigo-700 py-8 text-center">
          <p className="max-w-2xl mx-auto text-gray-200 text-base sm:text-lg px-4 leading-relaxed">
            ✨ {rifa.mensagemfinal}
          </p>
        </div>
      )}

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
  );
}

export default RifaPage;
