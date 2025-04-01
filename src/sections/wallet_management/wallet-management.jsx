import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


import { toast } from 'src/components/snackbar';
import { Scrollbar } from 'src/components/scrollbar';
import {
    useTable,
    emptyRows,
    rowInPage,
    TableNoData,
    TableEmptyRows,
    TableHeadCustom,
    TablePaginationCustom,
} from 'src/components/table';

import { WalletTableRow } from './wallet-table-row';
import { Typography } from '@mui/material';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'asset', label: 'Ativo', alignRight: false },
    { id: 'quantity', label: 'Quantidade', alignRight: false },
    { id: 'averagePrice', label: 'Preço Médio', alignRight: false },
    { id: 'currentPrice', label: 'Preço Atual', alignRight: false },
    { id: 'total', label: 'Total', alignRight: false },
    { id: 'variation', label: 'Variação', alignRight: false }
];

export function WalletManagement({ _tableData, sx, accordionOpened = false, title, category_summary }) {
    const table = useTable();

    const [tableData, setTableData] = useState(_tableData);

    useEffect(() => {
        setTableData(_tableData);
    }, [_tableData]);

    const notFound = !tableData.length;

    return (
        <Box sx={{ ...sx }}>
            <Card>
                <Accordion defaultExpanded={accordionOpened}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        sx={{ px: 4, py: 1 }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: '100%',
                                alignItems: 'center',
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    flex: { xs: 1, sm: 0.5, md: 1 },
                                    alignItems: { xs: 'flex-start', sm: 'flex-start', md: 'center' },
                                    flexDirection: { xs: 'column', sm: 'column', md: 'row' },
                                }}
                            >
                                <Typography sx={{ opacity: 0.95, mr: 2, fontSize: { xs: '12pt', sm: '12pt', md: '16pt' } }}>{title}</Typography>
                                <Typography sx={{ opacity: 0.75, fontStyle: 'italic', transform: 'translateY(1px)', fontSize: { xs: '10pt', sm: '10pt', md: '12pt' }, display: { xs: 'none', sm: 'inline-block' } }}>
                                    {_tableData.length} ativo{_tableData.length > 1 ? 's' : ''}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flex: { xs: 1.7, sm: 1, md: 1.5 },
                                    flexDirection: { xs: 'column', sm: 'column', md: 'row' },
                                    justifyContent: 'flex-end',
                                    alignItems: 'center',
                                }}
                            >
                                <Typography sx={{ opacity: 0.75, mr: 1, fontSize: { xs: '10pt', sm: '10pt', md: '12pt' }, display: { xs: 'none', sm: 'inline-block' } }}>Valor total:</Typography>
                                <Typography sx={{ opacity: 0.75, fontWeight: 'bold', fontSize: { xs: '10pt', sm: '10pt', md: '12pt' } }}>{`R$${parseFloat(category_summary.totalCurrent).toFixed(2).replace('.', ',')}`}</Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flex: 1,
                                    justifyContent: { xs: 'center', sm: 'center', md: 'flex-end' },
                                    alignItems: 'center',
                                }}
                            >
                                <Typography sx={{ opacity: 0.75, mr: 1, fontSize: { xs: '10pt', sm: '10pt', md: '12pt' }, display: { xs: 'none', sm: 'inline-block' } }}>Variação:</Typography>
                                <Typography
                                    sx={{ opacity: 0.75, fontSize: { xs: '10pt', sm: '10pt', md: '12pt' } }}
                                    color={
                                        (category_summary.percentageChange > 0 && 'success') ||
                                        (category_summary.percentageChange < 0 && 'error') ||
                                        (row.status === 0 && 'default')
                                    }
                                >
                                    {`${category_summary.percentageChange ? category_summary.percentageChange.toFixed(2) : ""}%`}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flex: { xs: 1, sm: 1, md: 2 },
                                    flexDirection: { xs: 'column', sm: 'column', md: 'row' },
                                    alignItems: 'flex-end',
                                    justifyContent: 'flex-end',
                                }}
                            >
                                <Typography sx={{ opacity: 0.75, mr: 1, fontSize: { xs: '10pt', sm: '10pt', md: '12pt' }, display: { xs: 'none', sm: 'inline-block' } }}>% NA CARTEIRA:</Typography>
                                <Typography sx={{ opacity: 0.75, mr: 1, fontWeight: 'bold', fontSize: { xs: '10pt', sm: '10pt', md: '12pt' } }}>{category_summary.portfolioPercentage}%</Typography>
                                <Typography sx={{ fontSize: { xs: '10pt', sm: '10pt', md: '12pt' }, display: { xs: 'none', sm: 'inline-block' } }}>(Meta: 40%)</Typography>
                            </Box>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 0 }}>
                        <Box sx={{ position: 'relative' }}>
                            <Scrollbar>
                                <Table size={'small'} sx={{ minWidth: 960 }}>
                                    <TableHeadCustom
                                        headCells={TABLE_HEAD}
                                        rowCount={tableData.length}
                                    />
                                    <TableBody>
                                        {tableData
                                            .map((row) => (
                                                <WalletTableRow
                                                    key={row.id}
                                                    row={row}
                                                />
                                            ))}

                                        <TableEmptyRows
                                            height={56}
                                            emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                                        />

                                        <TableNoData notFound={notFound} />
                                    </TableBody>
                                </Table>
                            </Scrollbar>
                        </Box>

                        {/* <TablePaginationCustom
                            page={table.page}
                            count={tableData.length}
                            rowsPerPage={table.rowsPerPage}
                            onPageChange={table.onChangePage}
                            onChangeDense={table.onChangeDense}
                            onRowsPerPageChange={table.onChangeRowsPerPage}
                        /> */}
                    </AccordionDetails>
                </Accordion>
            </Card>
        </Box>
    );
}
