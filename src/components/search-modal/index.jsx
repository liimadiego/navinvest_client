import React, { useState } from 'react';
import { Box, Modal, Paper, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { TickerSelector } from '../ticker-selector';
import { useNavigate } from 'react-router-dom';

export function SearchModal({ isOpen, handleClose }) {
    const [selectedTickers, setSelectedTickers] = useState([]);
    const navigate = useNavigate();

    const onAddTicker = (ticker) => {
        navigate(`/dashboard/detalhes-ativo/${ticker}`);
        handleClose();
    }

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            BackdropProps={{
                onClick: handleClose,
            }}

            sx={{
                backdropFilter: 'blur(2px)',
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    width: 1000,
                    minHeight: 100,
                    maxWidth: '90%',
                    bgcolor: 'background.paper',
                    p: "5px 5px",
                    margin: 'auto',
                    mt: '10%',
                    position: 'relative',
                    borderRadius: 1
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 5, top: 5, zIndex: 2 }}>
                    <CloseIcon />
                </IconButton>
                <Typography sx={{ padding: "10px 30px", paddingTop: "35px", opacity: .7, textAlign: "center" }} variant="h6" gutterBottom>
                    Busque pelo ativo de seu interesse para visualizar a cotação, indicadores e gráficos.
                </Typography>
                <Paper sx={{ paddingX: "5%", paddingBottom: "35px" }}>
                    <TickerSelector onAddTicker={onAddTicker} selectedTickers={selectedTickers} placeholder="Buscar ativo" openModalTrigger={isOpen} />
                </Paper>

            </Paper>
        </Modal>
    );
};