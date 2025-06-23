import React, { useEffect, useState } from 'react';
import { Modal, Paper, Typography, Divider, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export function AssetReportAIModal({ isOpen, handleClose, reportData }) {
  const [report, setReport] = useState(null);

  const getIcon = iconName => {
    switch (iconName) {
      case "check":
        return "✅";
      case "warning":
        return "⚠️";
      case "money":
        return "💰";
      case "money_down":
        return "📉";
      case "money_up":
        return " 📈";
      case "bank":
        return "🏦";
      case "briefcase":
        return "💼";
      case "down_trend":
        return "📉";
      case "up_trend":
        return "📈";
      default:
        return "";
    }
  }

  const ReportDisplay = (report) => (
    <>
      <Box display="flex" alignItems="center" mb={2} mt={5}>
        <MenuBookIcon sx={{ marginRight: 1 }} />
        <Typography variant="h4" fontWeight="bold">
          {report.title}
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {
        report.content.map((paragraph, index) => (
          <Box key={index} mb={3}>
            <Typography variant="h6" fontWeight="medium" gutterBottom>
              {paragraph.paragraph_title} {getIcon(paragraph.icon)}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {paragraph.paragraph_content}
            </Typography>
          </Box>
        ))
      }

      <Divider sx={{ my: 3 }} />

      <Box display="flex" alignItems="center" mb={1}>
        <EmojiObjectsIcon sx={{ marginRight: 1 }} />
        <Typography variant="h6" fontWeight="medium">
          Conclusão
        </Typography>
      </Box>
      <Typography variant="body1" color="text.secondary">
        {report.conclusion}
      </Typography>

      <Box mt={4} display="flex" alignItems="center">
        <CheckCircleIcon sx={{ color: "success.main", marginRight: 1 }} />
        <Typography variant="body2" color="success.main">
          Relatório finalizado com sucesso.
        </Typography>
      </Box>
    </>
  );

  useEffect(() => {
    setReport(reportData);
  }, [reportData]);

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      BackdropProps={{
        onClick: handleClose,
      }}
      sx={{
        backdropFilter: 'blur(2px)',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: 1000,
          maxHeight: '90vh',
          overflowY: 'auto',
          maxWidth: '90%',
          bgcolor: 'background.paper',
          p: "5px 5px",
          margin: 'auto',
          mt: '5vh',
          position: 'relative',
          borderRadius: 1
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 5, top: 5, zIndex: 2 }}>
          <CloseIcon />
        </IconButton>
        {!report ? (
          <>
            <Typography sx={{ paddingTop: "25px", opacity: .7, textAlign: "center" }} variant="h6" gutterBottom>
              Estamos preparando seu relatório com inteligência artificial...
            </Typography>
            <Typography sx={{ opacity: .7, textAlign: "center", pb: 3 }} variant="body2" gutterBottom>
              Por favor, aguarde um momento enquanto finalizamos
            </Typography>
          </>
        ) : null}
        <Paper sx={{ paddingX: "5%", paddingBottom: "35px" }}>
          {!report ? (
            <LoadingButton
              loading
              variant="outlined"
              sx={{ width: "100%", height: "50px", borderRadius: 1 }}
            >
              Gerando relatório...
            </LoadingButton>
          ) : (ReportDisplay(report))}
        </Paper>
      </Paper>
    </Modal>
  );
};