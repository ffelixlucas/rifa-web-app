import { FiX } from "react-icons/fi";

function PremioModal({ imagem, descricaoPremio, onClose }) {
  // Garante que '\\n' seja convertido para '\n'
  const descricaoCorrigida = (descricaoPremio || "Nenhuma descrição informada.").replace(/\\n/g, "\n");

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative animate-in fade-in">
        {/* Botão de fechar */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
          onClick={onClose}
          aria-label="Fechar modal"
        >
          <FiX />
        </button>

        {/* Imagem do prêmio */}
        {imagem && (
          <img
            src={imagem}
            alt="Prêmio"
            className="w-full rounded-md mb-4 object-cover"
          />
        )}

        {/* Descrição do prêmio */}
        <h2 className="text-lg font-bold text-center mb-2">🎁 Prêmios</h2>
        <p className="text-sm text-gray-700 whitespace-pre-line text-center">
          {descricaoCorrigida}
        </p>
      </div>
    </div>
  );
}

export default PremioModal;
