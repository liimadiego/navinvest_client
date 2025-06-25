import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

export function PasswordChecklist({ password = '' }) {
  const requirements = [
    { label: 'Pelo menos 8 caracteres', test: (pw) => pw.length >= 8 },
    { label: 'Letras min\u00fasculas', test: (pw) => /[a-z]/.test(pw) },
    { label: 'Letras mai\u00fasculas', test: (pw) => /[A-Z]/.test(pw) },
    { label: 'N\u00fameros', test: (pw) => /[0-9]/.test(pw) },
  ];

  return (
    <List dense sx={{ mt: 1 }}>
      {requirements.map((req) => {
        const passed = req.test(password);
        return (
          <ListItem key={req.label} disableGutters sx={{ p: 0.25 }}>
            <ListItemIcon sx={{ minWidth: 24 }}>
              {passed ? (
                <CheckCircleOutlineIcon color="success" fontSize="small" />
              ) : (
                <RadioButtonUncheckedIcon color="disabled" fontSize="small" />
              )}
            </ListItemIcon>
            <ListItemText primary={req.label} primaryTypographyProps={{ variant: 'caption' }} />
          </ListItem>
        );
      })}
    </List>
  );
}
