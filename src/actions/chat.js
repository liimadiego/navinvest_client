import { last } from 'es-toolkit';
import { uuidv4 } from 'minimal-shared/utils';
import axios, { endpoints } from 'src/lib/axios';

const AI_ASSISTANT_ENDPOINT = endpoints.ai_assistant;

// ----------------------------------------------------------------------

export async function sendMessage(messageData, chatId) {
  if (!messageData || !chatId) {
    return;
  }

  const messages = [];

  await axios.post(`${AI_ASSISTANT_ENDPOINT}`, {
    message: messageData,
    chatId: chatId
  })
    .then(response => {
      response = response.data;
      if (response.success) {
        if (response.data.valid_question) {
          for (const { messageType, answer } of response.data.data) {
            messages.push({
              id: uuidv4(),
              answer: answer,
              messageType: messageType,
              createdAt: new Date().toISOString(),
              senderId: 'ai-id',
              animate: true,
            });
          }
        } else {
          messages.push({
            id: uuidv4(),
            answer: "Essa mensagem não está dentro do escopo de investimentos , não é uma pergunta válida ou diz respeito a uma indicação de investimentos. Por favor, tente novamente.",
            messageType: 'text',
            createdAt: new Date().toISOString(),
            senderId: 'ai-id',
            warning: true,
            animate: true,
          });
        }
      }
    })
    .catch(error => {
      console.error(error);
    });

  return messages;
}