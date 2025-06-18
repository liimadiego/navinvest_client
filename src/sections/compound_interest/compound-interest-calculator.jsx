import { useState, useEffect } from 'react';
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
  Container,
  Card,
  CardContent,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Chart, useChart } from 'src/components/chart';
import { fCurrency } from 'src/utils/format-number';
import CalculateIcon from '@mui/icons-material/Calculate';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

function formatCurrency(value) {
  if (!value && value !== 0) return '';

  // Remove non-digit characters
  let digits = value.toString().replace(/\D/g, '');

  // Handle empty input
  if (!digits) return '';

  // Convert to number with decimal places
  const num = parseInt(digits, 10) / 100;

  // Format with Brazilian notation
  return num.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatPercentage(value) {
  if (!value && value !== 0) return '';

  // Remove non-digit characters except comma
  let sanitized = value.toString().replace(/[^\d,]/g, '');

  // Replace comma with dot for calculations
  sanitized = sanitized.replace(',', '.');

  // Limit to 2 decimal places
  const parts = sanitized.split('.');
  if (parts.length > 1 && parts[1].length > 2) {
    sanitized = `${parts[0]}.${parts[1].substring(0, 2)}`;
  }

  // Format back to display with comma
  return sanitized.replace('.', ',');
}

function parseCurrencyToNumber(formatted) {
  if (!formatted) return 0;
  return parseFloat(formatted.replace(/\./g, '').replace(',', '.'));
}

export function CompoundInterestCalculator() {
  const theme = useTheme();
  const [initial, setInitial] = useState('');
  const [monthly, setMonthly] = useState('');
  const [rate, setRate] = useState('');
  const [rateType, setRateType] = useState('anual');
  const [period, setPeriod] = useState('');
  const [periodType, setPeriodType] = useState('anos');
  const [results, setResults] = useState(null);

  const handleInitialChange = (e) => {
    const formatted = formatCurrency(e.target.value.replace(/\D/g, ''));
    setInitial(formatted);
  };

  const handleMonthlyChange = (e) => {
    const formatted = formatCurrency(e.target.value.replace(/\D/g, ''));
    setMonthly(formatted);
  };

  const handleRateChange = (e) => {
    setRate(formatPercentage(e.target.value));
  };

  const handlePeriodChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setPeriod(value);
  };

  const handleCalculate = () => {
    const initialValue = parseCurrencyToNumber(initial) || 0;
    const monthlyValue = parseCurrencyToNumber(monthly) || 0;
    let rateValue = parseFloat(String(rate).replace(',', '.')) || null;
    let months = parseInt(period, 10) || 0;

    if (isNaN(months) || months <= 0) {
      alert('Por favor, insira um período válido em meses ou anos.');
      return;
    }

    if (periodType === 'anos') months *= 12;

    if (rateType === 'anual') {
      rateValue = Math.pow(1 + rateValue / 100, 1 / 12) - 1;
    } else {
      rateValue /= 100;
    }

    let balance = initialValue;
    let invested = initialValue;
    let totalInterest = 0;
    const categories = [];
    const investedSeries = [];
    const interestSeries = [];
    const totalSeries = [];
    const rows = [];

    for (let i = 0; i < months; i += 1) {
      const monthlyInterest = balance * rateValue;

      balance += monthlyInterest;

      totalInterest += monthlyInterest;

      categories.push(i.toString());
      investedSeries.push(invested);
      interestSeries.push(totalInterest);
      totalSeries.push(balance);

      rows.push({
        id: i,
        month: i + 1,
        interest: monthlyInterest,
        invested,
        totalInterest,
        total: balance,
      });

      balance += monthlyValue;
      invested += monthlyValue;
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
    const sampledTotal = sampleData(totalSeries);

    setResults({
      final: balance,
      invested,
      totalInterest,
      chart: {
        categories: sampledCategories,
        investedSeries: sampledInvested,
        interestSeries: sampledInterest,
        totalSeries: sampledTotal,
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

  const chartOptions = useChart({
    chart: {
      // stacked: false,
      // zoom: { enabled: false },
    },
    legend: { position: 'top', horizontalAlign: 'right' },
    xaxis: {
      categories: results?.chart.categories || [],
      labels: {
        formatter: (value) => `${parseInt(value) + 1}m`,
        style: { colors: theme.palette.text.secondary }
      }
    },
    yaxis: {
      labels: {
        formatter: (value) => fCurrency(value, 'BRL', 0),
        style: { colors: theme.palette.text.secondary }
      }
    },
    tooltip: {
      y: {
        formatter: (val) => fCurrency(val, 'BRL'),
      },
      theme: theme.palette.mode,
    },
    fill: {
      opacity: 0.8,
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
      },
    },
    stroke: { curve: 'smooth', width: 2 },
    grid: {
      borderColor: theme.palette.divider,
    },
  });

  const columns = [
    { field: 'month', headerName: 'Mês', width: 80, align: 'center', headerAlign: 'center' },
    {
      field: 'interest',
      headerName: 'Juros do mês',
      minWidth: 140,
      flex: 1,
      valueFormatter: (value) => { return fCurrency(value, 'BRL') },
    },
    {
      field: 'invested',
      headerName: 'Total Investido',
      minWidth: 140,
      flex: 1,
      valueFormatter: (value) => fCurrency(value, 'BRL'),
    },
    {
      field: 'totalInterest',
      headerName: 'Total em Juros',
      minWidth: 140,
      flex: 1,
      valueFormatter: (value) => fCurrency(value, 'BRL'),
    },
    {
      field: 'total',
      headerName: 'Montante Acumulado',
      minWidth: 160,
      flex: 1,
      valueFormatter: (value) => fCurrency(value, 'BRL'),
    },
  ];

  return (
    <Box sx={{ py: 4, pt: 0, px: { xs: 2, md: 4 } }}>
      <Paper
        elevation={3}
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          bgcolor: 'background.paper',
          pb: results ? 4 : 0
        }}
      >
        <Box
          bgcolor='background.'
          sx={{
            p: 3,
            textAlign: 'center'
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Calculadora de Juros Compostos
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Simule seus investimentos e veja o poder dos juros compostos
          </Typography>
        </Box>

        <Box sx={{ px: { xs: 2, md: 4 } }}>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Valor inicial"
                value={initial}
                onChange={handleInitialChange}
                placeholder="0,00"
                variant="outlined"
                InputProps={{
                  startAdornment: <Box component="span" sx={{ color: 'text.secondary', mr: 1 }}>R$</Box>,
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Aporte mensal"
                value={monthly}
                onChange={handleMonthlyChange}
                placeholder="0,00"
                variant="outlined"
                InputProps={{
                  startAdornment: <Box component="span" sx={{ color: 'text.secondary', mr: 1 }}>R$</Box>,
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative' }}>
                <TextField
                  fullWidth
                  label="Taxa de juros"
                  value={rate}
                  onChange={handleRateChange}
                  placeholder="0,00"
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <FormControl variant="standard" sx={{ minWidth: 100, borderBottom: 'none' }}>
                        <Select
                          value={rateType}
                          onChange={(e) => setRateType(e.target.value)}
                          sx={{ ml: 1, borderBottom: 'none' }}
                        >
                          <MenuItem value="mensal">ao mês</MenuItem>
                          <MenuItem value="anual">ao ano</MenuItem>
                        </Select>
                      </FormControl>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative' }}>
                <TextField
                  fullWidth
                  label="Período"
                  value={period}
                  onChange={handlePeriodChange}
                  placeholder="0"
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <FormControl variant="standard" sx={{ minWidth: 100 }}>
                        <Select
                          value={periodType}
                          onChange={(e) => setPeriodType(e.target.value)}
                          sx={{ ml: 1 }}
                        >
                          <MenuItem value="meses">meses</MenuItem>
                          <MenuItem value="anos">anos</MenuItem>
                        </Select>
                      </FormControl>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                />
              </Box>
            </Grid>
          </Grid>

          <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleClear}
              size="large"
              startIcon={<RestartAltIcon />}
              sx={{ py: 1.5, borderRadius: 1 }}
            >
              Limpar
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={handleCalculate}
              size="large"
              startIcon={<CalculateIcon />}
              sx={{
                py: 1.5,
                borderRadius: 1,
                // background: theme => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              }}
            >
              Calcular
            </Button>
          </Stack>

          {results && (
            <Box>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                  <Card
                    elevation={2}
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)'
                      },
                      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.15)} 100%)`
                    }}
                  >
                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary', fontWeight: 500 }}>
                        Montante Final
                      </Typography>
                      <Typography variant="h4" color="primary.main" fontWeight="bold">
                        {fCurrency(results.final, 'BRL')}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card
                    elevation={2}
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)'
                      },
                      background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.05)} 0%, ${alpha(theme.palette.success.main, 0.15)} 100%)`
                    }}
                  >
                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary', fontWeight: 500 }}>
                        Total Investido
                      </Typography>
                      <Typography variant="h4" color="success.main" fontWeight="bold">
                        {fCurrency(results.invested, 'BRL')}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card
                    elevation={2}
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)'
                      },
                      background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.05)} 0%, ${alpha(theme.palette.info.main, 0.15)} 100%)`
                    }}
                  >
                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary', fontWeight: 500 }}>
                        Total em Juros
                      </Typography>
                      <Typography variant="h4" color="info.main" fontWeight="bold">
                        {fCurrency(results.totalInterest, 'BRL')}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Card sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }}>
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Evolução do Investimento
                  </Typography>
                  <Chart
                    type="area"
                    series={[
                      { name: 'Montante Acumulado', data: results.chart.totalSeries },
                      { name: 'Total Investido', data: results.chart.investedSeries },
                      // { name: 'Total em Juros', data: results.chart.interestSeries },
                    ]}
                    options={chartOptions}
                    sx={{ height: 400, width: '100%' }}
                  />
                </CardContent>
              </Card>

              <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Detalhamento Mensal
                  </Typography>
                  <Box sx={{ height: 'auto' }}>
                    <DataGrid
                      rows={results.rows}
                      columns={columns}
                      autoHeight
                      disableColumnMenu
                      hideFooter={results.rows.length <= 10}
                      initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                      }}
                      pageSizeOptions={[10, 25, 50, 100]}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
