import axios from 'src/lib/axios';

export async function getTickerList(query, limit = 5, type = "") {
    const limitParam = limit ? `&limit=${limit}` : "";
    const typeParam = type ? `&type=${type}` : "";

    return await axios.get(`/ticker/${query}?${limitParam}${typeParam}`)
        .then(({ data }) => {
            if (!data || !Array.isArray(data)) {
                throw new Error("Invalid response format: Expected an array of tickers");
            }

            return data.map((ticker) => {
                if (type === "treasury") {
                    return {
                        id: ticker.id,
                        name: ticker.name,
                        current_price: 0,
                        type: "treasury",
                        asset_name: ticker.name,
                        ticker: ticker.name,
                        image_url: "https://investidor10.com.br/assets/front/images/business-and-trade-gray.svg",
                        currency: "BRL",
                        last_twelve_months: 0,
                        indexer: ticker.indexer,
                        min_investment: ticker.min_investment
                    }
                }

                const imagePath = `/src/assets/tickers/${ticker.ticker}.jpg`;
                const defaultImagePath = "https://investidor10.com.br/assets/front/images/business-and-trade-gray.svg";

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