import { useEffect, useState } from 'react';
import RifaCard from '../components/RifaCard';
import { listarRifasPublicas } from '../services/rifaApi';

function HomePage() {
  const [rifas, setRifas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function carregarRifas() {
      try {
        setLoading(true);
        setErro('');
        const dados = await listarRifasPublicas();
        setRifas(dados);
      } catch (err) {
        setErro(err.message || 'Erro ao carregar rifas disponíveis.');
      } finally {
        setLoading(false);
      }
    }

    carregarRifas();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Rifas Disponíveis</h1>

      {loading ? (
        <p className="text-center text-gray-500">Carregando rifas...</p>
      ) : erro ? (
        <p className="text-center text-red-600">{erro}</p>
      ) : rifas.length === 0 ? (
        <p className="text-center text-gray-500">Nenhuma rifa encontrada.</p>
      ) : (
        rifas.map((rifa) => <RifaCard key={rifa.id} rifa={rifa} />)
      )}
    </div>
  );
}

export default HomePage;
