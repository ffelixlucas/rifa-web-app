import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ErrorBoundary from "./ErrorBoundary";
import { authService } from "../services/authService";
import { buscarNumerosDaRifa, excluirRifa } from "../services/rifaApi";

function formatarData(dataISO) {
  try {
    if (!dataISO || dataISO === "indefinido") return "Data não definida";
    const partes = String(dataISO).split("-");
    if (partes.length < 3) return "Data não definida";
    const [ano, mes, dia] = partes;
    return `${dia}/${mes}/${ano}`;
  } catch {
    return "Data não definida";
  }
}


export default function RifaCard({ rifa, onDelete }) {
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);
  const [pagos, setPagos] = useState(0);
  const [disponiveis, setDisponiveis] = useState(0);
  const [erro, setErro] = useState("");
  const [excluindo, setExcluindo] = useState(false);

  useEffect(() => {
    async function carregarNumeros() {
      if (document.visibilityState !== "visible") return;
      try {
        const numeros = await buscarNumerosDaRifa(rifa.id);
        setTotal(numeros.length);
        setPagos(numeros.filter((n) => n.status === "pago").length);
        setDisponiveis(numeros.filter((n) => n.status === "disponivel").length);
      } catch (error) {
        setErro(error.message || "Erro ao buscar números.");
      }
    }
    carregarNumeros();
  }, [rifa.id]);

  const status = rifa.finalizada ? "Finalizada" : "Ativa";
  const data = rifa.datasorteio || rifa.dataSorteio; // tolera ambos

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!onDelete) return;

    const confirmar = window.confirm(
      `Deseja realmente excluir a rifa "${rifa.titulo}"?`
    );
    if (!confirmar) return;

    try {
      setExcluindo(true);
      await excluirRifa(rifa.id);
      onDelete?.(rifa.id);
    } catch (error) {
      if (error.status === 401) {
        authService.removeToken();
      }
      setErro(error.message || "Erro ao excluir rifa.");
    } finally {
      setExcluindo(false);
    }
  };

  return (
    <ErrorBoundary label="RifaCard">

    <div
      onClick={() => navigate(`/admin/rifa/${rifa.id}`)}
      className="bg-white rounded shadow p-4 w-full max-w-md mx-auto mb-4 cursor-pointer hover:shadow-lg transition relative"
    >
      <h2 className="text-xl font-bold">{rifa.titulo}</h2>
      <p className="text-sm text-gray-600">
        Sorteio: {formatarData(data)}
      </p>
      <p
        className={`mt-1 font-semibold ${
          status === "Ativa" ? "text-green-600" : "text-gray-500"
        }`}
      >
        {status}
      </p>

      <div className="mt-2 text-sm text-gray-700 flex flex-wrap gap-x-4">
        <span>
          Total: <strong>{total}</strong>
        </span>
        <span>
          Pagos: <strong>{pagos}</strong>
        </span>
        <span>
          Restantes: <strong>{disponiveis}</strong>
        </span>
      </div>
      {erro && <p className="mt-2 text-xs text-red-600">{erro}</p>}

      {onDelete && (
        <button
          onClick={handleDelete}
          disabled={excluindo}
          className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded hover:bg-red-700 disabled:opacity-70"
        >
          {excluindo ? "Excluindo..." : "Excluir"}
        </button>
      )}
    </div>
    </ErrorBoundary>
  );
}
