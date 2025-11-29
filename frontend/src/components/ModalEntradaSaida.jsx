import { useState } from "react";
import Modal from "react-modal";
import { api } from "../api";

Modal.setAppElement("#root");

export default function ModalEntradaSaida({ produto, tipo, fechar, recarregar }) {
  const [quantidade, setQuantidade] = useState("");

  async function enviar() {
    await api.put(`/produtos/${produto.id_produto}/${tipo}`, {
      quantidade: Number(quantidade)
    });

    recarregar();
    fechar();
  }

  return (
    <Modal isOpen onRequestClose={fechar} className="modal">
      <h2>{tipo === "entrada" ? "Entrada de Produto" : "Saída de Produto"}</h2>

      <p>Produto: <b>{produto.nome_produto}</b></p>

      <input
        type="number"
        value={quantidade}
        onChange={(e) => setQuantidade(e.target.value)}
        placeholder="Quantidade"
      />

      <button onClick={enviar}>Confirmar</button>
      <button className="cancelar" onClick={fechar}>Cancelar</button>
    </Modal>
  );
}
