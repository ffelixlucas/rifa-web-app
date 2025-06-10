import { useEffect, useState } from "react";
import Confetti from "react-confetti";

function SorteioAnimado({ rifaId, onFinalizar }) {
  const [contador, setContador] = useState(0);
  const [numerosPagos, setNumerosPagos] = useState([]);
  const [numeroFinal, setNumeroFinal] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [largura, setLargura] = useState(window.innerWidth);
  const [altura, setAltura] = useState(window.innerHeight);

  useEffect(() => {
    async function fetchNumeros() {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/rifas/${rifaId}/numeros`);
      const data = await res.json();
      const pagos = data.filter((n) => n.status === "pago");
      setNumerosPagos(pagos);
    }
    fetchNumeros();
  }, [rifaId]);

  useEffect(() => {
    if (numerosPagos.length === 0) return;

    let contadorInterno = 0;
    const total = 40 + Math.floor(Math.random() * 30);
    const intervalo = setInterval(() => {
      const index = Math.floor(Math.random() * numerosPagos.length);
      const escolhido = numerosPagos[index];
      setContador(escolhido.numero);

      contadorInterno++;
      if (contadorInterno >= total) {
        clearInterval(intervalo);
        setNumeroFinal(escolhido);
        setShowConfetti(true);
        setTimeout(() => {
          onFinalizar(escolhido);
        }, 3000);
      }
    }, 120);

    return () => clearInterval(intervalo);
  }, [numerosPagos, onFinalizar]);

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
