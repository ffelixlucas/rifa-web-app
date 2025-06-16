import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { FaWhatsapp } from "react-icons/fa";

function SorteioAnimado({ rifaId, onFinalizar }) {
  const [contador, setContador] = useState(0);
  const [numeroFinal, setNumeroFinal] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [largura, setLargura] = useState(window.innerWidth);
  const [altura, setAltura] = useState(window.innerHeight);

  useEffect(() => {
    async function sortearDoBackend() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/rifas/${rifaId}/sorteio`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        

        const resultado = await res.json();

        if (res.ok) {
          animarNumero(resultado);
        } else {
          alert(resultado.message || "Erro ao sortear número");
          onFinalizar(null);
        }
      } catch (err) {
        alert("Erro de conexão com o servidor.");
        onFinalizar(null);
      }
    }

    function animarNumero(resultado) {
      let contadorInterno = 0;
      const total = 40 + Math.floor(Math.random() * 30);

      const intervalo = setInterval(() => {
        if (contadorInterno < total - 1) {
          const aleatorio = Math.floor(Math.random() * 100) + 1;
          setContador(aleatorio);
        } else {
          setContador(resultado.numero);
        }

        contadorInterno++;

        if (contadorInterno >= total) {
          clearInterval(intervalo);
          setNumeroFinal(resultado);
          setShowConfetti(true);

          setTimeout(() => {
            onFinalizar(resultado);
          }, 3000);
        }
      }, 120);
    }

    sortearDoBackend();
  }, [rifaId, onFinalizar]);

  function gerarLinkWhatsapp(telefone, nome) {
    const numeroLimpo = telefone.replace(/\D/g, ""); // Remove tudo que não for número
    const mensagem = `Parabéns ${nome}! 🎉 Você foi sorteado na rifa! Entre em contato para combinarmos a entrega do prêmio.`;
    return `https://wa.me/55${numeroLimpo}?text=${encodeURIComponent(mensagem)}`;
  }

  return (
    <div className="mt-10 text-center">
      {showConfetti && <Confetti width={largura} height={altura} />}

      <div className="text-3xl font-medium text-gray-500 mb-4">
        Embaralhando os números...
      </div>

      <div className="text-[6rem] font-extrabold text-indigo-600 animate-bounce">
        {contador}
      </div>

      {numeroFinal && (
        <div className="mt-6 flex items-center justify-center gap-3 text-2xl font-semibold text-green-700 animate-fade-in">
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

export default SorteioAnimado;
