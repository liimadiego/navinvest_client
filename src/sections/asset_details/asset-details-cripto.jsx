import React, { useEffect, useState, useRef } from 'react';
import { Box, Divider, Paper, Typography } from '@mui/material';
import { AssetDetailsHeader } from './view/asset-details-header';
import { CardAssetDetails } from './card-asset-details';
import { CONFIG } from 'src/global-config';
import { ChartComplete } from 'src/components/chart-complete';
import { VerticalTable } from './vertical-table';
import { FundamentalIndicatorCard } from './fundamental-indicator-card';
import { AssetHistoricTable } from './asset-historic-table';
import { DividendsHistoric } from './dividends-historic';

export function AssetDetailsCripto({ ticker, tickerData, chart, assetType, proftability }) {
    function isEmpty(obj) {
        for (const prop in obj) {
            if (Object.hasOwn(obj, prop)) {
                return false;
            }
        }
        return true;
    }

    const tickerInfo = tickerData?.tickerData;
    const assetInfo = tickerData?.tickerData?.cripto || {};
    const currency = tickerInfo ? tickerInfo.currency : 'BRL';

    const {
        name,
        market_cap,
        market_cap_rank,
        fully_diluted_valuation,
        total_volume,
        high_24h,
        low_24h,
        circulating_supply,
        total_supply,
        max_supply,
        roi_percentage,
        roi_currency,
        last_updated
    } = assetInfo;

    const price12MAgo = tickerInfo ? tickerInfo.price_twelve_months_ago : 0;
    const priceNow = tickerInfo ? tickerInfo.current_price : 0;

    const currentPrice = tickerInfo ? parseFloat(tickerInfo.current_price).toFixed(2) : 0;

    const variation12M = !isEmpty(tickerData?.historicalQuotesData) && price12MAgo ? (priceNow / price12MAgo) - 1 : 0;
    const refCompany = useRef(null);
    const refIndicators = useRef(null);
    const refPrice = useRef(null);

    return (
        <>
            <Paper elevation={3} style={{ padding: '1rem' }}>
                <AssetDetailsHeader tickerData={tickerData} refIndicators={refIndicators} refPrice={refPrice} assetType={'cripto'} />
            </Paper>

            <Box sx={{ mt: 2 }} gap={2} display={'flex'} flexWrap={'wrap'}>
                <CardAssetDetails
                    sx={{ flex: '1', minWidth: { xs: '200px', sm: '300px' } }}
                    title="Cotação"
                    total={currentPrice}
                    icon={`${CONFIG.assetsDir}/assets/icons/courses/ic-courses-progress.svg`}
                    color='success'
                    currency={currency}
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
                    title="Rank de Mercado"
                    total={market_cap_rank + "º"}
                    icon={`${CONFIG.assetsDir}/assets/icons/courses/ic-courses-progress.svg`}
                    color='primary'
                    description='Posição do ativo no ranking de mercado'
                />
                <CardAssetDetails
                    sx={{ flex: '1', minWidth: { xs: '200px', sm: '450px' } }}
                    title="Capitalização de Mercado"
                    total={market_cap}
                    icon={`${CONFIG.assetsDir}/assets/icons/courses/ic-courses-progress.svg`}
                    color='error'
                    type='currency_string'
                    currency={currency}
                    description='Valor total de mercado do ativo'
                />
            </Box>
            <Box ref={refPrice} >
                <ChartComplete isCurrency={true} chart={chart} title={`Cotação ${ticker.toUpperCase()}`} subheader={`Evolução e desempenho das ações ${assetInfo?.trade_name ? assetInfo?.trade_name : ""} (${ticker.toUpperCase()})`} currency={currency} />
            </Box>
            <VerticalTable proftability={proftability} />

            <Divider sx={{ borderStyle: 'dashed', mt: 3 }} />

            <Typography variant='h6' sx={{ ml: "3px", mt: 3, mb: 2 }} ref={refIndicators}>INDICADORES</Typography>
            <Box display={'flex'} justifyContent={'space-between'} width={"100%"} flexWrap={'wrap'} gap={2}>
                <FundamentalIndicatorCard tickerData={tickerData} assetType={'cripto'} />
            </Box>
        </>
    );
}