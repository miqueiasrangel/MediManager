const { google } = require('googleapis');
const path = require('path');

const SPREADSHEET_ID = process.env.ID_PLANILHA;
const ABA = process.env.ABA || 'estoque';

// Autenticação via Service Account (arquivo credentials.json na pasta raiz do servidor)
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '..', '..', 'credentials.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

async function getSheetsClient() {
  const client = await auth.getClient();
  return google.sheets({ version: 'v4', auth: client });
}

// Ler todas as linhas (exceto cabeçalho) - retorna array de arrays
async function lerTodasLinhas() {
  const sheets = await getSheetsClient();
  const range = `${ABA}!A2:I`; // colunas A..I correspondem às 9 colunas do layout
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range,
  });
  return res.data.values || [];
}

// Adicionar nova linha (append)
async function adicionarLinha(linha) {
  const sheets = await getSheetsClient();
  const range = `${ABA}!A2:I`;
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range,
    valueInputOption: 'RAW',
    requestBody: { values: [linha] },
  });
}

// Atualizar linha específica (linhaIndex é 0-based dentro do resultado de lerTodasLinhas())
// para a planilha, precisamos enviar range começando em A{n} até I{n}
async function atualizarLinhaPorIndex(linhaIndex, valoresLinha) {
  const sheets = await getSheetsClient();
  const planilhaRowNumber = 2 + linhaIndex; // porque A2 é índice 0
  const range = `${ABA}!A${planilhaRowNumber}:I${planilhaRowNumber}`;
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range,
    valueInputOption: 'RAW',
    requestBody: { values: [valoresLinha] },
  });
}

module.exports = {
  lerTodasLinhas,
  adicionarLinha,
  atualizarLinhaPorIndex,
};
