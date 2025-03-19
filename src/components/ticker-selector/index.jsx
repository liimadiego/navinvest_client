import { useEffect, useRef, useState } from 'react';
import { Box, InputAdornment, CircularProgress, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { set } from 'nprogress';

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

export function TickerSelector({ onAddTicker, selectedTickers, doNotRepeatCompany = false, placeholder = 'Adicionar Ticker', openModalTrigger = false }) {
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
            const tickers = availableTickers.filter(ticker => {
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
                return ticker.ticker.toLowerCase().includes(query.toLowerCase()) &&
                    !selectedTickers.some(selectedTicker => selectedTicker === ticker.ticker)
            });

            setIsLoading(false);
            setTickersSearchOptions(tickers);
        } catch (error) {
            console.error('Erro ao buscar tickers:', error);
        }
    };

    const handleSelectTicker = (ticker) => {
        onAddTicker(ticker);
        setSearchTickerText('');
        setTickersSearchOptions([]);
    };

    return (
        <div style={{ position: 'relative' }} ref={searchContainerRef}>
            <TextField
                inputRef={inputRef}
                label={placeholder}
                value={searchTickerText}
                onChange={(e) => setSearchTickerText(e.target.value)}
                fullWidth
                autoComplete='off'
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
                            onClick={() => handleSelectTicker(ticker.ticker)}
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
                                    width={{ xs: "100%", sm: "auto" }}
                                    mb={{ xs: 1, sm: 0 }}
                                >
                                    <img
                                        src={ticker.image_url}
                                        alt={ticker.ticker}
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
                                            <Box display={'flex'}>
                                                {ticker.ticker} - {ticker.companyName}
                                                <Box
                                                    sx={{
                                                        backgroundColor: 'primary.main',
                                                        padding: "1px 5px",
                                                        opacity: 0.8,
                                                        borderRadius: 1,
                                                        alignSelf: { xs: "flex-start", sm: "center" },
                                                        mt: { xs: 0, sm: 0 },
                                                        fontSize: "10px",
                                                        marginLeft: "5px"
                                                    }}
                                                >
                                                    {ticker.type}
                                                </Box>
                                            </Box>
                                        </Box>
                                        <Box
                                            display="flex"
                                            flexDirection={{ xs: "column", sm: "row" }}
                                            alignItems={{ xs: "flex-start", sm: "center" }}
                                            sx={{ fontWeight: 400 }}
                                        >
                                            <Typography sx={{ fontSize: "13px", opacity: 0.7, mr: 1 }}>
                                                R${ticker.current_price.toString().replace('.', ',')}
                                            </Typography>

                                            {ticker.last_twelve_months && (
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
                                            )}
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Button>
                    ))}
                </Box>
            )}
        </div>
    );
}