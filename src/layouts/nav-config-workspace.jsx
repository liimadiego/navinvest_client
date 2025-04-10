import { useState, useEffect } from 'react';

export let _wallets = [];

export const fetchWallets = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL2}/investment-portfolio/0737f150-0561-49c7-a59c-f61e0fc59cc6`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error('Failed to fetch wallets');
    }
    const wallets = data.map(wallet => ({
      id: wallet.id,
      name: wallet.name,
      objective: wallet.objective,
    }));
    _wallets = wallets;
  } catch (error) {
    console.error(error);
    return [];
  }
};

fetchWallets();

