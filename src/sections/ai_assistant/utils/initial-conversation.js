import { uuidv4 } from 'minimal-shared/utils';

import { fSub } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export function initialConversation({ message = '' }) {
  try {
    const aiParticipant = {
      id: 'ai-id',
      name: globalThis.getTranslation('ai_assistant_name'),
    };

    const messageData = {
      id: uuidv4(),
      answer: message,
      messageType: 'text',
      createdAt: fSub({ minutes: 1 }),
      senderId: 1,
    };

    return { messageData };
  } catch (error) {
    console.error('Error in initialConversation:', error);
    return { messageData: {} };
  }
}
