import { useState, useEffect } from 'react';
import Portal from "./Portal";
import { atualizarNumero } from "../services/rifaApi";

export default function NumeroModal({ numero, onClose, onSalvar }) {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [status, setStatus] = useState('pago');
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (numero) {
      setNome(numero.nome || '');
      setTelefone(numero.telefone || '');
      setStatus(numero.status || "reservado");
    }
  }, [numero]);

  function mascararTelefone(valor) {
    const digitos = String(valor || "").replace(/\D/g, "").slice(0, 11);
    if (digitos.length <= 2) return digitos;
    if (digitos.length <= 6) return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
    if (digitos.length <= 10) {
      return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
    }
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
  }

  async function salvar(payloadOverride) {
    if (!numero) return;
    setErro("");
    setSalvando(true);

    try {
      const payload = payloadOverride || { nome, status, telefone };
      await atualizarNumero(numero.id, payload);
      onSalvar?.();
      onClose?.();
    } catch (err) {
      setErro(err.message || "Não foi possível salvar.");
    } finally {
      setSalvando(false);
    }
  }

  if (!numero) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
          <h2 className="text-xl font-bold mb-4">Editar Número #{numero.numero}</h2>

          <label className="block mb-2 text-sm font-medium">Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-4"
          />

          <label className="block mb-2 text-sm font-medium">Telefone</label>
          <input
            type="text"
            value={telefone}
            onChange={(e) => setTelefone(mascararTelefone(e.target.value))}
            className="w-full border rounded px-3 py-2 mb-4"
            placeholder="(99) 99999-9999"
          />

          <label className="block mb-2 text-sm font-medium">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-4"
          >
            <option value="disponivel">Disponível (apagar dados)</option>
            <option value="pago">Pago</option>
            <option value="reservado">Reservado</option>
          </select>

          <div className="flex justify-end gap-2">
            {erro && <p className="mr-auto text-sm text-red-600">{erro}</p>}
            <button
              onClick={() =>
                salvar({
                  status: "disponivel",
                  nome: "",
                  telefone: "",
                })
              }
              disabled={salvando}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-70"
            >
              Liberar número
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              onClick={salvar}
              disabled={salvando}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              {salvando ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
