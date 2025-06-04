import { useState, useEffect } from 'react';

function NumeroModal({ numero, onClose, onSalvar }) {
  const [nome, setNome] = useState('');
  const [status, setStatus] = useState('pago');

  useEffect(() => {
    if (numero) {
      setNome(numero.nome || '');
      setStatus(numero.status === "disponivel" ? "pago" : numero.status);
    }
  }, [numero]);

  async function salvar() {
    try {
      const resposta = await fetch(`${import.meta.env.VITE_API_URL}/numeros/${numero.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // ✅ Adiciona o token aqui
        },
        body: JSON.stringify({ nome, status }),
      });
  
      if (!resposta.ok) {
        throw new Error('Erro ao atualizar número');
      }
  
      const dados = await resposta.json();
      console.log('✅ Número atualizado:', dados);
  
      onSalvar(); // Atualiza a lista na tela
      onClose();  // Fecha o modal
    } catch (err) {
      console.error('❌ Erro ao salvar número:', err);
    }
  }

  if (!numero) return null;

  return (
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
  );
}

export default NumeroModal;
