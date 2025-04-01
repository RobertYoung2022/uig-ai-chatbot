import { contentProcessor } from '../app/lib/content/processor';
import { vectorStore } from '../app/lib/vectorstore';
import dotenv from 'dotenv-safe';
import path from 'path';

// Load environment variables
dotenv.config();

async function ingestContent() {
  try {
    console.log('Starting content ingestion...');
    
    const contentDir = path.join(process.cwd(), process.env.CONTENT_DIRECTORY || 'data/raw');
    console.log(`Processing content from: ${contentDir}`);
    
    // Process all content files
    const chunks = await contentProcessor.processDirectory(contentDir);
    console.log(`Processed ${chunks.length} content chunks`);
    
    // Add to vector store
    await vectorStore.addDocuments(chunks);
    console.log('Successfully added content to vector store');
    
  } catch (error) {
    console.error('Error during content ingestion:', error);
    process.exit(1);
  }
}

ingestContent(); 