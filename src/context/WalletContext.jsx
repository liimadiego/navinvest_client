import React, { createContext, useContext, useEffect, useState } from 'react';

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [currentWallet, setCurrentWallet] = useState(() => {
    const savedWallet = localStorage.getItem('selectedWallet');
    return savedWallet ? JSON.parse(savedWallet) : null;
  });

  useEffect(() => {
    if (currentWallet) {
      localStorage.setItem('selectedWallet', JSON.stringify(currentWallet));
    } else {
      localStorage.removeItem('selectedWallet');
    }
  }, [currentWallet]);

  return (
    <WalletContext.Provider value={{ currentWallet, setCurrentWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  return useContext(WalletContext);
};