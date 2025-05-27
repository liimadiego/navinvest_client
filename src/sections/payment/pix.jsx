import React, { useEffect, useState } from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
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
    useColorScheme
} from '@mui/material';

export function Pix() {
    const [open, setOpen] = useState(false);
    const { mode } = useColorScheme();
    const [copied, setCopied] = useState(false);
    const borderColor = mode === 'dark' ? 'rgba(255,255,255,.3)' : 'rgba(0,0,0,.2)';

    // This would come from your backend in a real application
    const pixKey = "00020126580014BR.GOV.BCB.PIX0136example@email.com520400005303986540510.005802BR5913Recipient Name6008Sao Paulo62070503***6304E2CA";

    const handleCopy = () => {
        navigator.clipboard.writeText(pixKey);
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
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    Quase lá, finalize seu pagamento via PIX
                </Typography>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, alignItems: 'center' }}>
                    <Box sx={{
                        flex: { xs: '1 1 100%', md: '1 1 30%' },
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <Box sx={{ p: 2, border: `1px solid ${borderColor}`, borderRadius: 2 }}>
                            <QRCodeSVG value={pixKey} size={200} level="H" />
                        </Box>
                    </Box>

                    <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 70%' } }}>
                        <Typography variant="h6" gutterBottom>
                            Escaneie o QR Code ou use o código PIX abaixo:
                        </Typography>

                        <Box sx={{ mt: 2, mb: 3 }}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                value={pixKey}
                                InputProps={{
                                    readOnly: true,
                                    endAdornment: (
                                        <Button
                                            variant="contained"
                                            color={copied ? 'success' : 'primary'}
                                            onClick={handleCopy}
                                            startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
                                            sx={{ px: 3 }}
                                        >
                                            {copied ? 'Copiado' : 'Copiar'}
                                        </Button>
                                    ),
                                }}
                            />
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                            1. Abra o aplicativo do seu banco
                            <br />
                            2. Escolha a opção de pagamento por PIX
                            <br />
                            3. Escaneie o QR Code ou cole o código PIX
                            <br />
                            4. Confirme as informações e finalize o pagamento
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ mt: 4, p: 2, borderRadius: 1, bgcolor: mode == 'light' ? 'background.default' : "", boxShadow: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        Informações do pagamento:
                    </Typography>
                    <Typography variant="body2">
                        Valor: R$ 10,00
                        <br />
                        Beneficiário: Recipient Name
                        <br />
                        Identificação: Pedido #12345
                    </Typography>
                </Box>
            </Paper>

            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    Código PIX copiado com sucesso!
                </Alert>
            </Snackbar>
        </Container>
    );
}