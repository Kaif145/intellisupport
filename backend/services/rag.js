import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
import { LocalIndex } from 'vectra';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Each company gets their own vector index folder
const getIndex = async (companyId) => {
  const indexPath = path.join(__dirname, '../vectorstore', companyId.toString());
  
  // Always create fresh if it doesn't exist
  if (!fs.existsSync(indexPath)) {
    fs.mkdirSync(indexPath, { recursive: true });
  }
  
  const index = new LocalIndex(indexPath);
  if (!await index.isIndexCreated()) {
    await index.createIndex();
  }
  return index;
};

// Split text into small chunks
const chunkText = (text, chunkSize = 500, overlap = 50) => {
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    const chunk = text.slice(start, end).trim();
    if (chunk.length > 20) {
      chunks.push(chunk);
    }
    start += chunkSize - overlap;
  }
  return chunks;
};






// Convert text to vector using Groq embeddings
// Convert text to vector using simple local embeddings
const getEmbedding = async (text) => {
  const words = text.toLowerCase().split(/\s+/);
  const vector = new Array(384).fill(0);
  words.forEach((word, i) => {
    for (let j = 0; j < word.length; j++) {
      vector[(word.charCodeAt(j) * (i + 1)) % 384] += 1;
    }
  });
  // Normalize
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  return magnitude > 0 ? vector.map(v => v / magnitude) : vector;
};

// Extract text from PDF or TXT file
const extractText = async (filePath, fileType) => {
  if (fileType === 'pdf') {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } else if (fileType === 'txt') {
    return fs.readFileSync(filePath, 'utf-8');
  }
  throw new Error('Unsupported file type');
};

// INDEX a document — called when company uploads a file
const indexDocument = async (companyId, filePath, fileType) => {
  try {
    console.log(`📂 Starting indexing for company: ${companyId}`);
    console.log(`📄 File: ${filePath}, Type: ${fileType}`);
    
    const text = await extractText(filePath, fileType);
    console.log(`📝 Extracted text length: ${text.length} characters`);
    console.log(`📝 First 200 chars: ${text.slice(0, 200)}`);
    
    const chunks = chunkText(text);
    console.log(`📄 Processing ${chunks.length} chunks...`);

    const index = await getIndex(companyId);

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embedding = await getEmbedding(chunk);
      await index.insertItem({
        vector: embedding,
        metadata: { 
          text: chunk,
          companyId: companyId.toString(),
          chunkIndex: i
        }
      });
      console.log(`✅ Indexed chunk ${i + 1}/${chunks.length}: ${chunk.slice(0, 50)}...`);
    }

    console.log(`🎉 Document fully indexed!`);
    return chunks.length;
  } catch (error) {
    console.error('❌ Indexing error:', error);
    throw error;
  }
};

// SEARCH — called on every chat message
const searchDocuments = async (companyId, query, topK = 3) => {
  try {
    const index = await getIndex(companyId);
    const stats = await index.getIndexStats();
    
    console.log(`🔍 Searching index with ${stats.items} items`);
    
    if (stats.items === 0) return [];

    const queryEmbedding = await getEmbedding(query);
    const results = await index.queryItems(queryEmbedding, topK);
    
    console.log('📊 Search scores:', results.map(r => r.score));

    return results
      .filter(r => r.score > 0.1)
      .map(r => r.item.metadata.text);

  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
};

// DELETE all vectors for a company document
const deleteCompanyIndex = async (companyId) => {
  try {
    const indexPath = path.join(__dirname, '../vectorstore', companyId.toString());
    if (fs.existsSync(indexPath)) {
      fs.rmSync(indexPath, { recursive: true });
    }
  } catch (error) {
    console.error('Delete index error:', error);
  }
};

export { indexDocument, searchDocuments, deleteCompanyIndex };