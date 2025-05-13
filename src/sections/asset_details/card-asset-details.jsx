import { Skeleton, Typography, Box, Paper } from '@mui/material';
import { SvgColor } from 'src/components/svg-color';
import { Tooltip, IconButton } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

// ----------------------------------------------------------------------

export function CardAssetDetails({ sx, icon, title, total, type = false, color = 'warning', currency = false, description = false, assetType, ...other }) {

  return (
    <Paper elevation={3} sx={[{ py: 3, pl: 3, pr: 2.5, position: "relative", overflow: "hidden", zIndex: 1 }, ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
      <Box sx={{ flexGrow: 1 }}>
        {total !== null && total !== undefined ? (
          <Box sx={{ typography: 'h3', color: total < 0 ? 'error.main' : 'text.primary' }}>
            {type === 'currency' ? (
              currency === 'USD' ? `$${total.toLocaleString('en-US')}` : `R$${total.toLocaleString('pt-BR')}`
            ) : type === 'percentage' ? (
              `${total ? (total * 100).toFixed(2) : 0}%`
            ) : (
              total.toLocaleString().replace('.', ',')
            )}
          </Box>
        ) : (
          <Skeleton variant="text" width={100} height={40} />
        )}

        {title ? (
          <Typography noWrap variant="subtitle2" component="div" sx={{ color: 'text.secondary' }}>
            {title}
            {description && (
              <Tooltip title={description} arrow>
                <IconButton sx={{ ml: "5px", p: 0 }}>
                  <HelpOutlineIcon sx={{ fontSize: "12px" }} />
                </IconButton>
              </Tooltip>)
            }

          </Typography>
        ) : (
          <Skeleton variant="text" width={150} height={20} />
        )}
      </Box>

      <SvgColor
        src={icon}
        sx={(theme) => ({
          top: 24,
          right: 20,
          width: 36,
          height: 36,
          zIndex: 2,
          position: 'absolute',
          background: `linear-gradient(135deg, ${theme.vars.palette[color].main} 0%, ${theme.vars.palette[color].dark} 100%)`,
        })}
      />

      <Box
        sx={(theme) => ({
          top: -44,
          width: 160,
          zIndex: -1,
          height: 160,
          right: -104,
          opacity: 0.12,
          borderRadius: 3,
          position: 'absolute',
          transform: 'rotate(40deg)',
          background: `linear-gradient(to right, ${theme.vars.palette[color].main}, transparent)`,
        })}
      />
    </Paper>
  );
}
