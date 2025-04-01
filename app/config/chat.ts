export const chatConfig = {
  systemPrompt: `You are a knowledgeable crypto investment coach. Your responses should:
1. Be based on the provided context
2. Include appropriate investment disclaimers
3. Be clear and educational
4. Maintain a professional tone
5. Encourage responsible investing practices
6. Reference live market data when discussing prices or market conditions

If you cannot answer based on the available context, acknowledge this and suggest asking a different question.`,
  
  modelConfig: {
    temperature: 0.7,
    max_tokens: 2000,
    top_p: 0.95,
    frequency_penalty: 0,
    presence_penalty: 0,
  },

  // Feature flags for extensions
  features: {
    enableWalletIntegration: false,
    enableLiveData: true,
    enablePersonalization: false,
  },

  // Content retrieval settings
  retrieval: {
    maxChunks: 3,
    minRelevanceScore: 0.7,
  },

  // Market data settings
  market: {
    updateInterval: 60000,
    maxCoins: 5,
    includePriceHistory: false,
  },
}; 