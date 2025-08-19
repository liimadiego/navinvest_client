import { useEffect, useRef, useState } from 'react';
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
import { AddCircle, Circle, Sync } from '@mui/icons-material';
import axios from 'src/lib/axios';

import { useAuthContext } from 'src/auth/hooks';
import SyncB3Modal from 'src/components/sync-b3-modal';
import { validateCpf } from 'src/utils/cpf';

const B3_AUTHORIZATION_URL = import.meta.env.VITE_B3_AUTHORIZATION_URL;

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
    
    const [b3Modal, setB3Modal] = useState(false);
    const [b3ModaErrors, setB3ModaErrors] = useState({});
    // const [b3ModalIsLoading, setB3ModalIsLoading] = useState(false);
    
    const { user, checkUserSession } = useAuthContext();
    const [userCpf, setUserCpf] = useState(user.cpf);
    const [b3UserAuthorization, setB3UserAuthorization] = useState(false);

    const b3PopupRef = useRef(null);
    const b3PopupIntervalRef = useRef(null);

    const fetchUserAuthorization = async () => {
        setIsLoading(true);
        try {
            const { data: { authorized } } = await axios.get(`/b3-import/user-authorization`);
            setB3UserAuthorization(authorized);
        } catch (error) {
            if (!error.message === 'Usuário não possui CPF cadastrado') {
                console.error('Error fetching user authorization:', error);
            }
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchUserAuthorization();
    }, [userCpf]);

    const handleSyncB3Modal = () => {
        setB3Modal(true);
    };

    const handleCloseSyncB3ModalModal = () => {
        setB3Modal(false);
    };
    
    const handleUserCpfSubmit = async (cpf) => {
        setB3ModaErrors({});
        setIsLoading(true);
        try {
            if (!validateCpf(cpf)) {
                setB3ModaErrors({ ...b3ModaErrors, cpf: 'CPF inválido' });
            }
            const cpfNumber = cpf.replace(/\D/g, '');

            const r = await axios.post('/users/set-cpf', { cpf: cpfNumber });
            if (!r?.data?.success) throw r;

            setUserCpf(cpfNumber);

        } catch (error) {
            console.error('[E] handleUserCpfSubmit (cpf= ' + cpf + '):', error);
            setB3ModaErrors({ ...b3ModaErrors, cpf: 'Não foi possível definir o CPF no momento. Tente novamente mais tarde...' });
        }
        setIsLoading(false);
    };

    const cleanupPopup = () => {
        if (b3PopupIntervalRef.current) {
            clearInterval(b3PopupIntervalRef.current);
            b3PopupIntervalRef.current = null;
        }
        window.removeEventListener('focus', afterB3AuthorizationPopup);
        document.removeEventListener('visibilitychange', afterB3AuthorizationPopup);
        b3PopupRef.current = null;
    };

    const afterB3AuthorizationPopup = (e) => {
        // console.log('afterB3AuthorizationPopup triggered: e.type=', e.type, ', document.visibilityState=', document.visibilityState, ', b3PopupRef.current?.closed=', b3PopupRef.current?.closed);

        // Ignore visibility change when page becomes hidden
        if (e.type === 'visibilitychange' && document.visibilityState !== 'visible') {
            return;
        }

        if (b3PopupRef.current?.closed) {
            // console.log('Cleaning B3 Authorization Popup and calling user authorization fetch...');
            cleanupPopup();
            fetchUserAuthorization();
        }
    };

    const openB3AuthorizationPopup = () => {
        // Clean up any existing popup
        cleanupPopup();

        b3PopupRef.current = window.open(
            B3_AUTHORIZATION_URL,
            'b3Popup',
            `width=750,height=800,left=${Math.round(window.screen.width / 2 - 375)},top=${Math.round(window.screen.height / 2 - 400)}`
        );
        if (!b3PopupRef.current) { // Talvez o navegador esteja bloqueando pop-ups
            console.error('Não foi possível abrir a janela para autorização B3.');
            return;
        }
        
        console.log('Adding event listeners because of B3 Authorization Popup...');

        // Set up event listeners for popup detection
        window.addEventListener('focus', afterB3AuthorizationPopup, { passive: true });
        document.addEventListener('visibilitychange', afterB3AuthorizationPopup, { passive: true });

        // Polling fallback for browsers that don't support the above events reliably
        b3PopupIntervalRef.current = setInterval(() => afterB3AuthorizationPopup({ type: 'pool' }), 500);

        // console.log('[!] Opened B3 Authorization Popup.');
    };
    
    const handleSyncB3Sumbit = async (portfolioId) => {
        setIsLoading(true);
        try {
            const r = await axios.get(`/b3-import/user-transactions?portfolioId=${portfolioId}&fromStart=true`);
            if (!r?.data?.success) throw r;
            checkUserSession(); // Refresh user session to update the user data
            setB3Modal(false);
            if (portfolioId === currentWallet?.id) {
                fetchTableData(currentWallet?.id);
            }
            
        } catch (error) {
            console.error('Error synchronizing user with B3:', error);
        }
        setIsLoading(false);
    };

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
        const isFund = transaction.asset_type === 'FUNDS';

        axios.post(`/portfolio-transactions`, {
            "portfolio_id": currentWallet.id,
            "treasury_id": isTreasury ? transaction.tickerInfo.id : null,
            "fund_id": isFund ? transaction.tickerInfo.id : null,
            "ticker_id": !isFixedIncome && !isTreasury && !isFund ? transaction.tickerInfo.id : null,
            "asset_type": transaction.asset_type,
            "transaction_type": transaction.type,
            "amount": transaction.quantity * transaction.price,
            "price_per_unit": !isFixedIncome && !isTreasury && !isFund ? transaction.price : null,
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

        axios.get(`/portfolio-transactions/consolidated-transactions/${wallet_id}`)
            .then(({ data }) => {
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
                            fund_class: row.fund?.fund_class || "null",
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
                            variant="outlined"
                            startIcon={<VisibilityIcon />}
                        >
                            Ver lançamentos
                        </Button>}
                        {currentWallet?.id && <Button
                            onClick={handleOpenTransactionModal}
                            startIcon={<AddCircle />}
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
                        </Button>}
                        {currentWallet?.id && <Button
                            loading={isLoading}
                            disabled={((user.b3SyncPortfolioId === currentWallet.id) || isLoading)}
                            variant={(user.b3SyncPortfolioId === currentWallet.id || isLoading) ? "outlined" : undefined}
                            onClick={(user.b3SyncPortfolioId === currentWallet.id) ? undefined : handleSyncB3Modal}
                            startIcon={
                                isLoading ? 
                                undefined : (
                                    (user.b3SyncPortfolioId === currentWallet.id) ?
                                    <Circle 
                                        color="success" 
                                        sx={{ width: '12px' }} 
                                    /> :
                                    <Sync />
                                )
                            }
                            sx={(theme) => ({
                                // borderColor: theme.palette.primary.main,
                                backgroundColor: (user.b3SyncPortfolioId === currentWallet.id || isLoading) ? undefined : theme.palette.primary.main,
                                color: '#fff',
                                px: 2,
                                '&:hover': {
                                    // backgroundColor: 'transparent',
                                    backgroundColor: theme.palette.primary.dark,
                                    // borderColor: theme.palette.primary.dark,
                                    // boxShadow: 0
                                },
                            })}
                        >
                            {(user.b3SyncPortfolioId === currentWallet.id) ? "Carteira sincronizada" : "Sincronizar com a B3"}
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

                    <SyncB3Modal 
                        open={b3Modal}
                        handleUserCpfSubmit= {handleUserCpfSubmit}
                        errors= {b3ModaErrors}
                        userCpf={userCpf}
                        onClose={handleCloseSyncB3ModalModal}
                        isLoading={isLoading}
                        b3UserAuthorization={b3UserAuthorization}
                        handleSyncB3Sumbit={handleSyncB3Sumbit}
                        openB3AuthorizationPopup={openB3AuthorizationPopup}
                    />
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
