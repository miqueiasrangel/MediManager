const express = require('express');
const router = express.Router();
const sheets = require('../googleSheets');

function agoraFormatadoBR(date = new Date()) {
  const dia = String(date.getDate()).padStart(2, '0');
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const ano = date.getFullYear();
  const hora = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${dia}/${mes}/${ano} ${hora}:${min}`;
}

function gerarProximoId(linhas) {
  let max = 0;
  linhas.forEach(row => {
    const id = (row[0] || '').toString().trim();
    const m = id.match(/^PROD(\d{3,})$/i);
    if (m) {
      const num = parseInt(m[1], 10);
      if (num > max) max = num;
    }
  });
  const proximo = (max + 1).toString().padStart(3, '0');
  return `PROD${proximo}`;
}

function linhaParaObjeto(row) {
  return {
    id_produto: row[0] || '',
    nome_produto: row[1] || '',
    categoria: row[2] || '',
    quantidade: Number(row[3] || 0),
    ultima_movimentacao: row[4] || '',
    tipo_movimentacao: row[5] || '',
    quantidade_movimentada: Number(row[6] || 0),
    criado_em: row[7] || '',
    atualizado_em: row[8] || '',
  };
}

router.get('/', async (req, res) => {
  try {
    const linhas = await sheets.lerTodasLinhas();
    const produtos = linhas.map(linhaParaObjeto);
    res.json(produtos);
  } catch (err) {
    console.error('Erro listar produtos:', err);
    res.status(500).json({ erro: 'Erro ao listar produtos' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const linhas = await sheets.lerTodasLinhas();
    const index = linhas.findIndex(r => (r[0] || '').toString().trim() === id);
    if (index === -1) return res.status(404).json({ erro: 'Produto não encontrado' });
    const produto = linhaParaObjeto(linhas[index]);
    res.json(produto);
  } catch (err) {
    console.error('Erro obter produto:', err);
    res.status(500).json({ erro: 'Erro ao obter produto' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { nome_produto, categoria = '', quantidade_inicial = 0 } = req.body;
    if (!nome_produto) return res.status(400).json({ erro: 'nome_produto é obrigatório' });

    const linhas = await sheets.lerTodasLinhas();
    // gerar id automático
    const novoId = gerarProximoId(linhas);

    const agora = agoraFormatadoBR();
    const linha = [
      novoId,
      nome_produto,
      categoria,
      Number(quantidade_inicial),
      agora,                
      'Cadastro inicial',   
      Number(quantidade_inicial), 
      agora,               
      agora            
    ];

    await sheets.adicionarLinha(linha);
    return res.status(201).json({ status: 'ok', id_produto: novoId });
  } catch (err) {
    console.error('Erro cadastrar produto:', err);
    res.status(500).json({ erro: 'Erro ao cadastrar produto' });
  }
});

router.put('/:id/entrada', async (req, res) => {
  try {
    const id = req.params.id;
    const { quantidade } = req.body;
    if (quantidade == null) return res.status(400).json({ erro: 'quantidade é obrigatório' });
    const q = Number(quantidade);
    if (isNaN(q) || q <= 0) return res.status(400).json({ erro: 'quantidade deve ser número > 0' });

    const linhas = await sheets.lerTodasLinhas();
    const index = linhas.findIndex(r => (r[0] || '').toString().trim() === id);

    const agora = agoraFormatadoBR();

    if (index === -1) {
      const nomeProvisorio = id;
      const linha = [
        id,
        nomeProvisorio,
        '',
        q,
        agora,
        'Entrada',
        q,
        agora,
        agora
      ];
      await sheets.adicionarLinha(linha);
      return res.json({ status: 'ok', message: 'Produto criado e estoque atualizado' });
    } else {
      const row = linhas[index];
      const atualQuantidade = Number(row[3] || 0);
      const novaQuantidade = atualQuantidade + q;

      const novaLinha = [
        row[0] || id,           
        row[1] || '',          
        row[2] || '',           
        novaQuantidade,         
        agora,                  
        'Entrada',            
        q,                    
        row[7] || row[7] || '', 
        agora                   
      ];
      await sheets.atualizarLinhaPorIndex(index, novaLinha);
      return res.json({ status: 'ok', message: 'Estoque atualizado' });
    }
  } catch (err) {
    console.error('Erro entrada estoque:', err);
    res.status(500).json({ erro: 'Erro ao atualizar estoque' });
  }
});

router.put('/:id/saida', async (req, res) => {
  try {
    const id = req.params.id;
    const { quantidade } = req.body;
    if (quantidade == null) return res.status(400).json({ erro: 'quantidade é obrigatório' });
    const q = Number(quantidade);
    if (isNaN(q) || q <= 0) return res.status(400).json({ erro: 'quantidade deve ser número > 0' });

    const linhas = await sheets.lerTodasLinhas();
    const index = linhas.findIndex(r => (r[0] || '').toString().trim() === id);

    const agora = agoraFormatadoBR();

    if (index === -1) {
      return res.status(404).json({ erro: 'Produto não encontrado' });
    } else {
      const row = linhas[index];
      const atualQuantidade = Number(row[3] || 0);
      const novaQuantidade = atualQuantidade - q;
      if (novaQuantidade < 0) return res.status(400).json({ erro: 'Quantidade insuficiente em estoque' });

      const novaLinha = [
        row[0] || id,
        row[1] || '',
        row[2] || '',
        novaQuantidade,
        agora,
        'Saída',
        -q,           
        row[7] || '', 
        agora
      ];
      await sheets.atualizarLinhaPorIndex(index, novaLinha);
      return res.json({ status: 'ok', message: 'Saída registrada e estoque atualizado' });
    }
  } catch (err) {
    console.error('Erro saída estoque:', err);
    res.status(500).json({ erro: 'Erro ao registrar saída' });
  }
});

module.exports = router;
