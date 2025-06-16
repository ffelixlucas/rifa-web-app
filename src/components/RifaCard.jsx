import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function formatarData(dataISO) {
  if (!dataISO || dataISO === "indefinido") return "Data não definida";
  const partes = dataISO.split("-");
  if (partes.length !== 3) return "Data não definida";

  const [ano, mes, dia] = partes;
  return `${dia}/${mes}/${ano}`;
}


function RifaCard({ rifa, onDelete }) {
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);
  const [pagos, setPagos] = useState(0);
  const [disponiveis, setDisponiveis] = useState(0);

  useEffect(() => {
    async function carregarNumeros() {
      if (document.visibilityState !== "visible") {
        console.log("🙈 Aba não visível — ignorando fetch do RifaCard");
        return;
      }

      try {
        const resposta = await fetch(
          `${import.meta.env.VITE_API_URL}/rifas/${rifa.id}/numeros`
        );
        const numeros = await resposta.json();
        setTotal(numeros.length);
        setPagos(numeros.filter((n) => n.status === "pago").length);
        setDisponiveis(numeros.filter((n) => n.status === "disponivel").length);
      } catch (error) {
        console.error("Erro ao buscar números da rifa:", error);
      }
    }

    carregarNumeros();
  }, [rifa.id]);

  const status = rifa.finalizada ? "Finalizada" : "Ativa";

  const handleDelete = async (e) => {
    e.stopPropagation(); // ⛔️ Impede que o clique no botão dispare o clique do card
    const confirmar = window.confirm(
      `Deseja realmente excluir a rifa "${rifa.titulo}"?`
    );
    if (!confirmar) return;

    try {
      const resposta = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/rifas/${rifa.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (resposta.status === 204) {
        alert("Rifa excluída com sucesso!");
        if (onDelete) onDelete(rifa.id); // 🔥 Atualiza a lista no pai
      } else {
        const erro = await resposta.json();
        alert(`Erro ao excluir: ${erro.erro}`);
      }
    } catch (error) {
      console.error("Erro ao excluir rifa:", error);
      alert("Erro ao excluir rifa.");
    }
  };

  return (
    <div
      onClick={() => navigate(`/admin/rifa/${rifa.id}`)}
      className="bg-white rounded shadow p-4 w-full max-w-md mx-auto mb-4 cursor-pointer hover:shadow-lg transition relative"
    >
      <h2 className="text-xl font-bold">{rifa.titulo}</h2>
      <p className="text-sm text-gray-600">
        Sorteio: {formatarData(rifa.dataSorteio)}
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

      {/* 🔥 Botão de excluir */}
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded hover:bg-red-700"
      >
        Excluir
      </button>
    </div>
  );
}

export default RifaCard;
