interface CoinData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
}

class MarketDataService {
  private static instance: MarketDataService;
  private baseUrl = 'https://api.coingecko.com/api/v3';
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheDuration = 60 * 1000; // 1 minute

  private constructor() {}

  public static getInstance(): MarketDataService {
    if (!MarketDataService.instance) {
      MarketDataService.instance = new MarketDataService();
    }
    return MarketDataService.instance;
  }

  private async fetchWithCache(endpoint: string) {
    const cacheKey = endpoint;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return cached.data;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`);
    if (!response.ok) {
      throw new Error(`Market data API error: ${response.statusText}`);
    }

    const data = await response.json();
    this.cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  }

  async getTopCryptos(limit: number = 10): Promise<CoinData[]> {
    const endpoint = `/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`;
    return this.fetchWithCache(endpoint);
  }

  async getCryptoPrice(coinId: string): Promise<CoinData | null> {
    try {
      const endpoint = `/coins/markets?vs_currency=usd&ids=${coinId}&order=market_cap_desc&per_page=1&page=1&sparkline=false`;
      const data = await this.fetchWithCache(endpoint);
      return data[0] || null;
    } catch (error) {
      console.error(`Error fetching price for ${coinId}:`, error);
      return null;
    }
  }

  async getMarketOverview(): Promise<{
    total_market_cap: number;
    total_volume: number;
    btc_dominance: number;
  }> {
    const endpoint = '/global';
    const data = await this.fetchWithCache(endpoint);
    return {
      total_market_cap: data.data.total_market_cap.usd,
      total_volume: data.data.total_volume.usd,
      btc_dominance: data.data.market_cap_percentage.btc,
    };
  }
}

export const marketData = MarketDataService.getInstance(); 