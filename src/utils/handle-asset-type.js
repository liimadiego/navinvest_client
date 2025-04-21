export function translateAssetType(assetType, currency = 'BRL') {
  const type = assetType.toLowerCase();
  const currencyCode = currency.toUpperCase();

  if (type === 'stock' && currencyCode === 'BRL') return 'Ações';
  if (type === 'stock' && currencyCode === 'USD') return 'Stocks';

  const typeMap = {
    mutual_fund: 'Mutual Funds',
    fixed_income: 'Renda Fixa',
    treasury: 'Títulos Públicos',
    fii: 'FIIs',
    etf: 'ETFs',
    bdr: 'BDRs',
    reit: 'REITs',
    crypto: 'Criptomoedas',
    stablecoin: 'Criptomoedas',
  };

  return typeMap[type] || 'Others';
}