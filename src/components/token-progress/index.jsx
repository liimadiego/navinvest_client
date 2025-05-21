import { Box, styled, Typography, Tooltip, IconButton } from "@mui/material";
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import InfoIcon from '@mui/icons-material/Info';
import { useEffect, useState } from "react";
import axios from 'src/lib/axios';
import { useTokenUsage } from 'src/context/TokenUsage';
import { useAuthContext } from "src/auth/hooks";

export function TokenProgress({ sx = {} }) {
    const { user } = useAuthContext();
    const userHasPlan = user?.plan !== null;
    const { _tokenUsage, setTokenUsage } = useTokenUsage();
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (userHasPlan) {
            axios.get('/users/token-usage')
                .then((response) => {
                    if ((response.data.tokens_used * 100) > 100) {
                        setProgress(100);
                        setTokenUsage(100);
                    } else {
                        setProgress(parseInt(response.data.tokens_used * 100));
                        setTokenUsage(parseInt(response.data.tokens_used * 100));
                    }

                    setError(null);
                })
                .catch((error) => {
                    setError(error.response.data.message);
                });
        }
    })

    const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
        height: 8,
        borderRadius: 5,
        [`&.${linearProgressClasses.colorPrimary}`]: {
            backgroundColor: theme.palette.grey[300],
            ...theme.applyStyles('dark', {
                backgroundColor: theme.palette.grey[700],
            }),
        },
        [`& .${linearProgressClasses.bar}`]: {
            borderRadius: 5,
        },
    }));

    return (
        error === null && userHasPlan ?
            <Box sx={{ display: 'flex', alignItems: 'center', ...sx }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title="Este indicador mostra quanto do seu limite mensal de uso da inteligência artificial você já utilizou. Cada interação com a IA consome uma quantidade de tokens. Quando atingir 100%, você precisará aguardar a renovação no próximo mês ou mudar de plano para continuar usando.">
                        <IconButton sx={{ mr: 0, transform: 'scale(0.7) translate(5px, -1px)' }}>
                            <InfoIcon />
                        </IconButton>
                    </Tooltip>
                    <Typography
                        sx={{
                            display: { sm: 'block' },
                            color: 'text.secondary',
                            fontWeight: 500,
                            fontSize: '0.725rem',
                            mr: .5
                        }}
                    >
                        Uso de IA
                    </Typography>
                </Box>
                <Typography
                    sx={{
                        display: { sm: 'block' },
                        color: 'text.secondary',
                        fontWeight: 500,
                        fontSize: '0.725rem',
                        mr: 1.5
                    }}
                >
                    {progress}%
                </Typography>
                <Box sx={{ width: '90px', height: '10px', borderRadius: '5px' }}>
                    <BorderLinearProgress variant="determinate" value={progress} />
                </Box>
            </Box> :
            <></>
    )
}