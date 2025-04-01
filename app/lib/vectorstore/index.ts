import { Chroma } from 'langchain/vectorstores/chroma';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { Document } from 'langchain/document';
import { ContentChunk, SearchResult } from '@/app/types';

class VectorStore {
  private static instance: VectorStore;
  private vectorStore: Chroma | null = null;
  private embeddings: OpenAIEmbeddings;

  private constructor() {
    this.embeddings = new OpenAIEmbeddings({
      modelName: process.env.EMBEDDING_MODEL,
    });
  }

  public static getInstance(): VectorStore {
    if (!VectorStore.instance) {
      VectorStore.instance = new VectorStore();
    }
    return VectorStore.instance;
  }

  async initialize() {
    if (!this.vectorStore) {
      this.vectorStore = await Chroma.fromExistingCollection(
        this.embeddings,
        { collectionName: 'uig_content' }
      );
    }
  }

  async addDocuments(chunks: ContentChunk[]) {
    await this.initialize();
    
    const documents = chunks.map(chunk => new Document({
      pageContent: chunk.content,
      metadata: chunk.metadata,
    }));

    await this.vectorStore?.addDocuments(documents);
  }

  async similaritySearch(query: string, k: number = 3): Promise<SearchResult[]> {
    await this.initialize();
    
    const results = await this.vectorStore?.similaritySearch(query, k);
    
    return results?.map(doc => ({
      content: doc.pageContent,
      score: 0, // Chroma doesn't return scores by default
      metadata: doc.metadata as ContentChunk['metadata'],
    })) || [];
  }
}

export const vectorStore = VectorStore.getInstance(); 