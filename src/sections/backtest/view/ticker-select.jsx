import React, { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { TextField, Button, Switch, FormControlLabel, MenuItem, Select, List, ListItem, ListItemText, IconButton, InputAdornment, Box, FormHelperText } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const availableTickers = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'];

export function TickerSelect() {
    const { control, setValue, getValues, formState: { errors } } = useFormContext();
    const [selectedTicker, setSelectedTicker] = useState('');
    const [allocationType, setAllocationType] = useState('percentage');

    const handleAddTicker = () => {
        const tickers = getValues('tickers');
        if (selectedTicker && !tickers.some(t => t.ticker === selectedTicker)) {
            setValue('tickers', [...tickers, { ticker: selectedTicker, allocation: '' }]);
            setSelectedTicker('');
        }
    };

    const handleRemoveTicker = (ticker) => {
        const tickers = getValues('tickers');
        setValue('tickers', tickers.filter(t => t.ticker !== ticker));
    };

    const handleAllocationChange = (index, value) => {
        const tickers = getValues('tickers');
        tickers[index].allocation = value;
        setValue('tickers', tickers);
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

    return (
        <div>
            <div>
                <Select
                    value={selectedTicker}
                    onChange={(e) => setSelectedTicker(e.target.value)}
                    displayEmpty
                    fullWidth
                    error={!!errors.tickers}
                >
                    <MenuItem value="" disabled>
                        Selecione um ticker
                    </MenuItem>
                    {availableTickers.map((ticker) => (
                        <MenuItem key={ticker} value={ticker}>
                            {ticker}
                        </MenuItem>
                    ))}
                </Select>
                {errors.tickers && (
                    <FormHelperText error>{errors.tickers.message}</FormHelperText>
                )}
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
            </div>
            <Controller
                name="tickers"
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
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                {allocationType === 'percentage' ? '%' : '$'}
                                            </InputAdornment>
                                        ),
                                    }}
                                    style={{ width: '100px' }}
                                />
                                <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveTicker(item.ticker)}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItem>
                        ))}
                    </List>
                )}
            />
            <Controller
                name="allocationType"
                control={control}
                defaultValue={allocationType}
                render={({ field }) => (
                    <input type="hidden" {...field} />
                )}
            />
        </div>
    );
}