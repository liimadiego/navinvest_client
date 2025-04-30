import { useEffect, useRef, useState } from 'react';
import { Box, InputAdornment, CircularProgress, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { getTickerList } from 'src/utils/tickers';
import { translateAssetType } from 'src/utils/handle-asset-type';
import { fCurrency } from 'src/utils/format-number';

export function TickerSelector({
    onAddTicker,
    selectedTickers,
    doNotRepeatCompany = false,
    placeholder = 'Adicionar Ticker',
    openModalTrigger = false,
    error = false,
    helperText = "",
    sx,
    assetType = 'all'
}) {
    if (!onAddTicker) {
        throw new Error('onAddTicker is required');
    }

    if (!selectedTickers) {
        throw new Error('selectedTickers is required');
    }

    const inputRef = useRef(null);

    useEffect(() => {
        if (openModalTrigger && inputRef.current) {
            inputRef.current.focus();
        }
    }, [openModalTrigger]);

    const [searchTickerText, setSearchTickerText] = useState('');
    const [tickersSearchOptions, setTickersSearchOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const searchContainerRef = useRef(null);

    useEffect(() => {
        if (searchTickerText.length < 3) {
            setTickersSearchOptions([]);
        }

        const delayDebounceFn = setTimeout(() => {
            if (searchTickerText.length > 2) {
                fetchTickers(searchTickerText);
            }
        }, 1000);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTickerText, selectedTickers]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setTickersSearchOptions([]);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [searchContainerRef]);

    const fetchTickers = async (query) => {
        try {
            setIsLoading(true);
            const response = await getTickerList(query, 4, assetType !== 'all' ? assetType.toLowerCase() : '');
            const tickers = response.filter(ticker => {
                if (doNotRepeatCompany) {
                    const tickerCompany = ticker.ticker.substring(0, 4);
                    const hasTickerCompany = selectedTickers.some(selectedTicker => {
                        if (selectedTicker) {
                            return selectedTicker.substring(0, 4) === tickerCompany;
                        }
                        return false
                    });
                    if (hasTickerCompany) {
                        return false;
                    }
                }
                return !selectedTickers.some(selectedTicker => selectedTicker === ticker.ticker)
            });

            setIsLoading(false);
            setTickersSearchOptions(tickers);
        } catch (error) {
            console.error('Erro ao buscar tickers:', error);
        }
    };

    const handleSelectTicker = (ticker, tickerInfo) => {
        onAddTicker(ticker, tickerInfo);
        setSearchTickerText('');
        setTickersSearchOptions([]);
    };

    return (
        <Box style={{ position: 'relative' }} ref={searchContainerRef} sx={sx}>
            <TextField
                inputRef={inputRef}
                label={assetType == "TREASURY" ? "Buscar título" : placeholder}
                value={searchTickerText}
                onChange={(e) => setSearchTickerText(e.target.value)}
                fullWidth
                autoComplete='off'
                error={error}
                helperText={helperText}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            {isLoading && <CircularProgress size={20} color='grey' />}
                        </InputAdornment>
                    ),
                }}
            />

            {!!tickersSearchOptions.length && (
                <Box
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
                        padding: 1,
                        zIndex: 9999,
                    }}
                >
                    {tickersSearchOptions.map((ticker, index) => (
                        <Button
                            key={index}
                            variant="outlined"
                            onClick={() => handleSelectTicker(ticker.ticker, ticker)}
                            sx={{
                                backgroundColor: 'background.paper',
                                color: 'text.primary',
                                borderRadius: index === 0 ? '5px 5px 0 0' : index === tickersSearchOptions.length - 1 ? '0 0 5px 5px' : 0,
                                padding: { xs: "8px", sm: "10px" },
                                border: "1px solid",
                                borderColor: 'divider',
                                margin: 0,
                                width: '100%',
                                '&:hover': {
                                    backgroundColor: 'background.default',
                                },
                            }}
                        >
                            <Box
                                display="flex"
                                alignItems={{ xs: "flex-start", sm: "center" }}
                                justifyContent="space-between"
                                flexDirection={{ xs: "column", sm: "row" }}
                                width="100%"
                            >
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    width={{ xs: "100%", sm: "100%" }}
                                    mb={{ xs: 1, sm: 0 }}
                                >
                                    <img
                                        src={ticker.image_url}
                                        alt={ticker.ticker}
                                        onError={(e) => {
                                            if (ticker.fallback_image_url) {
                                                e.target.src = ticker.fallback_image_url;
                                            }
                                        }}
                                        style={{
                                            width: 32,
                                            height: 32,
                                            marginRight: 10,
                                            borderRadius: 5,
                                        }}
                                    />
                                    <Box
                                        display="flex"
                                        flexDirection="column"
                                        alignItems="start"
                                        flex={1}
                                        sx={{
                                            maxWidth: { xs: "calc(100% - 42px)", sm: "auto" },
                                            overflow: "hidden"
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                fontSize: "14px",
                                                width: "100%",
                                                textAlign: "left"
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: "100%" }}>
                                                <Typography sx={{ maxWidth: "200px" }}>
                                                    {ticker.ticker} {ticker.type === "treasury" ? "" : `- ${ticker.asset_name}`}
                                                </Typography>
                                                <Box
                                                    sx={{
                                                        backgroundColor: 'primary.main',
                                                        padding: "1px 5px",
                                                        opacity: 0.8,
                                                        borderRadius: 1,
                                                        alignSelf: "flex-start",
                                                        mt: { xs: 0, sm: 0 },
                                                        fontSize: "10px",
                                                        marginLeft: "5px"
                                                    }}
                                                >
                                                    {translateAssetType(ticker?.type || "treasury")}
                                                </Box>
                                            </Box>
                                        </Box>
                                        <Box
                                            display="flex"
                                            flexDirection={{ xs: "column", sm: "row" }}
                                            alignItems={{ xs: "flex-start", sm: "center" }}
                                            sx={{ fontWeight: 400 }}
                                        >
                                            <Typography sx={{ fontSize: "13px", opacity: 0.7, mr: ticker.type != "treasury" ? 1 : 0 }}>
                                                {ticker.type !== "treasury" ? fCurrency(ticker.current_price, ticker.currency) : ""}
                                            </Typography>

                                            {(ticker.last_twelve_months !== null && ticker.type !== "treasury") ?
                                                <Box display="flex" alignItems="center">
                                                    <Typography
                                                        sx={{
                                                            fontSize: "12px",
                                                            color: ticker.last_twelve_months > 0 ? 'green' : 'red',
                                                            display: "flex",
                                                            alignItems: "center"
                                                        }}
                                                    >
                                                        {ticker.last_twelve_months > 0 ? '+' : ''}
                                                        {(ticker.last_twelve_months * 100).toFixed(2)}%
                                                        <span style={{ marginLeft: "2px" }}>
                                                            {ticker.last_twelve_months > 0 ? '↑' : '↓'}
                                                        </span>
                                                    </Typography>
                                                    <Typography sx={{ fontSize: "11px", opacity: 0.7, ml: 0.5 }}>
                                                        (12 meses)
                                                    </Typography>
                                                </Box>
                                                : <Typography sx={{ fontSize: "11px", opacity: 0.7 }}>
                                                    {ticker.indexer ? camelize(ticker.indexer) : ""}
                                                </Typography>
                                            }
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Button>
                    ))}
                </Box>
            )}
        </Box>
    );
}

function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
        if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
        return index === 0 ? match.toUpperCase() : match.toLowerCase();
    });
}