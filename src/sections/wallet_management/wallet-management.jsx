import { useState, useCallback } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
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
    { id: 'variation', label: 'Variação', alignRight: false },
    { id: 'options', label: 'Opções', alignRight: false },
];

// ----------------------------------------------------------------------

export function WalletManagement({ _tableData, sx, accordionOpened = false }) {
    const table = useTable();

    const [tableData, setTableData] = useState(_tableData);

    const dataInPage = rowInPage(tableData, table.page, table.rowsPerPage);

    const notFound = !tableData.length;

    const handleDeleteRow = useCallback(
        (id) => {
            const deleteRow = tableData.filter((row) => row.id !== id);

            toast.success('Delete success!');

            setTableData(deleteRow);

            table.onUpdatePageDeleteRow(dataInPage.length);
        },
        [dataInPage.length, table, tableData]
    );

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
                        <Box display={'flex'} justifyContent={'space-between'} width={'100%'} alignItems={'center'}>
                            <Box display={'flex'} flex={1} alignItems={'center'}>
                                <Typography sx={{ mr: 2, fontSize: '16pt' }}>Ações</Typography>
                                <Typography sx={{ fontStyle: 'italic', transform: 'translateY(1px)' }}>9 ativos</Typography>
                            </Box>
                            <Box display={'flex'} flex={1.5} justifyContent={'flex-end'} alignItems={'center'}>
                                <Typography sx={{ mr: 1 }}>Valor total:</Typography>
                                <Typography sx={{ fontWeight: 'bold' }}>R$ 9.365,72</Typography>
                            </Box>
                            <Box display={'flex'} flex={1} justifyContent={'flex-end'} alignItems={'center'}>
                                <Typography sx={{ mr: 1 }}>Variação:</Typography>
                                <Typography
                                    color={
                                        (0.0173 > 0 && 'success') ||
                                        (0.0173 < 0 && 'error') ||
                                        (row.status === 0 && 'default')
                                    }
                                >
                                    {`${0.0173 * 100}%`}
                                </Typography>
                            </Box>
                            <Box display={'flex'} flex={2} justifyContent={'flex-end'}>
                                <Typography sx={{ mr: 1 }}>% NA CARTEIRA:</Typography>
                                <Typography sx={{ mr: 1, fontWeight: 'bold' }}>33,20%</Typography>
                                <Typography>(Meta: 40%)</Typography>
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
                                            .slice(
                                                table.page * table.rowsPerPage,
                                                table.page * table.rowsPerPage + table.rowsPerPage
                                            )
                                            .map((row) => (
                                                <WalletTableRow
                                                    key={row.id}
                                                    row={row}
                                                    onDeleteRow={() => handleDeleteRow(row.id)}
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

                        <TablePaginationCustom
                            page={table.page}
                            count={tableData.length}
                            rowsPerPage={table.rowsPerPage}
                            onPageChange={table.onChangePage}
                            onChangeDense={table.onChangeDense}
                            onRowsPerPageChange={table.onChangeRowsPerPage}
                        />
                    </AccordionDetails>
                </Accordion>
            </Card>
        </Box>
    );
}
