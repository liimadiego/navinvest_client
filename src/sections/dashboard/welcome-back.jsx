import { Box, Button } from "@mui/material";
import SeoIllustration from "src/assets/illustrations/seo-illustration";
import { BannerCard } from "src/components/banner-card";

export function WelcomeBack({ sx }) {
    return (
        <Box display='flex' sx={{ ...sx }}>
            <BannerCard
                title={`Que bom te ver por aqui de novo! 👋  \n Diego`}
                description="Continue de onde parou e explore novas oportunidades para aprimorar suas estratégias. Se precisar de algo, estamos por aqui!"
                img={<SeoIllustration hideBackground />}
                action={
                    <Button variant="contained" color="primary" href="/dashboard/ai_assistant">
                        Ir para o Assistente
                    </Button>
                }
            />
        </Box>
    );
}