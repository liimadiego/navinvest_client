import axios from 'src/lib/axios';

export async function getTickerList(query, limit = 5, type = "") {
    const limitParam = limit ? `&limit=${limit}` : "";
    const typeParam = type ? `&type=${type}` : "";

    return await axios.get(`/ticker/${query}?${limitParam}${typeParam}`)
        .then(({ data }) => {
            if (!data || !Array.isArray(data)) {
                throw new Error("Invalid response format: Expected an array of tickers");
            }

            const defaultImagePath = "https://investidor10.com.br/assets/front/images/business-and-trade-gray.svg";

            return data.map((ticker) => {
                if (type === "treasury") {
                    return {
                        id: ticker.id,
                        name: ticker.name,
                        current_price: 0,
                        type: "treasury",
                        asset_name: ticker.name,
                        ticker: ticker.name,
                        image_url: defaultImagePath,
                        currency: "BRL",
                        last_twelve_months: 0,
                        indexer: ticker.indexer,
                        min_investment: ticker.min_investment,
                        unit_price: ticker.unit_price,
                    }
                }

                if (type === 'funds') {
                    return {
                        id: ticker.id,
                        name: ticker.trade_name,
                        current_price: (ticker.current_price || 0).toFixed(2),
                        type: "funds",
                        fund_class: ticker.fund_class,
                        ticker: ticker.trade_name,
                        image_url: ticker.image_url || defaultImagePath,
                        currency: "BRL",
                        last_twelve_months: 0,
                    }
                }

                let imagePath = ticker.asset_type === "cripto" ? ticker.asset_image_url : `/assets/tickers/${ticker.ticker}.jpg`;

                if (ticker.asset_type === "bdr" || ticker.asset_type === "etf") {
                    imagePath = `https://icons.brapi.dev/icons/${ticker.ticker}.svg`;
                }

                return {
                    id: ticker.id,
                    name: ticker.asset_name,
                    current_price: ticker.current_price,
                    type: ticker.asset_type,
                    asset_name: ticker.asset_name,
                    ticker: ticker.ticker,
                    image_url: imagePath,
                    fallback_image_url: defaultImagePath,
                    currency: ticker.currency,
                    last_twelve_months: ticker.price_twelve_months_ago && ticker.current_price ? ((ticker.current_price - ticker.price_twelve_months_ago) / ticker.price_twelve_months_ago) : 0
                };
            });
        }).catch(error => {
            throw new Error(`Error fetching ticker list: ${error}`);
        })


}