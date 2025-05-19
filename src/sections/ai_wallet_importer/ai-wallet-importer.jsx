import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { Upload } from 'src/components/upload';
import { Iconify } from 'src/components/iconify';
import { Paper, Typography, Snackbar, Alert } from '@mui/material';
import { useWallet } from 'src/context/WalletContext';
import { CompleteInsertDataModal } from 'src/components/complete-insert-data-modal';
import axios from 'src/lib/axios';
import { useTokenUsage } from 'src/context/TokenUsage';

export function AiWalletImporter({ }) {
    const { currentWallet } = useWallet();
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tempWalletData, setTempWalletData] = useState([]);
    const [completeInsertDataModalOpen, setCompleteInsertDataModalOpen] = useState(false);
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'info'
    });
    const { tokenUsage } = useTokenUsage();
    const [isFeatureDisabled, setIsFeatureDisabled] = useState(false);

    useEffect(() => {
        if (tokenUsage >= 100) {
            setIsFeatureDisabled(true);
        }
    }, [tokenUsage]);

    const onSaveWallet = (updatedData) => {
        if (updatedData.length === 0 && tempWalletData.variable_income.length === 0) {
            setNotification({
                open: true,
                message: 'Nenhum dado para salvar',
                severity: 'warning'
            });
            return;
        }

        if (!currentWallet) {
            setNotification({
                open: true,
                message: 'Nenhuma carteira selecionada',
                severity: 'warning'
            });
            return;
        }

        const payload = {
            fixed_income: updatedData ?? [],
            variable_income: tempWalletData.variable_income ?? []
        }

        axios.post(`/portfolio-transactions/create-transaction-from-wallet-import-data/${currentWallet.id}`, { data: payload })
            .then(({ data }) => {
                if (!data.success) {
                    setNotification({
                        open: true,
                        message: `Erro ao salvar dados: ${data.message}`,
                        severity: 'error'
                    });
                    return;
                }

                setNotification({
                    open: true,
                    message: 'Dados salvos com sucesso!',
                    severity: 'success'
                });

                setCompleteInsertDataModalOpen(false);
            })
            .catch((error) => {
                setNotification({
                    open: true,
                    message: `Erro ao salvar dados: ${error}`,
                    severity: 'error'
                });
            });
    }

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
                    message: 'Nenhuma carteira selecionada (clique em `Criar carteira` no topo esquerdo)',
                    severity: 'warning'
                });
                return;
            }

            const formData = new FormData();
            files.forEach((file) => {
                formData.append("file0", file);
            });


            await axios.post(`/portfolio-transactions/import-wallet/${walletId}`, formData

            ).then(({ data }) => {
                if (!data.success) {
                    setNotification({
                        open: true,
                        message: `Erro ao importar arquivos: ${data.message}`,
                        severity: 'error'
                    });
                    return;
                }

                const { data: responseData } = data;

                if (responseData && responseData.fixed_income) {
                    setTempWalletData(responseData);
                    setCompleteInsertDataModalOpen(true);
                }

                // setNotification({
                //     open: true,
                //     message: 'Arquivos importados com sucesso!',
                //     severity: 'success'
                // });

                setFiles([]);
            }).catch((error) => {
                setNotification({
                    open: true,
                    message: `Erro ao importar arquivos: ${error}`,
                    severity: 'error'
                });
            });


        } catch (error) {
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
        <>
            {isFeatureDisabled && (
                <Alert
                    severity="warning"
                    sx={{ mt: 2 }}
                >
                    Limite de uso de IA mensal excedido. Aguarde até o próximo mês ou atualize seu plano para continuar usando o importador inteligente.
                </Alert>
            )}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column-reverse', sm: 'column-reverse', md: 'row' }, gap: 2, mb: 4, mt: 2 }}>
                <Paper elevation={3} sx={{ p: 3, pb: 4, flex: 1 }}>
                    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Upload disabled={isFeatureDisabled} multiple value={files} onDrop={handleDrop} onRemove={handleRemoveFile} />
                        {loading && <Box sx={{ mb: 3 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '12px', sm: '14px', md: '16px' } }}>
                                ⚠️ O processo de importação pode levar um ou dois minutos, dependendo do tamanho dos arquivos. Por favor, aguarde até que a importação seja concluída.
                            </Typography>
                        </Box>}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: files.length > 0 ? 0 : 3 }}>
                            {/* Aviso que demora em media 1 minuto */}
                            {!!files.length && (
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={handleRemoveAllFiles}
                                    disabled={isFeatureDisabled || loading}
                                >
                                    Remover arquivos
                                </Button>
                            )}
                            <Button
                                variant="contained"
                                startIcon={<Iconify icon="eva:cloud-upload-fill" />}
                                onClick={handleUpload}
                                disabled={isFeatureDisabled || loading}
                                loading={loading}
                                loadingPosition="end"
                            >
                                Importar Transações
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
            <CompleteInsertDataModal open={completeInsertDataModalOpen} onClose={() => { setCompleteInsertDataModalOpen(false) }} data={tempWalletData.fixed_income ? tempWalletData.fixed_income : []} onSave={onSaveWallet} />
        </>
    );
}