import { useEffect, useState } from 'react';
import { _userList } from 'src/_mock';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import { Button, Box, Table, TableBody, Skeleton } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';
import AddEditTransactionModal from 'src/components/add-edit-transaction-modal';
import { useWallet } from 'src/context/WalletContext';
import Interrogacao from 'src/assets/characters/character-6.webp';
import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';
import { WalletTableRow } from '../wallet-table-row';
import { useNavigate } from 'react-router-dom';
import axios from 'src/lib/axios';

export function WalletManagementIndividualTransactionsView() {
    const [tableData, setTableData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [transactionModal, setTransactionModal] = useState(false);
    const { currentWallet } = useWallet();
    const navigate = useNavigate();
    const [isTransactionModalLoading, setIsTransactionModalLoading] = useState(false);

    useEffect(() => {
        if (!currentWallet?.id && !isLoading) {
            navigate(paths.dashboard.wallet_management);
        }
    }, [currentWallet, isLoading, navigate]);

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

    const handleDeleteTransaction = (transactionId) => {
        if (!currentWallet?.id || !transactionId) {
            return;
        }

        axios.delete(`/portfolio-transactions/${transactionId}`)
            .then(() => {
                fetchTableData(currentWallet?.id);
            })
            .catch(error => {
                console.error('Error deleting transaction:', error);
            });
    }

    const handleSaveTransaction = (transaction) => {
        setIsTransactionModalLoading(true);
        if (!currentWallet?.id || !transaction) {
            setIsTransactionModalLoading(false);
            return;
        }

        transaction = transaction.data;

        const isFixedIncome = transaction.asset_type === 'FIXED_INCOME';
        const isTreasury = transaction.asset_type === 'TREASURY';

        axios.post(`/portfolio-transactions`, {
            "portfolio_id": currentWallet.id,
            "ticker_id": !isFixedIncome && !isTreasury ? transaction.tickerInfo.id : null,
            "treasury_id": isTreasury ? transaction.tickerInfo.id : null,
            "asset_type": transaction.asset_type,
            "transaction_type": transaction.type,
            "amount": transaction.quantity * transaction.price,
            "price_per_unit": !isFixedIncome && !isTreasury ? transaction.price : null,
            "transaction_date": transaction.date,
            "quantity": transaction.quantity,
            "issuer": transaction.issuer || null,
            "investment_type": transaction.investment_type || null,
            "indexation_type": transaction.indexation_type || null,
            "expiration_date": transaction.expiration_date || null,
            "indexer": transaction.indexer || null,
            "indexer_rate": transaction.indexer_rate || null,
            "currency": transaction.currency || "BRL",
        })
            .then(async ({ data }) => {
                setTransactionModal(false);
                fetchTableData(currentWallet?.id);
                setIsTransactionModalLoading(false);
            })
            .catch(error => {
                setIsTransactionModalLoading(false);
                console.error('Error saving transaction:', error);
            });
    }

    const fetchTableData = wallet_id => {
        setIsLoading(true);
        if (!wallet_id) {
            setTableData([]);
            setIsLoading(false);
            return;
        }

        axios.get(`/portfolio-transactions/${wallet_id}`)
            .then(({ data }) => {
                if (Array.isArray(data)) {
                    setTableData(data);
                    setIsLoading(false);
                }
                else {
                    console.error('Error fetching data:', data);
                    toast.error('Erro ao buscar dados da carteira. Tente novamente mais tarde.');
                }
            }).catch(error => {
                console.error('Error fetching data:', error);
                toast.error('Erro ao buscar dados da carteira. Tente novamente mais tarde.');
                setIsLoading(false);
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
                            // variant="contained"
                            startIcon={<Iconify icon="mingcute:add-line" />}
                            sx={(theme) => ({
                                backgroundColor: theme.palette.primary.main,
                                color: '#fff',
                                px: 2,
                                '&:hover': {
                                    backgroundColor: theme.palette.primary.dark,
                                },
                            })}
                        >
                            Adicionar lançamento
                        </Button>
                    </>
                }
                sx={{ mb: { xs: 3, md: 5 } }}
            />
            {currentWallet?.id &&
                <>
                    {
                        !isLoading ? <Box display="flex" flexDirection="column" gap={2}>
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
                                                    onDeleteRow={() => handleDeleteTransaction(row.id)}
                                                    fetchTableData={fetchTableData}
                                                />
                                            ))}
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
                        </Box> : <Skeleton variant="rectangular" width="100%" height={400} sx={{ borderRadius: 2 }} />
                    }

                    <AddEditTransactionModal isLoading={isTransactionModalLoading} open={transactionModal} onClose={handleCloseTransactionModal} onSave={handleSaveTransaction} />
                </>}
        </DashboardContent>
    );
}
