import { IconButton } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Box, Paper, Skeleton, Tooltip, Typography } from '@mui/material';
import { fNumber, fPercent, fShortenNumberToString } from 'src/utils/format-number';

export function FundamentalIndicatorCard({ tickerData, assetType }) {
    let fundamentalIndicatorsData = [];

    if (tickerData && assetType === 'fii') {
        const fiiMarketData = tickerData?.fii?.history?.[0];
        
        const DY = tickerData.dividendYieldPast12m;
        
        let AREA_TOTAL = 0; 
        let AREA_VAGA = 0;
        let AREA_INADIMPLENTE = 0;
        for (const property of fiiMarketData?.properties || []) {
            AREA_TOTAL += property.Area * 1 || 0;
            AREA_VAGA += property.Area * property.PercentVacancia || 0;
            AREA_INADIMPLENTE += property.Area * property.PercentInadimplencia || 0;
        }
        const VACANCIA_FISICA = (AREA_VAGA / (AREA_TOTAL || 1)) || 0;

        fiiMarketData.patrimonial_value_per_share = parseFloat(fiiMarketData.patrimonial_value_per_share.toFixed(2));
        const {
            market_capitalization: VALOR_DE_MERCADO,
            number_of_shareholders: NUMERO_DE_COTISTAS,
            patrimonial_value: VALOR_PATRIMONIAL,
            patrimonial_value_per_share: VALOR_PATRIMONIAL_POR_COTA,
            pvp: PVP,
            shares_issued: COTAS_EMITIDAS,
            vacancy: VACANCIA_FINANCEIRA
        } = fiiMarketData || {};

        fundamentalIndicatorsData = [
            {
                "title": "DY",
                "total": DY || null,
                "type": "percentage",
                "description": "Dividend Yield (DY) é o indicador que mostra quanto o fii paga de dividendos em relação ao preço da cota",
            },
            {
                "title": "P/VP",
                "total": PVP || null,
                "description": "P/VP = Preço da cota / Valor patrimonial por cota",
            },
            {
                "title": "AREA TOTAL",
                "total": fNumber(Math.round(AREA_TOTAL)) + "m²",
                "type": "string",
                "description": "Área total dos imóveis do FII",
            },
            {
                "title": "AREA VAGA",
                "total": fNumber(Math.round(AREA_VAGA)) + "m²",
                "type": "string",
                "description": "Área total vaga nos imóveis do FII",
            },
            {
                "title": "VACANCIA FÍSICA",
                "total": VACANCIA_FISICA || null,
                "type": "percentage",
                "description": "Vanacia física é o percentual de área total que está vaga nos imóveis do FII",
            },
            {
                "title": "VACANCIA FINANCEIRA",
                "total": VACANCIA_FINANCEIRA || null,
                "type": "percentage",
                "description": "Vanacia financeira é o percentual de receita que o FII deixa de receber por conta de imóveis vagos",
            },
            {
                "title": "AREA INADIMPLENTE",
                "total": fNumber(Math.round(AREA_INADIMPLENTE)) + "m²",
                "type": "string",
                "description": "Área total inadimplente nos imóveis do FII",
            },
            {
                "title": "INADIMPLENCIA (FÍSICA)",
                "total": (AREA_INADIMPLENTE / (AREA_TOTAL || 1)) || 0,
                "type": "percentage",
                "description": "Inadimplência física é o percentual de área total que está inadimplente nos imóveis do FII",
            },
            {
                "title": "VALOR DE MERCADO",
                "total": VALOR_DE_MERCADO || null,
                "type": "currency_string",
                "description": "Valor de mercado do FII",
            },
            {
                "title": "VALOR PATRIMONIAL",
                "total": VALOR_PATRIMONIAL || null,
                "type": "currency_string",
                "description": "Valor patrimonial do FII",
            },
            {
                "title": "VAL. PATRIMONIAL P/ COTA",
                "total": VALOR_PATRIMONIAL_POR_COTA || null,
                "type": "currency",
                "description": "Valor patrimonial por cota do FII",
            },
            {
                "title": "COTAS EMITIDAS",
                "total": COTAS_EMITIDAS || null,
                "type": "basic_number_format",
                "description": "Quantidade de cotas emitidas pelo FII"
            },
            {
                "title": "NÚMERO DE COTISTAS",
                "total": NUMERO_DE_COTISTAS || null,
                "type": "basic_number_format",
                "description": "Número de cotistas do FII"
            }
        ];
    }

    if (tickerData && tickerData.tickerCompanyInfo && assetType === 'br_stock') {
        const companyMarketData = tickerData?.companyMarketData[0];
        const {
            EV,
            EBIT,
            EBITDA,
            EV_EBIT,
            EV_EBITDA,
            P_EBIT,
            P_EBITDA,
            netDebt,
            netDebtEBIT,
            earnings_per_share,
            dividend_per_share,
            payout,
            p_acl,
            cagrNetIncome5Y,
            cagrNetSales5Y,
            netDebtEquity,
            netDebtEBITDA,
            grossDebtEquity,
            current_liquidity,
            ROIC
        } = companyMarketData?.others || {};

        const {
            balance,
            cash_flows,
            incomes,
            market_ratios,
            ratios,
            shares,
            dividendYieldLast12Months
        } = companyMarketData || {};

        fundamentalIndicatorsData = [
            {
                "title": "P/L",
                "total": market_ratios?.price_earnings || null,
                "description": "Preço da ação dividido pelo lucro por ação"
            },
            {
                "title": "P/Receita",
                "total": market_ratios?.price_to_sales || null,
                "description": "Preço da ação dividido pela receita líquida por ação"
            },
            {
                "title": "P/VP",
                "total": market_ratios?.price_to_book || null,
                "description": "Preço da ação dividido pelo valor patrimonial por ação"
            },
            {
                "title": "DY",
                "total": dividendYieldLast12Months || null,
                "type": "percentage",
                "description": "Dividend Yield (DY) é o indicador que mostra quanto a empresa paga de dividendos em relação ao preço da ação"
            },
            {
                "title": "Payout",
                "total": payout || null,
                "type": "percentage",
                "description": "Percentual do lucro líquido distribuído como dividendos aos acionistas"
            },
            {
                "title": "Margem Líquida",
                "total": ratios?.net_margin ? ratios.net_margin / 100 : null,
                "type": "percentage",
                "description": "Percentual do lucro líquido em relação à receita líquida"
            },
            {
                "title": "Margem Bruta",
                "total": ratios?.gross_margin ? ratios.gross_margin / 100 : null,
                "type": "percentage",
                "description": "Percentual do lucro bruto em relação à receita líquida"
            },
            {
                "title": "Margem EBIT",
                "total": ratios?.ebit_margin ? ratios?.ebit_margin / 100 : null,
                "type": "percentage",
                "description": "Percentual do lucro antes de juros e impostos em relação à receita líquida"
            },
            {
                "title": "Margem EBITDA",
                "total": ratios?.ebitda_margin ? ratios.ebitda_margin / 100 : null,
                "type": "percentage",
                "description": "Percentual do lucro antes de juros, impostos, depreciação e amortização em relação à receita líquida"
            },
            {
                "title": "EV/EBITDA",
                "total": EV_EBITDA || null,
                "description": "Valor da empresa dividido pelo EBITDA"
            },
            {
                "title": "EV/EBIT",
                "total": EV_EBIT || null,
                "description": "Valor da empresa dividido pelo EBIT"
            },
            {
                "title": "P/EBITDA",
                "total": P_EBITDA || null,
                "description": "Preço da ação dividido pelo EBITDA por ação"
            },
            {
                "title": "P/EBIT",
                "total": market_ratios?.price_to_ebit || null,
                "description": "Preço da ação dividido pelo EBIT por ação"
            },
            {
                "title": "P/Ativo",
                "total": market_ratios?.price_to_assets || null,
                "description": "Preço da ação dividido pelo valor total dos ativos"
            },
            {
                "title": "P/Ativo Circ. Líquido",
                "total": p_acl || null,
                "description": "Preço da ação dividido pelo ativo circulante líquido"
            },
            {
                "title": "VPA",
                "total": market_ratios?.equity_per_share || null,
                "description": "Valor patrimonial por ação"
            },
            {
                "title": "LPA",
                "total": market_ratios?.earnings_per_share || null,
                "description": "Lucro por ação"
            },
            {
                "title": "Giro Ativos",
                "total": ratios?.asset_turnover || null,
                "description": "Receita líquida dividida pelo total de ativos"
            },
            {
                "title": "ROE",
                "total": ratios?.return_on_equity ? ratios?.return_on_equity / 100 : null,
                "type": "percentage",
                "description": "Retorno sobre o patrimônio líquido"
            },
            {
                "title": "ROIC",
                "total": ROIC || null,
                "type": "percentage",
                "description": "Retorno sobre o capital investido"
            },
            {
                "title": "ROA",
                "total": ratios?.return_on_assets || null,
                "type": "percentage",
                "description": "Retorno sobre os ativos"
            },
            {
                "title": "Dívida Líquida / Patrimônio",
                "total": netDebtEquity || null,
                "description": "Relação entre dívida líquida e patrimônio líquido"
            },
            {
                "title": "Dívida Líquida / EBITDA",
                "total": netDebtEBITDA || null,
                "description": "Relação entre dívida líquida e EBITDA"
            },
            {
                "title": "Dívida Líquida / EBIT",
                "total": netDebtEBIT || null,
                "description": "Relação entre dívida líquida e EBIT"
            },
            {
                "title": "Dívida Bruta / Patrimônio",
                "total": grossDebtEquity || null,
                "description": "Relação entre dívida bruta e patrimônio líquido"
            },
            {
                "title": "Patrimônio / Ativos",
                "total": balance?.equity && balance?.assets ? balance?.equity / balance?.assets : 0,
                "description": "Relação entre patrimônio líquido e ativos totais"
            },
            {
                "title": "Liquidez Corrente",
                "total": current_liquidity || null,
                "description": "Capacidade de pagamento das obrigações de curto prazo"
            },
            {
                "title": "CAGR Receitas 5 Anos",
                "total": cagrNetSales5Y || null,
                "type": "percentage",
                "description": "Taxa de crescimento anual composta das receitas nos últimos 5 anos"
            },
            {
                "title": "CAGR Lucros 5 Anos",
                "total": cagrNetIncome5Y || null,
                "type": "percentage",
                "description": "Taxa de crescimento anual composta dos lucros nos últimos 5 anos"
            },
        ];
    }

    if (tickerData && tickerData.tickerCompanyInfo && assetType === 'us_stock') {
        const companyMarketData = tickerData?.companyMarketData[0];
        const {
            pl,
            psr,
            pvp,
            dividend_yield,
            roa,
            roe,
            roic,
            margem_liquida,
            margem_bruta,
            margem_operacional,
            pebitda,
            pebit,
            pativo,
            vpa,
            lpa,
            patrimonio_ativos,
            cagr_receita_5_anos,
            cagr_lucros_5_anos
        } = companyMarketData?.stockData || {};

        fundamentalIndicatorsData = [
            {
                "title": "P/L",
                "total": pl || null,
                "description": "Preço da ação dividido pelo lucro por ação"
            },
            {
                "title": "P/Receita",
                "total": psr || null,
                "description": "Preço da ação dividido pela receita líquida por ação"
            },
            {
                "title": "P/VP",
                "total": pvp || null,
                "description": "Preço da ação dividido pelo valor patrimonial por ação"
            },
            {
                "title": "DY",
                "total": dividend_yield / 100 || 0,
                "type": "percentage",
                "description": "Dividend Yield (DY) é o indicador que mostra quanto a empresa paga de dividendos em relação ao preço da ação"
            },
            {
                "title": "Margem Líquida",
                "total": margem_liquida ? margem_liquida / 100 : null,
                "type": "percentage",
                "description": "Percentual do lucro líquido em relação à receita líquida"
            },
            {
                "title": "Margem Bruta",
                "total": margem_bruta ? margem_bruta / 100 : null,
                "type": "percentage",
                "description": "Percentual do lucro bruto em relação à receita líquida"
            },
            {
                "title": "Margem Operacional",
                "total": margem_operacional ? margem_operacional / 100 : null,
                "type": "percentage",
                "description": "Percentual do lucro operacional em relação à receita líquida"
            },
            {
                "title": "EV/EBITDA",
                "total": pebitda || null,
                "description": "Valor da empresa dividido pelo EBITDA"
            },
            {
                "title": "EV/EBIT",
                "total": pebit || null,
                "description": "Valor da empresa dividido pelo EBIT"
            },
            {
                "title": "P/EBITDA",
                "total": pebitda || null,
            },
            {
                "title": "P/EBIT",
                "total": pebit || null,
            },
            {
                "title": "P/Ativo",
                "total": pativo || null,
                "description": "Preço da ação dividido pelo valor total dos ativos"
            },
            {
                "title": "VPA",
                "total": vpa || null,
                "description": "Valor patrimonial por ação"
            },
            {
                "title": "LPA",
                "total": lpa || null,
                "description": "Lucro por ação"
            },
            {
                "title": "Patrimônio / Ativos",
                "total": patrimonio_ativos || null,
                "description": "Relação entre patrimônio líquido e ativos totais"
            },
            {
                "title": "ROE",
                "total": roe ? roe / 100 : null,
                "type": "percentage",
                "description": "Retorno sobre o patrimônio líquido"
            },
            {
                "title": "ROIC",
                "total": roic ? roic / 100 : null,
                "type": "percentage",
                "description": "Retorno sobre o capital investido"
            },
            {
                "title": "ROA",
                "total": roa ? roa / 100 : null,
                "type": "percentage",
                "description": "Retorno sobre os ativos"
            },
            {
                "title": "CAGR Receitas 5 Anos",
                "total": cagr_receita_5_anos || null,
                "type": 'percentage',
                "description": 'Taxa de crescimento anual composta das receitas nos últimos 5 anos'
            },
            {
                "title": 'CAGR Lucros 5 Anos',
                'total': cagr_lucros_5_anos || null,
                'type': 'percentage',
                'description': 'Taxa de crescimento anual composta dos lucros nos últimos 5 anos'
            }
        ];
    }

    if (tickerData && tickerData.tickerData && assetType === 'cripto') {
        const assetData = tickerData.tickerData;
        fundamentalIndicatorsData = [
            {
                "title": "Preço 12 meses atrás",
                "total": assetData?.price_twelve_months_ago ? parseFloat(assetData.price_twelve_months_ago) : null,
                "type": "currency",
                "description": "Preço do ativo há 12 meses"
            },
            {
                "title": "Capitalização de Mercado",
                "total": assetData?.cripto?.market_cap ? parseFloat(assetData.cripto.market_cap) : null,
                "type": "currency_string",
                "description": "Capitalização de mercado do ativo"
            },
            {
                "title": "Rank Capitalização de Mercado",
                "total": assetData?.cripto?.market_cap_rank ? parseInt(assetData.cripto.market_cap_rank) : null,
                "type": "number",
                "description": "Posição do ativo em relação aos outros ativos (criptomoedas) por capitalização de mercado"
            },
            {
                "title": "Volume 24h",
                "total": assetData?.cripto?.total_volume ? parseFloat(assetData.cripto.total_volume) : null,
                "type": "currency_string",
                "description": "Volume negociado nas últimas 24 horas"
            },
            {
                "title": "Alta 24h",
                "total": assetData?.cripto?.max_supply ? parseFloat(assetData.cripto.max_supply) : null,
                "type": "number",
                "description": "Quantidade máxima de unidades que podem existir"
            },
            {
                "title": "Quantidade atualmente em Circulação",
                "total": assetData?.cripto?.circulating_supply ? parseFloat(assetData.cripto.circulating_supply) : null,
                "type": "currency_string",
                "description": "Quantidade de unidades atualmente em circulação"
            },
            {
                "title": "ROI (%)",
                "total": assetData?.cripto?.roi_percentage ? parseFloat(assetData.cripto.roi_percentage) / 100 : null,
                "type": "percentage",
                "description": "Retorno sobre o investimento (ROI) em relação ao Bitcoin"
            }
        ];
    }

    const FundamentalIndicator = ({ title, total, type, description, currency }) => {
        return (
            total !== null ? <Paper elevation={3} sx={{ p: 2, minWidth: { xs: assetType === 'cripto' ? '250px' : '136px', md: '250px' }, flex: '1', position: 'relative' }}>
                <Typography sx={{ p: 1, opacity: .75 }} variant='subtitle2'>{title}
                    <Tooltip title={description} arrow>
                        <IconButton sx={{ ml: "5px", p: 0, position: 'absolute', right: "15px", top: "15px" }}>
                            <HelpOutlineIcon sx={{ fontSize: "15px" }} />
                        </IconButton>
                    </Tooltip>
                </Typography>
                <Typography variant='h6' sx={{ p: 1, pt: 0 }}>
                    <Box>
                        {type === 'currency' ? (
                            currency === 'USD' ? `$${total.toLocaleString('en-US')}` : `R$${total.toLocaleString('pt-BR')}`
                        ) : type === 'currency_string' ? (
                            currency === 'USD' ? `$${fShortenNumberToString(total)}` : `R$${fShortenNumberToString(total)}`
                        ) : type === 'percentage' ? (
                            `${(total * 100).toFixed(2).replace('.', ',')}%`
                        ) : type === 'basic_number_format' ? (
                            currency === 'USD' ? `${fNumber(total)}` : `${fNumber(total)}`
                        ) : type === 'string' ? (
                            total
                        ) : (
                            Number.isInteger(total) ? total.toLocaleString().replace('.', ',') : total.toFixed(2).toLocaleString().replace('.', ',')
                            
                        )}
                    </Box>
                </Typography>
            </Paper> : <></>
        );
    }

    return (
        <>
            {fundamentalIndicatorsData.map((data, index) => (
                <FundamentalIndicator key={index} title={data.title} total={
                    tickerData ? data.total : null
                } type={data.type} description={data.description} />
            ))}
        </>
    )
}