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
                    {data !== undefined ? (data * 100).toFixed(2).toString().replace('.', ',') + '%' : '-'}
                </Typography>
                <Typography variant="subtitle2">{label}</Typography>
            </Box>
        </TableCell>
    );
}

export function VerticalTable({ tickerData }) {
    return (
        <>
            {tickerData ?
                <Box sx={{ mt: 2 }}>
                    <TableContainer component={Paper} elevation={3}>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell align="center">Rentabilidade</TableCell>
                                    <TableCellProftability label='1 mês' data={tickerData?.proftability.proftability.last_month} />
                                    <TableCellProftability label='3 meses' data={tickerData?.proftability.proftability.last_three_months} />
                                    <TableCellProftability label='12 meses' data={tickerData?.proftability.proftability.last_twelve_months} />
                                    <TableCellProftability label='2 anos' data={tickerData?.proftability.proftability.last_two_years} />
                                    <TableCellProftability label='5 anos' data={tickerData?.proftability.proftability.last_five_years} />
                                    <TableCellProftability label='10 anos' data={tickerData?.proftability.proftability.last_ten_years} />
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
                                    <TableCellProftability label='1 mês' data={tickerData?.proftability.real_proftability.last_month} />
                                    <TableCellProftability label='3 meses' data={tickerData?.proftability.real_proftability.last_three_months} />
                                    <TableCellProftability label='12 meses' data={tickerData?.proftability.real_proftability.last_twelve_months} />
                                    <TableCellProftability label='2 anos' data={tickerData?.proftability.real_proftability.last_two_years} />
                                    <TableCellProftability label='5 anos' data={tickerData?.proftability.real_proftability.last_five_years} />
                                    <TableCellProftability label='10 anos' data={tickerData?.proftability.real_proftability.last_ten_years} />
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