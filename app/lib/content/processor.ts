import { ContentChunk } from '@/app/types';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import fs from 'fs/promises';
import path from 'path';

export class ContentProcessor {
  private static instance: ContentProcessor;
  private splitter: RecursiveCharacterTextSplitter;

  private constructor() {
    this.splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
  }

  public static getInstance(): ContentProcessor {
    if (!ContentProcessor.instance) {
      ContentProcessor.instance = new ContentProcessor();
    }
    return ContentProcessor.instance;
  }

  async processFile(filePath: string): Promise<ContentChunk[]> {
    const content = await fs.readFile(filePath, 'utf-8');
    const fileName = path.basename(filePath);
    const fileType = this.getFileType(filePath);

    const texts = await this.splitter.splitText(content);

    return texts.map((text, index) => ({
      id: `${fileName}-${index}`,
      content: text,
      metadata: {
        source: fileName,
        type: fileType,
        title: fileName.replace(/\.[^/.]+$/, ''),
      },
    }));
  }

  async processDirectory(dirPath: string): Promise<ContentChunk[]> {
    const files = await fs.readdir(dirPath);
    const chunks: ContentChunk[] = [];

    for (const file of files) {
      if (this.isValidFile(file)) {
        const filePath = path.join(dirPath, file);
        const fileChunks = await this.processFile(filePath);
        chunks.push(...fileChunks);
      }
    }

    return chunks;
  }

  private getFileType(filePath: string): 'article' | 'video' {
    const ext = path.extname(filePath).toLowerCase();
    return ext === '.txt' ? 'article' : 'video';
  }

  private isValidFile(fileName: string): boolean {
    const ext = path.extname(fileName).toLowerCase();
    return ['.txt', '.vtt', '.srt'].includes(ext);
  }
}

export const contentProcessor = ContentProcessor.getInstance(); 