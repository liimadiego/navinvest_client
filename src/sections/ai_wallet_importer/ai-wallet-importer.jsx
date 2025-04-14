import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { Upload } from 'src/components/upload';
import { Iconify } from 'src/components/iconify';
import { Paper, Typography, Snackbar, Alert } from '@mui/material';
import { useWallet } from 'src/context/WalletContext';

export function AiWalletImporter({ }) {
    const { currentWallet } = useWallet();
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'info'
    });

    const handleDrop = useCallback(
        (acceptedFiles) => {
            setFiles([...files, ...acceptedFiles]);
        },
        [files]
    );

    const handleUpload = async () => {
        if (files.length === 0) {
            setNotification({
                open: true,
                message: 'Nenhum arquivo selecionado',
                severity: 'warning'
            });
            return;
        }

        try {
            setLoading(true);

            const walletId = currentWallet?.id;

            if (!walletId) {
                setNotification({
                    open: true,
                    message: 'Nenhum wallet selecionada',
                    severity: 'warning'
                });
                return;
            }

            const formData = new FormData();
            files.forEach((file) => {
                formData.append("file0", file);
            });


            const response = await fetch(`${import.meta.env.VITE_SERVER_URL2}/portfolio-transactions/import-wallet/${walletId}`, {
                method: 'POST',
                body: formData,
            }).then((res) => {
                return res.json()
            }).then((data) => {
                if (data.statusCode === 400 || data.statusCode === 500 || data.statusCode === 404) {
                    setNotification({
                        open: true,
                        message: `Erro ao importar arquivos: ${data.message}`,
                        severity: 'error'
                    });
                    return;
                }

                setNotification({
                    open: true,
                    message: 'Arquivos importados com sucesso!',
                    severity: 'success'
                });

                setFiles([]);
            }).catch((error) => {
                console.log("error", error)
                setNotification({
                    open: true,
                    message: `Erro ao importar arquivos: ${error}`,
                    severity: 'error'
                });
            });


        } catch (error) {
            console.log(error)
            setNotification({
                open: true,
                message: `Erro ao importar arquivos: ${error}`,
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFile = (inputFile) => {
        const filtered = files.filter((file) => file !== inputFile);
        setFiles(filtered);
    };

    const handleRemoveAllFiles = () => {
        setFiles([]);
    };

    const handleCloseNotification = () => {
        setNotification({ ...notification, open: false });
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column-reverse', sm: 'column-reverse', md: 'row' }, gap: 2, mb: 4, mt: 2 }}>
            <Paper elevation={3} sx={{ p: 3, pb: 4, flex: 1 }}>
                <Box>
                    <Upload multiple value={files} onDrop={handleDrop} onRemove={handleRemoveFile} />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                        {!!files.length && (
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleRemoveAllFiles}
                                disabled={loading}
                            >
                                Remover arquivos
                            </Button>
                        )}
                        <Button
                            variant="contained"
                            startIcon={<Iconify icon="eva:cloud-upload-fill" />}
                            onClick={handleUpload}
                            disabled={loading}
                        >
                            {loading ? 'Importando...' : 'Importar Transações'}
                        </Button>
                    </Box>
                </Box>
            </Paper>
            <Paper elevation={3} sx={{ p: 3, pb: 4, flex: 1 }}>
                <Box>
                    <Typography variant="h4" gutterBottom>📥 Importe Transações da Sua Carteira com IA</Typography>

                    <Typography sx={{ fontSize: { xs: '14px', sm: '16px', md: '16px' } }}>Envie seu arquivo e deixe a IA organizar tudo para você! Com esta funcionalidade, você pode importar suas operações de forma rápida e inteligente usando uma imagem, CSV ou Excel. A IA vai identificar e converter as transações automaticamente, padronizando tudo no formato correto.</Typography>
                    <br />
                    <Typography sx={{ fontSize: { xs: '14px', sm: '16px', md: '16px' } }}>
                        ✅ Envie uma imagem, CSV ou Excel com suas operações
                        <br />🔍 A IA irá identificar os dados e validar as transações automaticamente
                        <br />🧠 Campos como Tipo de Operação, Data, Quantidade, Ticker e Preço serão reconhecidos
                        <br />🚫 Caso faltem dados obrigatórios, você será informado de forma clara
                    </Typography>

                    <Typography sx={{ fontSize: { xs: '14px', sm: '16px', md: '16px' } }}>⚠️ Se os dados estiverem confusos ou ilegíveis, a IA também te avisa!</Typography>
                    <br />

                    <Typography sx={{ fontSize: { xs: '14px', sm: '16px', md: '16px' } }}>Clique em Importar Transações e descubra como é fácil organizar suas operações com a ajuda da inteligência artificial! 🚀</Typography>
                </Box>
            </Paper>

            <Snackbar
                open={notification.open}
                autoHideDuration={30000}
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseNotification}
                    severity={notification.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}