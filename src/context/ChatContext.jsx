import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuthContext } from 'src/auth/hooks';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [chatId, setChatId] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const { user } = useAuthContext();

    useEffect(() => {
        if (!user) {
            setChatId(null);
            setChatHistory([]);
        }
    }, [user]);

    return (
        <ChatContext.Provider value={{ chatId, setChatId, chatHistory, setChatHistory }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    return useContext(ChatContext);
};