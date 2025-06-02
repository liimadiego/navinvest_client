import React, { useState } from 'react';
import {
    Box,
    Tabs,
    Tab,
    Typography,
    Paper,
    Container,
    Avatar,
    Divider,
    Button,
    Modal,
    Alert
} from '@mui/material';
import { useAuthContext } from 'src/auth/hooks';
import { useNavigate } from 'react-router-dom';
import { paths } from 'src/routes/paths';
import { m } from 'framer-motion';
import { CONFIG } from 'src/global-config';
import { varAlpha } from 'minimal-shared/utils';
import axios from 'src/lib/axios';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`profile-tabpanel-${index}`}
            aria-labelledby={`profile-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

export function MyProfile() {
    const navigate = useNavigate();
    const [tabValue, setTabValue] = useState(0);
    const { user } = useAuthContext();
    const [modalOpened, setModalOpen] = useState(false);
    const [alertOpened, setAlertOpen] = useState(false);
    const [alertErrorOpened, setAlertErrorOpen] = useState(false);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleSubscriptionCancel = async () => {
        await axios.post('/users/request-subscription-cancellation')
            .then(() => {
                setAlertOpen(true);
            }
            ).catch((error) => {
                setAlertErrorOpen(true);
            })

        setModalOpen(false);

        setTimeout(() => {
            setAlertOpen(false);
            setAlertErrorOpen(false);
        }, 6000);
    };

    const formatPhone = (phone) => {
        const digitsOnly = phone.replace(/\D/g, '');
        if (digitsOnly.length === 0) {
            return '';
        }
        if (digitsOnly.length > 0 && digitsOnly.length <= 2) {
            return `(${digitsOnly}`;
        } else if (digitsOnly.length <= 6) {
            return `(${digitsOnly.slice(0, 2)}) ${digitsOnly.slice(2)}`;
        } else if (digitsOnly.length <= 10) {
            return `(${digitsOnly.slice(0, 2)}) ${digitsOnly.slice(2, 6)}-${digitsOnly.slice(6, 10)}`;
        } else {
            return `(${digitsOnly.slice(0, 2)}) ${digitsOnly.slice(2, 7)}-${digitsOnly.slice(7, 11)}`;
        }
    }

    const modalSure = (message, onConfirm) => {
        return <Modal
            open={modalOpened}
            onClose={() => { setModalOpen(false); }}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2, maxWidth: 400, margin: 'auto', mt: '20vh' }}>
                <Typography id="modal-title" variant="h6" component="h2">
                    Atenção
                </Typography>
                <Typography id="modal-description" sx={{ mt: 2 }}>
                    {message}
                </Typography>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={() => { setModalOpen(false) }} color="primary" variant="contained" sx={{ mr: 2 }}>Cancelar</Button>
                    <Button onClick={() => onConfirm()} variant="outlined">Confirmar</Button>
                </Box>
            </Box>
        </Modal>;
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        aria-label="profile tabs"
                        variant="fullWidth"
                    >
                        <Tab label="Meu Perfil" id="profile-tab-0" />
                        <Tab label="Gerenciar Assinatura" id="profile-tab-1" />
                    </Tabs>
                </Box>

                <TabPanel value={tabValue} index={0}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ width: 80, height: 80 }}>
                                {user ? user.displayName.charAt(0).toUpperCase() : 'U'}
                            </Avatar>
                            <Box>
                                <Typography variant="h6">{user ? user.displayName : ''}</Typography>
                                <Typography variant="body2" color="text.secondary">{user ? user.email : ''}</Typography>
                            </Box>
                        </Box>
                        <Divider />
                        <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                            <Typography variant="body1"><span style={{ opacity: 0.6, lineHeight: '30px' }}>Telefone:</span> {user ? formatPhone(user.phone) : '-'}</Typography>
                            <Typography variant="body1"><span style={{ opacity: 0.6, lineHeight: '30px' }}>Usuário desde:</span> {user ? new Date(user.created_at).toLocaleDateString() : '-'}</Typography>
                        </Box>
                    </Box>
                </TabPanel>

                {user && user.plan !== null ? (
                    <TabPanel value={tabValue} index={1}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Typography variant="h6">Sua Assinatura</Typography>
                                <Box sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
                                    <Typography variant="subtitle1"><span style={{ opacity: .6 }}>Plano atual:</span> Plano {user.plan.name ?? 'Premium'}</Typography>
                                    <Typography variant="subtitle1"><span style={{ opacity: .6 }}>Válido até:</span> {user.plan_expiration ? new Date(user.plan_expiration).toLocaleDateString() : 'N/A'}</Typography>
                                </Box>
                            </Box>
                            <Button
                                sx={{ height: 'fit-content', border: 'none', textDecoration: 'underline' }}
                                variant="outlined"
                                color="error"
                                onClick={() => { setModalOpen(true); }}
                            >
                                Solicitar encerramento da assinatura
                            </Button>
                            {modalSure(
                                'Você tem certeza que deseja solicitar o encerramento da sua assinatura? Você perderá acesso a todas as funcionalidades premium.',
                                handleSubscriptionCancel
                            )}
                        </Box>
                    </TabPanel>
                ) :
                    (
                        <TabPanel value={tabValue} index={1}>

                            <Box
                                sx={[
                                    (theme) => ({
                                        ...theme.mixins.bgGradient({
                                            images: [
                                                `linear-gradient(135deg, ${varAlpha(theme.vars.palette.error.lightChannel, 0.92)}, ${varAlpha(theme.vars.palette.secondary.darkChannel, 0.92)})`,
                                                `url(${CONFIG.assetsDir}/assets/background/background-7.webp)`,
                                            ],
                                        }),
                                        px: 3,
                                        py: 4,
                                        borderRadius: 2,
                                        position: 'relative',
                                    }),
                                ]}
                            >
                                <Box
                                    sx={(theme) => ({
                                        top: 0,
                                        left: 0,
                                        width: 1,
                                        height: 1,
                                        borderRadius: 2,
                                        position: 'absolute',
                                        border: `solid 3px ${varAlpha(theme.vars.palette.common.whiteChannel, 0.16)}`,
                                    })}
                                />

                                <Box
                                    component={m.img}
                                    animate={{ y: [12, -12, 12] }}
                                    transition={{
                                        duration: 8,
                                        ease: 'linear',
                                        repeat: Infinity,
                                        repeatDelay: 0,
                                    }}
                                    alt="Small Rocket"
                                    src={`${CONFIG.assetsDir}/assets/illustrations/illustration-rocket-small.webp`}
                                    sx={{
                                        right: 0,
                                        width: 112,
                                        height: 112,
                                        position: 'absolute',
                                    }}
                                />

                                <Box
                                    sx={{
                                        display: 'flex',
                                        position: 'relative',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                    }}
                                >
                                    <Box component="span" sx={{ typography: 'h5', color: 'common.white' }}>
                                        20% OFF no plano anual
                                    </Box>

                                    <Box
                                        component="span"
                                        sx={{
                                            mb: 2,
                                            mt: 0.5,
                                            color: 'common.white',
                                            typography: 'subtitle2',
                                        }}
                                    >
                                        Invista com inteligência
                                    </Box>

                                    <Button variant="contained" size="small" color="warning" href={paths.pricing} target="_blank" rel="noopener">
                                        Faça upgrade
                                    </Button>
                                </Box>
                            </Box>
                        </TabPanel>
                    )}
            </Paper>
            {alertOpened && <Alert severity="success" sx={{ position: 'fixed', bottom: 16, right: 16 }} onClose={() => { setAlertOpen(false); }}>
                Solicitação de encerramento enviada. Nossa equipe entrará em contato em breve
            </Alert>}
            {/* //onError */}
            {alertErrorOpened && <Alert severity="error" sx={{ position: 'fixed', bottom: 16, right: 16 }} onClose={() => { setAlertErrorOpen(false); }}>
                Ocorreu um erro ao solicitar o encerramento da assinatura. Tente novamente mais tarde.
            </Alert>}

        </Container>
    );
}