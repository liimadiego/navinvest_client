import { useRef, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';

import { useRouter } from 'src/routes/hooks';

import { sendMessage } from 'src/actions/chat';

import { Iconify } from 'src/components/iconify';

import { initialConversation } from './utils/initial-conversation';

import EmojiPicker from 'emoji-picker-react';

import SendIcon from '@mui/icons-material/Send';

import { useChat } from 'src/context/ChatContext';

import { uuidv4 } from 'minimal-shared/utils';
import { fSub } from 'src/utils/format-time';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export function ChatMessageInput() {
  const { user } = useAuthContext();
  const me = user?.id || 1;
  const { chatId, chatHistory, setChatHistory } = useChat();
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  const handleChangeMessage = useCallback((event) => {
    setMessage(event.target.value);
  }, []);

  const handleSendMessageEnter = useCallback(
    async (event) => {
      if (event.key !== 'Enter' || !message) return;
      try {
        const formattedMessage = {
          id: uuidv4(),
          answer: message,
          messageType: 'text',
          createdAt: fSub({ minutes: 1 }),
          senderId: me,
        }
        setChatHistory((prev) => [...prev, formattedMessage]);
        setMessage('');
        const responseMessages = await sendMessage(message, chatId);
        if (!responseMessages) {
          setError(true);
          return;
        }
        setChatHistory((prev) => [
          ...prev,
          ...responseMessages,
        ]);

      } catch (error) {
        console.error(error);
      }
    },
    [message, router]
  );

  const handleSendMessage = async () => {
    try {
      const formattedMessage = {
        id: uuidv4(),
        answer: message,
        messageType: 'text',
        createdAt: fSub({ minutes: 1 }),
        senderId: me,
      }
      setChatHistory((prev) => [...prev, formattedMessage]);
      setMessage('');
      const responseMessages = await sendMessage(message, chatId);
      if (!responseMessages) {
        setError(true);
        return;
      }
      setChatHistory((prev) => [
        ...prev,
        ...responseMessages,
      ]);

    } catch (error) {
      console.error(error);
    }
  }

  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  const handleToggleEmojiPicker = useCallback(() => {
    setEmojiPickerOpen((prev) => !prev);
  }, []);

  const handleSelectEmoji = useCallback((emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setEmojiPickerOpen(false);
  }, []);

  return (
    <>
      <InputBase
        name="chat-message"
        id="chat-message-input"
        value={message}
        onKeyUp={handleSendMessageEnter}
        onChange={handleChangeMessage}
        placeholder={globalThis.getTranslation('type_message')}
        autoComplete='off'
        startAdornment={
          <IconButton onClick={handleToggleEmojiPicker}>
            <Iconify icon="eva:smiling-face-fill" />
          </IconButton>
        }
        //sendMessage Icon
        endAdornment={
          <IconButton onClick={handleSendMessage}>
            <SendIcon />
          </IconButton>
        }
        sx={[
          (theme) => ({
            px: 1,
            height: 56,
            flexShrink: 0,
            borderTop: `solid 1px ${theme.vars.palette.divider}`,
          }),
        ]}
      />
      {emojiPickerOpen && (
        <Box sx={{ position: 'absolute', bottom: 60 }}>
          <EmojiPicker
            onEmojiClick={handleSelectEmoji}
            theme="dark"
            style={{
              backgroundColor: 'rgb(20, 26, 33)',
              transform: 'translateX(20px)',
            }}
          />
        </Box>
      )}
    </>
  );
}
