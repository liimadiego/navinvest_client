import React, { useState } from 'react';
import { TickerSelector } from 'src/components/ticker-selector';
import { Box, Button, Paper, Typography } from '@mui/material';
import { CardAssetInfo } from './card-asset-info';
import { ComparisonColumn } from './comparison-column';
import { MiddleComparisonColumn } from './middle-comparison-column';
import { WarningComparison } from './warning-comparison';

export function CompareAssets() {

  //tirar isso depois, precisa ser pela API
  const availableTickers = [
    { name: 'PETR4', current_price: 28.45, type: 'Ação', companyName: 'Petrobras', ticker: 'PETR4', image_url: 'https://investidor10.com.br/storage/companies/63d2c9ead34db.jpg', 'last_twelve_months': -0.0052 },
    { name: 'PETR3', current_price: 29.45, type: 'Ação', companyName: 'Petrobras', ticker: 'PETR3', image_url: 'https://investidor10.com.br/storage/companies/63d2c9ead34db.jpg', 'last_twelve_months': 0.0011 },
    { name: 'BBAS3', current_price: 32.45, type: 'Ação', companyName: 'Banco do Brasil', ticker: 'BBAS3', image_url: 'https://investidor10.com.br/storage/companies/66ad149f52cd4.jpg', 'last_twelve_months': -0.002 },
    { name: 'ITSA4', current_price: 10.23, type: 'Ação', companyName: 'Itaúsa', ticker: 'ITSA4', image_url: 'https://investidor10.com.br/storage/companies/677fd88bf3163.png', 'last_twelve_months': -0.05 },
    { name: 'TAEE3', current_price: 28.67, type: 'Ação', companyName: 'Taesa', ticker: 'TAEE3', image_url: 'https://investidor10.com.br/storage/companies/677fd88bf3163.png', 'last_twelve_months': -0.0011 },
    { name: 'TAEE4', current_price: 29.12, type: 'Ação', companyName: 'Taesa', ticker: 'TAEE4', image_url: 'https://investidor10.com.br/storage/companies/677fd88bf3163.png', 'last_twelve_months': 0.001 },
    { name: 'TAEE11', current_price: 30.45, type: 'Ação', companyName: 'Taesa', ticker: 'TAEE11', image_url: 'https://investidor10.com.br/storage/companies/677fd88bf3163.png', 'last_twelve_months': 0.012 },
    { name: 'AURE3', current_price: 18.34, type: 'Ação', companyName: 'Auren Energia', ticker: 'AURE3', image_url: 'https://investidor10.com.br/storage/companies/677fd88bf3163.png', 'last_twelve_months': -0.05 },
    { name: 'CMIG3', current_price: 12.56, type: 'Ação', companyName: 'Cemig', 'last_twelve_months': -0.05, ticker: 'CMIG3', image_url: 'https://investidor10.com.br/storage/companies/677fd88bf3163.png', 'last_twelve_months': -0.05 },
    { name: 'CSMG3', current_price: 14.78, type: 'Ação', companyName: 'Copasa', ticker: 'CSMG3', image_url: 'https://investidor10.com.br/storage/companies/677fd88bf3163.png', 'last_twelve_months': -0.05 },
    { name: 'SAPR3', current_price: 7.89, type: 'Ação', companyName: 'Sanepar', ticker: 'SAPR3', image_url: 'https://investidor10.com.br/storage/companies/677fd88bf3163.png', 'last_twelve_months': -0.05 },
    { name: 'KLBN4', current_price: 22.34, type: 'Ação', companyName: 'Klabin', ticker: 'KLBN4', image_url: 'https://investidor10.com.br/storage/companies/677fd88bf3163.png', 'last_twelve_months': -0.05 },
    { name: 'WEGE3', current_price: 38.45, type: 'Ação', companyName: 'WEG', ticker: 'WEGE3', image_url: 'https://investidor10.com.br/storage/companies/677fd88bf3163.png', 'last_twelve_months': -0.05 },
  ];

  const [selectedTickers, setSelectedTickers] = useState([]);
  const [inComparison, setInComparison] = useState(false);

  const [leftAsset, setLeftAsset] = useState({});
  const [rightAsset, setRightAsset] = useState({});
  const [warningMessage, setWarningMessage] = useState('');

  const deleteRightAsset = () => {
    setRightAsset({});
    setSelectedTickers(leftAsset ? [leftAsset.ticker] : []);
  }

  const deleteLeftAsset = () => {
    setLeftAsset({});
    setSelectedTickers(rightAsset ? [rightAsset.ticker] : []);
  }

  const getCoreAssetInfo = async (ticker) => {
    try {
      // const response = await fetch(`http://localhost:3000/tickers/${ticker}`);
      // const tickerInfo = await response.json();
      // return tickerInfo;
      return availableTickers.find(t => t.ticker === ticker);
    } catch (error) {
      console.error(error);
    }
  }

  const onAddTicker1 = async (ticker) => {
    const newLeftAsset = await getCoreAssetInfo(ticker);
    setLeftAsset(newLeftAsset);
    setSelectedTickers([newLeftAsset.ticker, rightAsset.ticker]);
  }

  const onAddTicker2 = async (ticker) => {
    const newRightAsset = await getCoreAssetInfo(ticker);
    setRightAsset(newRightAsset);
    setSelectedTickers([leftAsset.ticker, newRightAsset.ticker]);
  }

  const handleCompare = () => {
    setInComparison(!inComparison);
    setWarningMessage('Você está comparando ativos de setores diferentes. A comparação pode não ser precisa.');
  }

  const handleNewCompare = () => {
    setInComparison(false);
    setLeftAsset({});
    setRightAsset({});
    setSelectedTickers([]);
    setWarningMessage('');
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 3,
        alignItems: 'flex-start',
      }}>
      <Box flex={1.5} display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'} maxWidth={"100%"} sx={{ width: inComparison ? '100%' : "100%" }}>
        <Paper elevation={12} sx={{ padding: 2 }} style={{ overflow: 'visible', width: "100%", maxWidth: "100%", zIndex: 2 }}>
          <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
            <Typography variant="h6" gutterBottom padding={"0 0 8px 4px"}>
              Comparador de Ativos
            </Typography>

            {inComparison && <Button onClick={handleNewCompare} variant="outlined" type="button" color="primary">
              Nova Comparação
            </Button>}
          </Box>

          <Box component="form" noValidate autoComplete="off">
            <Box display={'flex'} gap={2} style={{ width: '100%' }}>
              <Box style={{ width: inComparison ? '40%' : '50%' }}>
                {!inComparison && <TickerSelector doNotRepeatCompany={true} onAddTicker={onAddTicker1} selectedTickers={selectedTickers} />}
                {leftAsset && leftAsset.name && <CardAssetInfo inComparison={inComparison} assetInfo={leftAsset} onDelete={deleteLeftAsset} />}
              </Box>
              {inComparison && <Paper elevation={4} sx={{ width: '20%', padding: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                VS
              </Paper>}
              <Box style={{ width: inComparison ? '40%' : '50%' }}>
                {!inComparison && <TickerSelector doNotRepeatCompany={true} onAddTicker={onAddTicker2} selectedTickers={selectedTickers} />}
                {rightAsset && rightAsset.name && <CardAssetInfo side='right' inComparison={inComparison} assetInfo={rightAsset} onDelete={deleteRightAsset} />}
              </Box>
            </Box>

            {!inComparison && <Box paddingTop={2} width={"100%"} display={'flex'} justifyContent={'end'}>
              <Button onClick={handleCompare} variant="contained" color="primary" type="submit">
                Comparar
              </Button>
            </Box>}
          </Box>
        </Paper>

        {inComparison && <Box width={inComparison ? "100%" : "100%"} maxWidth={"100%"} mt={2}>
          <WarningComparison text={warningMessage} />
        </Box>}

        {inComparison && <Box width={inComparison ? "100%" : "100%"} maxWidth={"100%"}>
          <Box display={'flex'} gap={2} style={{ width: '100%', maxWidth: '100%', marginTop: "15px", zIndex: 1 }}>
            <ComparisonColumn content={12} />
            <MiddleComparisonColumn title={"P/L"} description={"O P/L (Preço sobre Lucro) é um indicador financeiro que mede a relação entre o preço da ação de uma empresa e o seu lucro por ação. É utilizado para avaliar se uma ação está cara ou barata em relação ao seu histórico de lucros."} />
            <ComparisonColumn content={13.4} />
          </Box>

          <Box display={'flex'} gap={2} style={{ width: '100%', maxWidth: '100%', marginTop: "15px", zIndex: 1 }}>
            <ComparisonColumn content={"13,74%"} />
            <MiddleComparisonColumn title={"P/VP"} description={"Compara o preço da ação com seu valor patrimonial."} />
            <ComparisonColumn content={"29,45%"} />
          </Box>

          <Box display={'flex'} gap={2} style={{ width: '100%', maxWidth: '100%', marginTop: "15px", zIndex: 1 }}>
            <ComparisonColumn
              type="donut_chart"
              chart={{
                series: [
                  { label: 'Brasil', value: 80290000000 },
                  { label: 'Uruguai', value: 3010000000 },
                  { label: 'Paraguai', value: 1470000000 },
                  { label: 'Chile', value: 1420000000 },
                ],
              }}
            />
            <MiddleComparisonColumn title={"Regiões de receita"} description={"Compara o preço da ação com seu valor patrimonial."} />
            <ComparisonColumn
              type="donut_chart"
              chart={{
                series: [
                  { label: 'Brasil', value: 85290000000 },
                  { label: 'China', value: 1510000000 },
                  { label: 'Estados Unidos', value: 3470000000 },
                  { label: 'Singapura', value: 3420000000 },
                  { label: 'Outros', value: 14010000000 },
                ],
              }}
            />
          </Box>
        </Box>}
      </Box>

      {!inComparison && <Box sx={{ flex: 1 }}>
        <Paper elevation={3} sx={{ p: 3, pb: 4 }}>
          <Box>
            <h2 style={{ marginTop: 0 }}>📊 Compare Empresas e Tome Decisões Mais Inteligentes</h2>
            <p>Escolha duas empresas e compare seus principais indicadores fundamentalistas! Descubra qual delas apresenta os melhores números em lucratividade, endividamento, crescimento e outros fatores essenciais para um investimento bem-sucedido.</p>

            <p>✅ Adicione empresas e veja uma análise lado a lado
              <br />📈 Compare indicadores financeiros e operacionais
              <br />📊 Identifique oportunidades com base em dados reais
            </p>

            Selecione os ativos e clique em Comparar para uma visão clara e objetiva do desempenho das empresas! 🚀
          </Box>
        </Paper>
      </Box>}
    </Box>
  );
}