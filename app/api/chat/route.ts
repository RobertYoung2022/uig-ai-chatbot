import { OpenAI } from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { vectorStore } from '@/app/lib/vectorstore';
import { marketData } from '@/app/lib/market';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const lastMessage = messages[messages.length - 1];

  // Get relevant context from vector store
  const searchResults = await vectorStore.similaritySearch(lastMessage.content);
  const context = searchResults.map(result => result.content).join('\n\n');

  // Get market data if the question might be about current prices or market conditions
  let marketContext = '';
  if (lastMessage.content.toLowerCase().includes('price') || 
      lastMessage.content.toLowerCase().includes('market') ||
      lastMessage.content.toLowerCase().includes('worth') ||
      lastMessage.content.toLowerCase().includes('value')) {
    try {
      const [overview, topCoins] = await Promise.all([
        marketData.getMarketOverview(),
        marketData.getTopCryptos(5),
      ]);

      marketContext = `
Current Market Data (as of ${new Date().toISOString()}):
- Total Crypto Market Cap: $${(overview.total_market_cap / 1e12).toFixed(2)}T
- 24h Trading Volume: $${(overview.total_volume / 1e9).toFixed(2)}B
- Bitcoin Dominance: ${overview.btc_dominance.toFixed(1)}%

Top Cryptocurrencies:
${topCoins.map(coin => `${coin.name} (${coin.symbol.toUpperCase()}): $${coin.current_price.toLocaleString()} (${coin.price_change_percentage_24h > 0 ? '+' : ''}${coin.price_change_percentage_24h.toFixed(2)}% 24h)`).join('\n')}
`;
    } catch (error) {
      console.error('Error fetching market data:', error);
    }
  }

  const prompt = {
    role: 'system',
    content: `You are a knowledgeable crypto investment coach. Use the following context and market data to answer the user's question. If you cannot answer based on the context, say so politely and suggest asking a different question.

Context:
${context}

${marketContext ? `Live Market Data:\n${marketContext}` : ''}

Remember to:
1. Only provide information that is supported by the context or current market data
2. Be clear and concise in your explanations
3. Use appropriate disclaimers when discussing investments
4. Maintain a professional and educational tone
5. When discussing prices or market conditions, always reference the live data provided`
  };

  const response = await openai.chat.completions.create({
    model: process.env.COMPLETION_MODEL || 'gpt-4-turbo-preview',
    messages: [prompt, ...messages],
    temperature: 0.7,
    stream: true,
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
} 