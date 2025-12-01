# 📦 Sistema de Controle de Estoque para Medicamentos de Posto de Saúde Publico (Google Sheets + Node.js + React)

Este é um sistema completo de **controle de estoque para postos de saúde publico**, utilizando:

- **Google Sheets** como banco de dados  
- **Node.js + Express** no backend  
- **React (Vite)** no frontend  
- **Railway** para deploy (backend + frontend juntos)  

O objetivo é oferecer um sistema simples, rápido e moderno para registrar:

✔ Produtos  
✔ Entradas e saídas de estoque  
✔ Quantidades atualizadas  
✔ Movimentações registradas automaticamente

---

# 🚀 1. Como instalar e rodar localmente

## 🔧 Pré-requisitos

- Node.js 18+  
- NPM  
- Conta Google  
- Planilha do Google Sheets  
- Credenciais JSON do Google Cloud (Service Account)

---

# 📝 2. Configurando o Google Sheets

## 2.1 Crie uma planilha no Google Sheets  
Com estas colunas:

id_produto
nome_produto
categoria
quantidade
ultima_movimentacao
tipo_movimentacao
quantidade_movimentada
criado_em
atualizado_em


## 2.2 Obtenha o ID da planilha  
O ID está na URL:
https://docs.google.com/spreadsheets/d/SEU_ID_AQUI/edit


## 2.3 Criar credenciais no Google Cloud

1. Acesse: https://console.cloud.google.com  
2. Ative a API **Google Sheets API**  
3. Vá em: **APIs e Serviços → Credenciais**  
4. Crie uma **Service Account**  
5. Gere a chave **JSON**  
6. Baixe o arquivo e renomeie para (credentials.json) e adicione na raiz do projeto

## 2.4 Compartilhe a planilha com o email da Service Account

O email é semelhante a:
nome-do-projeto@nome-projeto.iam.gserviceaccount.com

está dentro de (credentials.json).


Clique em **Compartilhar** na planilha e conceda **Editor**.

---

# 🖥 3. Instalar o Backend

```bash
cd backend
npm install

Crie o arquivo .env:
PORTA=PORTA-DO-SERVIDOR-BACKEND
ID_PLANILHA=ID-DA-SUA-PLANILHA
ABA=NOME-DA-ABA-DA-SUA-PLANILHA

🖼 4. Instalar o Frontend

cd frontend
npm install

Rodar em ambiente de desenvolvimento:
npm run dev

