import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { fToNow } from 'src/utils/format-time';

export function ChatMessageItem({ message }) {
  const user = { id: 1 };

  const me = message.senderId === user.id;
  const { firstName, avatarUrl } = { firstName: 'Assistente de Investimentos', avatarUrl: 'https://cdn.fakercloud.com/avatars/brunodesign1202_128.jpg' };
  const { body, createdAt } = message;

  const renderInfo = () => (
    <Typography
      noWrap
      variant="caption"
      sx={{ mb: 1, color: 'text.disabled', ...(!me && { mr: 'auto' }) }}
    >
      {!me && `${firstName}, `}
      {fToNow(createdAt)}
    </Typography>
  );

  const renderBody = () => (
    <Stack
      sx={{
        p: 1.5,
        minWidth: 48,
        maxWidth: 320,
        borderRadius: 1,
        typography: 'body2',
        bgcolor: message.warning ? '#7A4100' : 'background.neutral',
        ...(me && { color: 'grey.800', bgcolor: 'primary.lighter' }),
      }}
    >
      {body}
    </Stack>
  );

  if (!message.body) {
    return null;
  }

  return (
    <Box sx={{ mb: 1, display: 'flex', justifyContent: me ? 'flex-end' : 'unset' }}>
      {!me && <Avatar alt={firstName} src={avatarUrl} sx={{ width: 32, height: 32, mr: 2 }} />}

      <Stack alignItems={me ? 'flex-end' : 'flex-start'}>
        {renderInfo()}

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            '&:hover': { '& .message-actions': { opacity: 1 } },
          }}
        >
          {renderBody()}
        </Box>
      </Stack>
    </Box>
  );
}
