import { last } from 'es-toolkit';
import { uuidv4 } from 'minimal-shared/utils';

import axios, { endpoints } from 'src/lib/axios';

const AI_ASSISTANT_ENDPOINT = endpoints.ai_assistant;
const LOCAL_STORAGE_KEY = 'chat_messages';

// ----------------------------------------------------------------------

export async function sendMessage(messageData) {
  insertMessage(messageData)

  const messagesLS = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
  const messages = messagesLS || [];
  const lastMessages = messages.slice(-10);

  const formattedMessages = lastMessages.map((message) => {
    return {
      role: message.senderId === 'ai-id' ? "assistant" : "user",
      content: typeof message.body === 'object' ? JSON.stringify(message.body) : message.body,
    }
  }
  );

  await fetch(`${import.meta.env.VITE_SERVER_URL2}${AI_ASSISTANT_ENDPOINT}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: messageData.body,
      messageHistoric: formattedMessages
    })
  }).then(r => r.json())
    .then(response => {
      if (response.success) {
        if (response.data.valid_question) {
          for (const { messageType, answer } of response.data.data) {
            insertMessage({
              id: uuidv4(),
              attachments: [],
              body: answer,
              contentType: messageType,
              createdAt: new Date().toISOString(),
              senderId: 'ai-id',
            });
          }

          // insertMessage({
          //   id: uuidv4(),
          //   attachments: [],
          //   body: response.data.answer,
          //   contentType: response.data.messageType,
          //   createdAt: new Date().toISOString(),
          //   senderId: 'ai-id',
          // });
        } else {
          insertMessage({
            id: uuidv4(),
            attachments: [],
            body: "Essa mensagem não está dentro do escopo de investimentos , não é uma pergunta válida ou diz respeito a uma indicação de investimentos. Por favor, tente novamente.",
            contentType: 'text',
            createdAt: new Date().toISOString(),
            senderId: 'ai-id',
            warning: true
          });
        }
      }
    })
    .catch(error => {
      console.error(error);
    });

}

function insertMessage(message) {
  const messagesLS = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
  const messages = messagesLS || [];

  messages.push(message);

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));

  window.dispatchEvent(new Event("storage"));
}