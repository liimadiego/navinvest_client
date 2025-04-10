import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    InputAdornment,
    Typography,
} from '@mui/material';
import { TickerSelector } from 'src/components/ticker-selector';
import { CardAssetInfo } from 'src/components/card-asset-info';

export default function AddEditTransactionModal({ open, onClose, onSave, editData }) {
    const [type, setType] = useState('BUY');
    const [tickerInfo, setTickerInfo] = useState(null);
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState('');
    const [costs, setCosts] = useState('0.00');
    const [errors, setErrors] = useState({});
    const [transactionId, setTransactionId] = useState(null);

    useEffect(() => {
        if (editData) {
            setTransactionId(editData.id);
            setType(editData.type);
            setTickerInfo({
                current_price: editData.ticker.current_price,
                id: editData.ticker.id,
                image_url: editData.ticker.asset_image_url,
                name: `${editData.ticker.ticker} - ${editData.ticker.asset_name}`,
                type: 'stock',
            });
            setDate(editData.date?.slice(0, 10));
            setQuantity(editData.quantity);
            setPrice(editData.price);
            setCosts(editData.costs ?? '0.00');
        }
    }, [editData]);

    useEffect(() => {
        if (!open) {
            setTickerInfo(null);
            setDate(new Date().toISOString().slice(0, 10));
            setQuantity(1);
            setPrice('');
            setType('BUY');
            setCosts('0.00');
            setErrors({});
            setTransactionId(null);
            return;
        }
    }, [open]);

    const total = ((parseFloat(price || 0) * quantity) + parseFloat(costs || 0)).toFixed(2);

    const handleSave = async () => {
        setErrors({});
        const newErrors = {};

        if (editData && !transactionId) {
            newErrors.transaction = 'Lançamento não encontrado';
        }

        if (!tickerInfo) {
            newErrors.ticker = 'Selecione um ativo';
        }
        if (quantity <= 0 || isNaN(quantity)) {
            newErrors.quantity = 'Quantidade deve ser maior que 0';
        }
        if (parseFloat(price) <= 0 || isNaN(price) || price === '') {
            newErrors.price = 'Preço deve ser maior que 0';
        }
        if (parseFloat(costs) < 0 || isNaN(costs)) {
            newErrors.costs = 'Custos não podem ser negativos';
        }
        if (new Date(date) > new Date()) {
            newErrors.date = 'Data não pode ser futura';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        await onSave({ errors: newErrors, data: { id: transactionId, type, tickerInfo, date, quantity: parseInt(quantity), price: parseFloat(price), costs: parseFloat(costs) } });

        setTickerInfo(null);
        setDate(new Date().toISOString().slice(0, 10));
        setQuantity(1);
        setPrice('');
        setCosts('0.00');
        setErrors({});
        onClose();

    };

    const handleAddTicker = (_, tickerInfo_) => {
        setTickerInfo(tickerInfo_);
    };

    const handleEditTicker = () => {
        setTickerInfo(null);
    };

    const handleSetQty = (value) => {
        value = value.replace(/^0+/, '');
        setQuantity(value);
    }


    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>{editData ? "Editar" : "Adicionar"} Lançamento</DialogTitle>
            <DialogContent>
                <ToggleButtonGroup
                    value={type}
                    exclusive
                    onChange={(_, val) => val && setType(val)}
                    fullWidth
                    sx={{ mb: 2 }}
                >
                    <ToggleButton value="BUY">COMPRA ↑</ToggleButton>
                    <ToggleButton value="SELL">VENDA ↓</ToggleButton>
                </ToggleButtonGroup>

                {!tickerInfo && (
                    <TickerSelector
                        sx={{ mb: 2 }}
                        onAddTicker={handleAddTicker}
                        selectedTickers={[]}
                        placeholder="Buscar ativo"
                        error={!!errors.ticker}
                        helperText={errors.ticker}
                    />
                )}

                {tickerInfo && <CardAssetInfo sx={{ mb: 3 }} assetInfo={tickerInfo} onEdit={handleEditTicker} />}

                <TextField
                    fullWidth
                    label="Data da compra"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    sx={{ mb: 2, textAlign: 'left' }}
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.date}
                    helperText={errors.date}
                />

                <TextField
                    fullWidth
                    label="Quantidade"
                    type="number"
                    value={quantity}
                    onChange={e => handleSetQty(e.target.value)}
                    sx={{ mb: 2 }}
                    error={!!errors.quantity}
                    helperText={errors.quantity}
                />

                <TextField
                    fullWidth
                    label="Preço em R$"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    sx={{ mb: 2 }}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                    }}
                    error={!!errors.price}
                    helperText={errors.price}
                />

                <TextField
                    fullWidth
                    label="Outros custos"
                    type="number"
                    value={costs}
                    onChange={(e) => setCosts(e.target.value)}
                    sx={{ mb: 2 }}
                    error={!!errors.costs}
                    helperText={errors.costs}
                />

                <Typography align="center" variant="subtitle1" sx={{ mt: 1 }}>
                    Valor total: <strong>R$ {total}</strong>
                </Typography>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} color="inherit">
                    Cancelar
                </Button>
                <Button onClick={handleSave} variant="contained" color="primary">
                    Salvar
                </Button>
            </DialogActions>
        </Dialog>
    );
}

