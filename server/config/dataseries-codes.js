// BCB SGS Series Codes (source: https://www.bcb.gov.br/estatisticas/sgs)
const BCB_SERIES = {
  CDI: '4389',            // CDI base 252
  SELIC: '1178',          // SELIC base 252
  TR: '7811'  ,           // TR taxa ao mês
  USD_PTAX_V: '1',        // USD/BRL exchange rate PTAX
  EUR_PTAX_V: '21619',    // EUR/BRL exchange rate PTAX
  // Add more series as needed
};

// Freeze to prevent accidental modification
module.exports = Object.freeze(BCB_SERIES);