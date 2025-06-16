import { useEffect, useState } from 'react';
import RifaCard from '../components/RifaCard';

function HomePage() {
  const [rifas, setRifas] = useState([]);

  useEffect(() => {
    async function carregarRifas() {
      try {
        const resposta = await fetch(`${import.meta.env.VITE_API_URL}/rifas`);
        const dados = await resposta.json();

        console.log('🔍 Rifas públicas:', dados);
        setRifas(dados);
      } catch (err) {
        console.error('Erro ao carregar rifas públicas:', err);
      }
    }

    carregarRifas();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Rifas Disponíveis</h1>

      {rifas.length === 0 ? (
        <p className="text-center text-gray-500">Nenhuma rifa encontrada.</p>
      ) : (
        rifas.map((rifa) => <RifaCard key={rifa.id} rifa={rifa} />)
      )}
    </div>
  );
}

export default HomePage;
