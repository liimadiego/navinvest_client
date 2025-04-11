import React, { createContext, useContext, useState } from 'react';

export const WalletsContext = createContext();

export const WalletsProvider = ({ children }) => {
  const [_wallets, _setWallets] = useState([]);

  return (
    <WalletsContext.Provider value={{ _wallets, _setWallets }}>
      {children}
    </WalletsContext.Provider>
  );
};

export const useWallets = () => {
  return useContext(WalletsContext);
};