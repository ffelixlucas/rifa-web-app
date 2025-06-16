import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderAdmin from "../components/HeaderAdmin.jsx";

function CriarRifaPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    valorNumero: "",
    dataSorteio: "",
    chavePix: "",
    banco: "",
    mensagemFinal: "",
    totalNumeros: "",
    imagemUrl: "",
    descricaoPremio: "",
    telefoneContato: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/rifas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const erro = await res.text();
        throw new Error(`Erro ao criar rifa: ${erro}`);
      }

      const dados = await res.json();
      console.log("Rifa criada:", dados);
      navigate("/admin");
    } catch (error) {
      console.error("Erro ao criar rifa:", error);
      alert("Erro ao criar rifa: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <HeaderAdmin />

      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Criar Nova Rifa</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="titulo"
            placeholder="Título da Rifa"
            value={form.titulo}
            onChange={handleChange}
            className="w-full rounded border p-2"
            required
          />

          <textarea
            name="descricao"
            placeholder="Descrição emocional da rifa"
            value={form.descricao}
            onChange={handleChange}
            rows={4}
            className="w-full rounded border p-2"
            required
          />

          <input
            type="text"
            name="valorNumero"
            placeholder="Valor por número (ex.: R$ 5,00)"
            value={form.valorNumero}
            onChange={handleChange}
            className="w-full rounded border p-2"
            required
          />

          <input
            type="date"
            name="dataSorteio"
            placeholder="Data do sorteio (opcional)"
            value={form.dataSorteio}
            onChange={handleChange}
            className="w-full rounded border p-2"
          />

          <input
            type="text"
            name="chavePix"
            placeholder="Chave Pix"
            value={form.chavePix}
            onChange={handleChange}
            className="w-full rounded border p-2"
            required
          />

          <input
            type="text"
            name="banco"
            placeholder="Banco + Nome (ex.: Banco Itaú - Fulano de Tal)"
            value={form.banco}
            onChange={handleChange}
            className="w-full rounded border p-2"
            required
          />

          <textarea
            name="mensagemFinal"
            placeholder="Mensagem de agradecimento"
            value={form.mensagemFinal}
            onChange={handleChange}
            rows={2}
            className="w-full rounded border p-2"
            required
          />

          <input
            type="number"
            name="totalNumeros"
            placeholder="Total de números (ex.: 100)"
            value={form.totalNumeros}
            onChange={handleChange}
            className="w-full rounded border p-2"
            required
          />

          <input
            type="text"
            name="imagemUrl"
            placeholder="URL da imagem do prêmio"
            value={form.imagemUrl}
            onChange={handleChange}
            className="w-full rounded border p-2"
            required
          />

          <input
            type="text"
            name="descricaoPremio"
            placeholder="Descrição dos prêmios"
            value={form.descricaoPremio}
            onChange={handleChange}
            className="w-full rounded border p-2"
            required
          />

          <input
            type="text"
            name="telefoneContato"
            placeholder="Telefone de contato (opcional)"
            value={form.telefoneContato}
            onChange={handleChange}
            className="w-full rounded border p-2"
          />

          <button
            type="submit"
            className="w-full rounded bg-green-600 p-3 text-white font-semibold hover:bg-green-700"
          >
            Criar Rifa
          </button>
        </form>
      </div>
    </div>
  );
}

export default CriarRifaPage;
