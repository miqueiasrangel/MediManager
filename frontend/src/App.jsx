import { useState } from "react";
import ListaProdutos from "./pages/ListaProdutos";
import CadastroProduto from "./pages/CadastroProduto";
import "./styles.css";

export default function App() {
  const [view, setView] = useState("lista");

  return (
    <div className="container">
      <h1>MediManager</h1>

      <div className="menu">
        <button onClick={() => setView("lista")}>Lista de Produtos</button>
        <button onClick={() => setView("cadastro")}>Cadastrar Produto</button>
      </div>

      {view === "lista" && <ListaProdutos />}
      {view === "cadastro" && <CadastroProduto />}
    </div>
  );
}
