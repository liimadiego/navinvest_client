import React, { useEffect, useState, useRef } from 'react';
import { Box, Divider, Paper, Typography } from '@mui/material';
import { AssetDetailsHeader } from './view/asset-details-header';
import { CardAssetDetails } from './card-asset-details';
import { CONFIG } from 'src/global-config';
import { ChartComplete } from 'src/components/chart-complete';
import { VerticalTable } from './vertical-table';

export function AssetDetailsEtf({ ticker, tickerData, chart, proftability }) {
    function isEmpty(obj) {
        for (const prop in obj) {
            if (Object.hasOwn(obj, prop)) {
                return false;
            }
        }
        return true;
    }

    const tickerInfo = tickerData?.tickerData;
    const assetInfo = tickerInfo?.etf || {};
    const currency = tickerInfo ? tickerInfo.currency : 'BRL';

    const {
        long_name,
        symbol,
        address1,
        address2,
        city,
        zip,
        country,
        industry,
        sector,
        about,
        logo_url
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
                <AssetDetailsHeader tickerData={tickerData} refPrice={refPrice} refCompany={refCompany} assetType={'etf'} />
            </Paper>

            <Box sx={{ mt: 2 }} gap={2} display={'flex'} flexWrap={'wrap'}>
                <CardAssetDetails
                    sx={{ flex: '1', minWidth: '200px' }}
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
            </Box>


            <Box ref={refPrice} >
                <ChartComplete isCurrency={true} chart={chart} title={`Cotação ${ticker.toUpperCase()}`} subheader={`Evolução e desempenho das ações ${assetInfo?.long_name ? assetInfo?.long_name : ""} (${ticker.toUpperCase()})`} currency={currency} />
            </Box>
            <VerticalTable proftability={proftability} />

            <Divider sx={{ borderStyle: 'dashed', mt: 3 }} />

            <Typography variant='h6' sx={{ ml: "3px", mt: 3, mb: 2 }} ref={refCompany}>INFORMAÇÕES DA EMPRESA</Typography>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
                    <Box sx={{ flex: '0 0 100px', display: 'flex', justifyContent: 'center' }}>
                        {logo_url ? (
                            <Box
                                component="img"
                                src={logo_url}
                                alt={`Logo ${assetInfo?.trade_name || ticker}`}
                                sx={{ maxWidth: '100%', maxHeight: '100px', objectFit: 'contain', borderRadius: 1 }}
                            />
                        ) : (
                            <Box
                                sx={{
                                    width: '100%',
                                    height: '100px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    bgcolor: 'background.neutral',
                                    borderRadius: 1,
                                }}
                            >
                                <Typography variant="body2" color="text.secondary" width={65}>Logo não disponível</Typography>
                            </Box>
                        )}
                    </Box>

                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h5" gutterBottom>{assetInfo?.long_name || '-'}</Typography>

                        <Typography variant="body2" paragraph sx={{ mb: 2 }}>
                            {assetInfo?.about || 'Informações sobre a empresa não disponíveis'}
                        </Typography>

                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">Setor</Typography>
                                <Typography variant="body2" gutterBottom>{assetInfo?.sector || '-'}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">Subsetor</Typography>
                                <Typography variant="body2" gutterBottom>{assetInfo?.sector || '-'}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">Segmento</Typography>
                                <Typography variant="body2" gutterBottom>{assetInfo?.industry || '-'}</Typography>
                            </Box>
                        </Box>

                        <Divider sx={{ mt: 3 }} />

                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Endereço</Typography>
                            <Typography variant="body2" gutterBottom>
                                {address1 ? address1 + (address2 ? `, ${address2}` : '') : '-'}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                {city ? `${city}, ` : ''}{zip ? `${zip}, ` : ''}{country || '-'}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </>
    );
}