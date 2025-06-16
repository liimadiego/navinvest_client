import React, { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import axios from 'src/lib/axios';

import {
    Box,
    Typography,
    Button,
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Modal,
    IconButton,
    Alert,
    Snackbar,
    Stepper,
    Step,
    StepLabel,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Divider,
    CircularProgress
} from '@mui/material';

const formQuestions = [
    {
        id: "experience",
        question: "Qual a sua experiência com investimentos?",
        options: [
            { value: "A", label: "Nenhuma, , estou começando agora." },
            { value: "B", label: "Tenho alguma experiência, já investi antes." },
            { value: "C", label: "Sou experiente, acompanho o mercado e faço investimentos regularmente." }
        ],
        slug: "experience"
    },
    {
        id: "risk_tolerance",
        question: "Qual sua tolerância ao risco em relação a investimentos?",
        options: [
            { value: "A", label: "Prefiro segurança total, mesmo que o retorno seja baixo." },
            { value: "B", label: "Aceito pequenos riscos para obter um retorno um pouco maior." },
            { value: "C", label: "Estou disposto a correr grandes riscos para maximizar meus ganhos." }
        ],
        slug: ""
    },
    {
        id: "investment_horizon",
        question: "Por quanto tempo você pretende manter seus investimentos antes de precisar do dinheiro?",
        options: [
            { value: "A", label: "Menos de 1 ano." },
            { value: "B", label: "Entre 1 e 5 anos." },
            { value: "C", label: "Mais de 5 anos." }
        ],
        slug: ""
    },
    {
        id: "market_reaction",
        question: "O que você faria se seu investimento perdesse 20% do valor em um curto período?",
        options: [
            { value: "A", label: "Venderia imediatamente para evitar mais perdas." },
            { value: "B", label: "Aguardaria para ver se o mercado se recupera." },
            { value: "C", label: "Compraria mais, aproveitando a queda para investir mais barato." }
        ],
        slug: ""
    },
    {
        id: "investment_goal",
        question: "Qual é o principal objetivo dos seus investimentos?",
        options: [
            { value: "A", label: "Preservação de capital, evitar perdas." },
            { value: "B", label: "Crescimento moderado do patrimônio ao longo do tempo." },
            { value: "C", label: "Altos ganhos, mesmo que haja maior volatilidade." }
        ],
        slug: ""
    }
];

export function InvestorProfile() {
    const [openModal, setOpenModal] = useState(false);
    const [showQuestions, setShowQuestions] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [userAnswers, setUserAnswers] = useState([]);
    const [userInvestorProfile, setUserInvestorProfile] = useState(null);

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => {
        setOpenModal(false);
        setShowQuestions(false);
        setActiveStep(0);
    };

    const handleStartQuestions = () => setShowQuestions(true);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleAnswerChange = (questionId, value) => {
        setAnswers({
            ...answers,
            [questionId]: value
        });
    };

    const handleSubmit = () => {
        setIsSubmitLoading(true);

        const payload = {
            investor_profile: {}
        };

        formQuestions.forEach((question) => {
            payload.investor_profile[question.id] = answers[question.id] || '';
        });

        axios.post('/investor-profile/create', payload)
            .then((response) => {
                setOpenSnackbar(true);
                handleCloseModal();
                setAnswers({});
            }
            ).catch((error) => {
                console.error('Erro ao salvar perfil de investidor:', error);
                handleCloseModal();
            })
            .finally(() => {
                setIsSubmitLoading(false);
                handleUserAnswes();
            });
    };

    const handleUserAnswes = async () => {
        setIsTableLoading(true);
        try {
            const response = await axios.get('/investor-profile/get-investor-profile');
            if (response.data && response.data.profileResponse && response.data.profileResponse.length > 0) {
                setUserAnswers(response.data.profileResponse);
            }
            if (response.data && response.data.profile) {
                setUserInvestorProfile(response.data.profile);
            }
        } catch (error) {
            console.error('Erro ao buscar respostas do usuário:', error);
        } finally {
            setIsTableLoading(false);
        }
    }

    useEffect(() => {
        handleUserAnswes();
    }, []);

    return (
        <Box>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                    <Box display="flex" alignItems="center">
                        <AccountBalanceIcon fontSize="large" sx={{ mr: 2, color: 'primary.main' }} />
                        <Typography variant="h4" component="h1" fontWeight="bold">
                            {userInvestorProfile ? `Perfil: ${userInvestorProfile}` : 'Perfil: A definir'}
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        onClick={handleOpenModal}
                        startIcon={<TrendingUpIcon />}
                        sx={{
                            borderRadius: 2,
                            px: 3,
                            py: 1,
                            fontWeight: 'bold'
                        }}
                    >
                        Definir Perfil
                    </Button>
                </Box>

                <Divider sx={{ mb: 4 }} />

                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                        Suas Respostas Atuais
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                        Aqui estão suas respostas atuais que definem seu perfil de investidor. Para atualizar, clique no botão "Definir Perfil".
                    </Typography>
                </Box>

                {userAnswers.length > 0 ? (
                    <Paper elevation={3}>
                        <TableContainer component={Paper} elevation={1} sx={{ mb: 4, borderRadius: 2, backgroundColor: 'background.default' }}>
                            <Table>
                                <TableHead sx={{ backgroundColor: 'primary.light' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Pergunta</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Sua Resposta</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {userAnswers.map((row) => (
                                        <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell component="th" scope="row">
                                                {row.question}
                                            </TableCell>
                                            <TableCell>{row.answer}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                ) : (
                    !isTableLoading ? <Box sx={{ p: 4, textAlign: 'center', borderRadius: 2, backgroundColor: 'background.default' }}>
                        <Typography variant="body1" color="text.secondary">
                            Você ainda não definiu seu perfil de investidor.
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={handleOpenModal}
                            sx={{ mt: 2 }}
                        >
                            Definir Agora
                        </Button>
                    </Box> :
                        <Box sx={{ p: 4, textAlign: 'center', borderRadius: 2, backgroundColor: 'background.default' }}>
                            <Typography variant="body1" color="text.secondary">
                                <CircularProgress />
                            </Typography>
                        </Box>

                )}
            </Paper>

            {/* Modal para definir o perfil */}
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
                // deixa o fundo escuro e desfocado
                sx={{
                    backdropFilter: 'blur(2px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Paper
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: '90%', sm: 600 },
                        maxHeight: '90vh',
                        overflow: 'auto',
                        p: 4,
                        borderRadius: 2
                    }}
                    elevation={3}
                >
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography id="modal-title" variant="h5" component="h2" fontWeight="bold">
                            {showQuestions ? "Questionário de Perfil de Investidor" : "Definir Perfil de Investidor"}
                        </Typography>
                        <IconButton onClick={handleCloseModal} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    {!showQuestions ? (
                        <>
                            <Typography id="modal-description" variant="body1" sx={{ mt: 2, mb: 4 }}>
                                Este questionário ajudará a determinar seu perfil de investidor, permitindo recomendações mais adequadas
                                ao seu estilo e objetivos financeiros. Responda às perguntas com sinceridade para obter o melhor resultado.
                            </Typography>
                            <Box display="flex" justifyContent="center">
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={handleStartQuestions}
                                    sx={{ px: 4, borderRadius: 2 }}
                                >
                                    Iniciar Questionário
                                </Button>
                            </Box>
                        </>
                    ) : (
                        <>
                            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                                {formQuestions.map((_, index) => (
                                    <Step key={index}>
                                        <StepLabel />
                                    </Step>
                                ))}
                            </Stepper>

                            <Box sx={{ mb: 4 }}>
                                {activeStep < formQuestions.length ? (
                                    <FormControl component="fieldset" sx={{ width: '100%' }}>
                                        <FormLabel component="legend" sx={{ mb: 2, fontWeight: 'bold', fontSize: '1.1rem' }}>
                                            {formQuestions[activeStep].question}
                                        </FormLabel>
                                        <RadioGroup
                                            value={answers[formQuestions[activeStep].id] || ''}
                                            onChange={(e) => handleAnswerChange(formQuestions[activeStep].id, e.target.value)}
                                        >
                                            {formQuestions[activeStep].options.map((option) => (
                                                <FormControlLabel
                                                    key={option.value}
                                                    value={option.value}
                                                    control={<Radio />}
                                                    label={option.label}
                                                    sx={{ mb: 1 }}
                                                />
                                            ))}
                                        </RadioGroup>
                                    </FormControl>
                                ) : (
                                    <Box sx={{ textAlign: 'center', my: 4 }}>
                                        <Typography variant="h6" gutterBottom>
                                            Questionário Concluído!
                                        </Typography>
                                        <Typography variant="body1">
                                            Obrigado por responder todas as perguntas. Clique em "Enviar" para processar seu perfil de investidor.
                                        </Typography>
                                    </Box>
                                )}
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Button
                                    disabled={activeStep === 0}
                                    onClick={handleBack}
                                    variant="outlined"
                                >
                                    Voltar
                                </Button>
                                {activeStep === formQuestions.length ? (
                                    <Button
                                        variant="contained"
                                        onClick={handleSubmit}
                                        color="primary"
                                        loading={isSubmitLoading}
                                        loadingPosition="end"
                                        disabled={Object.keys(answers).length < formQuestions.length}
                                    >
                                        Enviar
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        onClick={handleNext}
                                        disabled={!answers[formQuestions[activeStep].id]}
                                    >
                                        Próximo
                                    </Button>
                                )}
                            </Box>
                        </>
                    )}
                </Paper>
            </Modal>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                    Perfil de investidor salvo com sucesso!
                </Alert>
            </Snackbar>
        </Box>
    );
};