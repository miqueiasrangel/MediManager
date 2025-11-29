const { google } = require('googleapis');
const path = require('path');

const SPREADSHEET_ID = process.env.ID_PLANILHA;
const ABA = process.env.ABA || 'estoque';

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '..', '..', 'credentials.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

async function getSheetsClient() {
  const client = await auth.getClient();
  return google.sheets({ version: 'v4', auth: client });
}

async function lerTodasLinhas() {
  const sheets = await getSheetsClient();
  const range = `${ABA}!A2:I`; 
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range,
  });
  return res.data.values || [];
}

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

async function atualizarLinhaPorIndex(linhaIndex, valoresLinha) {
  const sheets = await getSheetsClient();
  const planilhaRowNumber = 2 + linhaIndex;
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
