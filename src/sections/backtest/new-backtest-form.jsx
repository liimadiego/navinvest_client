import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider, Controller, useFormContext } from 'react-hook-form';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { MenuItem, TextField, Button, Switch, FormControlLabel, List, ListItem, ListItemText, IconButton, InputAdornment, FormHelperText, Select } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useContext, useEffect, useState, useRef } from 'react';
import { BacktestContext } from 'src/context/BacktestContext';

export const newBacktestSchema = zod.object({
  portfolio: zod.array(zod.object({
    ticker: zod.string(),
    allocation: zod.string(),
  })).min(1, { message: 'Pelo menos um ticker é necessário' }),
  startDate: zod.string().min(1, { message: 'Data de início é obrigatória' }).refine((val) => !isNaN(Date.parse(val)), { message: 'Data de início deve ser uma data válida!' }),
  endDate: zod.string().min(1, { message: 'Data de fim é obrigatória' }).refine((val) => !isNaN(Date.parse(val)), { message: 'Data de fim deve ser uma data válida!' }),
  baseCurrency: zod.string().min(1, { message: 'Moeda base é obrigatória' }),
  allocationType: zod.string(),
});

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

export function BacktestForm() {
  const { setResults } = useContext(BacktestContext);
  const router = useRouter();

  const defaultValues = {
    portfolio: [],
    startDate: '',
    endDate: '',
    baseCurrency: 'BRL',
    allocationType: 'percentage',
  };

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(newBacktestSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue,
    getValues,
    control,
  } = methods;

  const [allocationType, setAllocationType] = useState('percentage');
  const [searchTickerText, setSearchTickerText] = useState('');
  const [tickersSearchOptions, setTickersSearchOptions] = useState([]);

  // Create a ref for the search container
  const searchContainerRef = useRef(null);

  useEffect(() => {
    //verifica se o usuario digitou mais que 2 caracteres
    if (searchTickerText.length > 2) {
      fetchTickers(searchTickerText);
    } else {
      setTickersSearchOptions([]);
    }
  }, [searchTickerText]);

  // Add click outside handler
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setTickersSearchOptions([]);
      }
    }

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);

    // Clean up the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchContainerRef]);

  const fetchTickers = async (query) => {
    try {
      // const response = await fetch(`http://localhost:3000/tickers/search?query=${query}`);
      // const tickers = await response.json();
      const portfolio = getValues('portfolio');
      const tickers = availableTickers.filter(ticker =>
        ticker.ticker.toLowerCase().includes(query.toLowerCase()) &&
        !portfolio.some(p => p.ticker === ticker.ticker)
      );
      console.log(tickers);
      setTickersSearchOptions(tickers);
      console.log(tickers);
    } catch (error) {
      console.error('Erro ao buscar tickers:', error);
      toast.error('Ocorreu um erro ao buscar os tickers. Tente novamente.');
    }
  };

  const handleAddTicker = (ticker) => {
    const portfolio = getValues('portfolio');
    if (ticker && !portfolio.some(t => t.ticker === ticker)) {
      setValue('portfolio', [...portfolio, { ticker: ticker, allocation: '' }]);
    }
  };

  const handleRemoveTicker = (ticker) => {
    const portfolio = getValues('portfolio');
    setValue('portfolio', portfolio.filter(t => t.ticker !== ticker));
  };

  const handleAllocationChange = (index, value) => {
    const portfolio = getValues('portfolio');
    portfolio[index].allocation = value;
    setValue('portfolio', portfolio);
  };

  const handleAllocationTypeChange = (event) => {
    const newAllocationType = event.target.checked ? 'value' : 'percentage';
    setAllocationType(newAllocationType);
    setValue('allocationType', newAllocationType);
  };

  const isValidNumber = (value) => {
    const regex = /^\d+(\.\d{1,2})?$/;
    return regex.test(value);
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      let ticker_error = false;

      methods.clearErrors();

      data.portfolio.forEach(ticker => {
        if (!isValidNumber(ticker.allocation) || ticker.value == '' || ticker.value == 0) {
          methods.setError('portfolio', { type: 'manual', message: 'É necessário preencher todos os valores dos tickers' });
          ticker_error = true;
        }
      });

      if (ticker_error) {
        return;
      }

      if (data.allocationType === 'percentage') {
        const sum = data.portfolio.reduce((acc, curr) => acc + parseFloat(curr.allocation), 0);
        if (sum !== 100) {
          methods.setError('portfolio', { type: 'manual', message: 'A soma das porcentagens deve ser 100%' });
          return;
        }
        data.portfolio = data.portfolio.map(ticker => ({ ...ticker, weight: parseFloat(ticker.allocation) / 100 }));
      } else {
        const sum = data.portfolio.reduce((acc, curr) => acc + parseFloat(curr.allocation), 0);
        data.portfolio = data.portfolio.map(ticker => ({ ...ticker, weight: parseFloat(ticker.allocation) / sum }));
      }

      data.portfolio.forEach(ticker => delete ticker.allocation);
      delete data.allocationType;

      data.startDate = new Date(data.startDate).getTime();
      data.endDate = new Date(data.endDate).getTime();

      const response = await fetch('http://localhost:3000/backtest/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      setResults(result);

      router.push(paths.dashboard.backtest_results)

    } catch (error) {
      console.error('Erro ao enviar dados:', error);
      toast.error('Ocorreu um erro ao enviar os dados. Tente novamente.');
    }
  });

  return (
    <FormProvider {...methods}>
      <Form methods={methods} onSubmit={onSubmit}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3,
          }}
        >
          <Box sx={{ flex: 3, zIndex: 2 }}>
            <Card sx={{ p: 3, overflow: 'visible' }}>
              <div style={{ position: 'relative' }} ref={searchContainerRef}>
                <TextField
                  label="Adicionar Ticker"
                  value={searchTickerText}
                  onChange={(e) => setSearchTickerText(e.target.value)}
                  fullWidth
                />
                {!!tickersSearchOptions.length && <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginTop: 2,
                    position: 'absolute',
                    top: "45px",
                    width: '100%',
                    backgroundColor: 'background.default',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    boxShadow: 1,
                    zIndex: 1,
                    padding: 1,
                  }}
                >
                  {tickersSearchOptions.map((ticker, index) => (
                    <Button
                      key={index}
                      variant="outlined"
                      onClick={() => {
                        handleAddTicker(ticker.ticker);
                        setSearchTickerText('');
                        setTickersSearchOptions([]);
                      }}
                      sx={{
                        backgroundColor: 'background.paper',
                        color: 'text.primary',
                        borderRadius: index == 0 ? '5px 5px 0 0' : index == tickersSearchOptions.length - 1 ? '0 0 5px 5px' : 0,
                        padding: "10px",
                        border: "1px solid",
                        borderColor: 'divider',
                        margin: 0,
                        '&:hover': {
                          backgroundColor: 'background.default',
                        },
                      }}
                    >
                      <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} style={{ width: '100%' }}>
                        <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                          <img src={ticker.image_url} alt={ticker.ticker}
                            style={{
                              width: 40,
                              height: 40,
                              marginRight: 15,
                              borderRadius: 5,
                            }}
                          />
                          <Box display={'flex'} flexDirection={'column'} alignItems={'start'}>
                            {ticker.ticker} - {ticker.companyName}<br></br>
                            <Box style={{ fontWeight: 400 }} display={'flex'} flexDirection={'row'} alignItems={'center'}>
                              <span style={{ fontSize: '13px', opacity: .7, marginRight: "10px" }}>R${ticker.current_price.toString().replace('.', ',')}</span>

                              {ticker.last_twelve_months && <Box>
                                <span style={{ fontSize: '12px', color: ticker.last_twelve_months > 0 ? 'green' : 'red' }}>
                                  {ticker.last_twelve_months > 0 ? '+' : ''}{(ticker.last_twelve_months * 100).toFixed(2)}%
                                  <span style={{ color: ticker.last_twelve_months > 0 ? 'green' : 'red', marginLeft: "2px" }}>
                                    {ticker.last_twelve_months > 0 ? '↑' : '↓'}
                                  </span>
                                </span>

                                <span style={{ fontSize: '11px', opacity: .7 }}> (12 meses)</span>
                              </Box>
                              }
                            </Box>
                          </Box>
                        </Box>
                        <Box sx={{ backgroundColor: 'primary.main', height: '100%', padding: "1px 5px", opacity: .8, borderRadius: 1 }}>
                          {ticker.type}
                        </Box>
                      </Box>
                    </Button>
                  ))}
                </Box>}

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <FormControlLabel
                    sx={{ mt: 1 }}
                    control={
                      <Switch
                        checked={allocationType === 'value'}
                        onChange={handleAllocationTypeChange}
                        color="primary"
                      />
                    }
                    label={allocationType === 'value' ? 'Valor' : 'Porcentagem'}
                  />
                </Box>
              </div>
              <div>
                <Controller
                  name="portfolio"
                  control={control}
                  render={({ field }) => (
                    <>
                      <List>
                        {field.value.map((item, index) => (
                          <ListItem key={index}>
                            <ListItemText primary={item.ticker} />
                            <TextField
                              type="number"
                              value={item.allocation}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (isValidNumber(value)) {
                                  handleAllocationChange(index, value);
                                }
                              }}
                              placeholder="0"
                              InputProps={{
                                startAdornment: allocationType === 'value' ? <InputAdornment position="start">R$</InputAdornment> : null,
                                endAdornment: allocationType === 'percentage' ? <InputAdornment position="end">%</InputAdornment> : null,
                              }}
                              sx={{ width: 150 }}
                            />
                            <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveTicker(item.ticker)}>
                              <DeleteIcon />
                            </IconButton>
                          </ListItem>
                        ))}
                      </List>
                      <FormHelperText error>{methods.formState.errors?.portfolio?.message}</FormHelperText>
                    </>
                  )}
                />
              </div>
            </Card>
          </Box>
          <Box sx={{ zIndex: 1, flex: 5, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Card sx={{ p: 3 }}>
              <Box
                sx={{
                  rowGap: 3,
                  columnGap: 2,
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              >
                <Field.DatePicker name="startDate" label="Data de Início" />

                <Field.DatePicker name="endDate" label="Data de Fim" />

                <Field.Select
                  name="baseCurrency"
                  label="Moeda Base"
                  options={[
                    { value: 'BRL', label: 'BRL' },
                    { value: 'USD', label: 'USD' },
                  ]}
                >
                  {[
                    { value: 'BRL', label: 'BRL' },
                    { value: 'USD', label: 'USD' },
                  ].map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Field.Select>
              </Box>

              <Stack sx={{ mt: 3, alignItems: 'flex-end' }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  Executar Backtest
                </LoadingButton>
              </Stack>
            </Card>
          </Box>
        </Box>
      </Form>
    </FormProvider>
  );
}