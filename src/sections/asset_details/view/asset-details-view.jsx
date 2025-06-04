import { useParams } from 'react-router-dom';
import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { AssetDetails } from '../asset-details';
import { LocalizationProvider } from 'src/locales';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { Alert, IconButton, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import { AssetReportAIModal } from 'src/components/asset-report-ai-modal';
import axios from 'src/lib/axios';
import { useTokenUsage } from 'src/context/TokenUsage';
import { useAuthContext } from 'src/auth/hooks';

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

        setChart({ series: handleHistoricalQuotes(data.historicalQuotesData) });
        setTickerData(data);

        if (data.proftability) {
          setProftability(data.proftability);
        }
      })
      .catch(error => {
        console.error('Error fetching ticker data:', error);
      });
  }, []);

  function handleHistoricalQuotes(historicalQuotesData) {
    const monthlyMap = {};

    historicalQuotesData.forEach(item => {
      const date = new Date(item.date);
      const year = date.getFullYear();
      const month = date.toLocaleString('pt-BR', { month: 'short' }).replace('.', '');
      const label = `${month.charAt(0).toUpperCase()}${month.slice(1)}/${year}`;

      const adjClose = parseFloat(item.adj_close);

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

    const fiveYears = {
      name: '5 anos',
      categories: orderedMonths.slice(-60).filter((_, index) => index % 2 === 0),
      data: [{
        name: 'Cotação',
        data: orderedMonths
          .slice(-60)
          .filter((_, index) => index % 2 === 0)
          .map(label => monthlyMap[label].map(v => v.toFixed(2)).join(', ')),
      }]
    };

    const dividerTenYears = orderedMonths.length > 60 ? 4 : 2;

    const tenYears = {
      name: '10 anos',
      categories: orderedMonths.slice(-120).filter((_, index) => index % dividerTenYears === 0),
      data: [{
        name: 'Cotação',
        data: orderedMonths
          .slice(-120)
          .filter((_, index) => index % dividerTenYears === 0)
          .map(label => monthlyMap[label].map(v => v.toFixed(2)).join(', ')),
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
            {!isFeatureDisabled && assetType == 'br_stock' && <>
              <Tooltip title="Momento da empresa: IA gera relatório levando em consideração os dados atuais do ativo">
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
        <AssetDetails proftability={proftability} ticker={tickerString} chart={chart} tickerData={tickerData} assetType={assetType} />
      </LocalizationProvider>
    </DashboardContent>
  );
}