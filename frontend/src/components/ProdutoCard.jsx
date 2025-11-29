import { useState } from "react";
import ModalEntradaSaida from "./ModalEntradaSaida";

export default function ProdutoCard({ produto, recarregar }) {
  const [tipo, setTipo] = useState(null);

  return (
    <div className="card">
      <h3>{produto.nome_produto}</h3>
      <p><b>ID:</b> {produto.id_produto}</p>
      <p><b>Categoria:</b> {produto.categoria}</p>
      <p><b>Quantidade:</b> {produto.quantidade}</p>

      <div className="acoes">
        <button onClick={() => setTipo("entrada")}>Entrada</button>
        <button onClick={() => setTipo("saida")}>Saída</button>
      </div>

      {tipo && (
        <ModalEntradaSaida
          produto={produto}
          tipo={tipo}
          fechar={() => setTipo(null)}
          recarregar={recarregar}
        />
      )}
    </div>
  );
}
