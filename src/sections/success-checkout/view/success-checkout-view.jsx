import { useEffect } from "react";
import { SuccessCheckout } from "../success-checkout"
import { useLocation, useNavigate } from "react-router-dom";

export function SuccessCheckoutView() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;

  useEffect(() => {
    if (!state || !state.success || !state.plan || !state.billingPreference || !state.mail) {
      navigate('/checkout-pagamento');
    }
  }, [state, navigate]);

  return (
    <>
      <SuccessCheckout
        plan={state?.plan}
        amount={state?.amount}
        billingPreference={state?.billingPreference}
        mail={state?.mail}
      />
    </>
  )
}
