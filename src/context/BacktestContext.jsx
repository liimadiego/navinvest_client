import React, { createContext, useState } from 'react';

export const BacktestContext = createContext();

export const BacktestProvider = ({ children }) => {
  const [results, setResults] = useState(null);

  return (
    <BacktestContext.Provider value={{ results, setResults }}>
      {children}
    </BacktestContext.Provider>
  );
};