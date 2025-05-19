import React, { createContext, useContext, useState } from 'react';

export const TokenUsageContext = createContext();

export const TokenUsageProvider = ({ children }) => {
    const [tokenUsage, setTokenUsage] = useState([]);

    return (
        <TokenUsageContext.Provider value={{ tokenUsage, setTokenUsage }}>
            {children}
        </TokenUsageContext.Provider>
    );
};

export const useTokenUsage = () => {
    return useContext(TokenUsageContext);
};