import { Box } from "@mui/material";
import { InvestorProfile } from "../investor-profile";
import { DashboardContent } from "src/layouts/dashboard";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { paths } from "src/routes/paths";

export function InvestorProfileView() {
    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading="Perfil do Investidor"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Perfil do Investidor', href: paths.dashboard.investor_profile }
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />
            <InvestorProfile />
        </DashboardContent>
    );
}