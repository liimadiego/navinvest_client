import { ChartSelect } from 'src/components/chart';
import { CardHeader, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useEffect, useState } from 'react';

export function AssetHistoricTable({ ticker }) {

    const [historicalFundDataRange, setHistoricalFundDataRange] = useState('5 Anos');
    const [historicalFundamentalistIndicators, setHistoricalFundamentalistIndicators] = useState(null);

    const handleChangeHistoricalFundDataRange = (newValue) => {
        setHistoricalFundDataRange(newValue);
    };

    const getFilteredData = (data) => {
        return historicalFundDataRange === '5 Anos' ? data.slice(0, 6) : data.slice(0, 11);
    };

    useEffect(() => {
        setHistoricalFundamentalistIndicators({
            ano: ["Atual", 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015],
            p_l: {
                title: "P/L",
                data: [12.65, 12.90, 3.90, 1.70, 3.48, 52.01, 9.81, 11.48, -470.89, -13.08, -2.51]
            },
            p_receita: {
                title: "P/RECEITA (PSR)",
                data: [0.94, 0.96, 0.95, 0.50, 0.82, 1.36, 1.30, 0.85, 0.74, 0.69, 0.27]
            },
            p_vp: {
                title: "P/VP",
                data: [1.27, 1.29, 1.28, 0.88, 0.96, 1.20, 1.33, 1.07, 0.80, 0.78, 0.34]
            },
            dividend_yield: {
                title: "DIVIDEND YIELD (DY)",
                data: [0.2266, 0.2266, 0.8025, 1.0454, 0.6913, 0.9521, 0.0027, 0.1012, 0.0000, 0.0000, 0.0000],
                type: 'percentage'
            },
            payout: {
                title: "PAYOUT",
                data: [2.8231, 2.8231, 7.6711, 15.1087, 8.4563, 1.4815, 0.0869, 0.0495, 0.0000, 0.0000, 0.0000],
                type: 'percentage'
            },
            margem_liquida: {
                title: "MARGEM LÍQUIDA",
                data: [0.0746, 0.0746, 0.1275, 0.1935, 0.1102, 0.0063, 0.0442, 0.0310, 0.0005, -0.0162, -0.0391],
                type: 'percentage'
            },
            margem_bruta: {
                title: "MARGEM BRUTA",
                data: [0.5021, 0.5021, 0.5791, 0.6462, 0.6250, 0.1824, 0.2719, 0.1786, 0.1331, 0.0583, -0.0410],
                type: 'percentage'
            },
            margem_ebit: {
                title: "MARGEM EBIT",
                data: [0.2795, 0.2795, 0.3755, 0.4455, 0.4055, 0.0545, 0.1235, 0.0865, 0.0135, -0.0455, -0.0955],
                type: 'percentage'
            },
            margem_ebitda: {
                title: "MARGEM EBITDA",
                data: [0.3537, 0.3537, 0.4507, 0.5207, 0.4807, 0.1207, 0.1897, 0.1527, 0.0797, 0.0097, -0.0407],
                type: 'percentage'
            },
            ev_ebitda: {
                title: "EV/EBITDA",
                data: [4.67, 4.74, 2.84, 1.57, 2.39, 6.50, 2.58, 5.37, 6.19, 8.05, 19.43]
            },
            ev_ebit: {
                title: "EV/EBIT",
                data: [5.92, 6.00, 3.84, 1.94, 3.10, 14.14, 4.55, 9.36, 13.15, 31.76, -37.42]
            },
            p_ebitda: {
                title: "P/EBITDA",
                data: [2.67, 2.72, 1.90, 0.88, 1.36, 3.43, 2.72, 2.72, 2.62, 2.98, 3.44]
            },
            p_ebit: {
                title: "P/EBIT",
                data: [3.38, 3.44, 2.57, 1.09, 1.76, 7.45, 4.79, 4.74, 5.56, 11.77, -6.63]
            },
            p_ativo: {
                title: "P/ATIVO",
                data: [0.41, 0.42, 0.46, 0.33, 0.38, 0.37, 0.43, 0.34, 0.25, 0.24, 0.10]
            },
            p_cap_giro: {
                title: "P/CAP.GIRO",
                data: [-7.77, -7.92, -70.93, -470.68, 11.13, 61.31, -97.30, 6.36, 2.86, 3.00, 1.51]
            },
            p_ativo_circ_liq: {
                title: "P/ATIVO CIRC LIQ",
                data: [-0.47, -0.48, -0.54, -0.39, -0.46, -0.44, -0.48, -0.41, -0.31, -0.29, -0.12]
            },
            vpa: {
                title: "VPA",
                data: [28.06, 28.06, 29.16, 27.93, 29.69, 23.64, 22.66, 21.25, 20.24, 19.18, 19.53]
            },
            lpa: {
                title: "LPA",
                data: [2.81, 2.81, 9.55, 14.44, 8.18, 0.54, 3.08, 1.98, -0.03, -1.14, -2.67]
            },
            roe: {
                title: "ROE",
                data: [0.1, 0.1, 0.33, 0.52, 0.28, 0.02, 0.14, 0.09, 0.00, -0.06, -0.15],
                type: 'percentage'
            },
            roa: {
                title: "ROA",
                data: [0.0329, 0.0329, 0.1125, 0.1695, 0.0915, 0.0060, 0.0340, 0.0220, -0.0005, -0.0195, -0.0455],
                type: 'percentage'
            }
        });
    }, []);

    return (
        <>
            {historicalFundamentalistIndicators ? (
                <Paper>
                    <CardHeader
                        title={"HISTÓRICO DE INDICADORES FUNDAMENTALISTAS"}
                        sx={{ py: 2 }}
                        action={
                            <ChartSelect
                                options={['5 Anos', '10 Anos']}
                                value={historicalFundDataRange}
                                onChange={handleChangeHistoricalFundDataRange}
                            />
                        }
                    />
                    <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Indicador</TableCell>
                                    {getFilteredData(historicalFundamentalistIndicators.ano).map((year, index) => (
                                        <TableCell key={index} sx={{}}>{year}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.keys(historicalFundamentalistIndicators)
                                    .filter(key => key !== 'ano')
                                    .map((indicatorKey) => (
                                        <TableRow
                                            key={indicatorKey}
                                            sx={{
                                                '&:hover': {
                                                    backgroundColor: 'rgba(224, 224, 224, 0.15)',
                                                },
                                            }}
                                        >
                                            <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 0.15)' }}>{historicalFundamentalistIndicators[indicatorKey].title}</TableCell>
                                            {getFilteredData(historicalFundamentalistIndicators[indicatorKey].data).map((value, index) => (
                                                <TableCell key={index} sx={{ borderRight: '1px solid rgba(224, 224, 224, 0.15)' }}>
                                                    {historicalFundamentalistIndicators[indicatorKey].type === 'percentage' ? `${(value * 100).toFixed(2)}%` : value}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            ) : (
                <Skeleton variant="rounded" width="100%" height={500} />
            )}
        </>
    )
}