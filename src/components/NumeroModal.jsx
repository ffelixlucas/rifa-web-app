import { useState, useEffect } from 'react';
import Portal from "./Portal";

export default function NumeroModal({ numero, onClose, onSalvar }) {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [status, setStatus] = useState('pago');

  useEffect(() => {
    if (numero) {
      setNome(numero.nome || '');
      setTelefone(numero.telefone || '');
      setStatus(numero.status === "disponivel" ? "pago" : numero.status);
    }
  }, [numero]);

  async function salvar() {
    if (!numero) return;
    const base = (import.meta.env.VITE_API_URL || "").replace(/\/+$/,"");
    const endpoints = [
      `${base}/numeros/${numero.id}`,
      `${base}/api/numeros/${numero.id}`,
    ];

    try {
      let resposta, dados;
      for (const url of endpoints) {
        resposta = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ nome, status, telefone }),
        });
        if (resposta.ok) {
          dados = await resposta.json();
          break;
        }
      }

      if (!resposta || !resposta.ok) {
        throw new Error('Erro ao atualizar número');
      }

      console.log('✅ Número atualizado:', dados);
      onSalvar?.();
      onClose?.();
    } catch (err) {
      console.error('❌ Erro ao salvar número:', err);
      alert('Não foi possível salvar. Tente novamente.');
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
            onChange={(e) => setTelefone(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-4"
            placeholder="(99) 99999-9999"
          />

          <label className="block mb-2 text-sm font-medium">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-4"
          >
            <option value="pago">Pago</option>
            <option value="reservado">Reservado</option>
          </select>

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              onClick={salvar}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
