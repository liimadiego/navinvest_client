import React, { useContext, useEffect, useState } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Modal,
    Box,
    Typography,
    Card,
    CardContent,
    Avatar,
    Grid,
    Divider
} from '@mui/material';
import { AuthContext } from 'src/auth/context/auth-context';
import { paths } from 'src/routes/paths';
import { useUserPlan } from 'src/context/UserPlan';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 2,
    p: 4,
};

const MyProfile = ({ onClose }) => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const {
        shouldUserUsePremiumFeatures
    } = useUserPlan();
    const [menuOpen, setMenuOpen] = useState(false);

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => setOpen(false);

    const handleManageSubscription = () => {
        setMenuOpen(false);
        onClose && onClose();
        navigate(paths.dashboard.my_profile);
    };

    return (
        (user && <>
            <Button
                variant="outlined"
                onClick={handleOpen}
                startIcon={<PersonIcon />}
                sx={{ width: '100%', mb: 2, py: 1.5 }}
            >
                Meu Perfil
            </Button>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="profile-modal-title"
            >
                <Box sx={modalStyle}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography id="profile-modal-title" variant="h5" component="h2">
                            Meu Perfil
                        </Typography>

                        {shouldUserUsePremiumFeatures && (
                            <Box sx={{ position: 'relative' }}>
                                <Button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setMenuOpen(!menuOpen);
                                    }}
                                    sx={{ minWidth: 'auto', p: 1 }}
                                >
                                    <Typography sx={{ fontSize: '1rem', fontWeight: 'bold', lineHeight: 1, opacity: .6 }}>⋮</Typography>
                                </Button>
                                {menuOpen && (
                                    <Box sx={{
                                        position: 'absolute',
                                        right: 0,
                                        top: '100%',
                                        bgcolor: 'background.paper',
                                        boxShadow: 3,
                                        borderRadius: 1,
                                        zIndex: 1000,
                                        width: 200,
                                    }}>
                                        <Button
                                            onClick={handleManageSubscription}
                                            sx={{
                                                display: 'flex',
                                                width: '100%',
                                                justifyContent: 'flex-start',
                                                p: 1.5,
                                            }}
                                        >
                                            Gerenciar Assinatura
                                        </Button>
                                    </Box>
                                )}
                            </Box>
                        )}
                    </Box>

                    <Card>
                        <CardContent>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item>
                                    <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                                        {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                                    </Avatar>
                                </Grid>
                                <Grid item xs>
                                    <Typography variant="h6">{user.displayName}</Typography>
                                    <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                                </Grid>
                            </Grid>

                            <Box sx={{ mt: 3 }}>
                                <Typography variant="subtitle1">Detalhes da assinatura</Typography>
                                <Typography variant="body2">
                                    Tipo: {user.plan ? user.plan.name : 'Grátis'}
                                </Typography>
                                <Typography variant="body2">
                                    Status: Ativo
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                <Button onClick={handleClose} variant="outlined">
                                    Fechar
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Modal>
        </>)
    );
};

export default MyProfile;