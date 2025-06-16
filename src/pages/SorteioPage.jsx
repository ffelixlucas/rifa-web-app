import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import SorteioAnimado from "../components/SorteioAnimado.jsx";

function SorteioPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rifa, setRifa] = useState(null);
  const [sorteios, setSorteios] = useState([]);
  const [ganhador, setGanhador] = useState(null);
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
          `${import.meta.env.VITE_API_URL}/admin/rifas/${id}/sorteios`,
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
      <div className="max-w-2xl mx-auto">
        {/* 🔙 Setinha voltar */}
        <div className="flex items-center justify-start mb-6">
          <button
            onClick={() => navigate(`/admin/rifa/${id}`)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
            <span>Voltar</span>
          </button>
        </div>

        <div className="text-center">
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
            <div className="mt-6 flex items-center justify-center gap-3 text-2xl font-bold text-green-700 animate-fade-in">
              {ganhador.colocacao === 1 && "🥇"}
              {ganhador.colocacao === 2 && "🥈"}
              {ganhador.colocacao === 3 && "🥉"}
              {ganhador.colocacao > 3 && `🏅 ${ganhador.colocacao}º lugar`}

              <span>
                Nº {ganhador.numero} — {ganhador.nome}
              </span>

              {ganhador.telefone && (
                <a
                  href={`https://wa.me/55${ganhador.telefone.replace(
                    /\D/g,
                    ""
                  )}?text=${encodeURIComponent(
                    `Parabéns ${ganhador.nome}! 🎉 Você foi sorteado na rifa "${rifa.titulo}".`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-800"
                  title="Chamar no WhatsApp"
                >
                  <FaWhatsapp size={28} />
                </a>
              )}
            </div>
          )}

          <div className="mt-10">
            <h2 className="text-lg font-semibold mb-4">
              🏆 Ganhadores até agora:
            </h2>

            <div className="space-y-3">
              {sorteios.map((s) => (
                <div
                  key={s.colocacao}
                  className="flex items-center justify-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 shadow-sm"
                >
                  <div className="flex items-center gap-2 text-2xl font-semibold text-green-700">
                    {s.colocacao === 1 && "🥇"}
                    {s.colocacao === 2 && "🥈"}
                    {s.colocacao === 3 && "🥉"}
                    {s.colocacao > 3 && `🏅 ${s.colocacao}º lugar`}

                    <span>
                      Nº {s.numero} — {s.nome}
                    </span>

                    {s.telefone && (
                      <a
                        href={`https://wa.me/55${s.telefone.replace(
                          /\D/g,
                          ""
                        )}?text=${encodeURIComponent(
                          `Parabéns ${s.nome}! 🎉 Você foi sorteado na rifa "${rifa.titulo}".`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-800"
                        title="Chamar no WhatsApp"
                      >
                        <FaWhatsapp size={28} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SorteioPage;
