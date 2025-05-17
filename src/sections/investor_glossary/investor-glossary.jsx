import React, { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import {
    Container,
    Typography,
    Paper,
    Box,
    Divider,
    TextField,
    List,
    ListItem,
    ListItemText,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    alpha,
    useTheme
} from '@mui/material';

// Sample glossary data
const glossaryItems = [
    { term: 'Ação', definition: 'Título que representa uma fração do capital social de uma empresa.' },
    { term: 'Ativo', definition: 'Tudo que possui valor e pode ser convertido em dinheiro (ex: ações, imóveis, saldo em conta).' },
    { term: 'Ativo Circulante', definition: 'Bens e direitos que podem ser convertidos em dinheiro em até 12 meses.' },
    { term: 'Bear Market', definition: 'Período de queda prolongada nos preços dos ativos.' },
    { term: 'Benchmark', definition: 'Referência usada para comparar a performance de um investimento (ex: CDI, Ibovespa).' },
    { term: 'Beta', definition: 'Mede a volatilidade de um ativo em relação ao mercado. Um beta > 1 indica mais risco que o mercado.' },
    { term: 'Bull Market', definition: 'Período de alta generalizada e prolongada nos preços dos ativos.' },
    { term: 'Book Value', definition: 'Valor patrimonial de uma empresa, calculado como ativos totais menos passivos.' },
    { term: 'CAGR', definition: 'Taxa de crescimento anual composta de um investimento ao longo de um período.' },
    { term: 'CDB', definition: 'Certificado de Depósito Bancário. Título emitido por bancos para captar dinheiro de investidores.' },
    { term: 'CDI', definition: 'Certificado de Depósito Interbancário. Taxa de juros usada como referência em investimentos de renda fixa.' },
    { term: 'Capital de Giro', definition: 'Recursos necessários para manter as operações do dia a dia de uma empresa.' },
    { term: 'Custódia', definition: 'Guarda dos ativos financeiros em nome do investidor.' },
    { term: 'Dividendos', definition: 'Parte do lucro da empresa distribuída aos acionistas.' },
    { term: 'Diversificação', definition: 'Estratégia de investir em diferentes ativos para reduzir o risco da carteira.' },
    { term: 'Dívida Líquida', definition: 'Total da dívida bruta menos o caixa e equivalentes de caixa da empresa.' },
    { term: 'EBIT', definition: 'Lucro antes de juros e impostos. Mede a performance operacional da empresa.' },
    { term: 'EBITDA', definition: 'Lucro antes de juros, impostos, depreciação e amortização.' },
    { term: 'Equity', definition: 'Valor do patrimônio líquido de uma empresa.' },
    { term: 'FII', definition: 'Fundo de Investimento Imobiliário. Fundo que investe em imóveis ou ativos do setor imobiliário.' },
    { term: 'Fundos de Investimento', definition: 'Veículos que reúnem dinheiro de vários investidores para aplicar em diversos ativos.' },
    { term: 'Governança Corporativa', definition: 'Conjunto de práticas que buscam aumentar a transparência e confiança dos investidores.' },
    { term: 'Hold', definition: 'Estratégia de manter um ativo na carteira por longo prazo, independentemente da volatilidade.' },
    { term: 'IBOVESPA', definition: 'Principal índice da bolsa brasileira, reflete o desempenho das ações mais negociadas.' },
    { term: 'IPO', definition: 'Oferta pública inicial de ações de uma empresa na bolsa de valores.' },
    { term: 'Índice de Sharpe', definition: 'Mede o retorno ajustado ao risco de um investimento.' },
    { term: 'Liquidez', definition: 'Facilidade com que um ativo pode ser convertido em dinheiro sem perda significativa de valor.' },
    { term: 'P/L', definition: 'Preço/Lucro. Mostra quantos anos o investidor levaria para recuperar o investimento com o lucro atual da empresa.' },
    { term: 'P/VPA', definition: 'Preço/Valor Patrimonial por Ação. Compara o preço da ação com o valor contábil da empresa.' },
    { term: 'Price Action', definition: 'Análise baseada apenas no movimento dos preços, sem uso de indicadores técnicos.' },
    { term: 'Proventos', definition: 'Ganhos pagos aos acionistas, como dividendos e juros sobre capital próprio.' },
    { term: 'Renda Fixa', definition: 'Investimentos com rentabilidade previsível (ex: Tesouro Direto, CDB).' },
    { term: 'Renda Variável', definition: 'Investimentos com retorno incerto (ex: ações, FIIs).' },
    { term: 'ROE', definition: 'Return on Equity. Mede a eficiência da empresa em gerar lucro com o capital dos acionistas.' },
    { term: 'Short', definition: 'Operação em que o investidor lucra com a queda do preço de um ativo.' },
    { term: 'Stop Loss', definition: 'Ordem automática de venda para limitar perdas em uma operação.' },
    { term: 'Stop Gain', definition: 'Ordem automática de venda para garantir lucros após uma alta do ativo.' },
    { term: 'Tesouro Direto', definition: 'Programa do governo para venda de títulos públicos a pessoas físicas.' },
    { term: 'Taxa Selic', definition: 'Taxa básica de juros da economia brasileira.' },
    { term: 'Ticker', definition: 'Código que identifica uma ação na bolsa. Ex: PETR4, VALE3.' },
    { term: 'Valuation', definition: 'Processo de estimar o valor justo de uma empresa ou ativo.' },
    { term: 'Volatilidade', definition: 'Grau de variação dos preços de um ativo em determinado período.' },
    { term: 'Yield', definition: 'Retorno de um investimento em relação ao valor investido, geralmente usado para dividendos.' }
];


export function InvestorGlossary() {
    const [searchTerm, setSearchTerm] = useState('');
    const theme = useTheme();

    // Group glossary items by first letter, normalizing accents
    const groupedGlossary = glossaryItems.reduce((acc, item) => {
        // Normalize the first letter to remove accents
        const normalizedFirstLetter = item.term.normalize('NFD')
            .charAt(0)
            .replace(/[\u0300-\u036f]/g, '')
            .toUpperCase();

        if (!acc[normalizedFirstLetter]) {
            acc[normalizedFirstLetter] = [];
        }
        acc[normalizedFirstLetter].push(item);
        return acc;
    }, {});

    // Filter glossary based on search term
    const filteredGroups = Object.keys(groupedGlossary)
        .filter(letter => {
            return groupedGlossary[letter].some(item =>
                item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.definition.toLowerCase().includes(searchTerm.toLowerCase())
            );
        })
        .sort();

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box mb={4} textAlign="center">
                <Typography variant="h3" component="h1" gutterBottom>
                    Glossário do Investidor
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" paragraph>
                    Termos essenciais para entender o mercado financeiro
                </Typography>
                <Divider sx={{ my: 2 }} />
            </Box>

            <Paper
                sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    mb: 4,
                    backgroundColor: alpha(theme.palette.primary.main, 0.05)
                }}
            >
                <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                <TextField
                    fullWidth
                    placeholder="Pesquisar termos..."
                    variant="standard"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{ disableUnderline: true }}
                />
            </Paper>

            {filteredGroups.length > 0 ? (
                filteredGroups.map(letter => (
                    <Box key={letter} mb={3}>
                        <Typography
                            variant="h5"
                            component="h2"
                            bgcolor="primary.main"
                            color="primary.contrastText"
                            px={2}
                            py={1}
                            borderRadius={1}
                        >
                            {letter}
                        </Typography>

                        {groupedGlossary[letter]
                            .filter(item =>
                                item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                item.definition.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map((item, index) => (
                                <Accordion key={index} sx={{ mt: 1 }}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography fontWeight="bold">{item.term}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography>{item.definition}</Typography>
                                    </AccordionDetails>
                                </Accordion>
                            ))
                        }
                    </Box>
                ))
            ) : (
                <Box textAlign="center" py={4}>
                    <Typography variant="h6" color="text.secondary">
                        Nenhum termo encontrado para "{searchTerm}"
                    </Typography>
                </Box>
            )}
        </Container>
    );
}