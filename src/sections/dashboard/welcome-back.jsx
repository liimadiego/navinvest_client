import { Box, Button } from "@mui/material";
import SeoIllustration from "src/assets/illustrations/seo-illustration";
import { BannerCard } from "src/components/banner-card";
import { useNavigate } from "react-router-dom";

export function WelcomeBack({ sx }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/dashboard/assistente-ia");
    }

    return (
        <>
            <BannerCard
                title={`Que bom te ver por aqui de novo, Diego! 👋`}
                description="Continue de onde parou e explore novas oportunidades para aprimorar suas estratégias. Se precisar de algo, estamos por aqui!"
                img={<SeoIllustration hideBackground />}
                action={
                    <Button variant="contained" color="primary" onClick={handleClick}>
                        Ir para o Assistente
                    </Button>
                }
            />
        </>
    );
}