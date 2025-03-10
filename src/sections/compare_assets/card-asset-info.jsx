import React from 'react';
import { Box, Paper, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export function CardAssetInfo({ assetInfo, onDelete = () => { } }) {

    return (
        <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
            <Box width={"100%"} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                <Box display={'flex'} alignItems={'center'}>
                    {assetInfo.image_url && (
                        <img src={assetInfo.image_url}
                            style={{ width: 40, height: 40, marginRight: 12 }}
                            alt={assetInfo.name}
                        />
                    )}
                    <Typography mb={0}>
                        {assetInfo.name}
                        {assetInfo.companyName && ` - ${assetInfo.companyName}`}
                        {assetInfo.last_twelve_months && (
                            <span>
                                <span style={{ fontSize: '12px', color: assetInfo.last_twelve_months > 0 ? 'green' : 'red' }}>
                                    {assetInfo.last_twelve_months > 0 ? '+' : ''}{(assetInfo.last_twelve_months * 100).toFixed(2)}%
                                    <span style={{ color: assetInfo.last_twelve_months > 0 ? 'green' : 'red', marginLeft: "2px" }}>
                                        {assetInfo.last_twelve_months > 0 ? '↑' : '↓'}
                                    </span>
                                </span>
                                <span style={{ fontSize: '11px', opacity: .7 }}> (12 meses)</span>
                            </span>
                        )}
                    </Typography>
                </Box>
                {onDelete && <IconButton edge="end" aria-label="delete" onClick={() => onDelete()}>
                    <DeleteIcon />
                </IconButton>}
            </Box>
        </Paper>
    );
};