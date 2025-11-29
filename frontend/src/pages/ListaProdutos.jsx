import { useEffect, useState } from "react";
import { api } from "../api";
import ProdutoCard from "../components/ProdutoCard";

export default function ListaProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState(""); // estado da barra de pesquisa

  async function carregar() {
    try {
      const res = await api.get("/produtos");
      setProdutos(res.data);
    } catch (erro) {
      console.error("Erro ao carregar produtos:", erro);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  // 🔎 Filtrar os produtos pelo nome
  const produtosFiltrados = produtos.filter((p) =>
    p.nome_produto.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div>
      {/* <h2 className="titulo-lista">Produtos em Estoque</h2> */}

      {/* 🔵 CAMPO DE PESQUISA */}
      <input
        type="text"
        placeholder="Pesquisar produto..."
        className="input-busca"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      <div className="lista-produtos">
        {produtosFiltrados.map((produto) => (
          <ProdutoCard
            key={produto.id_produto}
            produto={produto}
            recarregar={carregar}
          />
        ))}
      </div>
    </div>
  );
}
