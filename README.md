# DeFi Correlation Coach

A DeFi/Crypto Investment Coach Chatbot powered by RAG (Retrieval-Augmented Generation) technology. This chatbot provides insights and education about crypto correlations and DeFi investing strategies, enhanced with real-time market data.

## Features

- 🎮 AI-powered chat interface
- 🌐 Real-time cryptocurrency market data
- 📈 Live price tracking for top cryptocurrencies
- 🔚 Content-aware responses based on your materials
- 🚡 Educational focus with investment disclaimers
- ⚡ Real-time streaming responses
- 🎨 Modern, responsive UI
- 📄 Easy content updates
- 🗄️ Persistent ChromaDB storage for embeddings
- 📝 Chunk-based document processing
- 🧠 Memory-based conversation tracking

## Live Market Data

The chatbot includes a live market data panel that displays:
- Total cryptocurrency market capitalization
- 24-hour trading volume
- Bitcoin dominance
- Top 5 cryptocurrencies with current prices and 24h changes
- Automatic 1-minute data refresh

Market data is provided by CoinGecko API and is automatically included in chat responses when discussing prices or market conditions.

## Setup

1. Clone this repository:
   ```bash
   git clone https://github.com/RobertYoung2022/uig-ai-chatbot.git
   cd uig-ai-chatbot
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file and add your OpenAI API key:
   ```bash
   cp .env.example .env
   ```
   Fill in the required environment variables in `.env`:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `COMPLETION_MODEL`: OpenAI model to use (default: gpt-4)
   - `EMBEDDING_MODEL`: OpenAI embedding model (default: text-embedding-3-small)

4. Ensure you have the following directory structure:
   ```
   .
   ├── data/
   │   ├── raw/              # Source content files
   │   ├── processed/        # Processed content
   │   ├── tech-analy-uig.md # Knowledge base document
   │   └── chromadb/        # Vector database storage
   ├── app.py
   ├── requirements.txt
   └── .env
   ```

## Technical Details

- **Document Processing**: Uses CharacterTextSplitter with 500-character chunks and 50-character overlap
- **Vector Store**: ChromaDB with persistence enabled
- **Embeddings**: OpenAI Embeddings
- **LLM**: GPT-4 with temperature 0.7
- **Memory**: ConversationBufferMemory with message history
- **Retrieval**: Top-3 most relevant chunks for each query

## Running the Application

1. Make sure you're in the project directory
2. Run the Streamlit app:
   ```bash
   streamlit run app.py
   ```
3. Open your browser and navigate to the URL shown in the terminal (usually http://localhost:8501)

## Usage

Simply type your questions about crypto correlations, DeFi investing, or related topics in the chat input. The bot will provide detailed responses based on its knowledge base and current market data.

Example questions:
- "What is correlation in crypto?"
- "How do market sentiments affect crypto correlations?"
- "What are the different types of correlations?"
- "How can I use correlation in my DeFi investment strategy?"

## Content Management

### Supported File Types
- Articles: `.txt` files
- Video Transcripts: `.vtt` or `.srt` files

### Adding New Content
1. Add new files to `data/raw`
2. Run the ingestion script:
   ```bash
   npm run ingest
   ```

## Development

### Project Structure
```
uig-ai-chatbot/
├── app/
│   ├── api/
│   ├── chat/          # Chat API endpoint
│   │   ├── Chat.tsx   # Chat interface component
│   │   └── MarketData.tsx # Live market data component
│   └── lib/
│       ├── content/     # Content processing utilities
│       ├── market/      # Market data services
│       ├── embeddings/  # Embedding utilities
│       └── vectorstore/ # Vector database interface
├── data/
│   ├── raw/            # Source content files
│   ├── processed/      # Processed content
│   └── chromadb/       # Vector database storage
└── scripts/
    └── ingest.ts       # Content ingestion script
```

### Features and Configuration

The chatbot's features can be configured in `app/config/chat.ts`:

```typescript
features: {
  enableWalletIntegration: false,  // Future feature
  enableLiveData: true,           // Live market data
  enablePersonalization: false,    // Future feature
}

market: {
  updateInterval: 60000,          // Update interval in ms
  maxCoins: 5,                    // Number of top coins to display
  includePriceHistory: false,     // Future feature
}
```

### Future Extensions
The project is designed to be extensible with:
- Wallet integration for portfolio tracking
- Price history and charts
- Personalized investment recommendations
- Additional market data sources
- Technical analysis indicators

## License

MIT
