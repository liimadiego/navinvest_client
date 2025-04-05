import { useEffect, useState } from 'react';
import { WalletManagement } from '../wallet-management';
import { _userList } from 'src/_mock';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import { Button, Box } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';
import AddTransactionModal from '../add-transaction-modal';
import { useWallet } from 'src/context/WalletContext';
import Interrogacao from 'src/assets/characters/character-6.webp';

function calculateCategorySummary(category, fullPortfolio) {
    let totalPortfolioInvested = 0;
    let totalPortfolioCurrent = 0;

    // Calculate total portfolio values
    fullPortfolio.forEach(cat => {
        cat.assets.forEach(asset => {
            totalPortfolioInvested += asset.total_amount;
            totalPortfolioCurrent += parseFloat(asset.current_value);
        });
    });

    // Calculate category totals
    let totalInvested = 0;
    let totalCurrent = 0;

    category.forEach(asset => {
        totalInvested += asset.total_amount;
        totalCurrent += parseFloat(asset.current_value);
    });

    const percentageChange = ((totalCurrent - totalInvested) / totalInvested) * 100;
    const portfolioPercentage = (totalCurrent / totalPortfolioCurrent) * 100;

    return {
        totalInvested: parseFloat(totalInvested.toFixed(2)),
        totalCurrent: parseFloat(totalCurrent.toFixed(2)),
        percentageChange: parseFloat(percentageChange.toFixed(2)),
        portfolioPercentage: parseFloat(portfolioPercentage.toFixed(2)),
    };
}

export function WalletManagementView() {
    const [tableData, setTableData] = useState([]);
    const [transactionModal, setTransactionModal] = useState(false);
    const { currentWallet } = useWallet();

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
                let formatted_arr = [];

                data.forEach(group => {
                    if (!formatted_arr[group.category]) {
                        formatted_arr[group.category] = {
                            data: [],
                            category_summary: {},
                        };
                    }
                    group.assets.forEach(row => {
                        formatted_arr[group.category].data.push({
                            id: row.transaction_id,
                            assetImageUrl: row.asset_image_url,
                            asset: row.ticker,
                            quantity: row.total_quantity,
                            averagePrice: row.average_price,
                            currentPrice: row.current_price,
                            variation: row.variation,
                            asset_name: row.asset_name,
                            currency: row.currency,
                            percentage: row.percentage,
                            category_name: row.category_name,
                        });
                    });
                    formatted_arr[group.category].category_summary = calculateCategorySummary(group.assets, data);
                });

                setTableData(formatted_arr);
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
                    { name: 'Gerenciar carteira', href: paths.dashboard.wallet_management }
                ]}
                action={
                    <Button
                        onClick={handleOpenTransactionModal}
                        variant="contained"
                        startIcon={<Iconify icon="mingcute:add-line" />}
                    >
                        Adicionar lançamento
                    </Button>
                }
                sx={{ mb: { xs: 3, md: 5 } }}
            />
            <Box display="flex" flexDirection="column" gap={2}>
                {Object.keys(tableData).length > 0 ? (
                    Object.keys(tableData).map((category, index) => {
                        const rows = tableData[category];

                        if (!rows || rows.length === 0) return null;

                        return (
                            <WalletManagement
                                key={category}
                                _tableData={rows.data}
                                category_summary={rows.category_summary}
                                title={category}
                                percentage={0}
                                accordionOpened={index === 0}
                            />
                        );
                    })
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

            <AddTransactionModal open={transactionModal} onClose={handleCloseTransactionModal} onSave={handleSaveTransaction} />
        </DashboardContent>
    );
}
