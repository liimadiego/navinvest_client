import { ChartSelect } from 'src/components/chart';
import { CardHeader, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useEffect, useState } from 'react';
import { set } from 'nprogress';

export function AssetHistoricTable({ companyMarketData, historicalDividendYieldData }) {
    const [currentYearData, setCurrentYearData] = useState(null);
    const [historicalFundDataRange, setHistoricalFundDataRange] = useState('5 Anos');
    const [historicalFundamentalistIndicators, setHistoricalFundamentalistIndicators] = useState(null);

    useEffect(() => {

        if (!!companyMarketData && !!historicalDividendYieldData) {
            const currentYear = new Date().getFullYear();
            const maxYear = Math.max(...companyMarketData.map((item) => item.year));
            const maxYearDividends = historicalDividendYieldData?.dividendYields ? Math.max(...historicalDividendYieldData.dividendYields.map((item) => {
                return parseInt(item.year.split('-')[0]);
            })) : 0;

            const PLs = companyMarketData.map((item) => {
                return item.market_ratios?.price_earnings ? item.market_ratios.price_earnings.toFixed(2) : '-'
            }).slice(0, 10);

            const PSRs = companyMarketData.map((item) => {
                return item.market_ratios?.price_to_sales ? item.market_ratios.price_to_sales.toFixed(2) : '-'
            }).slice(0, 10);

            const PVPs = companyMarketData.map((item) => {
                return item.market_ratios?.price_to_book ? item.market_ratios.price_to_book.toFixed(2) : '-'
            }).slice(0, 10);

            const dividends = historicalDividendYieldData?.dividendYields ? historicalDividendYieldData.dividendYields.map((item) => {
                return item.dy ? (item.dy / 100) : '-';
            }).slice(0, 10) : Array(10).fill('-');

            const payouts = companyMarketData.map((item) => {
                return item.others.payout ? item.others.payout : '-'
            }).slice(0, 10);

            const netMargins = companyMarketData.map((item) => {
                return item.ratios?.net_margin ? item.ratios.net_margin / 100 : '-'
            }).slice(0, 10);

            const grossMargins = companyMarketData.map((item) => {
                return item.ratios?.gross_margin ? item.ratios.gross_margin / 100 : '-'
            }).slice(0, 10);

            const ebitMargins = companyMarketData.map((item) => {
                return item.ratios?.ebit_margin ? item.ratios.ebit_margin / 100 : '-'
            }).slice(0, 10);

            const ebitdaMargins = companyMarketData.map((item) => {
                return item.ratios?.ebitda_margin ? item.ratios.ebitda_margin / 100 : '-'
            }).slice(0, 10);

            const evEbitda = companyMarketData.map((item) => {
                return item.others?.EV_EBITDA ? item.others.EV_EBITDA.toFixed(2) : '-'
            }).slice(0, 10);

            const evEbit = companyMarketData.map((item) => {
                return item.others?.EV_EBIT ? item.others.EV_EBIT.toFixed(2) : '-'
            }).slice(0, 10);

            const pEbitda = companyMarketData.map((item) => {
                return item.others?.P_EBITDA ? item.others.P_EBITDA.toFixed(2) : '-'
            }).slice(0, 10);

            const pEbit = companyMarketData.map((item) => {
                return item.market_ratios?.price_to_ebit ? item.market_ratios.price_to_ebit.toFixed(2) : '-'
            }).slice(0, 10);

            const pAssets = companyMarketData.map((item) => {
                return item.market_ratios?.price_to_assets ? item.market_ratios.price_to_assets.toFixed(2) : '-'
            }).slice(0, 10);

            const pWorkingCapital = companyMarketData.map((item) => {
                return item?.others?.p_acl ? item.others.p_acl.toFixed(2) : '-'
            }).slice(0, 10);

            const vpa = companyMarketData.map((item) => {
                return item.market_ratios?.equity_per_share ? item.market_ratios.equity_per_share.toFixed(2) : '-'
            }).slice(0, 10);

            const lpa = companyMarketData.map((item) => {
                // return item.incomes.net_income && item.others.totalShares ? (item.incomes.net_income / item.others.totalShares).toFixed(2) : '-';

                return item.market_ratios?.earnings_per_share ? item.market_ratios.earnings_per_share.toFixed(2) : '-'
            }).slice(0, 10);

            const roe = companyMarketData.map((item) => {
                return item.ratios?.return_on_equity ? item.ratios.return_on_equity / 100 : '-'
            }).slice(0, 10);

            const roa = companyMarketData.map((item) => {
                return item.ratios?.return_on_assets ? item.ratios.return_on_assets : '-'
            }).slice(0, 10);

            if (currentYear > maxYear && companyMarketData?.[0]) {
                PLs.unshift(companyMarketData[0]?.market_ratios?.price_earnings ? companyMarketData[0].market_ratios.price_earnings.toFixed(2) : '-');
                PSRs.unshift(companyMarketData[0]?.market_ratios?.price_to_sales ? companyMarketData[0].market_ratios.price_to_sales.toFixed(2) : '-');
                PVPs.unshift(companyMarketData[0]?.market_ratios?.price_to_book ? companyMarketData[0].market_ratios.price_to_book.toFixed(2) : '-');
                payouts.unshift(companyMarketData[0]?.others?.payout ?? '-');
                netMargins.unshift(companyMarketData[0]?.ratios?.net_margin ? companyMarketData[0].ratios.net_margin / 100 : '-');
                grossMargins.unshift(companyMarketData[0]?.ratios?.gross_margin ? companyMarketData[0].ratios.gross_margin / 100 : '-');
                ebitMargins.unshift(companyMarketData[0]?.ratios?.ebit_margin ? companyMarketData[0].ratios.ebit_margin / 100 : '-');
                ebitdaMargins.unshift(companyMarketData[0]?.ratios?.ebitda_margin ? companyMarketData[0].ratios.ebitda_margin / 100 : '-');
                evEbitda.unshift(companyMarketData[0]?.others?.EV_EBITDA ? companyMarketData[0].others.EV_EBITDA.toFixed(2) : '-');
                evEbit.unshift(companyMarketData[0]?.others?.EV_EBIT ? companyMarketData[0].others.EV_EBIT.toFixed(2) : '-');
                pEbitda.unshift(companyMarketData[0]?.others?.P_EBITDA ? companyMarketData[0].others.P_EBITDA.toFixed(2) : '-');
                pEbit.unshift(companyMarketData[0]?.market_ratios?.price_to_ebit ? companyMarketData[0].market_ratios.price_to_ebit.toFixed(2) : '-');
                pAssets.unshift(companyMarketData[0]?.market_ratios?.price_to_assets ? companyMarketData[0].market_ratios.price_to_assets.toFixed(2) : '-');
                pWorkingCapital.unshift(companyMarketData[0]?.others?.p_acl ? companyMarketData[0].others.p_acl.toFixed(2) : '-');
                vpa.unshift(companyMarketData[0]?.market_ratios?.equity_per_share ? companyMarketData[0].market_ratios.equity_per_share.toFixed(2) : '-');
                lpa.unshift(companyMarketData[0]?.market_ratios?.earnings_per_share ? companyMarketData[0].market_ratios.earnings_per_share.toFixed(2) : '-');
                roe.unshift(companyMarketData[0]?.ratios?.return_on_equity ? companyMarketData[0].ratios.return_on_equity / 100 : '-');
                roa.unshift(companyMarketData[0]?.ratios?.return_on_assets ?? '-');
            }

            if (currentYear == maxYearDividends) {
                dividends[0] = companyMarketData[0].dividendYieldLast12Months;
                dividends.push('-')
            }

            setHistoricalFundamentalistIndicators({
                ano: ["Atual", ...companyMarketData.map((item) => item.year).slice(0, 10)],
                p_l: {
                    title: "P/L",
                    data: PLs
                },
                p_receita: {
                    title: "P/RECEITA (PSR)",
                    data: PSRs
                },
                p_vp: {
                    title: "P/VP",
                    data: PVPs
                },
                dividend_yield: {
                    title: "DIVIDEND YIELD (DY)",
                    data: dividends,
                    type: 'percentage'
                },
                payout: {
                    title: "PAYOUT",
                    data: payouts,
                    type: 'percentage'
                },
                margem_liquida: {
                    title: "MARGEM LÍQUIDA",
                    data: netMargins,
                    type: 'percentage'
                },
                margem_bruta: {
                    title: "MARGEM BRUTA",
                    data: grossMargins,
                    type: 'percentage'
                },
                margem_ebit: {
                    title: "MARGEM EBIT",
                    data: ebitMargins,
                    type: 'percentage'
                },
                margem_ebitda: {
                    title: "MARGEM EBITDA",
                    data: ebitdaMargins,
                    type: 'percentage'
                },
                ev_ebitda: {
                    title: "EV/EBITDA",
                    data: evEbitda,
                },
                ev_ebit: {
                    title: "EV/EBIT",
                    data: evEbit,
                },
                p_ebitda: {
                    title: "P/EBITDA",
                    data: pEbitda,
                },
                p_ebit: {
                    title: "P/EBIT",
                    data: pEbit,
                },
                p_ativo: {
                    title: "P/ATIVO",
                    data: pAssets,
                },
                p_ativo_circ_liq: {
                    title: "P/ATIVO CIRC LIQ",
                    data: pWorkingCapital,
                },
                vpa: {
                    title: "VPA",
                    data: vpa,
                },
                lpa: {
                    title: "LPA",
                    data: lpa,
                },
                roe: {
                    title: "ROE",
                    data: roe,
                    type: 'percentage'
                },
                roa: {
                    title: "ROA",
                    data: roa,
                    type: 'percentage'
                }
            });
        }
    }, [companyMarketData, historicalDividendYieldData]);

    const handleChangeHistoricalFundDataRange = (newValue) => {
        setHistoricalFundDataRange(newValue);
    };

    const getFilteredData = (data) => {
        return historicalFundDataRange === '5 Anos' ? data.slice(0, 6) : data.slice(0, 11);
    };

    useEffect(() => {
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
                                                    {historicalFundamentalistIndicators[indicatorKey].type === 'percentage' && !isNaN(value) ? `${(value * 100).toFixed(2)}%` : value}
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