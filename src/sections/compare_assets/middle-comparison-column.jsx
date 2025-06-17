import React, { useState } from 'react';
import { Box, Paper, Card, Grid, Typography, Tooltip, IconButton } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

export function MiddleComparisonColumn({ _width = '20%', title, description }) {
    return (
        <Paper elevation={3} sx={{ width: _width, padding: 2.5, textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', fontSize: { xs: 13, md: 15 } }}>
            {title}
            <Tooltip title={description}>
                <IconButton sx={{ position: 'absolute', top: 3, right: 3 }}>
                    <HelpOutlineIcon sx={{ fontSize: { xs: 12, md: 15 } }} />
                </IconButton>
            </Tooltip>
        </Paper>
    );
}