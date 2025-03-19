import React, { useEffect, useState } from 'react';
import { Box, Divider, Paper, Typography } from '@mui/material';
import { AssetDetailsHeader } from './view/asset-details-header';
import { CardAssetDetails } from './card-asset-details';
import { CONFIG } from 'src/global-config';
import { ChartComplete } from 'src/components/chart-complete';
import { VerticalTable } from './vertical-table';
import { FundamentalIndicatorCard } from './fundamental-indicator-card';
import { AssetHistoricTable } from './asset-historic-table';
import { DividendsHistoric } from './dividends-historic';

export function AssetDetails({ ticker }) {
    const [tickerData, setTickerData] = useState(null);
    const [chart, setChart] = useState({ series: [] });

    useEffect(() => {
        const timer = setTimeout(() => {
            setTickerData({
                currency: 'BRL',
                name: 'Petrobras',
                ticker: 'PETR4',
                companyName: 'PETROLEO BRASILEIRO S.A. PETROBRAS',
                type: 'Ação',
                image_url: 'https://investidor10.com.br/storage/companies/63d2c9ead34db.jpg',
                current_price: 28.45,
                last_twelve_months: -0.0052,
                p_l: 12.65,
                p_receita: 0.94,
                p_vp: 1.27,
                dividend_yield: 0.2266,
                payout: 2.8231,
                margem_liquida: 0.0746,
                margem_bruta: 0.5021,
                margem_ebit: 0.2795,
                margem_ebitda: 0.3537,
                ev_ebitda: 4.67,
                ev_ebit: 5.92,
                p_ebitda: 2.67,
                p_ebit: 3.38,
                p_ativo: 0.41,
                p_cap_giro: -7.77,
                p_ativo_circ_liq: -0.47,
                vpa: 28.06,
                lpa: 2.81,
                giro_ativos: 0.44,
                roe: 0.1,
                roic: 0.1616,
                roa: 0.0329,
                divida_liquida_patrimonio: 0.89,
                divida_liquida_ebitda: 1.88,
                divida_liquida_ebit: 2.38,
                divida_bruta_patrimonio: 1.02,
                patrimonio_ativos: 0.33,
                passivos_ativos: 0.67,
                liquidez_corrente: 0.69,
                cagr_receitas_5_anos: 0.1253,
                cagr_lucros_5_anos: 0.4272,
                proftability: {
                    proftability: {
                        last_ten_years: 10.1052,
                        last_five_years: 4.012,
                        last_two_years: -0.0232,
                        last_twelve_months: 0.0252,
                        last_three_months: 0.0052,
                        last_month: 0.0052,
                    },
                    real_proftability: {
                        last_ten_years: 12.1052,
                        last_five_years: 2.012,
                        last_two_years: -0.0242,
                        last_twelve_months: 0.0222,
                        last_three_months: 0.0049,
                        last_month: 0.0051,
                    },
                }
            });

            setChart({
                series: [
                    {
                        name: 'Yearly',
                        categories: [2022, 2023, 2024, 2025],
                        data: [
                            {
                                name: 'Retorno Diário',
                                data: ['0.50', '0.75', '0.60', '0.80'],
                            }
                        ],
                    },
                    {
                        name: 'Monthly',
                        categories: ['Jan/2023', 'Fev/2023', 'Mar/2023', 'Abr/2023', 'Mai/2023', 'Jun/2023', 'Jul/2023', 'Ago/2023', 'Set/2023', 'Out/2023', 'Nov/2023', 'Dez/2023'],
                        data: [
                            {
                                name: 'Retorno Diário',
                                data: ['0.50', '0.75', '0.60', '0.80', '0.90', '1.10', '1.20', '1.30', '1.40', '1.50', '1.60', '1.70'],
                            }
                        ],
                    },
                ],
            });

        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <Paper elevation={3} style={{ padding: '1rem' }}>
                <AssetDetailsHeader tickerData={tickerData} />
            </Paper>

            <Box sx={{ mt: 2 }} gap={2} display={'flex'} flexWrap={'wrap'}>
                <CardAssetDetails
                    sx={{ flex: '1', minWidth: '200px' }}
                    title="Cotação"
                    total={tickerData?.current_price}
                    icon={`${CONFIG.assetsDir}/assets/icons/courses/ic-courses-progress.svg`}
                    color='success'
                    currency={tickerData?.currency}
                    type='currency'
                    description='Valor atual da ação'
                />
                <CardAssetDetails
                    sx={{ flex: '1', minWidth: '200px' }}
                    title="Variação (12M)"
                    total={tickerData?.last_twelve_months}
                    icon={`${CONFIG.assetsDir}/assets/icons/courses/ic-courses-progress.svg`}
                    color='warning'
                    type='percentage'
                    description='Variação dos últimos 12 meses'
                />
                <CardAssetDetails
                    sx={{ flex: '1', minWidth: '200px' }}
                    title="P/L"
                    total={tickerData?.p_l}
                    icon={`${CONFIG.assetsDir}/assets/icons/courses/ic-courses-progress.svg`}
                    color='info'
                    description='Preço da ação dividido pelo lucro por ação'
                />
                <CardAssetDetails
                    sx={{ flex: '1', minWidth: '200px' }}
                    title="P/VP"
                    total={tickerData?.p_vp}
                    icon={`${CONFIG.assetsDir}/assets/icons/courses/ic-courses-progress.svg`}
                    color='error'
                    description='Preço da ação dividido pelo valor patrimonial por ação'
                />
                <CardAssetDetails
                    sx={{ flex: '1', minWidth: '200px' }}
                    title="DY"
                    total={tickerData?.dividend_yield}
                    icon={`${CONFIG.assetsDir}/assets/icons/courses/ic-courses-progress.svg`}
                    color='primary'
                    type='percentage'
                    description='Dividend Yield (DY) é o indicador que mostra quanto a empresa paga de dividendos em relação ao preço da ação'
                />
            </Box>

            <Box>
                <ChartComplete chart={chart} title={`Cotação ${ticker.toUpperCase()}`} subheader={`Evolução e desempenho das ações ${tickerData?.name ?? ""} (${ticker.toUpperCase()})`} />
            </Box>

            <VerticalTable tickerData={tickerData} />

            <Divider sx={{ borderStyle: 'dashed', mt: 3 }} />

            <Typography variant='h6' sx={{ ml: "3px", mt: 3, mb: 2 }}>INDICADORES FUNDAMENTALISTAS</Typography>
            <Box display={'flex'} justifyContent={'space-between'} width={"100%"} flexWrap={'wrap'} gap={2}>
                <FundamentalIndicatorCard tickerData={tickerData} />
            </Box>

            <Divider sx={{ borderStyle: 'dashed', mt: 3 }} />

            <Box sx={{ mt: 3 }}>
                <AssetHistoricTable ticker={ticker} />
            </Box>

            <Divider sx={{ borderStyle: 'dashed', mt: 3 }} />


            <Typography variant='h6' sx={{ ml: "3px", mt: 3, mb: 2 }}>HISTÓRICO DE DIVIDENDOS DE {ticker}</Typography>
            <DividendsHistoric ticker={ticker} />
        </>
    );
}