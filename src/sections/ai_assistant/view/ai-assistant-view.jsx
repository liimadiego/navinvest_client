import { useState, useCallback, useEffect } from 'react';

import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';

import { EmptyContent } from 'src/components/empty-content';

import { ChatLayout } from '../layout';
import { ChatMessageList } from '../chat-message-list';
import { ChatMessageInput } from '../chat-message-input';
import { useChat } from 'src/context/ChatContext';
import { useTokenUsage } from 'src/context/TokenUsage';
import { Alert } from '@mui/material';
import { background } from 'src/theme';

// ----------------------------------------------------------------------

export function AIAssistantView() {
  const [messages, setMessages] = useState([]);
  const { chatHistory } = useChat();
  const { tokenUsage } = useTokenUsage();
  const [isFeatureDisabled, setIsFeatureDisabled] = useState(false);

  useEffect(() => {
    if (tokenUsage >= 100) {
      setIsFeatureDisabled(true);
    }
  }, [tokenUsage]);

  useEffect(() => {
    setMessages(chatHistory);
  }, [chatHistory]);

  return (
    <DashboardContent
      maxWidth={false}
      sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column', pb: 2 }}
    >
      <Typography variant={"h5"} sx={{ mb: { xs: 0, md: 3 }, display: { xs: 'none', md: 'block' } }}>
        {globalThis.getTranslation('chat_with')} {globalThis.getTranslation('ai_assistant_name')}
      </Typography>
      {isFeatureDisabled && (
        <Alert
          severity="warning"
          sx={{ mb: 2 }}
        >
          Limite de uso de IA mensal excedido. Aguarde até o próximo mês ou atualize seu plano para continuar usando o assistente.
        </Alert>
      )}
      <ChatLayout
        slots={{
          header: (
            <Typography variant="h6">
              {globalThis.getTranslation('ai_assistant_name')}
            </Typography>
          ),
          main: (
            <>
              {messages.length === 0 ? (
                <EmptyContent
                  title={globalThis.getTranslation('welcome')}
                  description={globalThis.getTranslation('start_chat')}
                  imgUrl={`${CONFIG.assetsDir}/assets/icons/empty/ic-chat-active.svg`}
                />
              ) : (
                <ChatMessageList
                  messages={messages}
                />
              )}

              <ChatMessageInput isDisabled={isFeatureDisabled} />
            </>
          ),
        }}
      />
    </DashboardContent>
  );
}
