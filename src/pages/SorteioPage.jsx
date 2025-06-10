import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SorteioAnimado from "../components/SorteioAnimado.jsx";

function SorteioPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rifa, setRifa] = useState(null);
  const [sorteios, setSorteios] = useState([]);
  const [ganhador, setGanhador] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [animando, setAnimando] = useState(false);
  const [quantidadeSorteios, setQuantidadeSorteios] = useState(null);
  const [inputValor, setInputValor] = useState("");

  useEffect(() => {
    async function carregarDados() {
      try {
        const token = localStorage.getItem("token");

        const resRifa = await fetch(
          `${import.meta.env.VITE_API_URL}/admin/rifas/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const dadosRifa = await resRifa.json();
        setRifa(dadosRifa);

        const resSorteios = await fetch(
          `${import.meta.env.VITE_API_URL}/rifas/${id}/sorteios`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const dadosSorteios = await resSorteios.json();
        setSorteios(dadosSorteios);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        navigate("/admin/login");
      }
    }

    carregarDados();
  }, [id, navigate]);

  const podeSortear =
    quantidadeSorteios &&
    sorteios.length < quantidadeSorteios &&
    !ganhador &&
    !animando;

  if (!rifa) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Carregando dados da rifa...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Sorteio da Rifa
        </h1>
        <p className="text-sm text-gray-500 mb-6">{rifa.titulo}</p>

        {!quantidadeSorteios && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantos colocados você quer sortear?
            </label>
            <input
              type="number"
              min="1"
              value={inputValor}
              onChange={(e) => setInputValor(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 text-center w-32"
            />
            <button
              className="ml-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              onClick={() => {
                const numero = parseInt(inputValor);
                if (!isNaN(numero) && numero > 0) {
                  setQuantidadeSorteios(numero);
                } else {
                  alert("Digite um número válido.");
                }
              }}
            >
              Confirmar
            </button>
          </div>
        )}

        {podeSortear && (
          <button
            onClick={() => setAnimando(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium shadow"
          >
            🎉 Sortear {sorteios.length + 1}º colocado
          </button>
        )}

        {animando && (
          <SorteioAnimado
            rifaId={id}
            onFinalizar={(resultado) => {
              if (resultado) {
                setGanhador(resultado);
                setSorteios((prev) => [...prev, resultado]);

                // Após 4 segundos, limpa ganhador para liberar próximo sorteio
                setTimeout(() => {
                  setGanhador(null);
                }, 4000);
              }

              setAnimando(false);
            }}
          />
        )}

        {ganhador && (
          <div className="mt-6 text-2xl font-bold text-green-700 animate-fade-in">
            {ganhador.colocacao === 1 && "🥇"}
            {ganhador.colocacao === 2 && "🥈"}
            {ganhador.colocacao === 3 && "🥉"}
            {ganhador.colocacao > 3 &&
              `🏅 ${ganhador.colocacao}º lugar`}
            <div className="mt-2">
              Número {ganhador.numero} — {ganhador.nome}
            </div>
          </div>
        )}

        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-2">Ganhadores até agora:</h2>
          <ul className="text-sm text-gray-700 space-y-1">
            {sorteios.map((s) => (
              <li key={s.colocacao}>
                {s.colocacao === 1 && "🥇"}
                {s.colocacao === 2 && "🥈"}
                {s.colocacao === 3 && "🥉"}
                {s.colocacao > 3 && `🏅 ${s.colocacao}º lugar:`} Nº {s.numero} — {s.nome}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SorteioPage;
