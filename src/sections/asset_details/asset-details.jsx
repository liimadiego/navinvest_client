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

export function AssetDetails({ ticker, tickerData, chart, proftability }) {

    function isEmpty(obj) {
        for (const prop in obj) {
            if (Object.hasOwn(obj, prop)) {
                return false;
            }
        }
        return true;
    }

    const tickerInfo = tickerData?.tickerCompanyInfo;
    const companyInfo = tickerData?.tickerCompanyInfo?.company;
    const companyMarketData = tickerData?.companyMarketData[0];
    const historicalDividendYieldData = tickerData?.historicalDividendYieldData;
    const historicalQuotesData = tickerData?.historicalQuotesData;

    const price12MAgo = tickerInfo ? tickerInfo.price_twelve_months_ago : 0;
    const priceNow = tickerInfo ? tickerInfo.current_price : 0;

    const variation12M = !isEmpty(tickerData?.historicalQuotesData) ? (priceNow / price12MAgo) - 1 : 0;

    return (
        <>
            <Paper elevation={3} style={{ padding: '1rem' }}>
                <AssetDetailsHeader tickerData={tickerData} />
            </Paper>

            <Box sx={{ mt: 2 }} gap={2} display={'flex'} flexWrap={'wrap'}>
                <CardAssetDetails
                    sx={{ flex: '1', minWidth: '200px' }}
                    title="Cotação"
                    total={tickerInfo?.current_price}
                    icon={`${CONFIG.assetsDir}/assets/icons/courses/ic-courses-progress.svg`}
                    color='success'
                    currency={tickerInfo?.currency}
                    type='currency'
                    description='Valor atual da ação'
                />
                <CardAssetDetails
                    sx={{ flex: '1', minWidth: '200px' }}
                    title="Variação (12M)"
                    total={variation12M}
                    icon={`${CONFIG.assetsDir}/assets/icons/courses/ic-courses-progress.svg`}
                    color='warning'
                    type='percentage'
                    description='Variação dos últimos 12 meses'
                />
                <CardAssetDetails
                    sx={{ flex: '1', minWidth: '200px' }}
                    title="P/L"
                    total={companyMarketData?.market_ratios?.price_earnings ? companyMarketData?.market_ratios?.price_earnings.toFixed(2) : 0}
                    icon={`${CONFIG.assetsDir}/assets/icons/courses/ic-courses-progress.svg`}
                    color='info'
                    description='Preço da ação dividido pelo lucro por ação'
                />
                <CardAssetDetails
                    sx={{ flex: '1', minWidth: '200px' }}
                    title="P/VP"
                    total={companyMarketData?.market_ratios?.price_to_book ? companyMarketData?.market_ratios?.price_to_book.toFixed(2) : 0}
                    icon={`${CONFIG.assetsDir}/assets/icons/courses/ic-courses-progress.svg`}
                    color='error'
                    description='Preço da ação dividido pelo valor patrimonial por ação'
                />
                <CardAssetDetails
                    sx={{ flex: '1', minWidth: '200px' }}
                    title="DY"
                    total={companyMarketData?.dividendYieldLast12Months ? companyMarketData?.dividendYieldLast12Months : 0}
                    icon={`${CONFIG.assetsDir}/assets/icons/courses/ic-courses-progress.svg`}
                    color='primary'
                    type='percentage'
                    description='Dividend Yield (DY) é o indicador que mostra quanto a empresa paga de dividendos em relação ao preço da ação. Cálculo dos últimos 12 meses'
                />
            </Box>

            <Box>
                <ChartComplete isCurrency={true} chart={chart} title={`Cotação ${ticker.toUpperCase()}`} subheader={`Evolução e desempenho das ações ${tickerData?.name ?? ""} (${ticker.toUpperCase()})`} />
            </Box>

            <VerticalTable proftability={proftability} />

            <Divider sx={{ borderStyle: 'dashed', mt: 3 }} />

            <Typography variant='h6' sx={{ ml: "3px", mt: 3, mb: 2 }}>INDICADORES FUNDAMENTALISTAS</Typography>
            <Box display={'flex'} justifyContent={'space-between'} width={"100%"} flexWrap={'wrap'} gap={2}>
                <FundamentalIndicatorCard tickerData={tickerData} />
            </Box>

            <Divider sx={{ borderStyle: 'dashed', mt: 3 }} />

            <Box sx={{ mt: 3 }}>
                <AssetHistoricTable companyMarketData={tickerData?.companyMarketData} historicalDividendYieldData={historicalDividendYieldData} />
            </Box>

            <Divider sx={{ borderStyle: 'dashed', mt: 3 }} />


            <Typography variant='h6' sx={{ ml: "3px", mt: 3, mb: 2 }}>HISTÓRICO DE DIVIDENDOS DE {ticker}</Typography>
            <DividendsHistoric historicalDividendYieldData={historicalDividendYieldData} />
        </>
    );
}