// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  faqs: '/faqs',
  pricing: '/pricing',
  // AUTH
  auth: {
    amplify: {
      signIn: `${ROOTS.AUTH}/amplify/sign-in`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      signUp: `${ROOTS.AUTH}/amplify/sign-up`,
      updatePassword: `${ROOTS.AUTH}/amplify/update-password`,
      resetPassword: `${ROOTS.AUTH}/amplify/reset-password`,
    },
    jwt: {
      signIn: `${ROOTS.AUTH}/login`,
      signUp: `${ROOTS.AUTH}/registrar`,
      resetPassword: `${ROOTS.AUTH}/redefinir-senha`,
      updatePassword: `${ROOTS.AUTH}/atualizar-senha`,
    },
    firebase: {
      signIn: `${ROOTS.AUTH}/firebase/sign-in`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      signUp: `${ROOTS.AUTH}/firebase/sign-up`,
      resetPassword: `${ROOTS.AUTH}/firebase/reset-password`,
    },
    auth0: {
      signIn: `${ROOTS.AUTH}/auth0/sign-in`,
    },
    supabase: {
      signIn: `${ROOTS.AUTH}/supabase/sign-in`,
      verify: `${ROOTS.AUTH}/supabase/verify`,
      signUp: `${ROOTS.AUTH}/supabase/sign-up`,
      updatePassword: `${ROOTS.AUTH}/supabase/update-password`,
      resetPassword: `${ROOTS.AUTH}/supabase/reset-password`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    ai_assistant: `${ROOTS.DASHBOARD}/assistente-ia`,
    backtest: `${ROOTS.DASHBOARD}/backtest`,
    backtest_results: `${ROOTS.DASHBOARD}/resultado-backtest`,
    compare_assets: `${ROOTS.DASHBOARD}/comparar-ativos`,
    asset_details: `${ROOTS.DASHBOARD}/detalhes-ativo`,
    news: `${ROOTS.DASHBOARD}/noticias`,
    wallet_management: `${ROOTS.DASHBOARD}/gerenciar-carteira`,
    wallet_management_individual_transactions: `${ROOTS.DASHBOARD}/gerenciar-carteira/transacoes-individuais`,
    ai_wallet_importer: `${ROOTS.DASHBOARD}/importar-carteira`,
    currency_converter: `${ROOTS.DASHBOARD}/conversor-moedas`,
    investor_glossary: `${ROOTS.DASHBOARD}/glossario-investidor`,
    dividend_calendar: `${ROOTS.DASHBOARD}/agenda-dividendos`,
  },
};
