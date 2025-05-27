import React, { useEffect, useState } from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import PaymentIcon from '@mui/icons-material/Payment';
import { QRCodeSVG } from 'qrcode.react';
import {
    Box,
    Typography,
    Paper,
    Button,
    TextField,
    Snackbar,
    Alert,
    Divider,
    Container,
    useColorScheme,
    Card,
    CardContent,
    Chip,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Fade
} from '@mui/material';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import Looks3Icon from '@mui/icons-material/Looks3';
import Looks4Icon from '@mui/icons-material/Looks4';
import { useLocation } from 'react-router-dom';

export function Pix() {
    const location = useLocation();
    const { copyPaste, qrCodeBase64, amount, plan } = location.state || {};
    const [formattedAmount, setFormattedAmount] = useState('');

    useEffect(() => {
        if (amount) {
            const formatted = parseFloat(amount).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
            setFormattedAmount(formatted);
        }
    }, [amount]);

    if (!copyPaste) {
        return <div>Erro: Dados do PIX não encontrados.</div>;
    }

    const [open, setOpen] = useState(false);
    const { mode } = useColorScheme();
    const [copied, setCopied] = useState(false);
    const borderColor = mode === 'dark' ? 'rgba(255,255,255,.3)' : 'rgba(0,0,0,.2)';
    const backgroundColor = mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)';

    const handleCopy = () => {
        navigator.clipboard.writeText(copyPaste);
        setCopied(true);
        setOpen(true);

        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Fade in={true} timeout={800}>
                <Paper
                    elevation={6}
                    sx={{
                        p: { xs: 3, md: 5 },
                        borderRadius: 3,
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 8,
                            bgcolor: 'primary.main'
                        }}
                    />

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, mt: 1 }}>
                        <PaymentIcon color="primary" sx={{ fontSize: 32, mr: 2 }} />
                        <Typography variant="h4" component="h1" fontWeight="bold">
                            Finalize seu pagamento via PIX
                        </Typography>
                    </Box>

                    <Chip
                        label="Expira em 30 minutos"
                        color="warning"
                        variant="outlined"
                        sx={{ mb: 3 }}
                    />

                    <Divider sx={{ my: 3 }} />

                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 4,
                        alignItems: 'center'
                    }}>
                        <Box sx={{
                            flex: { xs: '1 1 100%', md: '1 1 40%' },
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}>
                            <Card
                                elevation={3}
                                sx={{
                                    p: 3,
                                    borderRadius: 2,
                                    bgcolor: backgroundColor,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center'
                                }}
                            >
                                <Box sx={{
                                    p: 3,
                                    border: `2px solid ${borderColor}`,
                                    borderRadius: 2,
                                    bgcolor: '#fff',
                                    mb: 2
                                }}>
                                    <img src={`data:image/png;base64,${qrCodeBase64}`} alt="QR Code Pix" width={180} />
                                </Box>
                                <Typography variant="subtitle2" color="text.secondary" align="center">
                                    Escaneie com o app do seu banco
                                </Typography>
                            </Card>
                        </Box>

                        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 60%' } }}>
                            <Typography variant="h6" gutterBottom fontWeight="medium">
                                Ou use o código PIX abaixo:
                            </Typography>

                            <Box sx={{ mt: 2, mb: 3 }}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={copyPaste}
                                    InputProps={{
                                        readOnly: true,
                                        sx: { borderRadius: 2 },
                                        endAdornment: (
                                            <Button
                                                variant="contained"
                                                color={copied ? 'success' : 'primary'}
                                                onClick={handleCopy}
                                                startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
                                                sx={{ px: 3, py: 1.2, borderRadius: 1.5 }}
                                            >
                                                {copied ? 'Copiado' : 'Copiar'}
                                            </Button>
                                        ),
                                    }}
                                />
                            </Box>

                            <Card
                                elevation={1}
                                sx={{
                                    mb: 3,
                                    bgcolor: backgroundColor,
                                    borderRadius: 2
                                }}
                            >
                                <CardContent>
                                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                        Como realizar o pagamento:
                                    </Typography>
                                    <List dense disablePadding>
                                        <ListItem>
                                            <ListItemIcon><LooksOneIcon color="primary" /></ListItemIcon>
                                            <ListItemText primary="Abra o aplicativo do seu banco" />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon><LooksTwoIcon color="primary" /></ListItemIcon>
                                            <ListItemText primary="Escolha a opção de pagamento por PIX" />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon><Looks3Icon color="primary" /></ListItemIcon>
                                            <ListItemText primary="Escaneie o QR Code ou cole o código PIX" />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon><Looks4Icon color="primary" /></ListItemIcon>
                                            <ListItemText primary="Confirme as informações e finalize o pagamento" />
                                        </ListItem>
                                    </List>
                                </CardContent>
                            </Card>
                        </Box>
                    </Box>

                    <Card sx={{
                        mt: 3,
                        bgcolor: mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'primary.light',
                        color: mode === 'dark' ? 'white' : 'primary.contrastText',
                        borderRadius: 2
                    }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom fontWeight="bold">
                                Informações do pagamento
                            </Typography>
                            <Box sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 4,
                                justifyContent: 'space-between'
                            }}>
                                <Box>
                                    <Typography variant="body2" color="inherit" sx={{ opacity: 0.8 }}>
                                        Valor:
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium">
                                        {formattedAmount}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body2" color="inherit" sx={{ opacity: 0.8 }}>
                                        Beneficiário:
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium">
                                        Navinvest Tecnologia LTDA
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body2" color="inherit" sx={{ opacity: 0.8 }}>
                                        Identificação:
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium">
                                        Plano {plan}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Paper>
            </Fade>

            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Código PIX copiado com sucesso!
                </Alert>
            </Snackbar>
        </Container>
    );
}