import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderAdmin from "../components/HeaderAdmin.jsx";
import { criarRifa } from "../services/rifaApi";
import { authService } from "../services/authService";

function CriarRifaPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    valorNumero: "",
    dataSorteio: "",
    chavePix: "",
    tipoChavePix: "",
    banco: "",
    mensagemFinal: "",
    totalNumeros: "",
    imagemUrl: "",
    descricaoPremio: "",
    telefoneContato: "",
  });
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setSalvando(true);

    try {
      await criarRifa(form);
      navigate("/admin");
    } catch (error) {
      if (error.status === 401) {
        authService.removeToken();
        navigate("/admin/login");
        return;
      }
      setErro(error.message || "Erro ao criar rifa.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <HeaderAdmin />

      {/* 🔙 Setinha de Voltar */}
      <div className="max-w-2xl mx-auto px-4 pt-4">
        <button
          onClick={() => navigate("/admin")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition mb-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          Voltar
        </button>
      </div>

      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Criar Nova Rifa</h1>
        {erro && (
          <p className="mb-4 rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
            {erro}
          </p>
        )}

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

          <div className="flex">
            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
              R$
            </span>
            <input
              type="text"
              name="valorNumero"
              placeholder="5,00"
              value={form.valorNumero}
              onChange={handleChange}
              className="w-full rounded-r-md border p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data do Sorteio
            </label>
            <div className="flex flex-col gap-1">
              <input
                type="date"
                name="dataSorteio"
                value={form.dataSorteio}
                onChange={handleChange}
                disabled={form.dataSorteio === "indefinido"}
                className={`w-full rounded border p-2 bg-white ${
                  form.dataSorteio === "indefinido"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.dataSorteio === "indefinido"}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      dataSorteio: e.target.checked ? "indefinido" : "",
                    })
                  }
                />
                Sem data definida
              </label>
            </div>
          </div>

          <input
            type="text"
            name="chavePix"
            placeholder="Chave Pix"
            value={form.chavePix}
            onChange={handleChange}
            className="w-full rounded border p-2"
            required
          />

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Tipo da Chave Pix:
            </label>
            <div className="flex flex-wrap gap-2">
              {["cpf", "celular", "email", "aleatoria", "cnpj"].map((tipo) => (
                <button
                  key={tipo}
                  type="button"
                  onClick={() => setForm({ ...form, tipoChavePix: tipo })}
                  className={`px-3 py-1 rounded-full border text-sm font-medium transition ${
                    form.tipoChavePix === tipo
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {tipo === "cpf" && "CPF"}
                  {tipo === "celular" && "Celular"}
                  {tipo === "email" && "E-mail"}
                  {tipo === "aleatoria" && "Chave Aleatória"}
                  {tipo === "cnpj" && "CNPJ"}
                </button>
              ))}
            </div>
          </div>

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
            disabled={salvando}
            className="w-full rounded bg-green-600 p-3 text-white font-semibold hover:bg-green-700"
          >
            {salvando ? "Criando rifa..." : "Criar Rifa"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CriarRifaPage;
