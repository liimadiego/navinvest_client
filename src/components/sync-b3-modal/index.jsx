import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Typography,
} from '@mui/material';
import { useWallet } from 'src/context/WalletContext';
import { useWallets } from 'src/context/WalletsContext';
import { Circle, VerifiedUser } from '@mui/icons-material';

import { formatCpf } from 'src/utils/cpf.js';

export default function SyncB3Modal({ 
    open, 
    errors, 
    userCpf, 
    isLoading = false, 
    b3UserAuthorization,

    onClose, 
    handleSyncB3Sumbit, 
    handleUserCpfSubmit, 
    openB3AuthorizationPopup 
}) {
    const { _wallets } = useWallets();
    const { currentWallet } = useWallet();
    
    const [cpf, setCpf] = useState(formatCpf(userCpf));
    const [wallet, setWallet] = useState(currentWallet?.id);

    useEffect(() => {
        setWallet(currentWallet?.id);
    }, [ currentWallet ]);

    const handleSetCpf = (value) => {
        setCpf(formatCpf(value));
    };

return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle align='center'>Sincronização de portfólio</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    disabled={!!userCpf}
                    error={!!errors.cpf}
                    helperText={errors.cpf}
                    label="CPF do usuário"
                    type="text"
                    value={cpf || ''}
                    onChange={e => handleSetCpf(e.target.value)}
                    placeholder="000.000.000-00"
                    inputProps={{ maxLength: 14 }}
                    sx={{ 
                        mt: 1,
                        mb: userCpf ? 2 : 1
                    }}
                />
                
                {userCpf && <TextField 
                    select
                    label="Carteira selecionada"
                    disabled={!userCpf || isLoading}
                    value={wallet}
                    onChange={(e) => setWallet(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                    slotProps={{
                        select: {
                            native: true,
                        }
                    }}
                >
                    {_wallets.map((w, i) => 
                    <option key={i} value={w.id}>
                        {w.name}
                    </option>)}
                </TextField>}

                {userCpf && <Button
                    variant={b3UserAuthorization ? "outlined" : "contained"}
                    disabled={!userCpf || isLoading || b3UserAuthorization}
                    onClick={(!b3UserAuthorization) ? openB3AuthorizationPopup : undefined}
                    color={b3UserAuthorization ? "success" : "primary"}
                    startIcon={(
                        b3UserAuthorization ?
                        <Circle color={b3UserAuthorization ? "success" : "disabled"} sx={{ width: '12px' }} /> : 
                        <VerifiedUser sx={{ mr: 1 }} />
                    )}
                    sx={(theme) => ({
                        px: 4,
                        width: '100%',
                        height: 50,
                        color: '#fff',
                        borderColor: theme.palette.primary.main,
                        '&:hover': {
                            backgroundColor: theme.palette.primary.dark,
                        },
                        '&.Mui-disabled': {
                            color: b3UserAuthorization ? theme.palette.success.main : '#fff',
                        }
                    })}
                >
                    {(b3UserAuthorization ? "Sincronização autorizada" : "Autorizar sincronização com a B3")}
                </Button>}
                

            </DialogContent>

            <DialogActions>
                <Button 
                onClick={onClose} 
                color="inherit">
                    Cancelar
                </Button>
                <Button 
                disabled={(userCpf && !b3UserAuthorization) || isLoading}
                loading={isLoading} 
                loadingPosition="end" 
                variant="contained" 
                onClick={() => userCpf ? handleSyncB3Sumbit(wallet) : handleUserCpfSubmit(cpf)}
                color="primary">
                    {userCpf ? "Sincronizar" : "Definir CPF"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}