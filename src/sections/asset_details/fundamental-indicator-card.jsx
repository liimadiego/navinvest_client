import { IconButton } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Box, Paper, Skeleton, Tooltip, Typography } from '@mui/material';

export function FundamentalIndicatorCard({ tickerData }) {

    const fundamentalIndicatorsData = [
        {
            "title": "P/L",
            "total": "tickerData?.p_l",
            "description": "Preço da ação dividido pelo lucro por ação"
        },
        {
            "title": "P/VP",
            "total": "tickerData?.p_vp",
            "description": "Preço da ação dividido pelo valor patrimonial por ação"
        },
        {
            "title": "DY",
            "total": "tickerData?.dividend_yield",
            "type": "percentage",
            "description": "Dividend Yield (DY) é o indicador que mostra quanto a empresa paga de dividendos em relação ao preço da ação"
        },
        {
            "title": "P/Receita",
            "total": "tickerData?.p_receita",
            "description": "Preço da ação dividido pela receita líquida por ação"
        },
        {
            "title": "Payout",
            "total": "tickerData?.payout",
            "type": "percentage",
            "description": "Percentual do lucro líquido distribuído como dividendos aos acionistas"
        },
        {
            "title": "Margem Líquida",
            "total": "tickerData?.margem_liquida",
            "type": "percentage",
            "description": "Percentual do lucro líquido em relação à receita líquida"
        },
        {
            "title": "Margem Bruta",
            "total": "tickerData?.margem_bruta",
            "type": "percentage",
            "description": "Percentual do lucro bruto em relação à receita líquida"
        },
        {
            "title": "Margem EBIT",
            "total": "tickerData?.margem_ebit",
            "type": "percentage",
            "description": "Percentual do lucro antes de juros e impostos em relação à receita líquida"
        },
        {
            "title": "Margem EBITDA",
            "total": "tickerData?.margem_ebitda",
            "type": "percentage",
            "description": "Percentual do lucro antes de juros, impostos, depreciação e amortização em relação à receita líquida"
        },
        {
            "title": "EV/EBITDA",
            "total": "tickerData?.ev_ebitda",
            "description": "Valor da empresa dividido pelo EBITDA"
        },
        {
            "title": "EV/EBIT",
            "total": "tickerData?.ev_ebit",
            "description": "Valor da empresa dividido pelo EBIT"
        },
        {
            "title": "P/EBITDA",
            "total": "tickerData?.p_ebitda",
            "description": "Preço da ação dividido pelo EBITDA por ação"
        },
        {
            "title": "P/EBIT",
            "total": "tickerData?.p_ebit",
            "description": "Preço da ação dividido pelo EBIT por ação"
        },
        {
            "title": "P/Ativo",
            "total": "tickerData?.p_ativo",
            "description": "Preço da ação dividido pelo valor total dos ativos"
        },
        {
            "title": "P/Cap. Giro",
            "total": "tickerData?.p_cap_giro",
            "description": "Preço da ação dividido pelo capital de giro"
        },
        {
            "title": "P/Ativo Circ. Líquido",
            "total": "tickerData?.p_ativo_circ_liq",
            "description": "Preço da ação dividido pelo ativo circulante líquido"
        },
        {
            "title": "VPA",
            "total": "tickerData?.vpa",
            "description": "Valor patrimonial por ação"
        },
        {
            "title": "LPA",
            "total": "tickerData?.lpa",
            "description": "Lucro por ação"
        },
        {
            "title": "Giro Ativos",
            "total": "tickerData?.giro_ativos",
            "description": "Receita líquida dividida pelo total de ativos"
        },
        {
            "title": "ROE",
            "total": "tickerData?.roe",
            "type": "percentage",
            "description": "Retorno sobre o patrimônio líquido"
        },
        {
            "title": "ROIC",
            "total": "tickerData?.roic",
            "type": "percentage",
            "description": "Retorno sobre o capital investido"
        },
        {
            "title": "ROA",
            "total": "tickerData?.roa",
            "type": "percentage",
            "description": "Retorno sobre os ativos"
        },
        {
            "title": "Dívida Líquida / Patrimônio",
            "total": "tickerData?.divida_liquida_patrimonio",
            "description": "Relação entre dívida líquida e patrimônio líquido"
        },
        {
            "title": "Dívida Líquida / EBITDA",
            "total": "tickerData?.divida_liquida_ebitda",
            "description": "Relação entre dívida líquida e EBITDA"
        },
        {
            "title": "Dívida Líquida / EBIT",
            "total": "tickerData?.divida_liquida_ebit",
            "description": "Relação entre dívida líquida e EBIT"
        },
        {
            "title": "Dívida Bruta / Patrimônio",
            "total": "tickerData?.divida_bruta_patrimonio",
            "description": "Relação entre dívida bruta e patrimônio líquido"
        },
        {
            "title": "Patrimônio / Ativos",
            "total": "tickerData?.patrimonio_ativos",
            "description": "Relação entre patrimônio líquido e ativos totais"
        },
        {
            "title": "Passivos / Ativos",
            "total": "tickerData?.passivos_ativos",
            "description": "Relação entre passivos totais e ativos totais"
        },
        {
            "title": "Liquidez Corrente",
            "total": "tickerData?.liquidez_corrente",
            "description": "Capacidade de pagamento das obrigações de curto prazo"
        },
        {
            "title": "CAGR Receitas 5 Anos",
            "total": "tickerData?.cagr_receitas_5_anos",
            "type": "percentage",
            "description": "Taxa de crescimento anual composta das receitas nos últimos 5 anos"
        },
        {
            "title": "CAGR Lucros 5 Anos",
            "total": "tickerData?.cagr_lucros_5_anos",
            "type": "percentage",
            "description": "Taxa de crescimento anual composta dos lucros nos últimos 5 anos"
        }
    ];

    const FundamentalIndicator = ({ title, total, type, description }) => {
        return (
            <Paper elevation={3} sx={{ p: 2, minWidth: { xs: '136px', md: '250px' }, flex: '1', position: 'relative' }}>
                <Typography sx={{ p: 1, opacity: .75 }} variant='subtitle2'>{title}
                    <Tooltip title={description} arrow>
                        <IconButton sx={{ ml: "5px", p: 0, position: 'absolute', right: "15px", top: "15px" }}>
                            <HelpOutlineIcon sx={{ fontSize: "15px" }} />
                        </IconButton>
                    </Tooltip>
                </Typography>
                <Typography variant='h6' sx={{ p: 1, pt: 0 }}>
                    {total ? (
                        <Box>
                            {type === 'currency' ? (
                                currency === 'USD' ? `$${total.toLocaleString('en-US')}` : `R$${total.toLocaleString('pt-BR')}`
                            ) : type === 'percentage' ? (
                                `${(total * 100).toFixed(2)}%`
                            ) : (
                                total.toLocaleString().replace('.', ',')
                            )}
                        </Box>) : (
                        <Skeleton variant="text" width={100} height={30} />
                    )}
                </Typography>
            </Paper>
        );
    }

    return (
        <>
            {fundamentalIndicatorsData.map((data, index) => (
                <FundamentalIndicator key={index} title={data.title} total={
                    tickerData ? eval(data.total
                        .replace('tickerData?.', 'tickerData.')
                        .replace('currency', 'tickerData.currency')
                    ) : null
                } type={data.type} description={data.description} />
            ))}
        </>
    )
}