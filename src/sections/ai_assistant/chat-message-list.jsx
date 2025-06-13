import Stack from '@mui/material/Stack';

import { Scrollbar } from 'src/components/scrollbar';

import { ChatMessageItem } from './chat-message-item';
import { useMessagesScroll } from './hooks/use-messages-scroll';

// ----------------------------------------------------------------------

export function ChatMessageList({ messages = [], isLoading = false }) {
  const displayedMessages = isLoading ? [...messages, { id: 'loading', senderId: 'ai-id', loading: true }] : messages;
  const { messagesEndRef } = useMessagesScroll(displayedMessages);

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
        {displayedMessages.map((message) => {
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
