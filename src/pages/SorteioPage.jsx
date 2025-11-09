import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaWhatsapp,
  FaTrophy,
  FaStar,
  FaFire,
  FaRegStar,
} from "react-icons/fa";
import { IoIosArrowBack, IoIosRocket } from "react-icons/io";
import SorteioAnimado from "../components/SorteioAnimado.jsx";

function SorteioPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [rifa, setRifa] = useState(null);
  const [sorteios, setSorteios] = useState([]);
  const [ganhador, setGanhador] = useState(null);
  const [animando, setAnimando] = useState(false);
  const [aguardandoProximo, setAguardandoProximo] = useState(false);
  const [quantidadeSorteios, setQuantidadeSorteios] = useState(null);
  const [inputValor, setInputValor] = useState("");
  const [ordem, setOrdem] = useState("asc");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);
        console.log("🌐 API URL:", import.meta.env.VITE_API_URL);

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
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, [id, navigate]);

  const podeSortear =
    quantidadeSorteios &&
    sorteios.length < quantidadeSorteios &&
    !ganhador &&
    !animando &&
    !aguardandoProximo;

  const proximoColocadoVisual =
    ordem === "asc"
      ? sorteios.length + 1
      : quantidadeSorteios - sorteios.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <FaTrophy className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-400 text-xl" />
          </div>
          <p className="mt-6 text-purple-200 font-medium animate-pulse">
            Carregando dados da rifa...
          </p>
        </div>
      </div>
    );
  }

  if (!rifa) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/20 max-w-md">
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-2xl font-bold text-white mb-3">
            Rifa Não Encontrada
          </h2>
          <p className="text-purple-200 mb-6">
            Esta rifa não existe ou você não tem acesso.
          </p>
          <button
            onClick={() => navigate("/admin")}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-2xl font-semibold transition-all transform hover:scale-105 shadow-lg"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-6xl animate-float">🎁</div>
        <div
          className="absolute top-20 right-20 text-4xl animate-float"
          style={{ animationDelay: "1s" }}
        >
          🎯
        </div>
        <div
          className="absolute bottom-20 left-20 text-5xl animate-float"
          style={{ animationDelay: "2s" }}
        >
          🏆
        </div>
        <div
          className="absolute bottom-10 right-10 text-6xl animate-float"
          style={{ animationDelay: "1.5s" }}
        >
          ⭐
        </div>
      </div>

      <div className="relative z-10 px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Cabeçalho */}
          <div className="flex items-center justify-between mb-12">
            <button
              onClick={() => navigate(`/admin/rifa/${id}`)}
              className="group flex items-center gap-3 text-purple-200 hover:text-white transition-all bg-white/10 hover:bg-white/20 backdrop-blur-lg px-5 py-3 rounded-2xl shadow-lg hover:shadow-xl border border-white/20"
            >
              <IoIosArrowBack className="text-xl group-hover:-translate-x-1 transition-transform" />
              <span className="font-semibold">Voltar</span>
            </button>

            <div className="text-center flex-1">
              <h1 className="text-4xl font-bold text-gradient text-shadow-glow">
                Sorteio da Rifa
              </h1>
              <p className="text-purple-200 mt-2 text-lg">{rifa.titulo}</p>
            </div>

            <div className="w-24 flex justify-end">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-2xl shadow-lg">
                <FaTrophy className="text-white text-2xl" />
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Configurações */}
            <div className="lg:col-span-1 space-y-8">
              {!quantidadeSorteios && (
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl mb-4 shadow-lg">
                      <IoIosRocket className="text-white text-3xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Quantos colocados você quer sortear?
                    </h2>
                    <p className="text-purple-200">
                      Defina a quantidade de premiados
                    </p>
                  </div>

                  <div className="space-y-6">
                    <input
                      type="number"
                      min="1"
                      value={inputValor}
                      onChange={(e) => setInputValor(e.target.value)}
                      className="w-full bg-white/5 border border-white/20 rounded-2xl px-6 py-4 text-white text-center text-xl font-bold placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Ex: 3"
                    />
                    <button
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                      onClick={() => {
                        const numero = parseInt(inputValor);
                        if (!isNaN(numero) && numero > 0) {
                          setQuantidadeSorteios(numero);
                        } else {
                          alert("Digite um número válido.");
                        }
                      }}
                      disabled={!inputValor}
                    >
                      Confirmar
                    </button>
                  </div>
                </div>
              )}

              {/* Ordem */}
              {quantidadeSorteios && (
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
                  <h2 className="text-xl font-bold text-white mb-6 text-center">
                    Ordem a ser sorteado
                  </h2>
                  <div className="space-y-4">
                    {["asc", "desc"].map((tipo) => (
                      <div
                        key={tipo}
                        className={`p-6 rounded-2xl border-2 cursor-pointer transition-all transform hover:scale-105 ${
                          ordem === tipo
                            ? "border-purple-500 bg-gradient-to-r from-purple-500/20 to-pink-500/20 shadow-lg"
                            : "border-white/20 bg-white/5 hover:border-purple-300/50"
                        }`}
                        onClick={() => setOrdem(tipo)}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              ordem === tipo
                                ? "border-purple-400 bg-purple-400"
                                : "border-white/40"
                            }`}
                          >
                            {ordem === tipo && (
                              <FaStar className="text-white text-xs" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-white">
                              {tipo === "asc"
                                ? "Do 1º ao último"
                                : "Do último ao 1º"}
                            </div>
                            <div className="text-purple-200 text-sm mt-1">
                              {tipo === "asc" ? "1 → 2 → 3" : "3 → 2 → 1"}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sorteio */}
            <div className="lg:col-span-2 space-y-8">
              {podeSortear && (
                <div className="text-center">
                  <button
                    onClick={() => setAnimando(true)}
                    className="group relative bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-600 hover:via-emerald-600 hover:to-green-700 text-white px-12 py-8 rounded-3xl font-bold text-2xl shadow-2xl transition-all transform hover:scale-105 overflow-hidden"
                  >
                    <div className="relative z-10 flex items-center justify-center gap-4">
                      <FaFire className="text-orange-300 text-3xl animate-pulse" />
                      <span>🎉 Sortear {proximoColocadoVisual}º colocado</span>
                      <FaRegStar className="text-yellow-300 text-3xl animate-bounce" />
                    </div>
                  </button>
                </div>
              )}

              {/* Spinner entre sorteios */}
              {aguardandoProximo && (
                <div className="flex flex-col items-center justify-center py-6 text-purple-300 animate-pulse">
                  <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                  <p className="text-sm">Preparando o próximo sorteio...</p>
                </div>
              )}

              {/* Animação real */}
              {animando && (
                <SorteioAnimado
                  rifaId={id}
                  ordem={ordem}
                  quantidadeSorteios={quantidadeSorteios}
                  onFinalizar={async (resultado) => {
                    console.log("📞 Resultado recebido do sorteio:", resultado);
                    console.log("📞 Telefone recebido:", resultado?.telefone);
                    if (resultado) {
                      setGanhador(resultado);
                      setAguardandoProximo(true);
                      setAnimando(false);

                      // envia whatsapp (chama backend)
                      try {
                        console.log("➡️ Enviando WhatsApp com payload:", {
                          numero: resultado.telefone,
                          nome: resultado.nome,
                          titulo: rifa.titulo,
                          numeroCota: resultado.numero,
                        });

                        await fetch(
                          `${
                            import.meta.env.VITE_API_URL
                          }/admin/whatsapp/enviar`,
                          {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${localStorage.getItem(
                                "token"
                              )}`,
                            },
                            body: JSON.stringify({
                              numero: resultado.telefone,
                              nome: resultado.nome,
                              titulo: rifa.titulo,
                              numeroCota: resultado.numero,
                            }),
                          }
                        );
                      } catch (err) {
                        console.error("Erro ao enviar WhatsApp:", err);
                      }

                      // 🔁 dá tempo do backend gravar e busca lista atualizada
                      await new Promise((r) => setTimeout(r, 1000));
                      try {
                        const res = await fetch(
                          `${
                            import.meta.env.VITE_API_URL
                          }/admin/rifas/${id}/sorteios`,
                          {
                            headers: {
                              Authorization: `Bearer ${localStorage.getItem(
                                "token"
                              )}`,
                            },
                          }
                        );
                        const atualizados = await res.json();
                        setSorteios(atualizados);
                      } catch (e) {
                        console.error(
                          "Erro ao atualizar lista de sorteios:",
                          e
                        );
                      }

                      // ⏱️ espera mais um pouco antes de liberar o próximo
                      setTimeout(() => {
                        setGanhador(null);
                        setAguardandoProximo(false);
                      }, 3000);
                    }
                  }}
                />
              )}

              {/* Ganhador atual */}
              {ganhador && (
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-lg border border-green-400/30 rounded-3xl p-8 shadow-2xl animate-fade-in">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-4 text-2xl font-bold text-white mb-4">
                      {ganhador.colocacao === 1 && "🥇"}
                      {ganhador.colocacao === 2 && "🥈"}
                      {ganhador.colocacao === 3 && "🥉"}
                      {ganhador.colocacao > 3 &&
                        `🏅 ${ganhador.colocacao}º lugar`}
                      <span>
                        Nº {ganhador.numero} — {ganhador.nome}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Lista de ganhadores */}
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-center text-white text-2xl font-bold">
                  🏆 Ganhadores até agora
                </div>

                <div className="p-8 max-h-96 overflow-y-auto">
                  {sorteios.length === 0 ? (
                    <div className="text-center py-12 text-purple-200">
                      Nenhum ganhador ainda.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {Array.from({
                        length: quantidadeSorteios || sorteios.length,
                      }).map((_, index) => {
                        const s = sorteios[index];
                        function enviarMensagemWhatsApp() {
                          if (!s.telefone) {
                            alert(
                              "Este participante não possui número de WhatsApp cadastrado."
                            );
                            return;
                          }

                          // 🔹 Remove tudo que não é número (espaço, +, traço, parênteses)
                          let numeroLimpo = s.telefone.replace(/\D/g, "");

                          // 🔹 Garante que o número começa com o DDI 55 (Brasil)
                          if (!numeroLimpo.startsWith("55")) {
                            numeroLimpo = "55" + numeroLimpo;
                          }

                          // 🔹 Monta o texto da mensagem com a colocação
                          const colocacaoTexto =
                            s.colocacao === 1
                              ? "🥇 1º lugar"
                              : s.colocacao === 2
                              ? "🥈 2º lugar"
                              : s.colocacao === 3
                              ? "🥉 3º lugar"
                              : `${s.colocacao}º lugar`;

                          const mensagem = `Parabéns ${s.nome}! 🎉 Você ficou em ${colocacaoTexto} na rifa "${rifa.titulo}". Número da sorte: ${s.numero}.`;

                          // 🔹 Cria o link do WhatsApp com o número limpo
                          const link = `https://wa.me/${numeroLimpo}?text=${encodeURIComponent(
                            mensagem
                          )}`;

                          console.log("🔗 Abrindo WhatsApp:", link);
                          window.open(link, "_blank");
                        }

                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 transition-all"
                          >
                            {s ? (
                              <>
                                <div className="flex items-center gap-3 text-white font-semibold text-lg">
                                  <span>{s.colocacao}º lugar</span>
                                  <span>
                                    Nº {s.numero} — {s.nome}
                                  </span>
                                </div>

                                {s.telefone && (
                                  <button
                                    onClick={enviarMensagemWhatsApp}
                                    className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-green-400/40 transition-all duration-300 group"
                                    title="Enviar WhatsApp"
                                  >
                                    <FaWhatsapp
                                      size={26}
                                      className="text-white drop-shadow-md group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300"
                                    />
                                    <span className="absolute -bottom-6 text-xs text-green-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                      WhatsApp
                                    </span>
                                  </button>
                                )}
                              </>
                            ) : (
                              <div className="flex items-center gap-3 text-purple-300 font-medium text-lg italic">
                                <span>{index + 1}º lugar</span>
                                <span className="text-purple-400/60">
                                  aguardando sorteio...
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SorteioPage;
