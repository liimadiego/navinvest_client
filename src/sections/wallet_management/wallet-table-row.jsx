import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

export function WalletTableRow({ row, isFixedIncome, isTreasury, isFunds }) {
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

  return (
    <>
      <TableRow hover tabIndex={-1}>
        <TableCell width={250}>
          <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
            <img
              src={`/assets/tickers/${row.asset}.jpg`}
              alt={row.name}
              onError={(e) => e.target.src = "/assets/tickers/default.svg"}
              style={{ borderRadius: 8, width: 40, height: 40 }}
            />

            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              {isFixedIncome || isFunds ? row.asset_name : row.asset}
              {!isFixedIncome && <Box component="span" sx={{ color: 'text.disabled' }}>
                {isFunds ? row.fund_class : row.asset_name}
              </Box>}
            </Stack>
          </Box>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.quantity}</TableCell>
        {!isFixedIncome && !isTreasury && !isFunds && <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatCurrency(row.currency, row.averagePrice)}</TableCell>}

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatCurrency(row.currency, isFixedIncome ? row.total_amount : row.currentPrice)}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {formatCurrency(row.currency, isFixedIncome || isTreasury ? row.current_value : row.currentPrice * row.quantity)}
        </TableCell>

        <TableCell width={100} sx={{ whiteSpace: 'nowrap' }}>
          <Label
            variant="soft"
            color={
              (row.variation > 0 && 'success') ||
              (row.variation < 0 && 'error') ||
              (row.variation === 0 && 'default')
            }
          >
            {`${row.variation}%`}
          </Label>
        </TableCell>

        {/* <TableCell width={100}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Editar" placement="top" arrow>
              <IconButton
                color={quickEditForm.value ? 'inherit' : 'default'}
                onClick={quickEditForm.onTrue}
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
        </TableCell> */}
      </TableRow>
    </>
  );
}
