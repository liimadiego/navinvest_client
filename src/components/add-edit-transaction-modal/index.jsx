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
    Tooltip,
    IconButton
} from '@mui/material';
import { TickerSelector } from 'src/components/ticker-selector';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { CardAssetInfo } from 'src/components/card-asset-info';

export default function AddEditTransactionModal({ open, onClose, onSave, editData, isLoading = false }) {
    const [assetType, setAssetType] = useState('STOCK');
    const [type, setType] = useState('BUY');
    const [tickerInfo, setTickerInfo] = useState(null);
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState('');
    const [costs, setCosts] = useState('0.00');
    const [errors, setErrors] = useState({});
    const [transactionId, setTransactionId] = useState(null);

    //fixed income values
    const [issuer, setIssuer] = useState('');
    const [investment_type, setInvestmentType] = useState('CDB');
    const [indexationType, setIndexationType] = useState('PRE_FIXED');
    const [expirationDate, setExpirationDate] = useState('');
    const [indexer, setIndexer] = useState('CDI');
    const [indexerRate, setIndexerRate] = useState('');
    const [currency, setCurrency] = useState('BRL');

    const clearFields = () => {
        setTickerInfo(null);
        setDate(new Date().toISOString().slice(0, 10));
        setQuantity(1);
        setPrice('');
        setCosts('0.00');
        setErrors({});
        setTransactionId(null);
        setType('BUY');
        setExpirationDate('');
        setIssuer('');
        setInvestmentType('CDB');
        setIndexationType('POST_FIXED');
        setIndexer('CDI');
        setIndexerRate('');
        setCurrency('BRL');
    };

    useEffect(() => {
        if (!editData) {
            clearFields();
        }
    }, [assetType]);

    useEffect(() => {
        if (editData) {
            const fixedIncomeDetails = editData.fixed_income_details || false;
            const treasuryDetails = editData.treasury || false;
            const isFixedIncome = editData.asset_type === "FIXED_INCOME";
            const isTreasury = editData.asset_type === "TREASURY";
            const isFunds = editData.asset_type === "FUNDS";

            setAssetType(editData.asset_type);
            setTransactionId(editData.id);
            setType(editData.type);
            setTickerInfo(!isFixedIncome ? {
                current_price: isTreasury ? treasuryDetails.amount : editData.ticker?.current_price,
                id: isTreasury ? treasuryDetails.id : editData.ticker.id,
                image_url: isTreasury ? "https://investidor10.com.br/assets/front/images/business-and-trade-gray.svg" : editData.ticker.asset_image_url,
                name: isTreasury ? treasuryDetails.name : `${editData.ticker.ticker} - ${editData.ticker.asset_name}`,
                currency: isTreasury ? "BRL" : editData.ticker.currency,
            } : null);
            setDate(editData.date?.slice(0, 10));
            setQuantity(editData.quantity);
            setPrice(editData.price);
            setCosts(editData.costs ?? '0.00');
            setCurrency(editData.ticker?.currency ?? 'BRL');

            if (isFixedIncome && fixedIncomeDetails) {
                setIssuer(fixedIncomeDetails.issuer);
                setInvestmentType(fixedIncomeDetails.investment_type);
                setIndexationType(fixedIncomeDetails.indexation_type);
                setExpirationDate(fixedIncomeDetails.expiration_date?.slice(0, 10));
                setIndexer(fixedIncomeDetails.indexer);
                setIndexerRate(fixedIncomeDetails.indexer_rate);
            }
        }
    }, [editData]);

    const total = ((parseFloat(price || 0) * quantity) + parseFloat(costs || 0)).toFixed(2);

    const handleSave = async () => {
        setErrors({});
        const newErrors = {};
        const data = {};

        if (editData && !transactionId) {
            newErrors.transaction = 'Lançamento não encontrado';
        }
        if (!tickerInfo && assetType !== "FIXED_INCOME") {
            newErrors.ticker = 'Selecione um ativo';
        }
        if (quantity <= 0 || isNaN(quantity)) {
            newErrors.quantity = 'Quantidade deve ser maior que 0';
        }
        if (parseFloat(price) <= 0 || isNaN(price) || price === '') {
            newErrors.price = 'Preço deve ser maior que 0';
        }
        if ((parseFloat(costs) < 0 || isNaN(costs) && assetType !== "FIXED_INCOME")) {
            newErrors.costs = 'Custos não podem ser negativos';
        }
        if (new Date(date) > new Date()) {
            newErrors.date = 'Data não pode ser futura';
        }
        if (assetType === "FIXED_INCOME") {
            if (!issuer) {
                newErrors.issuer = 'Informe o emissor do ativo';
            }
            if (!investment_type) {
                newErrors.investment_type = 'Informe o tipo de investimento';
            }
            if (!indexationType) {
                newErrors.indexationType = 'Informe o tipo de indexação';
            }
            if (!expirationDate) {
                newErrors.expirationDate = 'Informe a data de vencimento do ativo';
            }
            if (!indexer) {
                newErrors.indexer = 'Informe o indexador do ativo';
            }
            if (indexer === 'CDI+' && !indexerRate) {
                newErrors.indexerRate = 'Informe a taxa do CDI+';
            } else if (indexer === 'IPCA+' && !indexerRate) {
                newErrors.indexerRate = 'Informe a taxa do IPCA+';
            } else if (indexerRate <= 0 || isNaN(indexerRate)) {
                newErrors.indexerRate = 'Taxa do indexador deve ser maior que 0';
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        data.id = transactionId;
        data.type = type;
        data.price = parseFloat(price);
        data.date = date;
        data.asset_type = assetType;

        if (assetType === "FIXED_INCOME") {
            data.issuer = issuer;
            data.quantity = 1;
            data.investment_type = investment_type;
            data.indexation_type = indexationType;
            data.expiration_date = expirationDate;
            data.indexer = indexer;
            data.indexer_rate = parseFloat(indexerRate);
            data.currency = currency;
        } else {
            data.tickerInfo = tickerInfo;
            data.quantity = assetType === "TREASURY" || assetType === "FUNDS" ? parseFloat(quantity) : parseInt(quantity);
            data.costs = parseFloat(costs);
        }

        await onSave({ errors: newErrors, data });

        clearFields();
    };

    const handleAddTicker = (_, tickerInfo_) => {
        setTickerInfo(tickerInfo_);
        if (tickerInfo_?.type === "treasury" || assetType === "TREASURY") {
            setPrice(tickerInfo_.unit_price);
            setQuantity(1);
        }
        else if (tickerInfo_?.type === "funds" || assetType === "FUNDS") {
            setPrice(tickerInfo_.current_price);
            setQuantity(1);
        }
        else if (tickerInfo_?.currency) {
            const priceWith2Decimals = parseFloat(tickerInfo_.current_price).toFixed(2);
            setPrice(priceWith2Decimals);
            setQuantity(1);
        }
    };

    const handleEditTicker = () => {
        setTickerInfo(null);
    };

    const handleSetQty = (value) => {
        if (assetType === "TREASURY" || assetType === "FUNDS") {
            value = value.replace(',', '.');
            value = value.replace(/[^0-9.]/g, '');
            if (value.includes('.')) {
                const parts = value.split('.');
                parts[1] = parts[1].slice(0, 2);
                value = parts[0] + '.' + parts[1];
            }
        } else {
            value = value.replace(/[^0-9]/g, '');
        }
        setQuantity(value);
    }

    const getHelperTextIndexerRate = () => {
        if (indexer === 'CDI+') {
            return 'Informe a taxa pré-fixada do componente CDI+. Por exemplo: CDI + 4,00%.';
        } else if (indexer === 'IPCA+') {
            return 'Informe aqui a taxa anual a ser aplicada, além do IPCA. Exemplo: /,00%.';
        } else if (indexer === '+') {
            return 'Informe aqui a taxa pré-fixada do seu investimento. Exemplo: 4,00%.';
        }
        return 'Informe aqui quantos % do CDI esse investimento está pagando. Por exemplo: 116,00%';
    }

    const handleIndexerRateChange = (e) => {
        let value = e.target.value;

        value = value.replace(/[^\d.,]/g, '');
        value = value.replace(',', '.');

        if (value.includes('.')) {
            const parts = value.split('.');
            if (parts[1].length > 2) {
                parts[1] = parts[1].substring(0, 2);
                value = parts.join('.');
            }
        }

        setIndexerRate(value);
    };

    const handleIndexationChange = (e) => {
        const indexationType = e.target.value;
        setIndexationType(indexationType);
        if (indexationType === "PRE_FIXED")
            setIndexer('+');
    };

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

                {!editData && <TextField
                    select
                    label="Tipo de ativo"
                    value={assetType}
                    onChange={(e) => setAssetType(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                    slotProps={{
                        select: {
                            native: true,
                        }
                    }}
                >
                    <option value="STOCK">Ações/REITs</option>
                    <option value="FII">FIIs</option>
                    <option value="TREASURY">Tesouro Direto</option>
                    <option value="FIXED_INCOME">Renda Fixa</option>
                    <option value="FUNDS">Fundos de Investimentos</option>
                    <option value="CRYPTO">Cripto</option>
                    <option value="BDR">BDR</option>
                    <option value="ETF">ETF</option>
                </TextField>}

                {!tickerInfo && assetType !== "FIXED_INCOME" && (
                    <TickerSelector
                        sx={{ mb: 2, mt: 0 }}
                        onAddTicker={handleAddTicker}
                        assetType={assetType}
                        selectedTickers={[]}
                        placeholder={assetType === "FUNDS" ? "Busque por CNPJ ou Nome do Ativo" : "Buscar ativo"}
                        error={!!errors.ticker}
                        helperText={errors.ticker}
                    />
                )}

                {tickerInfo && <CardAssetInfo sx={{ mb: 3, mt: 0 }} assetType={assetType} assetInfo={tickerInfo} onEdit={handleEditTicker} />}

                {assetType === "FIXED_INCOME" && <TextField
                    fullWidth
                    label="Emissor"
                    value={issuer}
                    onChange={(e) => setIssuer(e.target.value)}
                    sx={{ mb: 2, textAlign: 'left' }}
                    error={!!errors.issuer}
                    helperText={errors.issuer}
                />}

                {assetType === "FIXED_INCOME" && <TextField
                    select
                    label="Tipo de investimento"
                    value={investment_type}
                    onChange={(e) => setInvestmentType(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                    slotProps={{
                        select: {
                            native: true,
                        }
                    }}
                >
                    <option value="CDB">CDB</option>
                    <option value="LCI">LCI</option>
                    <option value="LCA">LCA</option>
                    <option value="LC">LC</option>
                    <option value="LF">LF</option>
                    <option value="RDB">RDB</option>
                    <option value="DEBENTURE">Debênture</option>
                    <option value="CRI">CRI</option>
                    <option value="CRA">CRA</option>
                    <option value="CCB">CCB</option>
                </TextField>}

                {assetType === "FIXED_INCOME" && <TextField
                    select
                    label="Tipo de indexação"
                    value={indexationType}
                    onChange={handleIndexationChange}
                    fullWidth
                    sx={{ mb: 2 }}
                    slotProps={{
                        select: {
                            native: true,
                        }
                    }}
                >
                    <option value="PRE_FIXED">Pré-fixado</option>
                    <option value="POST_FIXED">Pós-fixado</option>
                </TextField>}

                <TextField
                    fullWidth
                    label={`Valor em ${tickerInfo ? (tickerInfo.currency == "BRL" ? "R$" : "US$") : "R$"}`}
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    sx={{ mb: 2 }}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">{tickerInfo ? (tickerInfo.currency == "BRL" ? "R$" : "US$") : "R$"}</InputAdornment>,
                    }}
                    error={!!errors.price}
                    helperText={errors.price}
                />
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

                {assetType === "FIXED_INCOME" && <TextField
                    fullWidth
                    label="Data de vencimento"
                    type="date"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    sx={{ mb: 2, textAlign: 'left' }}
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.expirationDate}
                    helperText={errors.expirationDate}
                />}

                {assetType === "FIXED_INCOME" && <TextField
                    select
                    label="Indexador"
                    value={indexer}
                    onChange={(e) => setIndexer(e.target.value)}
                    fullWidth
                    sx={{ mb: 2, display: indexationType === "PRE_FIXED" ? "none" : "block" }}
                    disabled={(indexationType === "PRE_FIXED")}
                    slotProps={{
                        select: {
                            native: true,
                        }
                    }}
                >
                    {indexationType === "PRE_FIXED" && <option value="+">-</option>}
                    {indexationType !== "PRE_FIXED" && <option value="CDI">CDI</option>}
                    {indexationType !== "PRE_FIXED" && <option value="CDI+">CDI+</option>}
                    {indexationType !== "PRE_FIXED" && <option value="IPCA+">IPCA+</option>}
                </TextField>}

                {(assetType !== "FIXED_INCOME") && <TextField
                    fullWidth
                    label="Quantidade"
                    type="number"
                    value={quantity}
                    onChange={e => handleSetQty(e.target.value)}
                    sx={{ mb: 2 }}
                    error={!!errors.quantity}
                    helperText={errors.quantity}
                    inputProps={{
                        step: assetType === "TREASURY" ? 0.01 : assetType === "FUNDS" ? 1e-8 : 1,
                        min: assetType === "TREASURY" ? 0.01 : assetType === "FUNDS" ? 1e-8 : 1,
                    }}
                />}

                {assetType !== "FIXED_INCOME" ? <TextField
                    fullWidth
                    label="Outros custos"
                    type="number"
                    value={costs}
                    onChange={(e) => setCosts(e.target.value)}
                    sx={{ mb: 2 }}
                    error={!!errors.costs}
                    helperText={errors.costs}
                /> :
                    <TextField
                        fullWidth
                        label={indexationType === "PRE_FIXED" ? "Taxa anual pré fixada" : "Taxa do indexador"}
                        type="number"
                        value={indexerRate}
                        onChange={handleIndexerRateChange}
                        sx={{ mb: 2 }}
                        error={!!errors.indexerRate}
                        helperText={errors.indexerRate}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">%</InputAdornment>,
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Tooltip
                                        title={getHelperTextIndexerRate()}
                                        arrow
                                        placement="top"
                                    >
                                        <IconButton size="small">
                                            <HelpOutlineIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </InputAdornment>
                            ),
                        }}
                    />
                }

                <Typography align="center" variant="subtitle1" sx={{ mt: 1 }}>
                    Valor total: <strong>{tickerInfo ? (tickerInfo.currency == "BRL" ? "R$" : "US$") : "R$"} {total}</strong>
                </Typography>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} color="inherit">
                    Cancelar
                </Button>
                <Button loading={isLoading} loadingPosition="end" onClick={handleSave} variant="contained" color="primary">
                    {editData ? "Salvar" : "Adicionar"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

