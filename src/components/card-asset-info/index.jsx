import React from 'react';
import { Box, Paper, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Edit } from '@mui/icons-material';

export function CardAssetInfo({ assetInfo, onDelete = false, onEdit = false, inComparison = false, side = 'left', sx }) {

    const image_content = (assetInfo) => (
        assetInfo.image_url &&
        <img src={assetInfo.image_url}
            style={{ width: 40, height: 40, borderRadius: 4 }}
            alt={assetInfo.name}
        />
    );

    return (
        <Paper elevation={2} sx={{ padding: 2, marginTop: inComparison ? 0 : 2, ...sx }}>
            <Box
                width={"100%"}
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
                flexDirection={{ xs: 'column', sm: 'row' }}
                textAlign={{ xs: 'center', sm: 'left' }}
            >
                <Box
                    width={"100%"}
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={{ xs: 'center', sm: side === 'left' ? 'flex-start' : 'flex-end' }}
                    flexDirection={{ xs: side === 'left' ? 'column' : 'column-reverse', sm: 'row' }}
                >
                    {assetInfo.image_url && side === 'left' && image_content(assetInfo)}
                    <Box
                        sx={{
                            mb: 0,
                            mt: { xs: 1, sm: 0 },
                            mr: { xs: 0, sm: side !== 'left' && !inComparison ? 2 : 0 },
                            ml: { xs: 0, sm: side === 'left' && !inComparison ? 2 : 0 }
                        }}
                    >
                        <Box sx={{ fontSize: '14px' }} display={'flex'}>
                            {!inComparison && assetInfo.name}
                            {assetInfo.asset_name && assetInfo.type !== "treasury" && <Typography sx={{ display: { xs: 'none', sm: 'block' }, fontSize: "14px" }}>{!inComparison ? " - " : ""} {assetInfo.asset_name}</Typography>}
                        </Box>
                        {!inComparison && assetInfo.last_twelve_months && assetInfo.type !== "treasury" ? (
                            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                                <span>
                                    <span style={{ fontSize: '12px', color: assetInfo.last_twelve_months > 0 ? 'green' : 'red' }}>
                                        {assetInfo.last_twelve_months > 0 ? '+' : ''}{(assetInfo.last_twelve_months * 100).toFixed(2)}%
                                        <span style={{ color: assetInfo.last_twelve_months > 0 ? 'green' : 'red', marginLeft: "2px" }}>
                                            {assetInfo.last_twelve_months > 0 ? '↑' : '↓'}
                                        </span>
                                    </span>
                                    <span style={{ fontSize: '11px', opacity: .7 }}> (12 meses)</span>
                                </span>
                            </Box>
                        ) : <Typography sx={{ fontSize: "11px", opacity: 0.7 }}>
                            {assetInfo.indexer ? camelize(assetInfo.indexer) : ""}
                        </Typography>}
                    </Box>
                    {assetInfo.image_url && side === 'right' && image_content(assetInfo)}
                </Box>
                <Box
                    display={'flex'}
                    justifyContent={{ xs: 'center', sm: 'flex-end' }}
                    mt={{ xs: 1, sm: 0 }}
                >
                    {!inComparison && onDelete && (
                        <IconButton aria-label="delete" onClick={() => onDelete()}>
                            <DeleteIcon />
                        </IconButton>
                    )}
                    {onEdit && (
                        <IconButton aria-label="edit" onClick={() => onEdit()}>
                            <Edit />
                        </IconButton>
                    )}
                </Box>
            </Box>
        </Paper>
    );
};

function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
        if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
        return index === 0 ? match.toUpperCase() : match.toLowerCase();
    });
}