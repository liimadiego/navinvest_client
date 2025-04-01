import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { UserQuickEditForm } from './wallet-quick-edit-form';

// ----------------------------------------------------------------------

export function WalletTableRow({ row, onDeleteRow }) {
  const confirmDialog = useBoolean();
  const quickEditForm = useBoolean();

  const renderQuickEditForm = () => (
    //precisa adaptar esse form, ele espera compas do user e não da acao
    <UserQuickEditForm
      currentUser={row}
      open={quickEditForm.value}
      onClose={quickEditForm.onFalse}
    />
  );

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
    switch (currency) {
      case 'USD':
        return `$${amount}`;
      case 'BRL':
        return `R$${parseFloat(amount).toFixed(2).replace('.', ',')}`;
      default:
        return `${currency}${amount}`;
    }
  };

  return (
    <>
      <TableRow hover tabIndex={-1}>
        <TableCell width={250}>
          <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
            <img alt={row.name} src={row.assetImageUrl} style={{ borderRadius: 8, width: 40, height: 40 }} />

            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              {row.asset}
              <Box component="span" sx={{ color: 'text.disabled' }}>
                {row.asset_name}
              </Box>
            </Stack>
          </Box>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.category_name === "Criptomoedas" ? row.quantity : Math.round(row.quantity)}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatCurrency(row.currency, row.averagePrice)}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatCurrency(row.currency, row.currentPrice)}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {formatCurrency(row.currency, row.currentPrice * row.quantity)}
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

      {renderQuickEditForm()}
      {renderConfirmDialog()}
    </>
  );
}
