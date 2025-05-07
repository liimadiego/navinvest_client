import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';

import { Scrollbar } from 'src/components/scrollbar';

import { ChatMessageItem } from './chat-message-item';
import { useMessagesScroll } from './hooks/use-messages-scroll';

// ----------------------------------------------------------------------

export function ChatMessageList({ messages = [] }) {
  const { messagesEndRef } = useMessagesScroll(messages);

  return (
    <>
      <Scrollbar
        ref={messagesEndRef}
        sx={{
          px: 3,
          pt: 5,
          pb: 3,
          flex: '1 1 auto',
          width: '100%',
        }}
      >
        {messages.map((message) => {
          return (
            <ChatMessageItem
              key={message.id}
              message={message}
            />
          );
        })}
      </Scrollbar>
    </>
  );
}
