import { useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";
import { sortearRifa } from "../services/rifaApi";

export default function SorteioAnimado({
  rifaId,
  ordem,
  quantidadeSorteios,
  onFinalizar,
}) {
  const [contador, setContador] = useState(0);
  const [numeroFinal, setNumeroFinal] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [largura, setLargura] = useState(window.innerWidth);
  const [altura, setAltura] = useState(window.innerHeight);
  const [erro, setErro] = useState("");

  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    function onResize() {
      setLargura(window.innerWidth);
      setAltura(window.innerHeight);
    }
    window.addEventListener("resize", onResize);

    async function sortearDoBackend() {
      try {
        const resultado = await sortearRifa(rifaId, {
          ordem,
          total: String(quantidadeSorteios),
        });

        if (resultado && typeof resultado.numero === "number") {
          animarNumero(resultado);
        } else {
          setErro("Resposta inválida ao sortear número.");
          onFinalizar?.(null);
        }
      } catch (err) {
        setErro(err.message || "Erro de conexão com o servidor.");
        onFinalizar?.(null);
      }
    }

    function animarNumero(resultado) {
      let contadorInterno = 0;
      const total = 40 + Math.floor(Math.random() * 30);

      intervalRef.current = setInterval(() => {
        if (!mountedRef.current) return;

        if (contadorInterno < total - 1) {
          const aleatorio = Math.floor(Math.random() * 100) + 1;
          setContador(aleatorio);
        } else {
          setContador(resultado.numero);
        }

        contadorInterno++;

        if (contadorInterno >= total) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;

          setNumeroFinal(resultado);
          setShowConfetti(true);

          timeoutRef.current = setTimeout(() => {
            if (mountedRef.current) onFinalizar?.(resultado);
          }, 3000);
        }
      }, 120);
    }

    sortearDoBackend();

    return () => {
      mountedRef.current = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [rifaId, onFinalizar]);


  return (
    <div className="mt-10 text-center">
      {showConfetti && <Confetti width={largura} height={altura} />}

      <div className="mb-4 text-3xl font-medium text-gray-500">
        Embaralhando os números...
      </div>

      <div className="text-[6rem] font-extrabold text-indigo-600 animate-bounce">
        {contador}
      </div>

      {numeroFinal && (
        <div className="mt-6 text-2xl font-semibold text-green-400">
          🎉 Número sorteado: {numeroFinal.numero}
        </div>
      )}
      {erro && <p className="mt-3 text-sm text-red-400">{erro}</p>}
    </div>
  );
}
