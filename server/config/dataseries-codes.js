// BCB SGS Series Codes (source: https://www.bcb.gov.br/estatisticas/sgs)
const BCB_SERIES = {
  CDI: { sgsCode: '4389', startDate:'30/06/1994' },          // CDI base 252
  SELIC: { sgsCode: '1178', startDate:'30/06/1994' },          // SELIC base 252
  TR1:   { sgsCode: '7811', startDate:'30/06/1994' },          // TR 1o dia do mês taxa ao mês
  USD_PTAX: { sgsCode: '1', startDate:'30/06/1994' },          // USD/BRL exchange rate PTAX
  EUR_PTAX: { sgsCode: '21619', startDate:'30/06/1994' },      // EUR/BRL exchange rate PTAX
  POUPANCA_NOVA: { sgsCode: '196', startDate:'01/06/2012' },   // Rendimento Poupança Nova aniversário dia 1 (a partir de 4/5/2012) ao mês)
  // Add more series as needed
};

// Freeze to prevent accidental modification
module.exports = Object.freeze(BCB_SERIES);