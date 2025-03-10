import React, { useState } from 'react';
import { TickerSelector } from 'src/components/ticker-selector';
import { Box, Button, Card, Grid, Typography } from '@mui/material';
import { CardAssetInfo } from './card-asset-info';

export function CompareAssetsForm() {

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

  const [leftAsset, setLeftAsset] = useState({});
  const [rightAsset, setRightAsset] = useState({});

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

  return (
    <Card elevation={3} sx={{ padding: 2 }} style={{ overflow: 'visible' }}>
      <Typography variant="h6" gutterBottom padding={"0 0 8px 4px"}>
        Comparador de Ativos
      </Typography>
      <Box component="form" noValidate autoComplete="off">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TickerSelector onAddTicker={onAddTicker1} selectedTickers={selectedTickers} />
            {leftAsset && leftAsset.name && <CardAssetInfo assetInfo={leftAsset} onDelete={deleteLeftAsset} />}
          </Grid>
          <Grid item xs={12} sm={6}>
            <TickerSelector onAddTicker={onAddTicker2} selectedTickers={selectedTickers} />
            {rightAsset && rightAsset.name && <CardAssetInfo assetInfo={rightAsset} onDelete={deleteRightAsset} />}
          </Grid>
          <Box paddingTop={2} width={"100%"} display={'flex'} justifyContent={'end'}>
            <Button variant="contained" color="primary" type="submit">
              Comparar
            </Button>
          </Box>
        </Grid>
      </Box>
    </Card>
  );
}