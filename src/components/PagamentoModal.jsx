import { useEffect, useState } from 'react';
import { FiCopy, FiX } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

function PagamentoModal({ numero, rifa, onClose }) {
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (!numero || !rifa) return null;

  // Dados formatados
  const telefoneBruto = rifa.telefonecontato ?? '';
  const numeroWhats = telefoneBruto.replace(/\D/g, '');
  const chavePix = rifa.chavepix ?? '';
  const valorTexto = rifa.valornumero?.replace(/[^\d,]/g, '').replace(',', '.') || '0';
  const valor = parseFloat(valorTexto);  const valorFormatado = !isNaN(valor) ? `R$ ${valor.toFixed(2).replace('.', ',')}` : 'Valor não informado';
  
  // Mensagem para WhatsApp
  const mensagemWhatsapp = `Olá! Quero reservar o número *${numero.numero}* da rifa *${rifa.titulo}*. Já vou realizar o pagamento via Pix.`;
  const linkWhatsapp = numeroWhats
    ? `https://wa.me/55${numeroWhats}?text=${encodeURIComponent(mensagemWhatsapp)}`
    : '#';

  const handleCopyPix = () => {
    if (!chavePix) return;
    
    navigator.clipboard.writeText(chavePix);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xs p-6 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-4">
          <h2 id="modal-title" className="text-lg font-bold text-gray-900">
            Reservar Número #{numero.numero}
          </h2>
          <button
            className="text-gray-500 hover:text-gray-800 transition-colors"
            onClick={onClose}
            aria-label="Fechar modal"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Valor</p>
            <p className="text-lg font-semibold text-indigo-600">
              {valorFormatado}
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm text-gray-600">Chave Pix - (CPF)</p>
              <button
                onClick={handleCopyPix}
                disabled={!chavePix}
                className={`flex items-center gap-1 text-xs ${chavePix ? 'text-indigo-600 hover:text-indigo-800' : 'text-gray-400 cursor-not-allowed'}`}
              >
                <FiCopy size={14} />
                {copied ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
            <div className="bg-gray-100 rounded-md p-3 text-sm text-gray-800 break-all">
              {chavePix || 'Chave não informada'}
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <a
              href={linkWhatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-2 w-full py-2 rounded-lg transition-all duration-200 ${
                numeroWhats
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              <FaWhatsapp size={18} />
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PagamentoModal;