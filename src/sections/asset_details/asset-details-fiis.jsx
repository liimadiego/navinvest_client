import React, { useEffect, useState, useRef } from 'react';
import { AssetDetailsHeader } from './view/asset-details-header';
import { CardAssetDetails } from './card-asset-details';
import { CONFIG } from 'src/global-config';
import { ChartComplete } from 'src/components/chart-complete';
import { VerticalTable } from './vertical-table';
import { FundamentalIndicatorCard } from './fundamental-indicator-card';
import { AssetHistoricTable } from './asset-historic-table';
import { DividendsHistoric } from './dividends-historic';
import { DonutChart } from 'src/components/donut-chart';
import { fNumber, fPercent } from 'src/utils/format-number';
import {
    Box,
    Divider,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from '@mui/material';

import {
    useTable,
    rowInPage,
    emptyRows,
    TablePaginationCustom,
    TableEmptyRows,
    TableNoData,
} from 'src/components/table';

export function AssetDetailsFiis({ ticker, tickerData, chart, proftability, assetType }) {
    const [imageError, setImageError] = useState(false);
    const [aboutFormated, setAboutFormated] = useState(<></>);

    function isEmpty(obj) {
        for (const prop in obj) {
            if (Object.hasOwn(obj, prop)) {
                return false;
            }
        }
        return true;
    }

    const tickerInfo = tickerData?.tickerData || {};
    
    const assetInfo = tickerInfo?.reit || {};

    function camelCaseParaTexto(texto) {
        return texto
            .replace(/([A-Z])/g, ' $1')
            .trim()
            .replace(/\b\w/g, letra => letra.toUpperCase());
    }

    useEffect(() => {
        if (assetInfo?.about) {
            try {
                assetInfo.about = JSON.parse(assetInfo.about);
            } catch (error) {
                // If parsing fails, keep it as is
            }

            const contentElements = [];
            for (const titulo of Object.keys(assetInfo.about)) {
                const content = assetInfo.about[titulo];
                if (content) {
                    contentElements.push(
                        <Box key={contentElements.length}>
                            <Typography variant="subtitle2" color="text.secondary">{camelCaseParaTexto(titulo)}</Typography>
                            <Typography variant="body2" gutterBottom>{content}</Typography>
                        </Box>
                    );
                }
            }

            setAboutFormated(<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>{contentElements}</Box>);
        }
    }, [assetInfo]);


    const currency = tickerInfo ? tickerInfo.currency : 'BRL';
    const fiiHistory = tickerData?.fii.history;
    const [historicalDividendYieldData, setHistoricalDividendYieldData] = useState({
        dividendYields: []
    });
    const [leaseContractsByIndexer, setLeaseContractsByIndexer] = useState([]);
    const [leaseContractsByExpiration, setLeaseContractsByExpiration] = useState([]);
    const [properties, setProperties] = useState([]);
    
    const lastDividendYield = tickerData?.dividendYieldPast12m;
    const [isDividendsAllZero, setDividendsIsAllZero] = useState(false);

    useEffect(() => {
        const dividendYieldHistory = fiiHistory?.map(item => ({
            dividend_yield: item.dividend_yield || 0,
            reference_year: item.reference_year || 0
        })) || [];

        setHistoricalDividendYieldData(dividendYieldHistory || []);

        if (fiiHistory.length > 0) {
            // Set properties
            const _properties = (fiiHistory[0]?.properties || [])
                .map(f => ({ ...f, PercentReceitasFII: Math.round(f.PercentReceitasFII * 1e4) / 1e2 }))
                .toSorted((a, b) => b.PercentReceitasFII - a.PercentReceitasFII);
            setProperties(_properties);

            // Set lease contracts by indexer
            let _totalIndexersPctg = 0;
            const _leaseContractsByIndexer = [];
            
            for (const [ indexador, value ] of Object.entries(fiiHistory[0]?.lease_contracts_by_indexer || {})) {
                if (!value) continue;
                _totalIndexersPctg += value * 100;
                _leaseContractsByIndexer.push({ label: indexador, value: value * 100 });
            }
            
            if (_totalIndexersPctg)
                _leaseContractsByIndexer.push({ label: 'Outros indexadores', value: 100 - _totalIndexersPctg });
            
            setLeaseContractsByIndexer(_leaseContractsByIndexer);
            
            // Set lease contracts by expiration
            let _totalExpirationsPctg = 0;
            const _leaseContractsByExpiration = [];
            
            const periodDict = {
                'up_to_3_months': 'Até 3 meses',
                'from_3_to_6_months': 'De 3 a 6 meses',
                'from_6_to_12_months': 'De 6 a 12 meses',
                'from_12_to_24_months': 'De 12 a 24 meses',
                'from_24_to_36_months': 'De 24 a 36 meses',
                'over_36_months': 'Acima de 36 meses',
                'undetermined_expiration': 'Sem prazo determinado'
            };

            for (const [ period, value ] of Object.entries(fiiHistory[0]?.lease_contracts_by_expiration || {})) {
                if (period === 'undetermined_expiration' && !value) continue;
                _totalIndexersPctg += value * 100;
                _leaseContractsByExpiration.push({ label: periodDict[period], value: value * 100 });
            }
            
            if (_totalExpirationsPctg)
                _leaseContractsByExpiration.push({ label: 'Outros tipos de validade', value: 100 - _totalExpirationsPctg });
            
            setLeaseContractsByExpiration(_leaseContractsByExpiration);
        }

    }, [fiiHistory]);

    useEffect(() => {
        if (historicalDividendYieldData?.dividendYields) {
            const allZero = historicalDividendYieldData.dividendYields.every(item => item.dy === 0);
            setDividendsIsAllZero(allZero);
        }
    }, [historicalDividendYieldData]);
    
    const table = useTable();
    const [searchQuery, setSearchQuery] = useState('');
    const filteredData = () => {
        let data = properties;

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            data = data.filter(p => p.Nome.toLowerCase().includes(query));
        }

        return data;
    };
    const dataFiltered = filteredData();
    const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);
    const notFound = !dataFiltered.length;

    const price12MAgo = tickerInfo ? tickerInfo.price_twelve_months_ago : 0;
    const priceNow = tickerInfo ? tickerInfo.current_price : 0;

    const currentPrice = tickerInfo ? parseFloat(tickerInfo.current_price).toFixed(2) : 0;

    const variation12M = !isEmpty(tickerData?.historicalQuotesData) && price12MAgo ? (priceNow / price12MAgo) - 1 : 0;
    const refCompany = useRef(null);
    const refIndicators = useRef(null);
    const refPrice = useRef(null);

    const assetImage = tickerData.asset_image_url;
    const displayedImage = imageError ? '/assets/tickers/default.svg' : assetImage;

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
                    title="P/VP"
                    total={fiiHistory?.[0]?.pvp || 0}
                    icon={`${CONFIG.assetsDir}/assets/icons/courses/ic-courses-progress.svg`}
                    color='error'
                    description='Preço da ação dividido pelo valor patrimonial por ação'
                />
                <CardAssetDetails
                    sx={{ flex: '1', minWidth: '200px' }}
                    title="DY"
                    total={lastDividendYield}
                    icon={`${CONFIG.assetsDir}/assets/icons/courses/ic-courses-progress.svg`}
                    color='primary'
                    type='percentage'
                    description='Dividend Yield (DY) é o indicador que mostra quanto a empresa paga de dividendos em relação ao preço da ação. Cálculo dos últimos 12 meses'
                />
            </Box>

            <Box ref={refPrice} >
                <ChartComplete isCurrency={true} chart={chart} title={`Cotação ${ticker.toUpperCase()}`} subheader={`Evolução e desempenho das ações ${assetInfo?.trade_name ? assetInfo?.trade_name : ""} (${ticker.toUpperCase()})`} currency={currency} />
            </Box>

            <VerticalTable proftability={proftability} />

            {assetType == 'br_stock' && <Divider sx={{ borderStyle: 'dashed', mt: 3 }} />}

            <Typography variant='h6' sx={{ ml: "3px", mt: 3, mb: 2 }} ref={refIndicators}>INDICADORES FUNDAMENTALISTAS</Typography>
            <Box display={'flex'} justifyContent={'space-between'} width={"100%"} flexWrap={'wrap'} gap={2}>
                <FundamentalIndicatorCard tickerData={tickerData} assetType={assetType} />
            </Box>

            <Divider sx={{ borderStyle: 'dashed', mt: 3 }} />

            <Box sx={{ mt: 3 }}>
                <AssetHistoricTable assetData={[ { ...fiiHistory[0], reference_year: 'Atual', dividend_yield: tickerData?.dividendYieldPast12m || 0 }, ...fiiHistory ]} assetInfo={tickerData?.assetInfo} historicalDividendYieldData={historicalDividendYieldData} assetType={assetType} />
            </Box>

            <Divider sx={{ borderStyle: 'dashed', mt: 3 }} />

            {!isDividendsAllZero &&
                <>
                    <Typography variant='h6' sx={{ ml: "3px", mt: 3, mb: 2 }}>HISTÓRICO DE DIVIDENDOS DE {ticker}</Typography>
                    <DividendsHistoric historicalDividendYieldData={historicalDividendYieldData} />
                    <Divider sx={{ borderStyle: 'dashed', mt: 3 }} />
                </>
            }

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mt: 3 }}>
                <Box flex={1}>
                    {leaseContractsByIndexer ? <DonutChart
                        title="Contratos de locação por indexador"
                        subheader="Contratos por indexador"
                        chart={{
                            series: leaseContractsByIndexer
                        }}
                        sx={{ height: '100%' }}
                    /> : <Skeleton variant="rounded" width="100%" height={"100%"} />}
                </Box>

                <Box flex={1}>
                    {leaseContractsByExpiration ? <DonutChart
                        title="Contratos de locação por prazo de vencimento"
                        subheader="Contratos por prazo de vencimento"
                        chart={{
                            series: leaseContractsByExpiration
                        }}
                        sx={{ height: '100%' }}
                    /> : <Skeleton variant="rounded" width="100%" height={"100%"} />}
                </Box>
            </Box>

            <Divider sx={{ borderStyle: 'dashed', my: 3 }} />
            
            {/* <TreemapChart
                title="Principais Propriedades do Fundo"
                subheader="Distribuição das 10 propriedades que mais geram receita para o FII"
                chart={{
                    series: properties.slice(0, 10).map(p => ({ x: p.Nome.slice(0, 15) + '...', y: p.PercentReceitasFII })),
                }}
                sx={{ mb: 3 }}
            /> */}

            
            
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Propriedades do Fundo
                </Typography>

                <Box sx={{ maxWidth: 300, mb: 2 }}>
                    <TextField
                        fullWidth
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            table.onResetPage();
                        }}
                        placeholder="Buscar por nome"
                        size="small"
                    />
                </Box>
                
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nome</TableCell>
                                <TableCell>Endereço</TableCell>
                                <TableCell align='center'>Área (m²)</TableCell>
                                <TableCell align='center'>% das Receitas</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dataInPage.map((property, index) => (
                                <TableRow key={index} hover>
                                    <TableCell>{property.Nome}</TableCell>
                                    <TableCell>{property.Endereco}</TableCell>
                                    <TableCell align="center">{fNumber(property.Area* 1, { minimumFractionDigits: 2 })}</TableCell>
                                    <TableCell align='center'>{fPercent(property.PercentReceitasFII).replace('.', ',')}</TableCell>
                                </TableRow>
                            ))}

                            <TableEmptyRows
                                height={56}
                                emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                            />

                            <TableNoData notFound={notFound} />
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePaginationCustom
                    page={table.page}
                    count={dataFiltered.length}
                    rowsPerPage={table.rowsPerPage}
                    onPageChange={table.onChangePage}
                    onRowsPerPageChange={table.onChangeRowsPerPage}
                />
            </Paper>

            <Divider sx={{ borderStyle: 'dashed' }} />

            <Typography variant='h6' sx={{ ml: "3px", mt: 3, mb: 2 }} ref={refCompany}>INFORMAÇÕES DO FUNDO</Typography>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
                    <Box sx={{ flex: '0 0 100px', display: 'flex', justifyContent: 'center' }}>
                        <img
                            src={displayedImage}
                            onError={() => setImageError(true)}
                            alt=""
                            style={{ width: '100px', height: '100px', borderRadius: 8 }}
                        />
                        {/* {tickerData?.tickerCompanyInfo?.ticker && assetType == 'br_stock' ? (
                            <Box
                                component="img"
                                src={displayedImage}
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
                        )} */}
                    </Box>

                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                            { assetInfo?.tradeName + ' - '  + (assetInfo?.name || '-')}
                        </Typography>

                        {aboutFormated}

                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">Setor</Typography>
                                <Typography variant="body2" gutterBottom>{assetInfo?.b3Sector || '-'}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">CNPJ</Typography>
                                <Typography variant="body2" gutterBottom>{assetInfo?.cnpj || '-'}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">Fundação</Typography>
                                <Typography variant="body2" gutterBottom>
                                    {assetInfo?.foundingDate ? new Date(assetInfo.foundingDate).toLocaleDateString() : '-'}
                                </Typography>
                            </Box>
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