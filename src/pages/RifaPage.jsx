import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PagamentoModal from "../components/PagamentoModal.jsx";

function RifaPage() {
  const { id } = useParams();
  const [rifa, setRifa] = useState(null);
  const [numeros, setNumeros] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [numeroSelecionado, setNumeroSelecionado] = useState(null);

  async function carregarDados() {
    try {
      const resRifa = await fetch(`${import.meta.env.VITE_API_URL}/rifas/${id}`);
      const dadosRifa = await resRifa.json();
      setRifa(dadosRifa);

      const resNumeros = await fetch(`${import.meta.env.VITE_API_URL}/rifas/${id}/numeros`);
      const dadosNumeros = await resNumeros.json();
      setNumeros(dadosNumeros);
    } catch (error) {
      console.error("Erro ao carregar dados da rifa:", error);
    }
  }

  useEffect(() => {
    carregarDados();
    const intervalo = setInterval(carregarDados, 5000); // Atualiza a cada 5s
    return () => clearInterval(intervalo);
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
      <div className="mx-auto max-w-5xl px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{rifa.titulo}</h1>
        <p className="text-sm text-gray-700 mb-1">Sorteio: {rifa.dataSorteio}</p>
        <p className="text-sm text-gray-600 mb-4">
          Valor por número: <strong>{rifa.valorNumero}</strong>
        </p>

        <div className="grid grid-cols-8 gap-2 sm:grid-cols-10">
          {numeros.map((num) => (
            <div className="relative" key={num.id}>
              <div
                onClick={() => {
                  if (num.status === "disponivel") {
                    setNumeroSelecionado(num);
                    setModalAberto(true);
                  }
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
    </div>
  );
}

export default RifaPage;
