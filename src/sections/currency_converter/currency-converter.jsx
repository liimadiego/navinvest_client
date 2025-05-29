import React, { useState, useEffect } from 'react';
import {
  TextField, Typography, Autocomplete, Button, Paper, Box,
  CircularProgress, Grid, Tooltip, IconButton, Fade, Divider
} from '@mui/material';
import Alert from '@mui/material/Alert';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ReportOutlinedIcon from '@mui/icons-material/ReportOutlined';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import axios from 'src/lib/axios';

function formatNumberInput(input) {
  if (!input) return { formatted: '', number: null };
  let sanitizedValue = String(input).replace(/[^\d,]/g, '');
  if (!sanitizedValue) return { formatted: '', number: null };

  let splitNumber = sanitizedValue.split(',');

  if (splitNumber.length > 2)
    splitNumber.splice(1, splitNumber.length - 1, splitNumber.slice(1).join('').replace(/\./g, ''));
  else if (splitNumber.length > 1)
    splitNumber[1] = splitNumber[1].replace(/\./g, '');

  if (!splitNumber[0])
    splitNumber[0] = '0';
  else
    splitNumber[0] = new Intl.NumberFormat('pt-BR').format(parseInt(splitNumber[0].replace(/\./g, '')));

  const formatted = splitNumber.join(',');
  const number = parseFloat(formatted.replaceAll('.', '').replace(',', '.'));

  return { formatted, number };
}

export function CurrencyConverter() {
  const [fromAmount, setFromAmount] = useState(null);
  const [fromCurrency, setFromCurrency] = useState('BRL');
  const [toAmount, setToAmount] = useState(null);
  const [toCurrency, setToCurrency] = useState('USD');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputValue, setInputValue] = useState('');

  const currencyOptions = [
    { code: 'USD', label: 'Dólar Americano (USD)' },
    { code: 'EUR', label: 'Euro (EUR)' },
    { code: 'BRL', label: 'Real Brasileiro (BRL)' },
    { code: 'GBP', label: 'Libra Esterlina (GBP)' },
    { code: 'JPY', label: 'Iene Japonês (JPY)' },
    { code: 'CAD', label: 'Dólar Canadense (CAD)' },
    { code: 'AUD', label: 'Dólar Australiano (AUD)' },
    { code: 'CHF', label: 'Franco Suíço (CHF)' }
  ];

  useEffect(() => {
    // Auto-convert when both currencies are selected and amount is entered
    if (fromAmount && fromCurrency && toCurrency) {
      fetchExchangeRate();
    }
  }, [fromAmount, fromCurrency, toCurrency]);

  const fetchExchangeRate = async () => {
    if (!fromAmount || !fromCurrency || !toCurrency) return;

    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post(`/currency-converter/convert`, {
        from: fromCurrency,
        to: toCurrency
      });

      const rate = Math.round(data.rate * 1e5) / 1e5;
      setExchangeRate(rate);

      const convertedAmount = fromAmount * rate;
      const { formatted } = formatNumberInput(convertedAmount.toFixed(2).replace('.', ','));
      setToAmount(formatted);
    } catch (err) {
      setError("Não foi possível realizar a conversão. Tente novamente.");
      setToAmount(null);
      setExchangeRate(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);

    if (toAmount) {
      const tempAmount = formatNumberInput(toAmount).number;
      setFromAmount(tempAmount);
      setInputValue(toAmount);
      setToAmount(null);
    }

    setExchangeRate(null);
  };

  const handleFromAmountChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
    const { formatted, number } = formatNumberInput(value);
    setFromAmount(number);
    event.target.value = formatted;
  };

  return (
    <Paper
      elevation={4}
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: 'background.paper'
      }}
    >
      <Box sx={{ p: 3, pb: 2 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{
          display: 'flex',
          alignItems: 'center',
          fontWeight: 600,
          color: 'primary.main'
        }}>
          <CurrencyExchangeIcon sx={{ mr: 1 }} />
          Conversor de Moedas
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{
              p: 3,
              height: '100%',
              borderRadius: 2,
              bgcolor: 'background.default',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Valor para conversão
                </Typography>
                <TextField
                  id="fromAmount"
                  fullWidth
                  variant="outlined"
                  placeholder="0,00"
                  value={inputValue}
                  onChange={handleFromAmountChange}
                  onBlur={(e) => {
                    const { formatted } = formatNumberInput(e.target.value);
                    setInputValue(formatted);
                  }}
                  InputProps={{
                    startAdornment: fromCurrency ? (
                      <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                        {fromCurrency}
                      </Typography>
                    ) : null
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Autocomplete
                  options={currencyOptions}
                  getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
                  value={currencyOptions.find(option => option.code === fromCurrency) || null}
                  onChange={(_, newValue) => {
                    setFromCurrency(newValue ? newValue.code : '');
                    setError(null);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="De"
                      fullWidth
                      variant="outlined"
                    />
                  )}
                  sx={{ flex: 1 }}
                />

                <IconButton
                  onClick={handleSwapCurrencies}
                  sx={{
                    transform: 'rotate(90deg)',
                    mx: 2,
                    bgcolor: 'primary.light',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.main',
                    }
                  }}
                >
                  <SwapVertIcon />
                </IconButton>

                <Autocomplete
                  options={currencyOptions}
                  getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
                  value={currencyOptions.find(option => option.code === toCurrency) || null}
                  onChange={(_, newValue) => {
                    setToCurrency(newValue ? newValue.code : '');
                    setError(null);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Para"
                      fullWidth
                      variant="outlined"
                    />
                  )}
                  sx={{ flex: 1 }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Resultado da conversão
                </Typography>
                <TextField
                  disabled
                  fullWidth
                  variant="outlined"
                  value={loading ? 'Calculando...' : (toAmount || '')}
                  InputProps={{
                    startAdornment: toCurrency ? (
                      <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                        {toCurrency}
                      </Typography>
                    ) : null,
                    endAdornment: loading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : null
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'background.paper',
                      fontWeight: 'bold'
                    }
                  }}
                />
              </Box>

              {exchangeRate && (
                <Fade in={!!exchangeRate}>
                  <Alert
                    icon={<InfoOutlinedIcon />}
                    severity="info"
                    variant="outlined"
                    sx={{ mb: 2 }}
                  >
                    <Typography variant="body2">
                      Taxa de câmbio: 1 {fromCurrency} = {formatNumberInput((exchangeRate.toFixed(5)).replace('.', ',')).formatted} {toCurrency}
                    </Typography>
                  </Alert>
                </Fade>
              )}

              {error && (
                <Alert
                  icon={<ReportOutlinedIcon />}
                  severity="error"
                  variant="outlined"
                >
                  {error}
                </Alert>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                📊 Converta Moedas com Facilidade e Precisão
              </Typography>

              <Typography variant="body1" paragraph>
                Com nosso conversor de moedas, você pode calcular rapidamente valores entre diversas moedas com taxas atualizadas em tempo real. Ideal para:
              </Typography>

              <Box sx={{ ml: 2, mb: 2 }}>
                <Typography component="div" variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  ✈️ <Box component="span" sx={{ ml: 1 }}>Planejamento de viagens internacionais</Box>
                </Typography>
                <Typography component="div" variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  💼 <Box component="span" sx={{ ml: 1 }}>Investimentos no exterior</Box>
                </Typography>
                <Typography component="div" variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  🛒 <Box component="span" sx={{ ml: 1 }}>Compras em sites internacionais</Box>
                </Typography >
                <Typography component="div" variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                  📱 <Box component="span" sx={{ ml: 1 }}>Transferências internacionais</Box>
                </Typography >
              </Box >

              <Typography variant="body1" paragraph>
                Simplifique suas conversões monetárias e tome decisões financeiras com confiança!
              </Typography>


            </Box >
          </Grid >
        </Grid >
      </Box >
    </Paper >
  );
}