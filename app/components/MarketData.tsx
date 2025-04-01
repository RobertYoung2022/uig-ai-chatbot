import { useEffect, useState } from 'react';
import { marketData } from '../lib/market';

interface MarketOverview {
  total_market_cap: number;
  total_volume: number;
  btc_dominance: number;
}

interface CoinData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
}

export default function MarketData() {
  const [overview, setOverview] = useState<MarketOverview | null>(null);
  const [topCoins, setTopCoins] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overviewData, topCoinsData] = await Promise.all([
          marketData.getMarketOverview(),
          marketData.getTopCryptos(5),
        ]);
        setOverview(overviewData);
        setTopCoins(topCoinsData);
      } catch (error) {
        console.error('Error fetching market data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse bg-white rounded-lg p-4 shadow-sm">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toFixed(2)}`;
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="grid grid-cols-3 gap-4 mb-4">
        {overview && (
          <>
            <div className="text-center">
              <p className="text-sm text-gray-500">Market Cap</p>
              <p className="font-semibold">{formatNumber(overview.total_market_cap)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">24h Volume</p>
              <p className="font-semibold">{formatNumber(overview.total_volume)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">BTC Dominance</p>
              <p className="font-semibold">{overview.btc_dominance.toFixed(1)}%</p>
            </div>
          </>
        )}
      </div>

      <div className="space-y-2">
        {topCoins.map((coin) => (
          <div key={coin.id} className="flex justify-between items-center py-2 border-b last:border-0">
            <div className="flex items-center">
              <span className="font-medium">{coin.name}</span>
              <span className="text-gray-500 ml-2 uppercase">{coin.symbol}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="font-medium">${coin.current_price.toLocaleString()}</span>
              <span className={`${
                coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {coin.price_change_percentage_24h.toFixed(2)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 