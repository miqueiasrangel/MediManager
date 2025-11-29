import { useState } from "react";
import { api } from "../api";

export default function CadastroProduto() {
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [mensagem, setMensagem] = useState("");

  async function cadastrar(e) {
    e.preventDefault();

    try {
      const res = await api.post("/produtos", {
        nome_produto: nome,
        categoria,
        quantidade_inicial: Number(quantidade)
      });

      setMensagem(`Produto cadastrado! ID gerado: ${res.data.id_produto}`);
      setNome("");
      setCategoria("");
      setQuantidade("");
    } catch {
      setMensagem("Erro ao cadastrar produto.");
    }
  }

  return (
    <div>
      <h2>Cadastrar Produto</h2>

      <form className="form" onSubmit={cadastrar}>
        <label>Nome do Produto</label>
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />

        <label>Categoria</label>
        <input
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        />

        <label>Quantidade Inicial</label>
        <input
          type="number"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
          required
        />

        <button type="submit">Cadastrar</button>
      </form>

      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}
