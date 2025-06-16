// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  faqs: '/faqs',
  pricing: '/planos',
  privacy_policy: '/politica-privacidade',
  terms_service: '/termos-servicos',
  payment: '/checkout-pagamento',
  pix: '/checkout-pagamento/pix',
  success_checkout: '/checkout-pagamento/sucesso',
  // AUTH
  auth: {
    jwt: {
      signIn: `${ROOTS.AUTH}/login`,
      signUp: `${ROOTS.AUTH}/registrar`,
      resetPassword: `${ROOTS.AUTH}/redefinir-senha`,
      updatePassword: `${ROOTS.AUTH}/atualizar-senha`,
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
    compound_interest: `${ROOTS.DASHBOARD}/calculadora-juros-compostos`,
    investor_glossary: `${ROOTS.DASHBOARD}/glossario-investidor`,
    dividend_calendar: `${ROOTS.DASHBOARD}/agenda-dividendos`,
    my_profile: `${ROOTS.DASHBOARD}/meu-perfil`,
    investor_profile: `${ROOTS.DASHBOARD}/perfil-investidor`,
  },
};
