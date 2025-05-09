import { useState, useCallback, useEffect } from 'react';

import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';

import { EmptyContent } from 'src/components/empty-content';

import { ChatLayout } from '../layout';
import { ChatMessageList } from '../chat-message-list';
import { ChatMessageInput } from '../chat-message-input';
import { useChat } from 'src/context/ChatContext';

// ----------------------------------------------------------------------

export function AIAssistantView() {
  const [messages, setMessages] = useState([]);
  const { chatHistory } = useChat();

  useEffect(() => {
    setMessages(chatHistory);
  }, [chatHistory]);

  return (
    <DashboardContent
      maxWidth={false}
      sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column' }}
    >
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        {globalThis.getTranslation('chat_with')} {globalThis.getTranslation('ai_assistant_name')}
      </Typography>

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

              <ChatMessageInput />
            </>
          ),
        }}
      />
    </DashboardContent>
  );
}
