import { useEffect, useState } from "react";
import { FiCopy, FiX, FiInfo } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import Portal from "./Portal";

export default function PagamentoModal({ numero, rifa, onClose }) {
  const [copied, setCopied] = useState(false);

  const labelTipo = {
    cpf: "CPF",
    celular: "Celular",
    email: "E-mail",
    aleatoria: "Chave Aleatória",
    cnpj: "CNPJ",
  };

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev || "auto";
    };
  }, []);

  if (!numero || !rifa) return null;

  const telefoneBruto = rifa.telefonecontato ?? "";
  const numeroWhats = telefoneBruto.replace(/\D/g, "");
  const chavePix = rifa.chavepix ?? "";
  const valorTexto =
    rifa.valornumero?.replace(/[^\d,]/g, "").replace(",", ".") || "0";
  const valor = parseFloat(valorTexto);
  const valorFormatado = !isNaN(valor)
    ? `R$ ${valor.toFixed(2).replace(".", ",")}`
    : "Valor não informado";

  const mensagemWhatsapp = `Olá! Quero reservar o número *${numero.numero}* da rifa *${rifa.titulo}*. Já vou realizar o pagamento via Pix.`;
  const linkWhatsapp = numeroWhats
    ? `https://wa.me/55${numeroWhats}?text=${encodeURIComponent(
        mensagemWhatsapp
      )}`
    : "#";

  const handleCopyPix = () => {
    if (!chavePix) return;
    navigator.clipboard.writeText(chavePix);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Portal>
      <div
        className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 animate-fadeIn"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 relative overflow-hidden animate-in slide-in-from-bottom-8 duration-300 text-gray-100">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2
              id="modal-title"
              className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500"
            >
              Reservar Número #{numero.numero}
            </h2>
            <button
              className="text-gray-500 hover:text-gray-300 transition-colors"
              onClick={onClose}
              aria-label="Fechar modal"
            >
              <FiX size={20} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Valor */}
            <div className="text-center bg-gray-800/60 rounded-lg py-3 shadow-inner">
              <p className="text-sm text-gray-400">Valor</p>
              <p className="text-2xl font-bold text-green-400">
                {valorFormatado}
              </p>
            </div>

            {/* Pix */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-gray-300">
                  Chave Pix ({labelTipo[rifa.tipochavepix] || "não informado"})
                </p>
                <button
                  onClick={handleCopyPix}
                  disabled={!chavePix}
                  className={`flex items-center gap-1 text-xs ${
                    chavePix
                      ? "text-indigo-400 hover:text-indigo-300"
                      : "text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <FiCopy size={14} />
                  {copied ? "Copiado!" : "Copiar"}
                </button>
              </div>
              <div className="bg-gray-800 rounded-md p-3 text-sm text-indigo-100 break-all">
                {chavePix || "Chave não informada"}
              </div>
              {copied && (
                <p className="text-xs text-green-400 mt-1 animate-fadeIn">
                  ✅ Chave Pix copiada com sucesso!
                </p>
              )}
            </div>

            {/* Botão principal */}
            <div className="flex flex-col gap-3">
              <a
                href={linkWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-2 w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                  numeroWhats
                    ? "bg-gradient-to-r from-indigo-500 to-pink-500 hover:opacity-90 text-white shadow-lg animate-pulse"
                    : "bg-gray-600 cursor-not-allowed"
                }`}
              >
                <FaWhatsapp size={18} />
                Escolher Número
              </a>

              {/* Info box */}
              <div className="flex items-start gap-2 text-xs italic text-blue-300 bg-blue-900/30 border border-blue-700 rounded-md p-2">
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-700/50">
                  <FiInfo size={12} />
                </div>
                <span>
                  Ao clicar em <strong>Escolher Número</strong>, ele será
                  reservado para você.
                  <br />A confirmação acontece após o pagamento via Pix e o
                  envio do comprovante pelo mesmo WhatsApp que será aberto
                  automaticamente.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
