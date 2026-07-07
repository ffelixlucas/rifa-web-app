import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NumeroModal from "../components/NumeroModal.jsx";
import CompradoresModal from "../components/CompradoresModal.jsx";
import {
  atualizarNumero,
  buscarNumerosDaRifa,
  buscarRifaAdmin,
} from "../services/rifaApi";
import { authService } from "../services/authService";

function AdminRifaPage() {
  const { id } = useParams();
  const [rifa, setRifa] = useState(null);
  const [numeros, setNumeros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [modalAberto, setModalAberto] = useState(false);
  const [numeroSelecionado, setNumeroSelecionado] = useState(null);
  const [modalCompradoresAberto, setModalCompradoresAberto] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [acaoRapidaId, setAcaoRapidaId] = useState(null);

  const navigate = useNavigate();

  async function recarregarNumeros() {
    const dados = await buscarNumerosDaRifa(id);
    setNumeros(dados);
  }

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);
        setErro("");

        const [dadosRifa, dadosNumeros] = await Promise.all([
          buscarRifaAdmin(id),
          buscarNumerosDaRifa(id),
        ]);

        setRifa(dadosRifa);
        setNumeros(dadosNumeros);
      } catch (error) {
        if (error.status === 401 || error.status === 403) {
          authService.removeToken();
          navigate("/admin/login");
          return;
        }
        setErro(error.message || "Erro ao carregar dados da rifa.");
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, [id, navigate]);

  const numerosFiltrados =
    filtroStatus === "todos"
      ? numeros
      : numeros.filter((num) => num.status === filtroStatus);

  const numerosPendentes = numeros
    .filter((num) => num.status === "reservado")
    .sort((a, b) => a.numero - b.numero);

  const resumo = {
    total: numeros.length,
    disponiveis: numeros.filter((num) => num.status === "disponivel").length,
    reservados: numeros.filter((num) => num.status === "reservado").length,
    pagos: numeros.filter((num) => num.status === "pago").length,
  };

  function formatarTelefone(telefone) {
    const digitos = String(telefone || "").replace(/\D/g, "");
    if (!digitos) return "";
    if (digitos.length === 11) {
      return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
    }
    if (digitos.length === 10) {
      return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
    }
    return telefone;
  }

  async function acaoRapida(numero, statusDestino) {
    try {
      setErro("");
      setAcaoRapidaId(numero.id);

      await atualizarNumero(numero.id, {
        status: statusDestino,
        nome: numero.nome || "",
        telefone: numero.telefone || "",
      });

      await recarregarNumeros();
      setFeedback(
        statusDestino === "pago"
          ? `Número ${numero.numero} confirmado como pago.`
          : `Número ${numero.numero} liberado com sucesso.`
      );
      setTimeout(() => setFeedback(""), 2500);
    } catch (error) {
      setErro(error.message || "Erro ao executar ação rápida.");
    } finally {
      setAcaoRapidaId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-t-indigo-600 border-gray-300"></div>
          <p className="text-base font-medium text-gray-600">Carregando rifa...</p>
        </div>
      </div>
    );
  }

  if (!rifa) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <p className="rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {erro || "Rifa não encontrada."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/admin")}
                className="rounded-full p-2 hover:bg-gray-100 transition"
                title="Voltar para Minhas Rifas"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </button>

              <div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{rifa.titulo}</h1>
                <p className="mt-1 text-sm text-gray-500 sm:text-base">
                  Total de Números: <span className="font-medium">{rifa.totalnumeros}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => navigate(`/admin/rifa/${id}/sorteio`)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium shadow transition"
              >
                🎉 Sortear
              </button>
              <button
                onClick={() => setModalCompradoresAberto(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium shadow transition"
              >
                👥 Compradores
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6">
        {feedback && (
          <p className="mb-3 rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
            {feedback}
          </p>
        )}
        {erro && (
          <p className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {erro}
          </p>
        )}

        <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
            <p className="text-[11px] uppercase tracking-wide text-gray-500">Total</p>
            <p className="text-lg font-bold text-gray-900">{resumo.total}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
            <p className="text-[11px] uppercase tracking-wide text-gray-500">Disponíveis</p>
            <p className="text-lg font-bold text-gray-700">{resumo.disponiveis}</p>
          </div>
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 shadow-sm">
            <p className="text-[11px] uppercase tracking-wide text-yellow-700">Pendentes</p>
            <p className="text-lg font-bold text-yellow-800">{resumo.reservados}</p>
          </div>
          <div className="rounded-lg border border-green-200 bg-green-50 p-3 shadow-sm">
            <p className="text-[11px] uppercase tracking-wide text-green-700">Pagos</p>
            <p className="text-lg font-bold text-green-800">{resumo.pagos}</p>
          </div>
        </div>

        <div className="mb-4 rounded-xl border border-yellow-300 bg-yellow-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-yellow-900">
              Pendentes para confirmar ({numerosPendentes.length})
            </h2>
            <button
              onClick={() => setFiltroStatus("reservado")}
              className="rounded-md bg-yellow-200 px-2 py-1 text-xs font-medium text-yellow-900 hover:bg-yellow-300"
            >
              Filtrar pendentes
            </button>
          </div>

          {numerosPendentes.length === 0 ? (
            <p className="text-sm text-yellow-800">Nenhuma pendência agora.</p>
          ) : (
            <div className="space-y-2">
              {numerosPendentes.slice(0, 12).map((num) => (
                <div
                  key={`pendente-${num.id}`}
                  className="rounded-lg border border-yellow-200 bg-white p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        Nº {num.numero} - {num.nome || "Sem nome"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {num.telefone ? formatarTelefone(num.telefone) : "Sem telefone"}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => {
                          setNumeroSelecionado(num);
                          setModalAberto(true);
                        }}
                        className="rounded-md border border-indigo-300 bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100"
                      >
                        Editar
                      </button>
                      {num.telefone && (
                        <a
                          href={`https://wa.me/55${String(num.telefone).replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-md border border-green-300 bg-green-50 px-2 py-1 text-xs font-medium text-green-700 hover:bg-green-100"
                        >
                          WhatsApp
                        </a>
                      )}
                      <button
                        onClick={() => acaoRapida(num, "pago")}
                        disabled={acaoRapidaId === num.id}
                        className="rounded-md bg-green-600 px-2 py-1 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-70"
                      >
                        Confirmar pago
                      </button>
                      <button
                        onClick={() => acaoRapida(num, "disponivel")}
                        disabled={acaoRapidaId === num.id}
                        className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-70"
                      >
                        Liberar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {numerosPendentes.length > 12 && (
                <p className="text-xs text-yellow-800">
                  Mostrando 12 pendências mais recentes para manter a tela rápida.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
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
                className={`cursor-pointer w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-md p-1 text-center shadow-sm transition-all duration-200 hover:shadow-md flex flex-col items-center justify-center ${
                  num.status === "disponivel"
                    ? "bg-white border border-gray-200 text-gray-800"
                    : num.status === "reservado"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {(num.status === "pago" || num.status === "reservado") && num.nome && (
                  <div className="text-[10px] font-medium leading-none">{num.nome}</div>
                )}
                <div className="text-[12px] font-bold leading-tight">{num.numero}</div>
              </div>
            </div>
          ))}

          {modalAberto && (
            <NumeroModal
              numero={numeroSelecionado}
              onClose={() => setModalAberto(false)}
              onSalvar={async () => {
                try {
                  await recarregarNumeros();
                } catch (error) {
                  setErro(error.message || "Erro ao atualizar números.");
                }
              }}
            />
          )}

          {modalCompradoresAberto && (
            <CompradoresModal
              rifaId={id}
              onClose={() => setModalCompradoresAberto(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminRifaPage;
