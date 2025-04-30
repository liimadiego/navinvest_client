import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
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

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'investment_type', label: 'Tipo de investimento', align: 'left' },
    { id: 'asset', label: 'Ativo', align: 'left' },
    { id: 'order_type', label: 'Tipo de ordem', align: 'left' },
    { id: 'transaction_date', label: 'Data de negociação', align: 'left' },
    { id: 'quantity', label: 'Quantidade', align: 'left' },
    { id: 'unit_price', label: 'Preço unitário', align: 'left' },
    { id: 'total_value', label: 'Valor total', align: 'left' },
    { id: 'source', label: 'Fonte', align: 'left' },
    { id: 'actions', label: 'Ações', align: 'left' },
];

export function WalletManagement({ _tableData, sx }) {
    const table = useTable();

    const [tableData, setTableData] = useState(_tableData);

    useEffect(() => {
        setTableData(_tableData);
    }, [_tableData]);

    const notFound = !tableData.length;

    return (
        <Box sx={{ ...sx }}>
            <Card>
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

                            {/* <TableEmptyRows
                                height={56}
                                emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                            /> */}

                            <TableNoData notFound={notFound} />
                        </TableBody>
                    </Table>
                </Scrollbar>
            </Card>
        </Box>
    );
}
