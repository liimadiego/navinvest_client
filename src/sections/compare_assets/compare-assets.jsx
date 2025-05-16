import React, { useEffect, useState } from 'react';
import { TickerSelector } from 'src/components/ticker-selector';
import { Alert, Box, Button, Paper, Typography } from '@mui/material';
import { CardAssetInfo } from '../../components/card-asset-info';
import { ComparisonColumn } from './comparison-column';
import { MiddleComparisonColumn } from './middle-comparison-column';
import { WarningComparison } from './warning-comparison';
import axios from 'src/lib/axios';

export function CompareAssets() {

  const [selectedTickers, setSelectedTickers] = useState([]);
  const [inComparison, setInComparison] = useState(false);

  const [leftAsset, setLeftAsset] = useState({});
  const [rightAsset, setRightAsset] = useState({});

  const [leftAssetInfo, setLeftAssetInfo] = useState({});
  const [rightAssetInfo, setRightAssetInfo] = useState({});

  const [hasToShrinkThePanel, setHasToShrinkThePanel] = useState(false);

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
      const tickerInfo = await axios(`/ticker/${ticker}?&limit=1`)
        .then((response) => {
          if (response.status === 200 && Array.isArray(response.data) && response.data.length > 0) {
            const data = response.data.map(item => ({
              name: item.ticker,
              current_price: item.current_price,
              type: item.asset_type,
              asset_name: item.asset_name,
              ticker: item.ticker,
              image_url: item.asset_image_url,
              last_twelve_months: item.price_twelve_months_ago && item.current_price ? ((item.current_price - item.price_twelve_months_ago) / item.price_twelve_months_ago) : 0,
            }));

            return data[0];
          } else {
            throw new Error('Error fetching ticker data');
          }
        })
        .catch((error) => {
          console.error('Error fetching ticker data:', error);
          return null;
        });
      return tickerInfo;
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
    axios.get(`/companies/compare?tickers[]=${leftAsset.ticker}&tickers[]=${rightAsset.ticker}`)
      .then((response) => {
        if (response.status === 200) {
          const assetsInfo = response.data;
          const leftAssetInfo = assetsInfo[leftAsset.ticker];
          const rightAssetInfo = assetsInfo[rightAsset.ticker];
          setLeftAssetInfo(leftAssetInfo);
          setRightAssetInfo(rightAssetInfo);

          const leftAssetSector = leftAssetInfo?.generalInfo?.sector?.value || null;
          const rightAssetSector = rightAssetInfo?.generalInfo?.sector?.value || null;

          if (leftAssetSector && rightAssetSector && leftAssetSector !== rightAssetSector) {
            setWarningMessage('Você está comparando ativos de setores diferentes. A comparação pode não ser precisa.');
          } else {
            setWarningMessage('');
          }

        } else {
          console.error('Erro ao realizar comparação:', response);
        }
      }
      )
      .catch((error) => {
        console.error('Erro ao realizar comparação:', error);
      });


    // setWarningMessage('Você está comparando ativos de setores diferentes. A comparação pode não ser precisa.');
  }

  const getTranslation = (key) => {
    const translations = {
      generalInfo: 'Informações Gerais',
      valuation: 'Avaliação',
      profitability: 'Lucratividade',
      margins: 'Margens',
      debt: 'Endividamento',
      liquidity: 'Liquidez',
      revenueAndProfit: 'Receita e Lucro',
      otherIndicators: 'Outros Indicadores',
    }
    return translations[key] || key;
  }

  const handleNewCompare = () => {
    setInComparison(false);
    setLeftAsset({});
    setRightAsset({});
    setSelectedTickers([]);
    setWarningMessage('');
  }

  useEffect(() => {
    const handleWindowScroll = () => {
      console.log('Window scroll position:', window.scrollY);
      setHasToShrinkThePanel(window.scrollY > 80);
    };

    window.addEventListener('scroll', handleWindowScroll);

    return () => {
      window.removeEventListener('scroll', handleWindowScroll);
    };
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 3,
        alignItems: 'flex-start',
      }}>
      <Box flex={1.5} display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'} sx={{ width: "100%", position: 'relative' }}>
        <Paper elevation={6} sx={{
          padding: 2,
          position: 'sticky',
          top: '80px',
          zIndex: 10,
          width: "100%",
          maxWidth: "100%",
          overflow: 'visible'
        }}>
          <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} style={{
            height: hasToShrinkThePanel ? '0px' : '50px',
            overflow: 'hidden',
            transition: 'height 0.3s ease-in-out',
          }}>
            <Typography variant="h6" gutterBottom padding={"0 0 8px 4px"} sx={{ transform: 'translateY(7px)' }}>
              Comparador de Ativos
            </Typography>

            {inComparison && <Button onClick={handleNewCompare} variant="outlined" type="button" color="primary">
              Nova Comparação
            </Button>}
          </Box>

          <Box component="form" noValidate autoComplete="off">
            <Box display={'flex'} gap={2} style={{ width: '100%' }}>
              <Box style={{ width: inComparison ? '40%' : '50%' }}>
                {!inComparison && <TickerSelector assetType='stock' doNotRepeatCompany={true} onAddTicker={onAddTicker1} selectedTickers={selectedTickers} />}
                {leftAsset && leftAsset.name && <CardAssetInfo inComparison={inComparison} assetInfo={leftAsset} onDelete={deleteLeftAsset} />}
              </Box>
              {inComparison && <Paper elevation={4} sx={{ width: '20%', padding: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                VS
              </Paper>}
              <Box style={{ width: inComparison ? '40%' : '50%' }}>
                {!inComparison && <TickerSelector assetType='stock' doNotRepeatCompany={true} onAddTicker={onAddTicker2} selectedTickers={selectedTickers} />}
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

        {inComparison && warningMessage != '' && <Box width={inComparison ? "100%" : "100%"} maxWidth={"100%"} mt={2}>
          <WarningComparison text={warningMessage} />
        </Box>}

        {/* Considerações da IA (apenas um <Alert /> do mui que tem um botaõ para ver mais, esse botao abre um modal para leitura) */}
        {/* {inComparison && <Box width={inComparison ? "100%" : "100%"} maxWidth={"100%"} mt={2}>
          <Alert
            severity="info"
            sx={{ borderRadius: "16px" }}
          >
            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
              <Typography variant="body2" color="text.secondary">
                Considerações da IA
              </Typography>
              <Button variant="outlined" size="small" sx={{ marginLeft: 2 }} onClick={() => { }}>
                Ver mais
              </Button>
            </Box>
          </Alert>
        </Box>} */}


        {inComparison && leftAssetInfo && rightAssetInfo && (
          Object.keys(leftAssetInfo).flatMap((key) => {
            if (Object.keys(leftAssetInfo[key]).length > 0) {
              return [
                <Typography
                  key={`title-${key}`}
                  variant="h6"
                  sx={{ mt: 3, mb: 1, fontWeight: 'medium' }}
                >
                  {getTranslation(key)}
                </Typography>,
                ...Object.keys(leftAssetInfo[key]).map((key2, index) => {
                  return (
                    <Box key={`${key}-${key2}-${index}`} display={'flex'} gap={2} style={{ width: '100%', maxWidth: '100%', marginTop: "15px", zIndex: 1 }}>
                      <ComparisonColumn content={leftAssetInfo[key][key2].value} winner={leftAssetInfo[key][key2].winner} />
                      <MiddleComparisonColumn
                        title={leftAssetInfo[key][key2].translation}
                        description={leftAssetInfo[key][key2].tooltip} />
                      <ComparisonColumn content={rightAssetInfo[key][key2].value} winner={rightAssetInfo[key][key2].winner} />
                    </Box>
                  )

                }).filter(Boolean)
              ];
            }
            return [];
          })
        )}
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