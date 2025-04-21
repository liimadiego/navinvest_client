import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { Label } from 'src/components/label';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { UserQuickEditForm } from './wallet-quick-edit-form';
import { Tooltip, Typography } from '@mui/material';
import { IconButton } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import AddEditTransactionModal from 'src/components/add-edit-transaction-modal';
import { useState } from 'react';
import { useWallet } from 'src/context/WalletContext';
import { translateAssetType } from 'src/utils/handle-asset-type';

// ----------------------------------------------------------------------

export function WalletTableRow({ row, onDeleteRow, fetchTableData }) {
  const confirmDialog = useBoolean();
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [isEditFormLoading, setIsEditFormLoading] = useState(false);
  const { currentWallet } = useWallet();
  const isFixedIncome = row.asset_type === "FIXED_INCOME";

  const handleSaveEditForm = async (transaction) => {
    setIsEditFormLoading(true);
    if (!currentWallet?.id || !transaction) {
      setIsEditFormLoading(false);
      return;
    }

    transaction = transaction.data;
    let objectToSend = {};

    if (transaction.asset_type === "FIXED_INCOME") {
      objectToSend = {
        "portfolio_id": currentWallet.id,
        "ticker_id": null,
        "asset_type": transaction.asset_type,
        "transaction_type": transaction.type,
        "amount": transaction.quantity * transaction.price,
        "quantity": transaction.quantity,
        "price_per_unit": null,
        "transaction_date": transaction.date,
        "issuer": transaction.issuer || null,
        "investment_type": transaction.investment_type || null,
        "indexation_type": transaction.indexation_type || null,
        "expiration_date": transaction.expiration_date || null,
        "indexer": transaction.indexer || null,
        "indexer_rate": transaction.indexer_rate || null,
        "currency": transaction.currency || "BRL",
      }
    } else {
      objectToSend = {
        "portfolio_id": currentWallet.id,
        "ticker_id": 10,
        "asset_type": transaction.asset_type,
        "transaction_type": transaction.type,
        "amount": transaction.quantity * transaction.price,
        "quantity": transaction.quantity,
        "price_per_unit": !isFixedIncome ? transaction.price : null,
        "transaction_date": transaction.date
      }
    }

    fetch(`${import.meta.env.VITE_SERVER_URL2}/portfolio-transactions/${transaction.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(objectToSend),
    })
      .then(response => response.json())
      .then(async (data) => {
        setEditFormOpen(false);
        fetchTableData(currentWallet?.id);
        setIsEditFormLoading(false);
      })
      .catch(error => {
        console.error('Error saving transaction:', error);
        setIsEditFormLoading(false);
      });

  }

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Deletar"
      content="Tem certeza que deseja deletar?"
      action={
        <Button variant="contained" color="error" onClick={onDeleteRow}>
          Deletar
        </Button>
      }
    />
  );

  const formatCurrency = (currency, amount) => {
    const formatWithDots = (value) => {
      return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    switch (currency) {
      case 'USD':
        return `$${amount}`;
      case 'BRL':
        return `R$${formatWithDots(parseFloat(amount).toFixed(2).replace('.', ','))}`;
      default:
        return `${currency}${amount}`;
    }
  };

  const formatDateBRL = (date) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString('pt-BR', options);
  }

  const handleEditTransaction = async (data) => {
    const { type, tickerInfo, date, quantity, price, costs, amount, id, asset_type, fixed_income_details } = data;
    const transactionData = {
      asset_type,
      type,
      ticker: tickerInfo,
      fixed_income_details: fixed_income_details,
      date,
      quantity,
      amount,
      price,
      costs,
      id
    };

    setEditFormData(transactionData);
    setEditFormOpen(true)
  }

  return (
    <>
      <TableRow hover>
        <TableCell sx={{ minWidth: "150px" }} height={45}>
          <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
            <Box display={'flex'} gap={.5} alignItems={'center'}>
              <Box sx={{
                width: "5px",
                height: "100%",
                backgroundColor: row.transaction_type === "BUY" ? "#4caf50" : "#f44336",
                borderRadius: "5px",
                userSelect: "none",
                color: row.transaction_type === "BUY" ? "#4caf50" : "#f44336",
                marginRight: 1,
              }}>
                .
              </Box>
              <Typography component="span" sx={{ fontSize: 14, fontWeight: 400 }}>
                {translateAssetType(row.asset_type, row.ticker?.currency)}
              </Typography>
            </Box>
          </Box>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 400 }}>{isFixedIncome ? `${row.fixed_income_details?.issuer} - ${row.fixed_income_details?.investment_type}` : row.ticker?.ticker}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 400 }}>{row.transaction_type === "BUY" ? "Compra" : "Venda"}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 400 }}>{formatDateBRL(row.transaction_date)}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 400 }}>{row.quantity}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 400 }}>{formatCurrency(
          isFixedIncome ? row.fixed_income_details?.currency : row.ticker?.currency,
          isFixedIncome ? row.amount : row.price_per_unit
        )}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 400 }}>{formatCurrency(
          isFixedIncome ? row.fixed_income_details?.currency : row.ticker?.currency,
          row.amount
        )}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 400 }}>
          Manual
        </TableCell>

        <TableCell width={100}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Editar" placement="top" arrow>
              <IconButton
                color={'default'}
                onClick={() => handleEditTransaction({
                  id: row.id,
                  type: row.transaction_type,
                  tickerInfo: row.ticker,
                  date: row.transaction_date,
                  quantity: row.quantity,
                  price: row.fixed_income_details ? row.amount : row.price_per_unit,
                  costs: row.costs,
                  asset_type: row.asset_type,
                  fixed_income_details: row.fixed_income_details
                })}
              >
                <Iconify icon="solar:pen-bold" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete" placement="top" arrow>
              <IconButton color="error" onClick={confirmDialog.onTrue}>
                <Iconify icon="solar:trash-bin-trash-bold" />
              </IconButton>
            </Tooltip>
          </Box>
        </TableCell>
      </TableRow>

      <AddEditTransactionModal isLoading={isEditFormLoading} onClose={() => setEditFormOpen(false)} onSave={handleSaveEditForm} open={editFormOpen} editData={editFormData} />
      {renderConfirmDialog()}
    </>
  );
}
