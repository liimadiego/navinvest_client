import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Button,
    useTheme,
    alpha,
    Fade,
    Grow
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material'

const SectionTitle = ({ title, subtitle }) => {
    const theme = useTheme();

    return (
        <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
                variant="h3"
                component="h2"
                sx={{
                    fontWeight: 'bold',
                    mb: 2,
                    fontSize: { xs: '2rem', md: '3rem' }
                }}
            >
                {title}
            </Typography>
            <Typography
                variant="h6"
                sx={{
                    color: 'text.secondary',
                    maxWidth: '600px',
                    mx: 'auto',
                    lineHeight: 1.6,
                    fontSize: { xs: '1.1rem', md: '1.25rem' }
                }}
            >
                {subtitle}
            </Typography>
        </Box>
    );
};

const FAQAccordion = () => {
    const theme = useTheme();
    const [expanded, setExpanded] = useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const faqData = [
        {
            question: "É difícil usar a Navinvest?",
            answer: "Não. É como conversar com um consultor no WhatsApp."
        },
        {
            question: "A IA vai recomendar ativos específicos?",
            answer: "Ela apresenta os dados, cenários e comparações. A decisão final é sempre sua."
        },
        {
            question: "Funciona no celular?",
            answer: "Sim. Acesse do smartphone, tablet ou desktop."
        },
        {
            question: "Tem suporte?",
            answer: "Sim, por e-mail e com tutoriais completos."
        },
        {
            question: "Posso cancelar a qualquer momento?",
            answer: "Sim, você pode cancelar sua assinatura a qualquer momento, sem complicações."
        },
        {
            question: "Quais as formas de pagamento?",
            answer: "Aceitamos cartões de crédito e PIX. Você pode escolher a forma que preferir."
        },
        {
            question: "Tem concorrentes no Brasil?",
            answer: "Não. Somos pioneiros aqui no Brasil."
        },
        {
            question: "Tem garantia?",
            answer: "Sim. Você pode testar por 7 dias gratuitamente com cartão. Não gostou? Cancela sem custo."
        },
        {
            question: "Meus dados ficam seguros?",
            answer: "Sim. Todos os dados são protegidos com tecnologia de ponta e nunca são compartilhados sem sua autorização."
        }
    ];

    return (
        <Box
            id="faq-complete"
            sx={{
                py: { xs: 6, md: 8 },
                position: 'relative',
                width: '100%',
            }}
        >
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <SectionTitle
                    title="Perguntas Frequentes"
                    subtitle="Tudo que você precisa saber antes de dar o próximo passo"
                />

                <Box sx={{ mt: 6 }}>
                    {faqData.map((faq, index) => (
                        <Accordion
                            key={index}
                            expanded={expanded === `panel${index}` || (index === 0 && expanded === false)}
                            onChange={handleChange(`panel${index}`)}
                            sx={{
                                mb: 2,
                                borderRadius: '16px !important',
                                boxShadow: expanded === `panel${index}`
                                    ? '0 8px 32px rgba(0, 0, 0, 0.08)'
                                    : '0 2px 8px rgba(0, 0, 0, 0.04)',
                                border: '1px solid',
                                borderColor: expanded === `panel${index}`
                                    ? 'primary.main'
                                    : alpha(theme.palette.divider, 0.1),
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                                    borderColor: alpha(theme.palette.primary.main, 0.3),
                                    transform: 'translateY(-2px)'
                                },
                                '&::before': {
                                    display: 'none'
                                },
                                overflow: 'hidden',
                                bgcolor: expanded === `panel${index}`
                                    ? alpha(theme.palette.primary.main, 0.02)
                                    : 'background.paper'
                            }}
                        >
                            <AccordionSummary
                                expandIcon={
                                    <ExpandMore
                                        size={24}
                                        style={{
                                            color: theme.palette.primary.main,
                                            transition: 'transform 0.3s ease',
                                        }}
                                    />
                                }
                                sx={{
                                    py: 2,
                                    px: 3,
                                    minHeight: '72px !important',
                                    '&.Mui-expanded': {
                                        minHeight: '72px !important'
                                    },
                                    '&:hover': {
                                        backgroundColor: alpha(theme.palette.primary.main, 0.04)
                                    },
                                    transition: 'background-color 0.3s ease',
                                    '& .MuiAccordionSummary-content': {
                                        margin: '16px 0',
                                        '&.Mui-expanded': {
                                            margin: '16px 0'
                                        }
                                    }
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: '600',
                                        color: 'text.primary',
                                        fontSize: { xs: '1.1rem', md: '1.25rem' },
                                        lineHeight: 1.4
                                    }}
                                >
                                    {faq.question}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails
                                sx={{
                                    px: 3,
                                    pb: 3,
                                    pt: 2,
                                    backgroundColor: alpha(theme.palette.background.paper, 0.1)
                                }}
                            >
                                <Box sx={{ pt: 1, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: 'text.secondary',
                                            lineHeight: 1.7,
                                            fontSize: { xs: '1rem', md: '1.1rem' }
                                        }}
                                    >
                                        {faq.answer}
                                    </Typography>
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>
            </Container>
        </Box>
    );
};

export default FAQAccordion;