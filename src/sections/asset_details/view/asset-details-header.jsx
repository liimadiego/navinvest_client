import ApartmentIcon from '@mui/icons-material/Apartment';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import BarChartIcon from '@mui/icons-material/BarChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import IconButton from '@mui/material/IconButton';
import { Box, Typography } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

export function AssetDetailsHeader({ tickerData }) {
    if (!tickerData) {
        return (
            <Box display="flex" justifyContent={{ xs: 'flex-start', md: 'space-between' }} sx={{ p: 1 }} flexDirection={{ xs: 'column', md: 'row' }}>
                <Box display="flex" alignItems="center" gap={2}>
                    <Skeleton variant="rectangular" width={70} height={70} />
                    <Box style={{ height: 70 }}>
                        <Skeleton variant="text" width={100} />
                        <Skeleton variant="text" width={150} />
                    </Box>
                </Box>
                <Box style={{ color: "#fff" }} flexDirection='row' display="flex" gap={2}>
                    <Skeleton variant="circular" width={30} height={30} />
                    <Skeleton variant="circular" width={30} height={30} />
                    <Skeleton variant="circular" width={30} height={30} />
                    <Skeleton variant="circular" width={30} height={30} />
                    <Skeleton variant="rectangular" width={30} height={30} style={{ marginLeft: "30px" }} />
                </Box>
            </Box>
        );
    }

    return (
        <Box display="flex" justifyContent={{ xs: 'flex-start', md: 'space-between' }} sx={{ p: 1, position: "relative" }} flexDirection={{ xs: 'column', md: 'row' }}>
            <Box display="flex" alignItems="center" gap={2} sx={{ justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <img src={tickerData.image_url} alt="" style={{ width: 70, height: 70, borderRadius: 8 }} />
                <Box style={{ height: 70 }}>
                    <Typography variant="h5">{tickerData.ticker}</Typography>
                    <Typography variant="subtitle2">{tickerData.companyName}</Typography>
                </Box>
            </Box>
            <Box sx={{ mt: { xs: 4, md: 0 }, justifyContent: { xs: 'center', md: 'flex-end' } }} style={{ color: "#fff" }} flexDirection='row' display="flex" gap={2}>
                <Box display="flex" gap={2} justifyContent={'center'} flexDirection='row'>
                    <Box display={'flex'} gap={1}>
                        <IconButton style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: { xs: 0, md: 2 } }}>
                            <ApartmentIcon sx={{ fontSize: { xs: "20px", md: "30px" } }} />
                            <Typography sx={{ fontSize: { xs: "13px", md: "13px" } }}>Empresa</Typography>
                        </IconButton>
                        <IconButton style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: { xs: 0, md: 2 } }}>
                            <MonetizationOnIcon sx={{ fontSize: { xs: "20px", md: "30px" } }} />
                            <Typography sx={{ fontSize: { xs: "13px", md: "13px" } }}>Contábil</Typography>
                        </IconButton>
                    </Box>
                    <Box display={'flex'} gap={1}>
                        <IconButton style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: { xs: 0, md: 2 } }}>
                            <BarChartIcon sx={{ fontSize: { xs: "20px", md: "30px" } }} />
                            <Typography sx={{ fontSize: { xs: "13px", md: "13px" } }}>Indicadores</Typography>
                        </IconButton>
                        <IconButton style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: { xs: 0, md: 2 } }}>
                            <TimelineIcon sx={{ fontSize: { xs: "20px", md: "30px" } }} />
                            <Typography sx={{ fontSize: { xs: "13px", md: "13px" } }}>Cotação</Typography>
                        </IconButton >
                    </Box>
                </Box >

                <IconButton
                    variant="outlined"
                    sx={{ height: "30px", marginLeft: "30px", position: { xs: 'absolute', md: 'relative' }, top: { xs: '0', md: 'auto' }, right: { xs: '0', md: 'auto' } }}
                >
                    <StarBorderIcon />
                </IconButton>
            </Box >
        </Box >
    );
}