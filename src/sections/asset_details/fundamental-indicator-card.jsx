import { IconButton } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Box, Paper, Skeleton, Tooltip, Typography } from '@mui/material';

export function FundamentalIndicatorCard({ tickerData, assetType }) {
    const companyMarketData = tickerData?.companyMarketData[0];
    let fundamentalIndicatorsData = [];

    if (tickerData && tickerData.tickerCompanyInfo && assetType === 'br_stock') {
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



    const FundamentalIndicator = ({ title, total, type, description, currency }) => {
        return (
            total !== null ? <Paper elevation={3} sx={{ p: 2, minWidth: { xs: '136px', md: '250px' }, flex: '1', position: 'relative' }}>
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
                        ) : type === 'percentage' ? (
                            `${(total * 100).toFixed(2)}%`
                        ) : (
                            total.toFixed(2).toLocaleString().replace('.', ',')
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