import { Box, Button, IconButton, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { SearchModal } from '../search-modal';
import { useState } from 'react';

export function NavSearch() {
    const [searchModalOpen, setSearchModalOpen] = useState(false);

    const handleCloseModalSearch = () => {
        setSearchModalOpen(false);
    };

    const handleOpenModalSearch = () => {
        setSearchModalOpen(true);
    };
    return (
        <>
            <SearchModal handleClose={handleCloseModalSearch} isOpen={searchModalOpen}></SearchModal>
            <Box sx={{ px: 2, mb: 1 }}>
                <Button
                    onClick={handleOpenModalSearch}
                    sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        pl: 1.5,
                        pb: 1,
                        pt: 1,
                        alignItems: 'center',
                        borderRadius: 1,
                        '&:hover': {
                            backgroundColor: 'rgba(145 158 171 / 0.08)',
                            cursor: 'pointer',
                            borderRadius: 1,
                        },
                    }}>
                    <SearchIcon sx={{ width: 24, height: 24, color: 'rgba(145 158 171 / 0.7)' }} />
                    <Typography
                        variant="body2"
                        sx={{
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            ml: 1,
                            color: 'text.secondary',
                        }}
                    >
                        Pesquisar Ativo
                    </Typography>
                </Button>
            </Box>
        </>
    );
}