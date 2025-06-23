import { useParams } from 'react-router-dom';
import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { AssetDetails } from '../asset-details';
import { AssetDetailsCripto } from '../asset-details-cripto';
import { AssetDetailsBdr } from '../asset-details-bdr';
import { AssetDetailsEtf } from '../asset-details-etf';
import { LocalizationProvider } from 'src/locales';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { Alert, IconButton, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import { AssetReportAIModal } from 'src/components/asset-report-ai-modal';
import axios from 'src/lib/axios';
import { useTokenUsage } from 'src/context/TokenUsage';
import { useAuthContext } from 'src/auth/hooks';
import { AssetDetailsFiis } from '../asset-details-fiis';

// ----------------------------------------------------------------------

export function AssetDetailsView() {
  const { ticker = '' } = useParams();
  const [assetType, setAssetType] = useState(null);
  const tickerString = String(ticker || '').toUpperCase();

  const [tickerData, setTickerData] = useState(null);
  const [chart, setChart] = useState({ series: [] });
  const [reportData, setReportData] = useState(null);
  const [proftability, setProftability] = useState(null);

  const { user } = useAuthContext();

  const { tokenUsage } = useTokenUsage();
  const [isFeatureDisabled, setIsFeatureDisabled] = useState(false);

  useEffect(() => {
    axios.get(`/ticker/get-ticker-data/${tickerString}`)
      .then(({ data }) => {
        const _assetType = data.assetType || null;
        setAssetType(_assetType);

        setChart({ series: handleHistoricalQuotes(data.historicalQuotesData, _assetType) });
        setTickerData(data);

        if (data.proftability) {
          setProftability(data.proftability);
        }
      })
      .catch(error => {
        console.error('Error fetching ticker data:', error);
      });
  }, []);

  function handleHistoricalQuotes(historicalQuotesData, assetType) {
    const monthlyMap = {};

    historicalQuotesData.forEach(item => {
      const date = new Date(item.date);
      const year = date.getFullYear();
      const month = date.toLocaleString('pt-BR', { month: 'short' }).replace('.', '');
      const label = `${month.charAt(0).toUpperCase()}${month.slice(1)}/${year}`;
      let adjClose = 0;

      if (assetType === 'cripto') {
        adjClose = parseFloat(item.close_brl);
      } else {
        adjClose = parseFloat(item.adj_close);
      }

      if (!monthlyMap[label]) monthlyMap[label] = [];
      monthlyMap[label].push(adjClose);
    });

    const orderedMonths = Object.keys(monthlyMap).sort((a, b) => {
      const [mA, yA] = a.split('/');
      const [mB, yB] = b.split('/');
      const dA = new Date(`${yA}-${mA}-01`);
      const dB = new Date(`${yB}-${mB}-01`);
      return dA - dB;
    });

    function getFilteredWithLastItem(months, divider) {
      const filtered = months.filter((_, index) => index % divider === 0);
      const lastMonth = months[months.length - 1];

      if (filtered[filtered.length - 1] !== lastMonth) {
        filtered.push(lastMonth);
      }

      return filtered;
    }

    const fiveYearsMonths = orderedMonths.slice(-60);
    const fiveYearsFiltered = getFilteredWithLastItem(fiveYearsMonths, 2);

    const fiveYears = {
      name: '5 anos',
      categories: fiveYearsFiltered,
      data: [{
        name: 'Cotação',
        data: fiveYearsFiltered.map(label => monthlyMap[label].map(v => v.toFixed(2)).join(', ')),
      }]
    };

    const tenYearsMonths = orderedMonths.slice(-120);
    const dividerTenYears = orderedMonths.length > 60 ? 4 : 2;
    const tenYearsFiltered = getFilteredWithLastItem(tenYearsMonths, dividerTenYears);

    const tenYears = {
      name: '10 anos',
      categories: tenYearsFiltered,
      data: [{
        name: 'Cotação',
        data: tenYearsFiltered.map(label => monthlyMap[label].map(v => v.toFixed(2)).join(', ')),
      }]
    };

    return [fiveYears, tenYears];
  }

  const handleAskAIReport = () => {
    setReportData(null);
    handleOpenModaAssetReport();

    axios.post(`${import.meta.env.VITE_SERVER_URL2}/asset-report-ai/generate-report`, {
      company_data: tickerData,
    })
      .then(({ data }) => {
        setReportData(data)
      })
      .catch(error => {
        console.error('Error:', error);
        setReportData(null);
        handleCloseModalAssetReport();
      });
  }

  const [isAssetReportAIModalOpen, setAssetReportModalOpen] = useState(false);

  const handleCloseModalAssetReport = () => {
    setReportData(null);
    setAssetReportModalOpen(false);
  };

  const handleOpenModaAssetReport = () => {
    setAssetReportModalOpen(true);
  };

  useEffect(() => {
    if (tokenUsage >= 100 || user?.plan === null) {
      setIsFeatureDisabled(true);
    }
  }, [tokenUsage, user]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={tickerString ? `Detalhes do ativo: ${tickerString.toUpperCase()}` : "Detalhes do ativo"}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Detalhes do ativo' },
          ...(tickerString ? [{ name: tickerString.toUpperCase() }] : [])
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
        action={
          <>
            {!isFeatureDisabled && (assetType == 'br_stock' || assetType == 'fii') && <>
              <Tooltip title={`Momento ${(assetType == 'br_stock' ? 'da empresa' : 'do FII')}: A IA gera relatório levando em consideração os dados atuais do ativo`}>
                <IconButton
                  onClick={handleAskAIReport}
                >
                  <AutoAwesomeIcon />
                </IconButton>
              </Tooltip>

              <AssetReportAIModal reportData={reportData} handleClose={handleCloseModalAssetReport} isOpen={isAssetReportAIModalOpen} />
            </>
            }
          </>
        }
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {(assetType === 'br_stock' || assetType === 'us_stock') &&
          <AssetDetails proftability={proftability} ticker={tickerString} chart={chart} tickerData={tickerData} assetType={assetType} />}

        {assetType === 'cripto' &&
          <AssetDetailsCripto proftability={proftability} ticker={tickerString} chart={chart} tickerData={tickerData} />}

        {assetType === 'bdr' &&
          <AssetDetailsBdr proftability={proftability} ticker={tickerString} chart={chart} tickerData={tickerData} />}

        {assetType === 'etf' &&
          <AssetDetailsEtf proftability={proftability} ticker={tickerString} chart={chart} tickerData={tickerData} />}

        {assetType === 'fii' &&
          <AssetDetailsFiis proftability={proftability} ticker={tickerString} chart={chart} tickerData={tickerData} assetType={assetType} />}

      </LocalizationProvider>
    </DashboardContent>
  );
}