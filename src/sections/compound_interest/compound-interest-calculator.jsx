import { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Grid,
  Paper,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Stack,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Chart, useChart } from 'src/components/chart';
import { fCurrency } from 'src/utils/format-number';

function formatNumberInput(input) {
  if (!input) return { formatted: '', number: null };
  let sanitizedValue = String(input).replace(/[^\d,]/g, '');
  if (!sanitizedValue) return { formatted: '', number: null };

  let splitNumber = sanitizedValue.split(',');

  if (splitNumber.length > 2)
    splitNumber.splice(1, splitNumber.length - 1, splitNumber.slice(1).join('').replace(/\./g, ''));
  else if (splitNumber.length > 1) splitNumber[1] = splitNumber[1].replace(/\./g, '');

  if (!splitNumber[0]) splitNumber[0] = '0';
  else
    splitNumber[0] = new Intl.NumberFormat('pt-BR').format(
      parseInt(splitNumber[0].replace(/\./g, ''))
    );

  const formatted = splitNumber.join(',');
  const number = parseFloat(formatted.replaceAll('.', '').replace(',', '.'));

  return { formatted, number };
}

export function CompoundInterestCalculator() {
  const [initial, setInitial] = useState('');
  const [monthly, setMonthly] = useState('');
  const [rate, setRate] = useState('');
  const [rateType, setRateType] = useState('mensal');
  const [period, setPeriod] = useState('');
  const [periodType, setPeriodType] = useState('meses');
  const [results, setResults] = useState(null);

  const handleCalculate = () => {
    const initialValue = formatNumberInput(initial).number || 0;
    const monthlyValue = formatNumberInput(monthly).number || 0;
    let rateValue = parseFloat(String(rate).replace(',', '.')) || 0;
    let months = parseInt(period, 10) || 0;

    if (periodType === 'anos') months *= 12;
    if (rateType === 'anual') rateValue /= 12;
    rateValue /= 100;

    let balance = initialValue;
    let invested = initialValue;
    let totalInterest = 0;
    const categories = [];
    const investedSeries = [];
    const interestSeries = [];
    const rows = [];

    for (let i = 1; i <= months; i += 1) {
      balance += monthlyValue; // depósito no início do mês
      invested += monthlyValue;
      const interest = balance * rateValue;
      balance += interest;
      totalInterest += interest;
      categories.push(i.toString());
      investedSeries.push(invested);
      interestSeries.push(totalInterest);
      rows.push({
        id: i,
        month: i,
        interest,
        invested,
        totalInterest,
        total: balance,
      });
    }

    const sampleData = (data, max = 25) => {
      if (data.length <= max) return data;
      const res = [];
      const step = (data.length - 1) / (max - 1);
      for (let i = 0; i < max; i += 1) {
        res.push(data[Math.round(i * step)]);
      }
      return res;
    };

    const sampledCategories = sampleData(categories);
    const sampledInvested = sampleData(investedSeries);
    const sampledInterest = sampleData(interestSeries);

    setResults({
      final: balance,
      invested,
      totalInterest,
      chart: {
        categories: sampledCategories,
        investedSeries: sampledInvested,
        interestSeries: sampledInterest,
      },
      rows,
    });
  };

  const handleClear = () => {
    setInitial('');
    setMonthly('');
    setRate('');
    setPeriod('');
    setResults(null);
  };

  const chartOptions = useChart(
    results
      ? {
          xaxis: { categories: results.chart.categories },
          tooltip: {
            y: {
              formatter: (val) => fCurrency(val, 'BRL'),
            },
          },
        }
      : {}
  );

  const columns = [
    { field: 'month', headerName: 'Mês', width: 80 },
    {
      field: 'interest',
      headerName: 'Juros',
      minWidth: 140,
      valueFormatter: ({ value }) => fCurrency(value, 'BRL'),
    },
    {
      field: 'invested',
      headerName: 'Total Investido',
      minWidth: 140,
      valueFormatter: ({ value }) => fCurrency(value, 'BRL'),
    },
    {
      field: 'totalInterest',
      headerName: 'Total Juros',
      minWidth: 140,
      valueFormatter: ({ value }) => fCurrency(value, 'BRL'),
    },
    {
      field: 'total',
      headerName: 'Total Acumulado',
      minWidth: 160,
      valueFormatter: ({ value }) => fCurrency(value, 'BRL'),
    },
  ];

  return (
    <Paper elevation={4} sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: 'primary.main' }}>
          Calculadora de Juros Compostos
        </Typography>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Valor inicial"
              value={initial}
              onChange={(e) => {
                const { formatted } = formatNumberInput(e.target.value);
                setInitial(formatted);
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Valor mensal"
              value={monthly}
              onChange={(e) => {
                const { formatted } = formatNumberInput(e.target.value);
                setMonthly(formatted);
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Taxa de juros (%)"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel id="rate-type-label">Período da taxa</InputLabel>
              <Select
                labelId="rate-type-label"
                label="Período da taxa"
                value={rateType}
                onChange={(e) => setRateType(e.target.value)}
              >
                <MenuItem value="mensal">Mensal</MenuItem>
                <MenuItem value="anual">Anual</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Período"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel id="period-type-label">Tipo de período</InputLabel>
              <Select
                labelId="period-type-label"
                label="Tipo de período"
                value={periodType}
                onChange={(e) => setPeriodType(e.target.value)}
              >
                <MenuItem value="meses">Meses</MenuItem>
                <MenuItem value="anos">Anos</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button fullWidth variant="contained" onClick={handleCalculate} sx={{ height: '100%' }}>
              Calcular
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button fullWidth variant="outlined" onClick={handleClear} sx={{ height: '100%' }}>
              Limpar
            </Button>
          </Grid>
        </Grid>

        {results && (
          <Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 3 }}>
              <Box>
                <Typography variant="subtitle2">Valor total final</Typography>
                <Typography variant="h6" color="primary.main">
                  {fCurrency(results.final, 'BRL')}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">Total investido</Typography>
                <Typography variant="h6" color="primary.main">
                  {fCurrency(results.invested, 'BRL')}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">Total em juros</Typography>
                <Typography variant="h6" color="primary.main">
                  {fCurrency(results.totalInterest, 'BRL')}
                </Typography>
              </Box>
            </Stack>

            <Chart
              type="area"
              series={[
                { name: 'Total Investido', data: results.chart.investedSeries },
                { name: 'Total em Juros', data: results.chart.interestSeries },
              ]}
              options={chartOptions}
              slotProps={{ loading: { p: 2.5 } }}
              sx={{ height: 320, mb: 3 }}
            />

            <DataGrid
              autoHeight
              rows={results.rows}
              columns={columns}
              disableColumnMenu
              hideFooter
              sx={{ mt: 2 }}
            />
          </Box>
        )}
      </Box>
    </Paper>
  );
}
