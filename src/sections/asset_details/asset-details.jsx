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

export function AssetDetails({ ticker, tickerData, chart, proftability, assetType }) {
    function isEmpty(obj) {
        for (const prop in obj) {
            if (Object.hasOwn(obj, prop)) {
                return false;
            }
        }
        return true;
    }

    let assetInfo = null;
    const tickerInfo = tickerData?.tickerCompanyInfo;
    const companyMarketData = tickerData?.companyMarketData[0];
    const currency = tickerInfo ? tickerInfo.currency : 'BRL';
    let p_l = 0;
    let p_vp = 0;
    let dividendYield = 0;

    if (tickerData && tickerData.tickerCompanyInfo && assetType === 'br_stock') {
        assetInfo = tickerData.tickerCompanyInfo.company;
        assetInfo = {
            ...assetInfo,
            sector: assetInfo?.b3_sector,
            subsector: assetInfo?.b3_subsector,
            segment: assetInfo?.b3_segment,
            trade_name: assetInfo?.trade_name,
            founding_date: assetInfo?.founding_date,
            main_activity: assetInfo?.main_activity,
            is_state_owned: assetInfo?.is_state_owned,
            cnpj: assetInfo?.cnpj,
            website: assetInfo?.website,
        };

        p_l = companyMarketData?.market_ratios?.price_earnings ? companyMarketData?.market_ratios?.price_earnings.toFixed(2) : 0;
        p_vp = companyMarketData?.market_ratios?.price_to_book ? companyMarketData?.market_ratios?.price_to_book.toFixed(2) : 0;
        dividendYield = companyMarketData?.dividendYieldLast12Months ? companyMarketData?.dividendYieldLast12Months.toFixed(2) : 0;
    }

    if (tickerData && tickerData.tickerCompanyInfo && assetType === 'us_stock') {
        assetInfo = tickerData.tickerCompanyInfo.stock;
        assetInfo = {
            ...assetInfo,
            sector: tickerData.sector,
            subsector: tickerData.sector,
            segment: assetInfo?.industry,
            trade_name: assetInfo?.name,
            founding_date: null,
            main_activity: null,
            is_state_owned: null,
            cnpj: assetInfo?.cik,
            website: assetInfo?.official_site,
        };

        p_l = companyMarketData.stockData.pl;
        p_vp = companyMarketData.stockData.pvp;
        dividendYield = companyMarketData.stockData.dividend_yield ? companyMarketData.stockData.dividend_yield / 100 : 0;


    }

    const historicalDividendYieldData = tickerData?.historicalDividendYieldData;

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
                <AssetDetailsHeader tickerData={tickerData} refCompany={refCompany} refIndicators={refIndicators} refPrice={refPrice} assetType={assetType} />
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
                <CardAssetDetails
                    sx={{ flex: '1', minWidth: '200px' }}
                    title="P/L"
                    total={p_l}
                    icon={`${CONFIG.assetsDir}/assets/icons/courses/ic-courses-progress.svg`}
                    color='info'
                    description='Preço da ação dividido pelo lucro por ação'
                />
                <CardAssetDetails
                    sx={{ flex: '1', minWidth: '200px' }}
                    title="P/VP"
                    total={p_vp}
                    icon={`${CONFIG.assetsDir}/assets/icons/courses/ic-courses-progress.svg`}
                    color='error'
                    description='Preço da ação dividido pelo valor patrimonial por ação'
                />
                <CardAssetDetails
                    sx={{ flex: '1', minWidth: '200px' }}
                    title="DY"
                    total={dividendYield}
                    icon={`${CONFIG.assetsDir}/assets/icons/courses/ic-courses-progress.svg`}
                    color='primary'
                    type='percentage'
                    description='Dividend Yield (DY) é o indicador que mostra quanto a empresa paga de dividendos em relação ao preço da ação. Cálculo dos últimos 12 meses'
                />
            </Box>

            <Box ref={refPrice} >
                <ChartComplete isCurrency={true} chart={chart} title={`Cotação ${ticker.toUpperCase()}`} subheader={`Evolução e desempenho das ações ${assetInfo?.trade_name ? assetInfo?.trade_name : ""} (${ticker.toUpperCase()})`} currency={currency} />
            </Box>

            {assetType == 'br_stock' && <VerticalTable proftability={proftability} />}

            {assetType == 'br_stock' && <Divider sx={{ borderStyle: 'dashed', mt: 3 }} />}

            <Typography variant='h6' sx={{ ml: "3px", mt: 3, mb: 2 }} ref={refIndicators}>INDICADORES FUNDAMENTALISTAS</Typography>
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

            <Divider sx={{ borderStyle: 'dashed', mt: 3 }} />

            <Typography variant='h6' sx={{ ml: "3px", mt: 3, mb: 2 }} ref={refCompany}>INFORMAÇÕES DA EMPRESA</Typography>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
                    <Box sx={{ flex: '0 0 100px', display: 'flex', justifyContent: 'center' }}>
                        {tickerData?.tickerCompanyInfo?.ticker && assetType == 'br_stock' ? (
                            <Box
                                component="img"
                                src={`/assets/tickers/${tickerData?.tickerCompanyInfo?.ticker}.jpg`}
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
                        <Typography variant="h5" gutterBottom>{assetInfo?.trade_name || '-'}</Typography>

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
                                <Typography variant="body2" gutterBottom>{assetInfo?.subsector || '-'}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">Segmento</Typography>
                                <Typography variant="body2" gutterBottom>{assetInfo?.segment || '-'}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">{assetType == 'br_stock' ? 'CNPJ' : 'CIK'}</Typography>
                                <Typography variant="body2" gutterBottom>{assetInfo?.cnpj || '-'}</Typography>
                            </Box>
                            {assetType == 'br_stock' && <Box>
                                <Typography variant="subtitle2" color="text.secondary">Tipo</Typography>
                                <Typography variant="body2" gutterBottom>
                                    {assetInfo?.is_state_owned ? 'Estatal' : 'Privada'}
                                </Typography>
                            </Box>}
                            {assetType == 'br_stock' && <Box>
                                <Typography variant="subtitle2" color="text.secondary">Fundação</Typography>
                                <Typography variant="body2" gutterBottom>
                                    {assetInfo?.founding_date ? new Date(assetInfo.founding_date).toLocaleDateString() : '-'}
                                </Typography>
                            </Box>}
                            {assetType == 'br_stock' && <Box>
                                <Typography variant="subtitle2" color="text.secondary">Atividade Principal</Typography>
                                <Typography variant="body2" gutterBottom>{assetInfo?.main_activity || '-'}</Typography>
                            </Box>}
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">Website</Typography>
                                {assetInfo?.website ? (
                                    <Typography variant="body2" component="a" href={assetInfo.website} target="_blank" rel="noopener noreferrer" sx={{ color: 'primary.main', textDecoration: 'none' }}>
                                        {assetInfo.website}
                                    </Typography>
                                ) : (
                                    <Typography variant="body2">-</Typography>
                                )}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </>
    );
}