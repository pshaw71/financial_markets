// BCB SGS Series Codes (source: https://www.bcb.gov.br/estatisticas/sgs)
const DATA_SERIES = {
  // CDI base 252
  CDI: { sgsCode: '4389', startDate: '30/06/1994', schemaType: 'date_value' },
  // SELIC base 252
  SELIC: { sgsCode: '1178', startDate: '30/06/1994', schemaType: 'date_value' }, 
  // TR 1o dia do mês taxa ao mês
  TR1: { sgsCode: '7811', startDate: '30/06/1994', schemaType: 'date_value' },    
  // USD/BRL exchange rate PTAX
  USD_PTAX: { sgsCode: '1', startDate: '30/06/1994', schemaType: 'date_value' },     
  // EUR/BRL exchange rate PTAX
  EUR_PTAX: { sgsCode: '21619', startDate: '30/06/1994', schemaType: 'date_value' },      
  // Rendimento Poupança Nova aniversário dia 1 (a partir de 4/5/2012) ao mês)
  POUPANCA_NOVA: { sgsCode: '196', startDate:'01/06/2012', schemaType: 'date_value' },   
  // Add more series as needed
};

// Freeze to prevent accidental modification
module.exports = Object.freeze(DATA_SERIES);