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
import { useContext, useState } from 'react';
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

const availableTickers = ['BBAS3', 'ITSA4', 'TAEE11', 'AURE3', 'CMIG3', 'CSMG3', 'SAPR3', 'KLBN4', 'WEGE3'];

export function BacktestForm() {
  const { setResults } = useContext(BacktestContext);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const filteredTickers = availableTickers.filter((ticker) =>
    ticker.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const [selectedTicker, setSelectedTicker] = useState('');
  const [allocationType, setAllocationType] = useState('percentage');

  const handleAddTicker = () => {
    const portfolio = getValues('portfolio');
    if (selectedTicker && !portfolio.some(t => t.ticker === selectedTicker)) {
      setValue('portfolio', [...portfolio, { ticker: selectedTicker, allocation: '' }]);
      setSelectedTicker('');
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
          <Box sx={{ flex: 3 }}>
            <Card sx={{ p: 3 }}>
              <div>
                <Controller
                  name="portfolio"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Select
                        value={selectedTicker}
                        onChange={(e) => setSelectedTicker(e.target.value)}
                        displayEmpty
                        fullWidth
                        error={!!error}
                        renderValue={(selected) => (selected ? selected : "Selecione um ticker")}
                      >
                        <TextField
                          variant="standard"
                          placeholder="Buscar..."
                          fullWidth
                          autoFocus
                          onChange={(e) => setSearchTerm(e.target.value)}
                          value={searchTerm}
                        />

                        {filteredTickers.length > 0 ? (
                          filteredTickers.map((ticker) => (
                            <MenuItem key={ticker} value={ticker}>
                              {ticker}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled>Nenhum resultado encontrado</MenuItem>
                        )}
                      </Select>

                      {error && <FormHelperText error>{error.message}</FormHelperText>}
                    </>
                  )}
                />
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <FormControlLabel
                    style={{ marginTop: '10px' }}
                    control={
                      <Switch
                        checked={allocationType === 'value'}
                        onChange={handleAllocationTypeChange}
                        color="primary"
                      />
                    }
                    label={allocationType === 'value' ? 'Valor' : 'Porcentagem'}
                  />
                  <Button variant="contained" color="primary" onClick={handleAddTicker} style={{ marginTop: '10px' }}>
                    Adicionar
                  </Button>
                </Box>
              </div>
              <div style={{ marginTop: '20px' }}>
                <Controller
                  name="portfolio"
                  control={control}
                  render={({ field }) => (
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
                            slotProps={{
                              input: {
                                startAdornment: (allocationType === 'value' ? <InputAdornment position="start">R$</InputAdornment> : ''),
                                endAdornment: (allocationType === 'percentage' ? <InputAdornment position="end">%</InputAdornment> : ''),
                              },
                            }}
                            style={{ width: '150px' }}
                          />
                          <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveTicker(item.ticker)}>
                            <DeleteIcon />
                          </IconButton>
                        </ListItem>
                      ))}
                    </List>
                  )}
                />
              </div>
            </Card>
          </Box>
          <Box sx={{ flex: 5, display: 'flex', flexDirection: 'column', gap: 3 }}>
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

              {/* Botão de submissão */}
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