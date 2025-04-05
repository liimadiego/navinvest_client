import { useParams } from 'react-router-dom';
import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { AssetDetails } from '../asset-details';
import { LocalizationProvider } from 'src/locales';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { IconButton, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import { AssetReportAIModal } from 'src/components/asset-report-ai-modal';

// ----------------------------------------------------------------------

export function AssetDetailsView() {
  const { ticker = '' } = useParams();
  const [tickerData, setTickerData] = useState(null);
  const [chart, setChart] = useState({ series: [] });
  const [reportData, setReportData] = useState(null);

  const tickerString = String(ticker || '');

  const TEMP_TICKER_DATA = {
    currency: 'BRL',
    name: 'Petrobras',
    ticker: 'PETR4',
    asset_name: 'PETROLEO BRASILEIRO S.A. PETROBRAS',
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
  };

  const TEMP_CHART = {
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
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setTickerData(TEMP_TICKER_DATA);
      setChart(TEMP_CHART);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleAskAIReport = () => {
    setReportData(null);
    handleOpenModaAssetReport();

    fetch(`${import.meta.env.VITE_SERVER_URL2}/asset-report-ai/generate-report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        company_data: TEMP_TICKER_DATA,
      }),
    })
      .then(response => response.json())
      .then(data => {
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
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AssetDetails ticker={tickerString} chart={chart} tickerData={tickerData} />
      </LocalizationProvider>
    </DashboardContent>
  );
}