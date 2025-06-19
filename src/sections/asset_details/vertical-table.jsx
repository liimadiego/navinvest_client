import React from 'react';
import { Box, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableRow, Tooltip, Typography } from '@mui/material';
import { IconButton } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';


const TableCellProftability = ({ data, label }) => {
    return (
        <TableCell align="center">
            <Box display="flex" flexDirection={'column'} alignItems="center">
                <Typography
                    variant="subtitle2"
                    style={{ color: data > 0 ? 'green' : data < 0 ? 'red' : 'inherit' }}
                >
                    {data !== null ? (data * 100).toFixed(2).toString().replace('.', ',') + '%' : '-'}
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 'regular' }}>{label}</Typography>
            </Box>
        </TableCell>
    );
}

export function VerticalTable({ proftability }) {
    return (
        <>
            {proftability ?
                <Box sx={{ mt: 2 }}>
                    <TableContainer component={Paper} elevation={3}>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell align="center">Rentabilidade</TableCell>
                                    <TableCellProftability label='1 mês' data={proftability.one_month?.nominal || null} />
                                    <TableCellProftability label='3 meses' data={proftability.three_months?.nominal || null} />
                                    <TableCellProftability label='12 meses' data={proftability.one_year?.nominal || null} />
                                    <TableCellProftability label='2 anos' data={proftability.two_years?.nominal || null} />
                                    <TableCellProftability label='5 anos' data={proftability.five_years?.nominal || null} />
                                    <TableCellProftability label='10 anos' data={proftability.ten_years?.nominal || null} />
                                </TableRow>
                                <TableRow>
                                    <TableCell align="center">
                                        Rentabilidade Real
                                        <Tooltip title={"Rentabilidade descontando inflação"} arrow>
                                            <IconButton sx={{ ml: "5px", p: 0 }}>
                                                <HelpOutlineIcon sx={{ fontSize: "12px" }} />
                                            </IconButton>
                                        </Tooltip>

                                    </TableCell>
                                    <TableCellProftability label='1 mês' data={proftability.one_month?.real || null} />
                                    <TableCellProftability label='3 meses' data={proftability.three_months?.real || null} />
                                    <TableCellProftability label='12 meses' data={proftability.one_year?.real || null} />
                                    <TableCellProftability label='2 anos' data={proftability.two_years?.real || null} />
                                    <TableCellProftability label='5 anos' data={proftability.five_years?.real || null} />
                                    <TableCellProftability label='10 anos' data={proftability.ten_years?.real || null} />
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box> :
                <Paper elevation={3} style={{ padding: '1rem', marginTop: '1rem' }}>
                    <Skeleton variant="rounded" width={'100%'} height={200} />
                </Paper>
            }
        </>
    );
};