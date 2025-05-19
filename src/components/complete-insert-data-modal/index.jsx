import React, { useEffect, useState } from 'react';
import { Box, Dialog, DialogTitle, DialogContent, Table, TableRow, TableCell, TextField, InputAdornment, DialogActions, Button, TableBody, Tooltip, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Scrollbar } from '../scrollbar';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { TableHeadCustom, TableNoData } from '../table';

export function CompleteInsertDataModal({ data = [], onClose, open, onSave }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(
        data.map(item => ({
            issuer: item.issuer || '',
            investment_type: item.investment_type || 'CDB',
            amount: item.amount || 1100,
            indexer: item.indexer || 'PRE_FIXED',
            indexation_type: item.indexation_type || 'CDI',
            transaction_date: item.date || new Date().toISOString().split('T')[0],
            expiration_date: item.expiration_date || new Date().toISOString().split('T')[0],
            indexer_rate: item.indexer_rate || 0,
            transaction_type: item.transaction_type,
        })) || []
    );

    const [error, setError] = useState(false);

    useEffect(() => {
        setFormData(
            data.map(item => ({
                issuer: item.issuer || '',
                investment_type: item.investment_type || 'CDB',
                amount: item.amount || 1100,
                indexer: item.indexer || 'PRE_FIXED',
                indexation_type: item.indexation_type || 'CDI',
                transaction_date: item.date || new Date().toISOString().split('T')[0],
                expiration_date: item.expiration_date || new Date().toISOString().split('T')[0],
                indexer_rate: item.indexer_rate || 0,
                transaction_type: item.transaction_type,
            })) || []
        );
    }, [data]);

    const handleInputChange = (index, field, value) => {
        const updatedData = [...formData];
        updatedData[index] = {
            ...updatedData[index],
            [field]: value
        };
        setFormData(updatedData);
    };

    const getHelperTextIndexerRate = (indexer) => {
        if (indexer === 'CDI+') {
            return 'Informe a taxa pré-fixada do componente CDI+. Por exemplo: CDI + 4,00%.';
        } else if (indexer === 'IPCA+') {
            return 'Informe aqui a taxa anual a ser aplicada, além do IPCA. Exemplo: /,00%.';
        }
        return 'Informe aqui quantos % do CDI esse investimento está pagando. Por exemplo: 116,00%';
    }

    const handleSave = async () => {
        setError(false);
        setLoading(true);

        const isValid = formData.every(item => {
            return Object.values(item).every(value => value !== '' && value !== null && value !== undefined);
        });

        if (!isValid) {
            setError(true);
            return;
        }

        await onSave(formData);

        setLoading(false);
        onClose();
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
            <DialogTitle>Conferindo dados de Renda Fixa <i>(tudo certo com os dados de Renda Variável)</i></DialogTitle>
            <DialogContent>
                <Box sx={{ position: 'relative' }}>
                    <Scrollbar>
                        <Table size={'small'} sx={{ minWidth: 960 }}>
                            <TableHeadCustom
                                headCells={[
                                    { id: 'issuer', label: 'Emissor', alignRight: false },
                                    { id: 'investment_type', label: 'Tipo de investimento', alignRight: false },
                                    { id: 'indexation_type', label: 'Tipo de Indexação', alignRight: false },
                                    { id: 'amount', label: 'Valor', alignRight: false },
                                    { id: 'transaction_date', label: 'Data de compra', alignRight: false },
                                    { id: 'expiration_date', label: 'Data de vencimento', alignRight: false },
                                    { id: 'indexer', label: 'Indexador', alignRight: false },
                                    { id: 'indexer_rate', label: 'Taxa de indexação', alignRight: false },

                                ]}
                            />
                            <TableBody>
                                {formData.map((row, index) => (
                                    <TableRow hover tabIndex={-1} key={index}>
                                        <TableCell align="left" sx={{ width: 170 }}>
                                            <TextField
                                                fullWidth
                                                value={row.issuer}
                                                onChange={(e) => handleInputChange(index, 'issuer', e.target.value)}
                                                error={false}
                                                helperText={""}
                                            />
                                        </TableCell>

                                        <TableCell align="left" sx={{ width: 170 }}>
                                            <TextField
                                                select
                                                value={row.investment_type}
                                                onChange={(e) => handleInputChange(index, 'investment_type', e.target.value)}
                                                fullWidth
                                                slotProps={{
                                                    select: {
                                                        native: true,
                                                    }
                                                }}
                                            >
                                                <option value="CDB">CDB</option>
                                                <option value="LCI">LCI</option>
                                                <option value="LCA">LCA</option>
                                                <option value="LC">LC</option>
                                                <option value="LF">LF</option>
                                                <option value="RDB">RDB</option>
                                                <option value="DEBENTURE">Debênture</option>
                                                <option value="CRI">CRI</option>
                                                <option value="CRA">CRA</option>
                                                <option value="CCB">CCB</option>
                                            </TextField>
                                        </TableCell>

                                        <TableCell align="left" sx={{ width: 170 }}>
                                            <TextField
                                                select
                                                value={row.indexation_type}
                                                onChange={(e) => handleInputChange(index, 'indexation_type', e.target.value)}
                                                fullWidth
                                                slotProps={{
                                                    select: {
                                                        native: true,
                                                    }
                                                }}
                                            >
                                                <option value="PRE_FIXED">Pré-fixado</option>
                                                <option value="POST_FIXED">Pós-fixado</option>
                                            </TextField>
                                        </TableCell>

                                        <TableCell align="left" sx={{ width: 170 }}>
                                            <TextField
                                                fullWidth
                                                type="number"
                                                value={row.amount}
                                                onChange={(e) => handleInputChange(index, 'amount', e.target.value)}
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start">{"R$"}</InputAdornment>,
                                                }}
                                                error={false}
                                                helperText={""}
                                            />
                                        </TableCell>

                                        <TableCell align="left">
                                            <TextField
                                                fullWidth
                                                type="date"
                                                value={row.transaction_date}
                                                onChange={(e) => handleInputChange(index, 'transaction_date', e.target.value)}
                                                InputLabelProps={{ shrink: true }}
                                            />
                                        </TableCell>

                                        <TableCell align="left">
                                            <TextField
                                                fullWidth
                                                type="date"
                                                value={row.expiration_date}
                                                onChange={(e) => handleInputChange(index, 'expiration_date', e.target.value)}
                                                InputLabelProps={{ shrink: true }}
                                            />
                                        </TableCell>

                                        <TableCell align="left" sx={{ width: 170 }}>
                                            <TextField
                                                select
                                                value={row.indexer}
                                                onChange={(e) => handleInputChange(index, 'indexer', e.target.value)}
                                                fullWidth
                                                slotProps={{
                                                    select: {
                                                        native: true,
                                                    }
                                                }}
                                            >
                                                <option value="CDI">CDI</option>
                                                <option value="CDI+">CDI+</option>
                                                <option value="IPCA+">IPCA+</option>
                                            </TextField>
                                        </TableCell>

                                        <TableCell align="left">
                                            <TextField
                                                fullWidth
                                                type="number"
                                                value={row.indexer_rate}
                                                onChange={(e) => handleInputChange(index, 'indexer_rate', e.target.value)}
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start">%</InputAdornment>,
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <Tooltip
                                                                title={getHelperTextIndexerRate(row.indexer)}
                                                                arrow
                                                                placement="top"
                                                            >
                                                                <IconButton size="small">
                                                                    <HelpOutlineIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableNoData notFound={formData.length === 0} />
                            </TableBody>
                        </Table>
                    </Scrollbar>
                </Box>
            </DialogContent>
            <DialogActions sx={{ display: 'flex', alignItems: 'center' }}>
                {error && <Typography variant="body2" color="error" sx={{ fontSize: { xs: '12px', sm: '14px', md: '16px' }, mr: 3 }}>
                    * Preencha todos os campos para continuar.
                </Typography>}
                <Button onClick={onClose} variant='outlined' color='error'>Cancelar</Button>
                <Button onClick={handleSave} variant='contained' color='primary'
                    loading={loading}
                    loadingPosition="start"
                >Finalizar</Button>
            </DialogActions>
        </Dialog>
    );
}
