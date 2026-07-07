import { useEffect, useState } from "react";
import { FiCopy, FiX, FiInfo } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import Portal from "./Portal";
import { reservarNumerosPublico } from "../services/rifaApi";

export default function PagamentoModal({
  rifaId,
  numero,
  numerosSelecionados,
  dadosComprador,
  onDadosCompradorChange,
  rifa,
  onClose,
  onRemoverNumero,
  onConfirm,
}) {
  const [copied, setCopied] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

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

  const listaNumeros = Array.isArray(numerosSelecionados)
    ? numerosSelecionados
    : [];
  const numerosEscolhidos =
    listaNumeros.length > 0
      ? listaNumeros
      : numero
      ? [numero]
      : [];

  if (!rifa || numerosEscolhidos.length === 0) return null;

  const nomeCompleto = dadosComprador?.nomeCompleto || "";
  const telefoneMascarado = dadosComprador?.telefone || "";
  const telefoneApenasDigitos = telefoneMascarado.replace(/\D/g, "");

  const telefoneBruto = rifa.telefonecontato ?? "";
  const numeroWhats = telefoneBruto.replace(/\D/g, "");
  const chavePix = rifa.chavepix ?? "";
  const valorTexto =
    rifa.valornumero?.replace(/[^\d,]/g, "").replace(",", ".") || "0";
  const valor = parseFloat(valorTexto);
  const valorFormatado = !isNaN(valor)
    ? `R$ ${valor.toFixed(2).replace(".", ",")}`
    : "Valor não informado";
  const quantidadeSelecionada = numerosEscolhidos.length;
  const numerosOrdenados = [...numerosEscolhidos]
    .sort((a, b) => a.numero - b.numero)
    .map((n) => n.numero);
  const totalFormatado = !isNaN(valor)
    ? `R$ ${(valor * quantidadeSelecionada).toFixed(2).replace(".", ",")}`
    : "Valor não informado";

  const mensagemWhatsapp = `Olá! Quero reservar ${
    quantidadeSelecionada > 1 ? "os números" : "o número"
  } *${numerosOrdenados.join(", ")}* da rifa *${rifa.titulo}*. Já vou realizar o pagamento via Pix.`;
  const linkWhatsapp = numeroWhats
    ? `https://wa.me/55${numeroWhats}?text=${encodeURIComponent(
        mensagemWhatsapp
      )}`
    : "#";

  const removerNumero = (numeroId) => {
    onRemoverNumero?.(numeroId);
  };

  const handleCopyPix = () => {
    if (!chavePix) return;
    navigator.clipboard.writeText(chavePix);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const atualizarDadosComprador = (parcial) => {
    onDadosCompradorChange?.((atual) => ({
      ...(atual || {}),
      ...parcial,
    }));
  };

  const formatarTelefone = (valor) => {
    const digitos = String(valor || "")
      .replace(/\D/g, "")
      .slice(0, 11);

    if (digitos.length <= 2) return digitos;
    if (digitos.length <= 6) return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
    if (digitos.length <= 10) {
      return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
    }
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
  };

  const nomeValido =
    nomeCompleto.trim().length >= 5 && nomeCompleto.trim().split(/\s+/).length >= 2;
  const telefoneValido =
    telefoneApenasDigitos.length === 10 || telefoneApenasDigitos.length === 11;
  const podeReservar =
    !salvando && quantidadeSelecionada > 0 && nomeValido && telefoneValido;

  const handleReservar = async () => {
    if (!podeReservar) return;

    try {
      setSalvando(true);
      setErro("");

      await reservarNumerosPublico(rifaId, {
        numeroIds: numerosEscolhidos.map((n) => n.id),
        nome: nomeCompleto,
        telefone: telefoneMascarado,
      });

      if (numeroWhats) {
        window.open(linkWhatsapp, "_blank", "noopener,noreferrer");
      }

      await onConfirm?.();
    } catch (errorReserva) {
      setErro(errorReserva.message || "Não foi possível reservar os números.");
    } finally {
      setSalvando(false);
    }
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
              Reservar {quantidadeSelecionada} número
              {quantidadeSelecionada > 1 ? "s" : ""}
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
              {quantidadeSelecionada > 1 && (
                <p className="mt-1 text-sm text-green-300">
                  Total: <span className="font-semibold">{totalFormatado}</span>
                </p>
              )}
            </div>
            <div className="rounded-md border border-indigo-500/40 bg-indigo-500/10 p-3">
              <p className="text-xs text-indigo-200">Números selecionados</p>
              <div className="mt-2 flex max-h-28 flex-wrap gap-2 overflow-y-auto pr-1">
                {numerosEscolhidos
                  .slice()
                  .sort((a, b) => a.numero - b.numero)
                  .map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => removerNumero(item.id)}
                      className="inline-flex items-center gap-2 rounded-full border border-indigo-300/40 bg-indigo-400/10 px-2 py-1 text-xs font-semibold text-indigo-100 hover:bg-indigo-400/20"
                      title={`Remover número ${item.numero}`}
                    >
                      <span>{item.numero}</span>
                      <span className="rounded-full bg-indigo-300/20 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-indigo-200">
                        remover
                      </span>
                    </button>
                  ))}
              </div>
            </div>
            <div className="space-y-3 rounded-md border border-gray-700 bg-gray-800/60 p-3">
              <div>
                <label className="mb-1 block text-xs text-gray-300">
                  Nome completo
                </label>
                <input
                  type="text"
                  value={nomeCompleto}
                  onChange={(event) =>
                    atualizarDadosComprador({ nomeCompleto: event.target.value })
                  }
                  placeholder="Ex.: Lucas da Silva"
                  className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-indigo-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-300">
                  Telefone (WhatsApp)
                </label>
                <input
                  type="tel"
                  value={telefoneMascarado}
                  onChange={(event) =>
                    atualizarDadosComprador({
                      telefone: formatarTelefone(event.target.value),
                    })
                  }
                  placeholder="(11) 99999-9999"
                  className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-indigo-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Pix */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex flex-col">
                  <p className="text-sm text-gray-300">
                    Chave Pix ({labelTipo[rifa.tipochavepix] || "não informado"}
                    )
                  </p>
                  {/* Banco e titular */}
                  {rifa.banco && (
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <span className="text-gray-500">🏦</span>
                      {rifa.banco}
                    </p>
                  )}
                </div>
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

              {/* Chave isolada */}
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
              <button
                type="button"
                onClick={handleReservar}
                disabled={!podeReservar}
                className={`flex items-center justify-center gap-2 w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                  podeReservar
                    ? "bg-gradient-to-r from-indigo-500 to-pink-500 hover:opacity-90 text-white shadow-lg animate-pulse"
                    : "bg-gray-600 cursor-not-allowed"
                }`}
              >
                <FaWhatsapp size={18} />
                {salvando
                  ? "Reservando..."
                  : numeroWhats
                  ? `Reservar ${quantidadeSelecionada} número${
                      quantidadeSelecionada > 1 ? "s" : ""
                    } e abrir WhatsApp`
                  : `Reservar ${quantidadeSelecionada} número${
                      quantidadeSelecionada > 1 ? "s" : ""
                    }`
                  }
              </button>
              {erro && (
                <p className="rounded border border-red-400/40 bg-red-900/30 px-2 py-1 text-xs text-red-200">
                  {erro}
                </p>
              )}
              {!nomeValido && (
                <p className="text-xs text-yellow-300">
                  Informe nome completo (nome e sobrenome).
                </p>
              )}
              {!telefoneValido && (
                <p className="text-xs text-yellow-300">
                  Informe telefone com DDD (10 ou 11 dígitos).
                </p>
              )}

              {/* Info box */}
              <div className="flex items-start gap-2 text-xs italic text-blue-300 bg-blue-900/30 border border-blue-800 rounded-md p-2">
                <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-700">
                  <FiInfo size={14} className="text-blue-100" />
                </div>

                <span>
                  Ao clicar em <strong>Reservar</strong>,{" "}
                  {quantidadeSelecionada > 1 ? "os números serão" : "o número será"}
                  reservado para você.
                  <br />
                  O admin recebe nome e telefone pré-preenchidos para só
                  confirmar o pagamento depois.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
