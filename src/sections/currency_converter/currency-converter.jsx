import React from 'react';
import { TextField, Typography, Autocomplete, Grid2, Button, Divider, Paper, Box, CircularProgress } from '@mui/material';
import Alert from '@mui/material/Alert';

import { default as InfoIcon } from '@mui/icons-material/InfoOutlined';
import { default as ErrorIcon } from '@mui/icons-material/ReportOutlined';
import { default as SwapIcon } from '@mui/icons-material/SwapHoriz';
import axios from 'src/lib/axios';

function formatNumberInput(input) {
  let sanitizedValue = input.replace(/[^\d,]/g, '');
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
  const [fromAmount, setFromAmount] = React.useState(null);
  const [fromCurrency, setFromCurrency] = React.useState('');
  const [toAmount, setToAmount] = React.useState(null);
  const [toCurrency, setToCurrency] = React.useState('');
  const [exchangeRate, setExchangeRate] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const currencyOptions = ['USD', 'EUR', 'BRL', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF'];

  const fetchExchangeRate = async () => {
    setLoading(true);
    setError(null);
    setExchangeRate(null);
    try {
      await axios.post(`/currency-converter/convert`, { from: fromCurrency, to: toCurrency })
        .then(({ data }) => {
          data.rate = Math.round(data.rate * 1e5) / 1e5;

          setExchangeRate(data.rate);

          const { formatted } = formatNumberInput(((fromAmount * data.rate).toFixed(8) * 1 + '').replace('.', ','));
          setToAmount(formatted);

          document.getElementById('toAmount').focus();
        });

    } catch (err) {
      setError(err.message);
      setExchangeRate(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFromCurrencyChange = (event, newValue) => {
    setFromCurrency((newValue.toUpperCase() || ''));
    setError(null);
    setToAmount(null);
    setExchangeRate(null);
  };

  const handleFromAmountChange = (event) => {
    const { value } = event.target;
    const { formatted, number } = formatNumberInput(value);
    setFromAmount(number);
    event.target.value = formatted;
    console.log(value, formatted, number);
  };

  const handleFromAmountBlur = (event) => {
    const { value } = event.target;
    const { formatted, number } = formatNumberInput(value);
    setFromAmount(number);
    event.target.value = formatted;
  };

  const handleToCurrencyChange = (event, newValue) => {
    setToCurrency((newValue.toUpperCase() || ''));
    setError(null);
    setToAmount(null);
    setExchangeRate(null);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 3
      }}
    >
      <Box sx={{ flex: 2, display: 'flex' }}>
        <Paper elevation={3} sx={{ p: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Grid2 container spacing={1} direction="column" sx={{ p: 3, pb: 4, flexGrow: 1 }}>
            <Grid2 container spacing={0} sx={{ px: 1 }}>
              <Grid2 size={12} flexDirection="row" sx={{ display: 'flex' }}>
                <TextField
                  id="fromAmount"
                  // variant="standard"
                  label="Valor original:"
                  onChange={handleFromAmountChange}
                  onBlur={handleFromAmountBlur}
                  fullWidth
                  slotProps={{
                    htmlInput: {
                      style: { textAlign: 'center', paddingLeft: '10px', paddingRight: '10px' }
                    },
                    // inputLabel: {
                    //   style: { paddingLeft: '10px' }
                    // }
                  }}
                />
              </Grid2>
            </Grid2>

            <Grid2 container spacing={1} sx={{ px: 1, my: 1, display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
              <Grid2 size={5}>
                <Autocomplete
                  options={currencyOptions}
                  id="fromCoin"
                  freeSolo
                  blurOnSelect
                  disableClearable
                  value={fromCurrency ? fromCurrency : ''}
                  onInputChange={handleFromCurrencyChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      // variant="standard"
                      label="De:"
                      onFocus={(event) => event.target.select()}
                      slotProps={{
                        htmlInput: {
                          ...params.inputProps,
                          style: { textTransform: 'uppercase', textAlign: 'center', paddingLeft: '10px', paddingRight: '10px' }
                        },
                        // inputLabel: {
                        //   ...params.inputLabel,
                        //   style: { paddingLeft: '10px' }
                        // }
                      }}
                    />
                  )}
                />
              </Grid2>
              <Grid2 size={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'end' }}>
                <Button
                  sx={{ p: 0.25, minWidth: 0, mb: 0.5 }}
                  variant="contained"
                  onClick={() => {
                    const tempFromAmount = fromAmount;
                    const tempFromCurrency = fromCurrency;
                    const tempToAmount = toAmount;
                    const tempToCurrency = toCurrency;

                    document.getElementById('fromAmount').value = tempToAmount;
                    setFromAmount(formatNumberInput(tempToAmount).number);
                    setFromCurrency(tempToCurrency);

                    const { formatted } = formatNumberInput((tempFromAmount + '').replace('.', ','));
                    setToAmount(formatted);
                    setToCurrency(tempFromCurrency);

                    setExchangeRate(null);
                    setError(null);
                  }}
                  disabled={!fromCurrency || !toCurrency || loading}
                >
                  <SwapIcon sx={{ p: 0, minWidth: 0, height: '22px', width: '22px' }} />
                </Button>
              </Grid2>
              <Grid2 size={5}>
                <Autocomplete
                  options={currencyOptions}
                  id="toCoin"
                  freeSolo
                  blurOnSelect
                  disableClearable
                  value={toCurrency ? toCurrency : ''}
                  onInputChange={handleToCurrencyChange}
                  renderInput={(params) =>
                    <TextField
                      {...params}
                      // variant="standard"
                      label="Para:"
                      onFocus={(event) => event.target.select()}
                      slotProps={{
                        htmlInput: {
                          ...params.inputProps,
                          style: { textTransform: 'uppercase', textAlign: 'center', paddingLeft: '10px', paddingRight: '10px' }
                        },
                        // inputLabel: {
                        //   ...params.inputLabel,
                        //   style: { paddingLeft: '10px' }
                        // }
                      }}
                    />
                  }
                />
              </Grid2>
            </Grid2>

            <Grid2 container spacing={0} sx={{ px: 1 }}>
              <Grid2 size={12} flexDirection={'row'} sx={{ display: 'flex' }}>
                <TextField
                  disabled
                  fullWidth
                  // variant="standard"
                  label="Valor após conversão:"
                  id="toAmount"
                  value={toAmount ? toAmount : ''}
                  slotProps={{
                    htmlInput: {
                      style: { textAlign: 'center', paddingLeft: '10px', paddingRight: '10px' }
                    },
                    // inputLabel: {
                    //   style: { paddingLeft: '10px' }
                    // }
                  }}
                />
              </Grid2>
            </Grid2>

            <Grid2 container spacing={1} sx={{ mt: 1 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={fetchExchangeRate}
                disabled={!fromAmount || !fromCurrency || !toCurrency || loading}
                sx={{ height: '40px' }}
              >
                {loading ? <CircularProgress size="20px" color="inherit" /> : "Converter"}
              </Button>
            </Grid2>

            <Grid2 sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              {
                (error && (
                  <Alert
                    sx={{
                      p: 0,
                      py: '2px',
                      fontSize: 14,
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      '& .MuiAlert-icon': { p: 0 },
                      '& .MuiAlert-message': { p: 0 }
                    }}
                    icon={<ErrorIcon sx={{ fontSize: 20, display: 'flex', alignItems: 'center' }} />}
                    severity="error"
                    variant="outlined"
                  >
                    {error}
                  </Alert>
                )) ||
                (exchangeRate && (
                  <Alert
                    sx={{
                      p: 0,
                      py: '2px',
                      fontSize: 14,
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      '& .MuiAlert-icon': { p: 0 },
                      '& .MuiAlert-message': { p: 0 }
                    }}
                    icon={<InfoIcon sx={{ fontSize: 20, display: 'flex', alignItems: 'center' }} />}
                    severity="info"
                    variant="outlined"
                  >
                    1 {fromCurrency} = {formatNumberInput(((exchangeRate * 1).toFixed(5) * 1 + '').replace('.', ',')).formatted} {toCurrency}
                  </Alert>
                ))
              }
            </Grid2>

          </Grid2>
        </Paper>
      </Box>

      <Box sx={{ flex: 3.5, display: 'flex' }}>
        <Paper elevation={3} sx={{ p: 3, pb: 4, width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ flexGrow: 1 }}>
            <h2 style={{ marginTop: 0 }}>📊 Converta Moedas com Facilidade e Precisão</h2>
            <p>Quer saber quanto vale o seu dinheiro em outras moedas? Com o nosso conversor, você pode calcular rapidamente valores entre diversas moedas com taxas atualizadas em tempo real. Ideal para viagens, investimentos internacionais ou compras no exterior. Simplifique suas conversões monetárias e tome decisões financeiras com confiança!</p>

            <p>✅ Informe o valor original
              <br />💱 Escolha as moedas para conversão (de/para)
              <br />🚀 Obtenha instantaneamente o valor convertido com a taxa mais atualizada
            </p>

            Clique em Converter e simplifique sua vida financeira! 💸
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}