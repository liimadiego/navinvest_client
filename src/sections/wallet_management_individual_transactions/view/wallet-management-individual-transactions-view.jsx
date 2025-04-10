import { useEffect, useState } from 'react';
import { _userList } from 'src/_mock';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import { Button, Box, Table, TableBody } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';
import AddEditTransactionModal from '../add-edit-transaction-modal';
import { useWallet } from 'src/context/WalletContext';
import Interrogacao from 'src/assets/characters/character-6.webp';
import { Scrollbar } from 'src/components/scrollbar';
import { TableEmptyRows, TableHeadCustom, TableNoData, emptyRows, useTable } from 'src/components/table';
import { WalletTableRow } from '../wallet-table-row';

export function WalletManagementIndividualTransactionsView() {
    const [tableData, setTableData] = useState([]);
    const [transactionModal, setTransactionModal] = useState(false);
    const { currentWallet } = useWallet();

    const TABLE_HEAD = [
        { id: 'investment_type', label: 'Tipo', align: 'left' },
        { id: 'asset', label: 'Ativo', align: 'left' },
        { id: 'order_type', label: 'Tipo de ordem', align: 'left' },
        { id: 'transaction_date', label: 'Data de negociação', align: 'left' },
        { id: 'quantity', label: 'Quantidade', align: 'left' },
        { id: 'unit_price', label: 'Preço unitário', align: 'left' },
        { id: 'total_value', label: 'Valor total', align: 'left' },
        { id: 'source', label: 'Fonte', align: 'left' },
        { id: 'actions', label: 'Ações', align: 'left' },
    ];

    const handleOpenTransactionModal = () => {
        setTransactionModal(true);
    }
    const handleCloseTransactionModal = () => {
        setTransactionModal(false);
    }

    const handleSaveTransaction = (transaction) => {
        if (!currentWallet?.id || !transaction) {
            return;
        }

        transaction = transaction.data;

        fetch(`${import.meta.env.VITE_SERVER_URL2}/portfolio-transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({

                "portfolio_id": currentWallet.id,
                "ticker_id": 22,
                "transaction_type": transaction.type,
                "amount": transaction.quantity * transaction.price,
                "quantity": transaction.quantity,
                "price_per_unit": transaction.price,
                "transaction_date": transaction.date,
            }),
        })
            .then(response => response.json())
            .then(data => {
                setTransactionModal(false);
                fetchTableData(currentWallet?.id);
            })
            .catch(error => {
                console.error('Error saving transaction:', error);
            });
    }

    const fetchTableData = wallet_id => {
        if (!wallet_id) {
            setTableData([]);
            return;
        }

        fetch(`${import.meta.env.VITE_SERVER_URL2}/portfolio-transactions/${wallet_id}`)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setTableData(data);
                }
                else {
                    console.error('Error fetching data:', data);
                    toast.error('Erro ao buscar dados da carteira. Tente novamente mais tarde.');
                }
            }).catch(error => {
                console.error('Error fetching data:', error);
                toast.error('Erro ao buscar dados da carteira. Tente novamente mais tarde.');
            });
    }

    useEffect(() => {
        fetchTableData(currentWallet?.id);
    }, [currentWallet]);

    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading="Minha carteira"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Gerenciar carteira', href: paths.dashboard.wallet_management },
                    { name: 'Lançamentos individuais', href: paths.dashboard.wallet_management_individual_transactions },
                ]}
                action={
                    <>
                        <Button
                            onClick={handleOpenTransactionModal}
                            variant="contained"
                            startIcon={<Iconify icon="mingcute:add-line" />}
                        >
                            Adicionar lançamento
                        </Button>
                    </>
                }
                sx={{ mb: { xs: 3, md: 5 } }}
            />
            <Box display="flex" flexDirection="column" gap={2}>
                {tableData.length > 0 ? (
                    <Scrollbar>
                        <Table size={'small'} sx={{ minWidth: 960 }}>
                            <TableHeadCustom
                                headCells={TABLE_HEAD}
                                rowCount={tableData.length}
                            />
                            <TableBody>
                                {tableData.map((row, index) => (
                                    <WalletTableRow
                                        key={row.id}
                                        row={row}
                                        fetchTableData={fetchTableData}
                                    />
                                ))}

                                {/* <TableEmptyRows
                                    height={56}
                                    emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                                />

                                <TableNoData notFound={notFound} /> */}
                            </TableBody>
                        </Table>
                    </Scrollbar>
                ) : (
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        sx={{ mt: 5 }}
                    >
                        <img src={Interrogacao} alt="Sem dados disponíveis nesta carteira" width={150} />
                        <Box textAlign="center">
                            <h3>Nenhum dado disponível nesta carteira</h3>
                            <p>Adicione um lançamento para começar a visualizar os dados da sua carteira.</p>
                        </Box>
                    </Box>
                )}
            </Box>

            <AddEditTransactionModal open={transactionModal} onClose={handleCloseTransactionModal} onSave={handleSaveTransaction} />
        </DashboardContent>
    );
}
