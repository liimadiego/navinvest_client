import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Grid,
    Button,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    IconButton,
    alpha,
} from '@mui/material';
import {
    CalendarMonth,
    ArrowBackIos,
    ArrowForwardIos,
    Favorite,
    FavoriteBorder,
    FilterList,
    Notifications
} from '@mui/icons-material';
import { useTheme } from '@emotion/react';
import { fCurrency, fPercent } from 'src/utils/format-number';
import axios from 'src/lib/axios';

export function DividendCalendar() {
    //ref para dividendos futuros
    const dividendsRef = useRef(null);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [dividendData, setDividendData] = useState([]);
    const [filter, setFilter] = useState('all');
    const [favorites, setFavorites] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const theme = useTheme();

    useEffect(() => {
        const fetchDividends = async () => {
            try {
                setIsLoading(true);
                await getDividendsFromMonth(currentMonth + 1, currentYear);
                await new Promise(resolve => setTimeout(resolve, 500));
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching dividends:', error);
                setIsLoading(false);
            }
        };
        fetchDividends();

    }, [currentMonth, currentYear]);

    const handleScrollToDividends = () => {
        if (dividendsRef.current) {
            const offset = dividendsRef.current.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({
                top: offset,
                behavior: 'smooth'
            });
        }
    };

    const handlePreviousMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const getDividendsFromMonth = async (month, year) => {
        axios.get(`/ticker/get-all-dividends?month=${month}&year=${year}`)
            .then((response) => {
                const dividends = response.data.map(dividend => ({
                    id: dividend.id,
                    symbol: dividend.ticker,
                    companyName: dividend.company.name,
                    amount: parseFloat(dividend.adj_amount),
                    exDate: new Date(new Date(`${dividend.ex_date} 12:00:00`)),
                    paymentDate: new Date(new Date(`${dividend.payable_date} 12:00:00`)),
                    sector: dividend.company.b3_sector,
                    currency: dividend.tickerInfo.currency || 'BRL',
                }));
                setDividendData(dividends);
            })
            .catch((error) => {
                console.error('Error fetching dividends:', error);
            });
    }

    // const toggleFavorite = (id) => {
    //     if (favorites.includes(id)) {
    //         setFavorites(favorites.filter(favId => favId !== id));
    //     } else {
    //         setFavorites([...favorites, id]);
    //     }
    // };

    const filteredData = () => {
        if (filter === 'favorites') {
            return dividendData.filter(dividend => favorites.includes(dividend.id));
        }
        return dividendData;
    };

    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    return (
        <Container maxWidth="lg">
            {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box sx={{ opacity: 0 }}>.</Box>
                <Box>
                    <Button
                        startIcon={<FilterList />}
                        onClick={() => setShowFilters(!showFilters)}
                        variant="outlined"
                        sx={{ mr: 1 }}
                    >
                        Filters
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Notifications />}
                    >
                        Set Alerts
                    </Button>
                </Box>
            </Box>

            {showFilters && (
                <Paper sx={{ p: 2, mb: 3 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth variant="outlined" size="small">
                                <InputLabel>View</InputLabel>
                                <Select
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    label="View"
                                >
                                    <MenuItem value="all">All Stocks</MenuItem>
                                    <MenuItem value="favorites">Favorites Only</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth variant="outlined" size="small">
                                <InputLabel>Sector</InputLabel>
                                <Select
                                    defaultValue=""
                                    label="Sector"
                                >
                                    <MenuItem value="">All Sectors</MenuItem>
                                    <MenuItem value="Technology">Technology</MenuItem>
                                    <MenuItem value="Healthcare">Healthcare</MenuItem>
                                    <MenuItem value="Finance">Finance</MenuItem>
                                    <MenuItem value="Energy">Energy</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                placeholder="Search by symbol or name"
                                size="small"
                                variant="outlined"
                            />
                        </Grid>
                    </Grid>
                </Paper>
            )} */}

            <Paper elevation={3} sx={{ p: 3, mb: 4, backgroundColor: 'background.paper' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <IconButton onClick={handlePreviousMonth} disabled={isLoading}>
                        <ArrowBackIos />
                    </IconButton>
                    <Typography variant="h5" fontWeight="bold">
                        {monthNames[currentMonth]} {currentYear}
                    </Typography>
                    <IconButton onClick={handleNextMonth} disabled={isLoading}>
                        <ArrowForwardIos />
                    </IconButton>
                </Box>

                <Grid container spacing={1} sx={{
                    pb: 1,
                    mb: 2,
                    backgroundColor: theme.palette.mode === 'light' ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
                    borderRadius: 1,
                    display: { xs: 'none', sm: 'flex' }
                }}>
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map(day => (
                        <Grid item xs key={day}>
                            <Typography align="center" fontWeight="bold">
                                {day}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>

                {(() => {
                    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
                    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
                    const weeks = Math.ceil((firstDayOfMonth + daysInMonth) / 7);

                    const calendarRows = [];
                    let day = 1;

                    for (let week = 0; week < weeks; week++) {
                        const daysInWeek = [];

                        for (let i = 0; i < 7; i++) {
                            if ((week === 0 && i < firstDayOfMonth) || day > daysInMonth) {
                                // Empty cell
                                daysInWeek.push(
                                    <Grid item xs key={`empty-${week}-${i}`} sx={{ display: { xs: 'none', sm: 'block' } }}>
                                        <Paper elevation={0} sx={{ height: 80, bgcolor: 'transparent' }} />
                                    </Grid>
                                );
                            } else {
                                // Day cell
                                const currentDay = day;
                                const dividendsToday = dividendData.filter(dividend =>
                                    dividend.exDate.getDate() === currentDay);

                                daysInWeek.push(
                                    <Grid item xs={1.714} sm={1.714} md={1.714} key={`day-${day}`} onClick={() => handleScrollToDividends()}>
                                        <Paper
                                            elevation={dividendsToday.length > 0 ? 3 : 2}
                                            sx={{
                                                height: { xs: 40, sm: 80 },
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: { xs: 'center', sm: 'flex-start' },
                                                alignItems: { xs: 'center', sm: 'flex-start' },
                                                p: 1,
                                                bgcolor: dividendsToday.length > 0 ? 'background.default' : 'background.neutral',
                                                cursor: dividendsToday.length > 0 ? 'pointer' : 'default',
                                                '&:hover': {
                                                    bgcolor: theme.palette.mode === 'light' ? 'background.darker' : 'action.hover',
                                                }
                                            }}
                                        >
                                            <Typography variant="body2" fontWeight={day === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear() ? 'bold' : 'normal'}>
                                                {day}
                                            </Typography>
                                            {dividendsToday.length > 0 && (
                                                <Box sx={{ mt: 'auto', overflow: 'hidden', display: 'flex', alignItems: 'flex-start' }}>
                                                    {dividendsToday.slice(0, 1).map(dividend => (
                                                        <>
                                                            <Chip
                                                                key={dividend.id}
                                                                label={dividend.symbol}
                                                                size="small"
                                                                color="primary"
                                                                sx={{ mb: 0.5, maxWidth: '100%', display: { xs: 'none', sm: 'block' } }}
                                                            />
                                                            <Box sx={{ display: { xs: 'block', sm: 'none' }, width: '20px', height: '10px', backgroundColor: 'primary.main', borderRadius: 1 }}>

                                                            </Box>
                                                        </>
                                                    ))}
                                                    {dividendsToday.length > 1 && (
                                                        <Typography variant="caption" sx={{ ml: 1, display: { xs: 'none', sm: 'block' } }} color="text.secondary">
                                                            +{dividendsToday.length - 1}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            )}
                                        </Paper>
                                    </Grid>
                                );
                                day++;
                            }
                        }

                        calendarRows.push(
                            <Grid container spacing={1} key={`week-${week}`} sx={{ mb: 1 }}>
                                {daysInWeek}
                            </Grid>
                        );
                    }

                    return calendarRows;
                })()}
            </Paper>

            <Paper elevation={3} sx={{ p: 3 }} ref={dividendsRef}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Dividendos futuros
                </Typography>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Ticker</TableCell>
                                <TableCell>Nome</TableCell>
                                <TableCell align='center'>Valor</TableCell>
                                <TableCell align='center'>Data com</TableCell>
                                <TableCell align='center'>Data de Pagamento</TableCell>
                                {/* <TableCell align="right">Dividend Yield</TableCell> */}
                                {/* <TableCell align="center">Favorito</TableCell> */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredData().map((dividend) => (
                                <TableRow key={dividend.id} hover>
                                    <TableCell>
                                        <Chip
                                            label={dividend.symbol}
                                            color="primary"
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell>{dividend.companyName}</TableCell>
                                    <TableCell align='center'>{fCurrency(dividend.amount.toFixed(2), dividend.currency || 'BRL')}</TableCell>
                                    <TableCell align='center'>{dividend.exDate.toLocaleDateString()}</TableCell>
                                    <TableCell align='center'>{dividend.paymentDate.toLocaleDateString()}</TableCell>
                                    {/* <TableCell align="right">{dividend.yield}</TableCell> */}
                                    {/* <TableCell align="center">
                                        <IconButton onClick={() => toggleFavorite(dividend.id)}>
                                            {favorites.includes(dividend.id) ?
                                                <Favorite color="error" /> :
                                                <FavoriteBorder />
                                            }
                                        </IconButton>
                                    </TableCell> */}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Container>
    );
}