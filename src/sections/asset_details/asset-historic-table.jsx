import { ChartSelect } from 'src/components/chart';
import { CardHeader, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useEffect, useState } from 'react';
import { set } from 'nprogress';
import { fNumber, fPercent, fShortenNumberToString } from 'src/utils/format-number';

export function AssetHistoricTable({ assetData, historicalDividendYieldData, assetType }) {
    const [currentYearData, setCurrentYearData] = useState(null);
    const [historicalFundDataRange, setHistoricalFundDataRange] = useState('5 Anos');
    const [historicalFundamentalistIndicators, setHistoricalFundamentalistIndicators] = useState(null);

    useEffect(() => {
        if (!!assetData && !!historicalDividendYieldData && assetType === 'br_stock') {
            const currentYear = new Date().getFullYear();
            const maxYear = Math.max(...assetData.map((item) => item.year));
            const maxYearDividends = historicalDividendYieldData?.dividendYields ? Math.max(...historicalDividendYieldData.dividendYields.map((item) => {
                return parseInt(item.year.split('-')[0]);
            })) : 0;

            const PLs = assetData.map((item) => {
                return item.market_ratios?.price_earnings ? item.market_ratios.price_earnings.toFixed(2) : '-'
            }).slice(0, 10);

            const PSRs = assetData.map((item) => {
                return item.market_ratios?.price_to_sales ? item.market_ratios.price_to_sales.toFixed(2) : '-'
            }).slice(0, 10);

            const PVPs = assetData.map((item) => {
                return item.market_ratios?.price_to_book ? item.market_ratios.price_to_book.toFixed(2) : '-'
            }).slice(0, 10);

            const dividends = historicalDividendYieldData?.dividendYields ? historicalDividendYieldData.dividendYields.map((item) => {
                return item.dy ? (item.dy / 100) : '-';
            }).slice(0, 10) : Array(10).fill('-');

            const payouts = assetData.map((item) => {
                return item.others.payout ? item.others.payout : '-'
            }).slice(0, 10);

            const netMargins = assetData.map((item) => {
                return item.ratios?.net_margin ? item.ratios.net_margin / 100 : '-'
            }).slice(0, 10);

            const grossMargins = assetData.map((item) => {
                return item.ratios?.gross_margin ? item.ratios.gross_margin / 100 : '-'
            }).slice(0, 10);

            const ebitMargins = assetData.map((item) => {
                return item.ratios?.ebit_margin ? item.ratios.ebit_margin / 100 : '-'
            }).slice(0, 10);

            const ebitdaMargins = assetData.map((item) => {
                return item.ratios?.ebitda_margin ? item.ratios.ebitda_margin / 100 : '-'
            }).slice(0, 10);

            const evEbitda = assetData.map((item) => {
                return item.others?.EV_EBITDA ? item.others.EV_EBITDA.toFixed(2) : '-'
            }).slice(0, 10);

            const evEbit = assetData.map((item) => {
                return item.others?.EV_EBIT ? item.others.EV_EBIT.toFixed(2) : '-'
            }).slice(0, 10);

            const pEbitda = assetData.map((item) => {
                return item.others?.P_EBITDA ? item.others.P_EBITDA.toFixed(2) : '-'
            }).slice(0, 10);

            const pEbit = assetData.map((item) => {
                return item.market_ratios?.price_to_ebit ? item.market_ratios.price_to_ebit.toFixed(2) : '-'
            }).slice(0, 10);

            const pAssets = assetData.map((item) => {
                return item.market_ratios?.price_to_assets ? item.market_ratios.price_to_assets.toFixed(2) : '-'
            }).slice(0, 10);

            const pWorkingCapital = assetData.map((item) => {
                return item?.others?.p_acl ? item.others.p_acl.toFixed(2) : '-'
            }).slice(0, 10);

            const vpa = assetData.map((item) => {
                return item.market_ratios?.equity_per_share ? item.market_ratios.equity_per_share.toFixed(2) : '-'
            }).slice(0, 10);

            const lpa = assetData.map((item) => {
                // return item.incomes.net_income && item.others.totalShares ? (item.incomes.net_income / item.others.totalShares).toFixed(2) : '-';

                return item.market_ratios?.earnings_per_share ? item.market_ratios.earnings_per_share.toFixed(2) : '-'
            }).slice(0, 10);

            const roe = assetData.map((item) => {
                return item.ratios?.return_on_equity ? item.ratios.return_on_equity / 100 : '-'
            }).slice(0, 10);

            const roa = assetData.map((item) => {
                return item.ratios?.return_on_assets ? item.ratios.return_on_assets : '-'
            }).slice(0, 10);

            if (currentYear > maxYear && assetData?.[0]) {
                PLs.unshift(assetData[0]?.market_ratios?.price_earnings ? assetData[0].market_ratios.price_earnings.toFixed(2) : '-');
                PSRs.unshift(assetData[0]?.market_ratios?.price_to_sales ? assetData[0].market_ratios.price_to_sales.toFixed(2) : '-');
                PVPs.unshift(assetData[0]?.market_ratios?.price_to_book ? assetData[0].market_ratios.price_to_book.toFixed(2) : '-');
                payouts.unshift(assetData[0]?.others?.payout ?? '-');
                netMargins.unshift(assetData[0]?.ratios?.net_margin ? assetData[0].ratios.net_margin / 100 : '-');
                grossMargins.unshift(assetData[0]?.ratios?.gross_margin ? assetData[0].ratios.gross_margin / 100 : '-');
                ebitMargins.unshift(assetData[0]?.ratios?.ebit_margin ? assetData[0].ratios.ebit_margin / 100 : '-');
                ebitdaMargins.unshift(assetData[0]?.ratios?.ebitda_margin ? assetData[0].ratios.ebitda_margin / 100 : '-');
                evEbitda.unshift(assetData[0]?.others?.EV_EBITDA ? assetData[0].others.EV_EBITDA.toFixed(2) : '-');
                evEbit.unshift(assetData[0]?.others?.EV_EBIT ? assetData[0].others.EV_EBIT.toFixed(2) : '-');
                pEbitda.unshift(assetData[0]?.others?.P_EBITDA ? assetData[0].others.P_EBITDA.toFixed(2) : '-');
                pEbit.unshift(assetData[0]?.market_ratios?.price_to_ebit ? assetData[0].market_ratios.price_to_ebit.toFixed(2) : '-');
                pAssets.unshift(assetData[0]?.market_ratios?.price_to_assets ? assetData[0].market_ratios.price_to_assets.toFixed(2) : '-');
                pWorkingCapital.unshift(assetData[0]?.others?.p_acl ? assetData[0].others.p_acl.toFixed(2) : '-');
                vpa.unshift(assetData[0]?.market_ratios?.equity_per_share ? assetData[0].market_ratios.equity_per_share.toFixed(2) : '-');
                lpa.unshift(assetData[0]?.market_ratios?.earnings_per_share ? assetData[0].market_ratios.earnings_per_share.toFixed(2) : '-');
                roe.unshift(assetData[0]?.ratios?.return_on_equity ? assetData[0].ratios.return_on_equity / 100 : '-');
                roa.unshift(assetData[0]?.ratios?.return_on_assets ?? '-');
            }

            if (currentYear == maxYearDividends) {
                dividends[0] = assetData[0].dividendYieldLast12Months;
                dividends.push('-')
            }

            setHistoricalFundamentalistIndicators({
                ano: ["Atual", ...assetData.map((item) => item.year).slice(0, 10)],
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

        if (!!assetData && assetType === 'us_stock') {
            const years = assetData.map(item => item.year);
            const pl = assetData.map(item => item.stockData.pl ? item.stockData.pl : '-');
            const psr = assetData.map(item => item.stockData.psr ? item.stockData.psr : '-');
            const pvp = assetData.map(item => item.stockData.pvp ? item.stockData.pvp : '-');
            const dividendYield = assetData.map(item => item.stockData.dividend_yield ? item.stockData.dividend_yield / 100 : '-');
            const roa = assetData.map(item => item.stockData.roa ? (item.stockData.roa / 100) : '-');
            const roe = assetData.map(item => item.stockData.roe ? (item.stockData.roe / 100) : '-');
            const roic = assetData.map(item => item.stockData.roic ? (item.stockData.roic / 100) : '-');
            const margemLiquida = assetData.map(item => item.stockData.margem_liquida ? (item.stockData.margem_liquida / 100) : '-');
            const margemBruta = assetData.map(item => item.stockData.margem_bruta ? (item.stockData.margem_bruta / 100) : '-');
            const margemOperacional = assetData.map(item => item.stockData.margem_operacional ? (item.stockData.margem_operacional / 100) : '-');
            const pebitda = assetData.map(item => item.stockData.pebitda ? item.stockData.pebitda : '-');
            const pebit = assetData.map(item => item.stockData.pebit ? item.stockData.pebit : '-');
            const pativo = assetData.map(item => item.stockData.pativo ? item.stockData.pativo : '-');
            const vpa = assetData.map(item => item.stockData.vpa ? item.stockData.vpa : '-');
            const lpa = assetData.map(item => item.stockData.lpa ? item.stockData.lpa : '-');
            const patrimonioAtivos = assetData.map(item => item.stockData.patrimonio_ativos ? (item.stockData.patrimonio_ativos) : '-');

            setHistoricalFundamentalistIndicators({
                ano: years,
                p_l: {
                    title: "P/L",
                    data: pl
                },
                p_receita: {
                    title: "P/RECEITA (PSR)",
                    data: psr
                },
                p_vp: {
                    title: "P/VP",
                    data: pvp
                },
                dividend_yield: {
                    title: "DIVIDEND YIELD (DY)",
                    data: dividendYield,
                    type: 'percentage'
                },
                roa: {
                    title: "ROA",
                    data: roa,
                    type: 'percentage'
                },
                roe: {
                    title: "ROE",
                    data: roe,
                    type: 'percentage'
                },
                roic: {
                    title: "ROIC",
                    data: roic,
                    type: 'percentage'
                },
                margem_liquida: {
                    title: "MARGEM LÍQUIDA",
                    data: margemLiquida,
                    type: 'percentage'
                },
                margem_bruta: {
                    title: "MARGEM BRUTA",
                    data: margemBruta,
                    type: 'percentage'
                },
                margem_operacional: {
                    title: "MARGEM OPERACIONAL",
                    data: margemOperacional,
                    type: 'percentage'
                },
                pebitda: {
                    title: "P/EBITDA",
                    data: pebitda
                },
                pebit: {
                    title: "P/EBIT",
                    data: pebit
                },
                p_ativo: {
                    title: "P/ATIVO",
                    data: pativo
                },
                vpa: {
                    title: "VPA",
                    data: vpa
                },
                lpa: {
                    title: "LPA",
                    data: lpa
                },
                patrimonio_ativos: {
                    title: "PATRIMÔNIO/ATIVOS",
                    data: patrimonioAtivos
                },
            });
        }

        if (!!assetData && assetType === 'fii') {
            const historicalFundamentalistIndicators = {
                ano: [],
                patrimonial_value: {
                    title: "VALOR PATRIMONIAL",
                    data: []
                },
                patrimonial_value_per_share: {
                    title: "VALOR PATRIMONIAL POR COTA",
                    data: []
                },
                number_of_shareholders: {
                    title: "NUMERO DE COTISTAS",
                    data: []
                },
                shares_issued: {
                    title: "COTAS EMITIDAS",
                    data: []
                },
                p_vp: {
                    title: "P/VP",
                    data: []
                },
                dividend_yield: {
                    title: "DIVIDEND YIELD (DY)",
                    data: [],
                    type: 'percentage'
                },
                market_capitalization: {
                    title: "VALOR DE MERCADO",
                    data: []
                },
                total_area: {
                    title: "AREA TOTAL",
                    data: []
                },
                vacancy_area: {
                    title: "AREA VAGA",
                    data: []
                },
                overdue_area: {
                    title: "AREA INADIMPLENTE",
                    data: []
                },
                vacancy: {
                    title: "VACANCIA FINANCEIRA",
                    data: [],
                    type: 'percentage'
                },
                physical_vacancy: {
                    title: "VACANCIA FISICA",
                    data: [],
                    type: 'percentage'
                },
            };

            for (const data of assetData) {
                data.patrimonial_value_per_share = parseFloat(data.patrimonial_value_per_share.toFixed(2));
                const { 
                    reference_year,
                    patrimonial_value: VALOR_PATRIMONIAL,
                    patrimonial_value_per_share: VALOR_PATRIMONIAL_POR_COTA,
                    vacancy: VACANCIA_FINANCEIRA,
                    number_of_shareholders: NUMERO_DE_COTISTAS,
                    shares_issued: COTAS_EMITIDAS,
                    properties,
                    pvp: PVP,
                    dividend_yield: DY,
                    market_capitalization: VALOR_DE_MERCADO
                } = data;

                let AREA_TOTAL = 0; 
                let AREA_VAGA = 0;
                let AREA_INADIMPLENTE = 0;
                for (const property of properties || []) {
                    AREA_TOTAL += property.Area * 1 || 0;
                    AREA_VAGA += property.Area * property.PercentVacancia || 0;
                    AREA_INADIMPLENTE += property.Area * property.PercentInadimplencia || 0;
                }
                const VACANCIA_FISICA = (AREA_VAGA / (AREA_TOTAL || 1)) || 0;

                historicalFundamentalistIndicators.ano.push(reference_year);
                historicalFundamentalistIndicators.patrimonial_value.data.push('R$ ' + fShortenNumberToString(VALOR_PATRIMONIAL));
                historicalFundamentalistIndicators.patrimonial_value_per_share.data.push('R$ ' + fNumber(VALOR_PATRIMONIAL_POR_COTA));
                historicalFundamentalistIndicators.number_of_shareholders.data.push(fNumber(NUMERO_DE_COTISTAS));
                historicalFundamentalistIndicators.shares_issued.data.push(fNumber(COTAS_EMITIDAS));
                historicalFundamentalistIndicators.p_vp.data.push(fNumber(PVP));
                historicalFundamentalistIndicators.dividend_yield.data.push(DY);
                historicalFundamentalistIndicators.market_capitalization.data.push('R$ ' + fShortenNumberToString(VALOR_DE_MERCADO));
                historicalFundamentalistIndicators.total_area.data.push(fNumber(Math.round(AREA_TOTAL)) + 'm²');
                historicalFundamentalistIndicators.vacancy_area.data.push(fNumber(Math.round(AREA_VAGA)) + 'm²');
                historicalFundamentalistIndicators.overdue_area.data.push(fNumber(Math.round(AREA_INADIMPLENTE)) + 'm²');
                historicalFundamentalistIndicators.vacancy.data.push(VACANCIA_FINANCEIRA);
                historicalFundamentalistIndicators.physical_vacancy.data.push(VACANCIA_FISICA);
            }

            setHistoricalFundamentalistIndicators(historicalFundamentalistIndicators);
        }

    }, [assetData, historicalDividendYieldData]);

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
                                                    {historicalFundamentalistIndicators[indicatorKey].type === 'percentage' && !isNaN(value) ? `${(value * 100).toFixed(2).replace('.', ',')}%` : value}
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