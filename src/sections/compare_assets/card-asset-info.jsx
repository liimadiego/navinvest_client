import React from 'react';
import { Box, Paper, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export function CardAssetInfo({ assetInfo, onDelete = () => { }, inComparison = false, side = 'left' }) {

    const image_content = (assetInfo) => (
        <img src={assetInfo.image_url}
            style={{ width: 40, height: 40, borderRadius: 4 }}
            alt={assetInfo.name}
        />
    );

    return (
        <Paper elevation={4} sx={{ padding: 2, marginTop: inComparison ? 0 : 2 }}>
            <Box width={"100%"} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                <Box width={"100%"} display={'flex'} alignItems={'center'} justifyContent={side == 'left' ? 'flex-start' : 'flex-end'}>
                    {assetInfo.image_url && side == 'left' && image_content(assetInfo)}
                    <Typography mb={0} style={{ marginRight: side !== 'left' ? 12 : 0, marginLeft: side === 'left' ? 12 : 0, fontSize: "14px" }}>
                        {!inComparison && assetInfo.name}
                        {assetInfo.companyName && `${!inComparison ? " - " : ""} ${assetInfo.companyName}`}
                        {!inComparison && assetInfo.last_twelve_months && (
                            <>
                                <br />
                                <span>
                                    <span style={{ fontSize: '12px', color: assetInfo.last_twelve_months > 0 ? 'green' : 'red' }}>
                                        {assetInfo.last_twelve_months > 0 ? '+' : ''}{(assetInfo.last_twelve_months * 100).toFixed(2)}%
                                        <span style={{ color: assetInfo.last_twelve_months > 0 ? 'green' : 'red', marginLeft: "2px" }}>
                                            {assetInfo.last_twelve_months > 0 ? '↑' : '↓'}
                                        </span>
                                    </span>
                                    <span style={{ fontSize: '11px', opacity: .7 }}> (12 meses)</span>
                                </span>
                            </>
                        )}
                    </Typography>
                    {assetInfo.image_url && side == 'right' && image_content(assetInfo)}
                </Box>
                {!inComparison && onDelete && <IconButton edge="end" aria-label="delete" onClick={() => onDelete()}>
                    <DeleteIcon />
                </IconButton>}
            </Box>
        </Paper >
    );
};