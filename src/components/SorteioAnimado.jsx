import { useEffect, useState } from "react";
import Confetti from "react-confetti";

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
        const res = await fetch(`${import.meta.env.VITE_API_URL}/rifas/${rifaId}/sorteio`, {
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
        const aleatorio = Math.floor(Math.random() * 100) + 1;
        setContador(aleatorio);
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
        <div className="mt-6 text-2xl font-semibold text-green-700 animate-fade-in">
          🎉 Parabéns {numeroFinal.nome}!
        </div>
      )}
    </div>
  );
}

export default SorteioAnimado;
