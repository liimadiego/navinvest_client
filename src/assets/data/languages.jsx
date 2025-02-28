/* eslint-disable */
import { useLanguage } from "src/utils/languageContext";

export const getTranslation = (tag) => {
    const { language } = useLanguage();

    switch (language) {
        case 'pt-br':
            return ptBR[tag];
        case 'en':
            return enUS[tag];
        default:
            return ptBR[tag];
    }
}
const ptBR = {
    'language_code': 'pt-br',
    'dark-mode': 'Modo escuro',
    'page-one-title': 'Página um',
    'notifications': 'Notificações',
    'settings': 'Configurações',
    'mark-all-as-read': 'Marcar todas como lidas',
    'news': 'Notícias',
    'read-more': 'Leia mais',
    'all_m': 'Todos',
    'all_f': 'Todas',
    'unread_m': 'Não lidos',
    'unread_f': 'Não lidas',
    'ai_assistant_name': 'Assistente IA',
    'warning_ai_text': "Essa mensagem não está dentro do escopo de investimentos , não é uma pergunta válida ou diz respeito a uma indicação de investimentos. Por favor, tente novamente.",
    'chat_with': 'Chat com',
    'welcome': "Bem-vindo(a)!",
    'start_chat': "Inicie uma conversa com seu assistente de IA.",
    'type_message': 'Digite uma mensagem',
};

const enUS = {
    'language_code': 'en',
    'dark-mode': 'Dark mode',
    'page-one-title': 'Page one',
    'notifications': 'Notifications',
    'settings': 'Settings',
    'mark-all-as-read': 'Mark all as read',
    'news': 'News',
    'read-more': 'Read more',
    'all_m': 'All',
    'all_f': 'All',
    'unread_m': 'Unread',
    'unread_f': 'Unread',
    'ai_assistant_name': 'AI Assistant',
    'warning_ai_text': "This message is not within the scope of investments, it is not a valid question or it concerns an investment recommendation. Please try again.",
    'chat_with': 'Chat with',
    "welcome": "Welcome!",
    'start_chat': "Satrt a conversation with your AI assistant.",
    'type_message': 'Type a message',
};