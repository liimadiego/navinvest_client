import { uuidv4 } from 'minimal-shared/utils';

import { fSub } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export function initialConversation({ message = '', me = { id: 1 } }) {
  const aiParticipant = {
    id: 'ai-id',
    name: globalThis.getTranslation('ai_assistant_name'),
  };

  const messageData = {
    id: uuidv4(),
    attachments: [],
    body: message,
    contentType: 'text',
    createdAt: fSub({ minutes: 1 }),
    senderId: me.id,
  };

  const conversationData = {
    id: uuidv4(),
    messages: [messageData],
    participants: [me, aiParticipant],
    type: 'ONE_TO_ONE',
    unreadCount: 0,
  };

  return { messageData, conversationData };
}
