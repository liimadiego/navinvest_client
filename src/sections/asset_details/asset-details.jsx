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

export function AssetDetails({ ticker, tickerData, chart }) {

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