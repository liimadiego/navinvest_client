import { useEffect, useRef, useState } from 'react';
import { Box, InputAdornment, CircularProgress, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { getTickerList } from 'src/utils/tickers';
import { translateAssetType } from 'src/utils/handle-asset-type';
import { fCurrency } from 'src/utils/format-number';
import { Scrollbar } from '../scrollbar';

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
            if (searchTickerText.length > 1) {
                fetchTickers(searchTickerText);
            }
        }, 100);

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
            const response = await getTickerList(query, 100, assetType !== 'all' ? assetType.toLowerCase() : '');
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
                <Scrollbar sx={{
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
                    maxHeight: '300px',
                    overflowY: 'auto',
                }}>
                    <Box>
                        {tickersSearchOptions.map((ticker, index) => {
                            return <Button
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
                                        alignItems={{ xs: "flex-start", sm: "center" }}
                                        width={{ xs: "100%", sm: "100%" }}
                                        mb={{ xs: 1, sm: 0 }}
                                    >
                                        <Box
                                            component="img"
                                            src={ticker.image_url}
                                            alt={ticker.ticker}
                                            onError={(e) => {
                                                if (ticker.fallback_image_url) {
                                                    e.target.src = ticker.fallback_image_url;
                                                }
                                            }}
                                            sx={{
                                                width: { xs: 24, sm: 32 },
                                                height: { xs: 24, sm: 32 },
                                                mr: 1.25,
                                                borderRadius: 0.625,
                                                transform: { xs: 'translateY(5px)', sm: 'translateY(0)' },
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
                                                    fontSize: { xs: "12px", sm: "14px" },
                                                    width: "100%",
                                                    textAlign: "left"
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: "100%", flexDirection: { xs: "column-reverse", sm: "row" }, textAlign: { xs: "center", sm: "left" } }}>
                                                    <Typography sx={{ maxWidth: "200px", fontSize: { xs: "12px", sm: "14px" } }}>
                                                        {ticker.ticker} {ticker.type === "treasury" || ticker.type === "funds" ? "" : `- ${ticker.asset_name}`}
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
                                                            marginLeft: { xs: 0, sm: "5px" },
                                                            mb: { xs: "5px", sm: 0 },
                                                            width: { xs: "100%", sm: "auto" },
                                                            textAlign: "center",
                                                            color: 'white',
                                                        }}
                                                    >
                                                        {translateAssetType(ticker?.type || "")}
                                                    </Box>
                                                </Box>
                                            </Box>
                                            <Box
                                                display="flex"
                                                flexDirection={{ xs: "column", sm: "row" }}
                                                alignItems={{ xs: "flex-start", sm: "center" }}
                                                sx={{ fontWeight: 400, width: { xs: "100%", sm: "auto" }, textAlign: { xs: "center", sm: "left" } }}
                                            >
                                                <Typography sx={{ opacity: 0.7, mr: (ticker.type != "treasury" && ticker.type != "funds") ? 1 : 0, fontSize: { xs: "12px", sm: "14px" }, width: { xs: "100%", sm: "auto" } }}>
                                                    {ticker.type !== "treasury" && ticker.type !== "funds" ? fCurrency(ticker.current_price, ticker.currency) : ""}
                                                </Typography>

                                                {(ticker.last_twelve_months !== null && ticker.type !== "treasury" && ticker.type !== "funds") ?
                                                    <Box display="flex" alignItems="center" width={{ xs: "100%", sm: "auto" }} justifyContent={{ xs: "center", sm: "flex-start" }}>
                                                        <Typography
                                                            sx={{
                                                                fontSize: "12px",
                                                                color: ticker.last_twelve_months == 0 ? 'gray' : (ticker.last_twelve_months < 0 ? 'red' : 'green'),
                                                                display: "flex",
                                                                alignItems: "center"
                                                            }}
                                                        >
                                                            {ticker.last_twelve_months <= 0 ? '' : '+'}
                                                            {(ticker.last_twelve_months * 100).toFixed(2)}%
                                                            <span style={{ marginLeft: "2px" }}>
                                                                {ticker.last_twelve_months == 0 ? '' : ticker.last_twelve_months < 0 ? '↓' : '↑'}
                                                            </span>
                                                        </Typography>
                                                        <Typography sx={{ display: { xs: 'none', sm: 'block' }, fontSize: "11px", opacity: 0.7, ml: 0.5 }}>
                                                            (12 meses)
                                                        </Typography>
                                                        <Typography sx={{ display: { xs: 'block', sm: 'none' }, fontSize: "11px", opacity: 0.7, ml: 0.5 }}>
                                                            (12m)
                                                        </Typography>
                                                    </Box>
                                                    : <Typography sx={{ fontSize: "11px", opacity: 0.7 }}>
                                                        {ticker.indexer ? camelize(ticker.indexer) : ticker.fund_class || ""}
                                                    </Typography>
                                                }
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </Button>
                        })}
                    </Box>
                </Scrollbar>
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