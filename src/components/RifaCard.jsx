import { Link } from 'react-router-dom';

function RifaCard({ rifa }) {
  const status = new Date(rifa.dataSorteio) >= new Date() ? 'Ativa' : 'Finalizada';

  return (
    <div className="bg-white rounded shadow p-4 w-full max-w-md mx-auto mb-4">
      <h2 className="text-xl font-bold">{rifa.titulo}</h2>
      <p className="text-sm text-gray-600">Sorteio: {rifa.dataSorteio}</p>
      <p className={`mt-1 font-semibold ${status === 'Ativa' ? 'text-green-600' : 'text-gray-500'}`}>
        {status}
      </p>
      <Link
        to={`/admin/rifa/${rifa.id}`}
        className="mt-3 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        Ver números
      </Link>
    </div>
  );
}

export default RifaCard;
