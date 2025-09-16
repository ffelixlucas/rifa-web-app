import { useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";
import { FaWhatsapp } from "react-icons/fa";

export default function SorteioAnimado({ rifaId, onFinalizar }) {
  const [contador, setContador] = useState(0);
  const [numeroFinal, setNumeroFinal] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [largura, setLargura] = useState(window.innerWidth);
  const [altura, setAltura] = useState(window.innerHeight);

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
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/admin/rifas/${rifaId}/sorteio`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const resultado = await res.json();

        if (res.ok && resultado && typeof resultado.numero === "number") {
          animarNumero(resultado);
        } else {
          alert(resultado?.message || "Erro ao sortear número");
          onFinalizar?.(null);
        }
      } catch (err) {
        alert("Erro de conexão com o servidor.");
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

  function gerarLinkWhatsapp(telefone, nome) {
    if (!telefone) return "#";
    const numeroLimpo = telefone.replace(/\D/g, "");
    const mensagem = `Parabéns ${nome}! 🎉 Você foi sorteado na rifa! Entre em contato para combinarmos a entrega do prêmio.`;
    return `https://wa.me/55${numeroLimpo}?text=${encodeURIComponent(mensagem)}`;
  }

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
        <div className="mt-6 flex items-center justify-center gap-3 text-2xl font-semibold text-green-700">
          🎉 Parabéns {numeroFinal.nome}!
          {numeroFinal.telefone && (
            <a
              href={gerarLinkWhatsapp(numeroFinal.telefone, numeroFinal.nome)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-800"
              title="Chamar no WhatsApp"
            >
              <FaWhatsapp size={32} />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
