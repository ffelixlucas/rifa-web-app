// src/pages/RifaPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PagamentoModal from "../components/PagamentoModal.jsx";
import PremioModal from "../components/PremioModal.jsx";
import ErrorBoundary from "../components/ErrorBoundary.jsx";
import { buscarNumerosDaRifa, buscarRifaPublica } from "../services/rifaApi";

function RifaPage() {
  const { id } = useParams();
  const [rifa, setRifa] = useState(null);
  const [numeros, setNumeros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [numerosSelecionadosIds, setNumerosSelecionadosIds] = useState([]);
  const [dadosComprador, setDadosComprador] = useState({
    nomeCompleto: "",
    telefone: "",
  });
  const [modalPremioAberto, setModalPremioAberto] = useState(false);
  const [tooltip, setTooltip] = useState("");
  const [erro, setErro] = useState("");
  const [feedbackSucesso, setFeedbackSucesso] = useState("");

  async function carregarDados() {
    try {
      setLoading(true);
      setErro("");
      const [dadosRifa, dadosNumeros] = await Promise.all([
        buscarRifaPublica(id),
        buscarNumerosDaRifa(id),
      ]);
      setRifa(dadosRifa);
      setNumeros(dadosNumeros);
      setNumerosSelecionadosIds((selecionadosAtuais) =>
        selecionadosAtuais.filter((numeroId) =>
          dadosNumeros.some(
            (n) => n.id === numeroId && n.status === "disponivel"
          )
        )
      );
      document.title = dadosRifa.titulo || "Rifa";
    } catch (error) {
      setErro(error.message || "Erro ao carregar dados da rifa.");
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

  useEffect(() => {
    if (modalAberto && numerosSelecionadosIds.length === 0) {
      setModalAberto(false);
    }
  }, [modalAberto, numerosSelecionadosIds.length]);

  const numerosSelecionados = numeros
    .filter(
      (n) => numerosSelecionadosIds.includes(n.id) && n.status === "disponivel"
    )
    .sort((a, b) => a.numero - b.numero);

  const valorUnitario = Number.parseFloat(
    String(rifa?.valornumero ?? "0").replace(/[^\d,]/g, "").replace(",", ".")
  );
  const valorTotalSelecionado =
    (Number.isNaN(valorUnitario) ? 0 : valorUnitario) * numerosSelecionados.length;

  function alternarSelecaoNumero(num) {
    if (num.status !== "disponivel") {
      setTooltip(num.status === "reservado" ? "Número já reservado" : "Número já pago");
      setTimeout(() => setTooltip(""), 2000);
      return;
    }

    setNumerosSelecionadosIds((atual) =>
      atual.includes(num.id)
        ? atual.filter((numeroId) => numeroId !== num.id)
        : [...atual, num.id]
    );
  }

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
          <div className="max-w-4xl mx-auto px-4 pb-32">
            {erro && (
              <p className="my-4 rounded border border-red-300 bg-red-900/30 px-3 py-2 text-sm text-red-200">
                {erro}
              </p>
            )}
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

            {/* Legenda + Contador */}
            <div className="flex flex-wrap justify-center gap-6 text-xs sm:text-sm mb-6 text-gray-300">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-gray-900 border border-gray-600 rounded"></span>
                <span>Disponíveis:</span>
                <span className="font-semibold text-gray-200">
                  {numeros.filter((n) => n.status === "disponivel").length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-yellow-400 rounded"></span>
                <span>Reservadas:</span>
                <span className="font-semibold text-yellow-400">
                  {numeros.filter((n) => n.status === "reservado").length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-green-400 rounded"></span>
                <span>Vendidas:</span>
                <span className="font-semibold text-green-400">
                  {numeros.filter((n) => n.status === "pago").length}
                </span>
              </div>
            </div>
            {/* Grade de números */}
            <div className="grid grid-cols-8 gap-2 sm:grid-cols-10 lg:grid-cols-12 lg:gap-4 animate-fadeIn">
              {numeros.map((num) => (
                <div className="relative" key={`numero-${num.id}`}>
                  {numerosSelecionadosIds.includes(num.id) && (
                    <span className="absolute -top-1 -right-1 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white">
                      ✓
                    </span>
                  )}
                  <div
                    onClick={() => alternarSelecaoNumero(num)}
                    className={`cursor-pointer w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-md p-1 text-center shadow-sm 
                      transition-all duration-300 hover:scale-105 hover:shadow-lg flex flex-col items-center justify-center
                      ${
                        num.status === "disponivel" &&
                        numerosSelecionadosIds.includes(num.id)
                          ? "bg-indigo-600 border border-indigo-300 text-white"
                          : num.status === "disponivel"
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
              <div
              className={`fixed left-1/2 -translate-x-1/2 bg-black/80 text-white px-3 py-1 rounded text-sm shadow-lg ${
                  numerosSelecionados.length > 0 ? "bottom-24" : "bottom-4"
                }`}
              >
                {tooltip}
              </div>
            )}
            {feedbackSucesso && (
              <div className="fixed left-1/2 top-20 z-40 -translate-x-1/2 rounded-md border border-green-300/50 bg-green-500/15 px-4 py-2 text-sm font-medium text-green-100 shadow-lg backdrop-blur">
                {feedbackSucesso}
              </div>
            )}
          </div>
        )}
        {!loading && !rifa && (
          <div className="mx-auto max-w-xl px-4 py-10 text-center">
            <p className="rounded border border-red-300 bg-red-900/30 px-4 py-3 text-red-200">
              {erro || "Rifa não encontrada."}
            </p>
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

        {numerosSelecionados.length > 0 && (
          <div className="fixed bottom-0 inset-x-0 z-30 border-t border-indigo-400/40 bg-gray-950/95 backdrop-blur-md">
            <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="text-xs text-indigo-200">
                  {numerosSelecionados.length} número
                  {numerosSelecionados.length > 1 ? "s selecionados" : " selecionado"}
                </p>
                <p className="truncate text-xs text-gray-300">
                  {numerosSelecionados.map((n) => n.numero).join(", ")}
                </p>
                <p className="text-sm font-semibold text-green-300">
                  Total: R$ {valorTotalSelecionado.toFixed(2).replace(".", ",")}
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  onClick={() => setNumerosSelecionadosIds([])}
                  className="rounded-md border border-gray-600 px-3 py-2 text-xs text-gray-200 hover:bg-gray-800"
                >
                  Limpar
                </button>
                <button
                  onClick={() => setModalAberto(true)}
                  className="rounded-md bg-gradient-to-r from-indigo-500 to-pink-500 px-3 py-2 text-xs font-semibold text-white hover:opacity-90"
                >
                  Reservar agora
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modais */}
        {modalAberto && (
          <PagamentoModal
            rifaId={id}
            numerosSelecionados={numerosSelecionados}
            dadosComprador={dadosComprador}
            onDadosCompradorChange={setDadosComprador}
            rifa={rifa}
            onClose={() => setModalAberto(false)}
            onRemoverNumero={(numeroId) =>
              setNumerosSelecionadosIds((atual) =>
                atual.filter((idSelecionado) => idSelecionado !== numeroId)
              )
            }
            onConfirm={async () => {
              setModalAberto(false);
              setNumerosSelecionadosIds([]);
              await carregarDados();
              setFeedbackSucesso(
                "Reserva enviada com sucesso. Aguarde confirmação do administrador."
              );
              setTimeout(() => setFeedbackSucesso(""), 3000);
            }}
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
