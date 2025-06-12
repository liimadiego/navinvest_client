import ApartmentIcon from '@mui/icons-material/Apartment';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import BarChartIcon from '@mui/icons-material/BarChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import IconButton from '@mui/material/IconButton';
import { Box, Typography } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

export function AssetDetailsHeader({
    tickerData,
    refCompany,
    refIndicators,
    refPrice,
    assetType
}) {
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

    let assetInfo = null;
    let assetImage = null;
    let tickerName = null;

    if (tickerData && tickerData.tickerCompanyInfo && assetType === 'br_stock') {
        assetInfo = tickerData.tickerCompanyInfo.company;
        assetInfo = {
            ...assetInfo,
            trade_name: tickerData.tickerCompanyInfo.trade_name || assetInfo.name,
        };
        assetImage = `/assets/tickers/${tickerData.tickerCompanyInfo.ticker}.jpg`;
        tickerName = tickerData.tickerCompanyInfo.ticker;
    }

    if (tickerData && tickerData.tickerCompanyInfo && assetType === 'us_stock') {
        assetInfo = tickerData.tickerCompanyInfo.stock;
        assetInfo = {
            ...assetInfo,
            trade_name: assetInfo?.name,
        };
        assetImage = `/assets/tickers/${tickerData.tickerCompanyInfo.ticker}.jpg`;
        tickerName = tickerData.tickerCompanyInfo.ticker;
    }

    if (tickerData && tickerData.tickerData && assetType === 'cripto') {
        assetInfo = tickerData.tickerData;
        assetInfo = {
            ...assetInfo,
            trade_name: tickerData.tickerData.asset_name
        };
        assetImage = tickerData.tickerData.asset_image_url;
        tickerName = tickerData.tickerData.ticker;
    }

    if (tickerData && tickerData.tickerData && assetType === 'bdr') {
        assetInfo = tickerData.tickerData;
        assetInfo = {
            ...assetInfo,
            trade_name: tickerData.tickerData.asset_name
        };
        assetImage = tickerData.tickerData?.bdr ? tickerData.tickerData.bdr.logo_url : `/assets/tickers/${tickerData.tickerData.ticker}.jpg`;
        tickerName = tickerData.tickerData.ticker;
    }

    if (tickerData && tickerData.tickerData && assetType === 'etf') {
        assetInfo = tickerData.tickerData;
        assetInfo = {
            ...assetInfo,
            trade_name: tickerData.tickerData.asset_name
        };
        assetImage = tickerData.tickerData?.etf ? tickerData.tickerData.etf.logo_url : `/assets/tickers/${tickerData.tickerData.ticker}.jpg`;
        tickerName = tickerData.tickerData.ticker;
    }

    // console.log("tickerData", tickerData, "assetType", assetType);
    if (tickerData && tickerData.fii && assetType === 'fii') {
        assetInfo = tickerData.tickerData;
        assetInfo = {
            ...assetInfo,
            trade_name: assetInfo?.reit?.name || "",
        };
        assetImage = `https://investidor10.com.br/assets/front/images/business-and-trade-gray.svg`;
        tickerName = tickerData.tickerData.asset_name;
    }

    const scrollToSection = (ref) => {
        if (!ref.current) return;

        const top = ref.current.getBoundingClientRect().top + window.scrollY - 70;

        window.scrollTo({
            top,
            behavior: 'smooth',
        });
    }

    return (
        <Box display="flex" justifyContent={{ xs: 'flex-start', md: 'space-between' }} sx={{ p: 1, position: "relative" }} flexDirection={{ xs: 'column', md: 'row' }}>
            <Box display="flex" alignItems="center" gap={2} sx={{ justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <img
                    src={assetImage}
                    onError={(e) => e.target.src = "https://investidor10.com.br/assets/front/images/business-and-trade-gray.svg"}
                    alt=""
                    style={{ width: 70, height: 70, borderRadius: 8 }}
                />
                <Box style={{ height: 70 }}>
                    <Typography variant="h5">{tickerName}</Typography>
                    <Typography variant="subtitle2">{assetInfo?.trade_name}</Typography> {/* Fixing the fiis data on database to include this type of information... */}
                </Box>
            </Box>
            <Box sx={{ mt: { xs: 4, md: 0 }, justifyContent: { xs: 'center', md: 'flex-end' } }} style={{ color: "#fff" }} flexDirection='row' display="flex" gap={2}>
                <Box display="flex" gap={2} justifyContent={'center'} flexDirection='row'>
                    <Box display={'flex'} gap={1}>
                        <IconButton style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: { xs: 0, md: 2 }, cursor: 'pointer', borderRadius: 10, width: "80px" }} onClick={() => scrollToSection(refPrice)}>
                            <TimelineIcon sx={{ fontSize: { xs: "20px", md: "30px" } }} />
                            <Typography sx={{ fontSize: { xs: "13px", md: "13px" } }}>Cotação</Typography>
                        </IconButton >
                        {(assetType != 'bdr') && <IconButton style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: { xs: 0, md: 2 }, cursor: 'pointer', borderRadius: 10, width: "80px" }} onClick={() => scrollToSection(refIndicators)}>
                            <BarChartIcon sx={{ fontSize: { xs: "20px", md: "30px" } }} />
                            <Typography sx={{ fontSize: { xs: "13px", md: "13px" } }}>Indicadores</Typography>
                        </IconButton>}
                    </Box>
                    {(assetType === 'us_stock' || assetType === 'br_stock' || assetType === 'bdr') && <Box display={'flex'} gap={1}>
                        <IconButton style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: { xs: 0, md: 2 }, cursor: 'pointer', borderRadius: 10, width: "80px" }} onClick={() => scrollToSection(refCompany)}>
                            <ApartmentIcon sx={{ fontSize: { xs: "20px", md: "30px" } }} />
                            <Typography sx={{ fontSize: { xs: "13px", md: "13px" } }}>Empresa</Typography>
                        </IconButton>
                    </Box>}
                </Box>

                {/* <IconButton
                    variant="outlined"
                    sx={{ height: "30px", marginLeft: "30px", position: { xs: 'absolute', md: 'relative' }, top: { xs: '0', md: 'auto' }, right: { xs: '0', md: 'auto' } }}
                >
                    <StarBorderIcon />
                </IconButton> */}
            </Box >
        </Box >
    );
}