import { useEffect, useState } from 'react';
import { WalletManagement } from '../wallet-management';
import { _userList } from 'src/_mock';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import { Button, Box, Typography, Skeleton } from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import AddEditTransactionModal from 'src/components/add-edit-transaction-modal';
import { useWallet } from 'src/context/WalletContext';
import ChillWoman2 from 'src/assets/characters/character-8.webp';
import ChillWoman from 'src/assets/characters/character-3.webp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import { AddCircle } from '@mui/icons-material';

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
    const navigate = useNavigate();
    const [tableData, setTableData] = useState([]);
    const [transactionModal, setTransactionModal] = useState(false);
    const { currentWallet } = useWallet();
    const [isLoading, setIsLoading] = useState(true);
    const [isTransactionModalLoading, setIsTransactionModalLoading] = useState(false);

    const handleOpenTransactionModal = () => {
        setTransactionModal(true);
    }

    const handleCloseTransactionModal = () => {
        setTransactionModal(false);
    }

    const handleSeeIndividualTransactions = () => {
        navigate(paths.dashboard.wallet_management_individual_transactions);
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

        fetch(`${import.meta.env.VITE_SERVER_URL2}/portfolio-transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "portfolio_id": currentWallet.id,
                "treasury_id": isTreasury ? transaction.tickerInfo.id : null,
                "ticker_id": !isFixedIncome && !isTreasury ? transaction.tickerInfo.id : null,
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
            }),
        })
            .then(response => response.json())
            .then(async (data) => {
                setTransactionModal(false);
                fetchTableData(currentWallet?.id);
                setIsTransactionModalLoading(false);
            })
            .catch(error => {
                console.error('Error saving transaction:', error);
                setIsTransactionModalLoading(false);
            });
    }

    const fetchTableData = wallet_id => {
        setIsLoading(true);
        if (!wallet_id) {
            setTableData([]);
            setIsLoading(false);
            return;
        }

        fetch(`${import.meta.env.VITE_SERVER_URL2}/portfolio-transactions/consolidated-transactions/${wallet_id}`)
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
                            total_amount: row.total_amount,
                            current_value: parseFloat(row.current_value),
                        });
                    });
                    formatted_arr[group.category].category_summary = calculateCategorySummary(group.assets, data);
                });

                setTableData(formatted_arr);
                setIsLoading(false);
            }).catch(error => {
                console.error('Error fetching table data:', error);
                setIsLoading(false);
            });
    }

    const ShowWarningImageAndMessage = ({ image, title, message, imageSx }) => {
        return (
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                sx={{ mt: 5 }}
            >
                <img src={image} alt={message} height={250} style={{ ...imageSx }} />
                <Box textAlign="center">
                    <Typography
                        sx={{ fontWeight: 600, fontSize: 22, mt: 2, mb: 1, color: 'text.secondary' }}
                    >{title}
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ color: 'text.secondary' }}
                    >{message}
                    </Typography>

                </Box>
            </Box>
        );
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
                    <>
                        {currentWallet?.id && Object.keys(tableData).length > 0 && <Button
                            onClick={handleSeeIndividualTransactions}
                            variant="contained"
                            startIcon={<VisibilityIcon />}
                        >
                            Ver lançamentos
                        </Button>}
                        {currentWallet?.id && <Button
                            onClick={handleOpenTransactionModal}
                            variant="contained"
                            startIcon={<AddCircle />}
                        >
                            Adicionar lançamento
                        </Button>}
                    </>
                }
                sx={{ mb: { xs: 3, md: 5 } }}
            />
            {currentWallet?.id ?
                <>
                    {!isLoading ? <Box display="flex" flexDirection="column" gap={2}>
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
                            <ShowWarningImageAndMessage
                                image={ChillWoman}
                                imageSx={{ transform: 'translateX(20px)' }}
                                title="Quase lá! Só falta um passo"
                                message="Adicione lançamentos na sua carteira para visualizar os dados"
                            />
                        )}
                    </Box> : <Skeleton variant="rectangular" width={'100%'} height={500} sx={{ borderRadius: 2 }} />}

                    <AddEditTransactionModal isLoading={isTransactionModalLoading} open={transactionModal} onClose={handleCloseTransactionModal} onSave={handleSaveTransaction} />
                </> :

                <ShowWarningImageAndMessage
                    image={ChillWoman2}
                    title="Nenhuma carteira selecionada"
                    message='Crie uma nova carteira clicando em "Criar carteira" no topo da página para começar a visualizar os dados'
                />
            }

        </DashboardContent>
    );
}
